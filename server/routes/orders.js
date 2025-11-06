const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { assignDeliveryExecutive, createDeliveryTracking } = require('../services/deliveryService');

// Guest user session helper
const getGuestUserId = (req) => {
  // Use session ID or create a temporary guest ID
  if (!req.session.guestId) {
    req.session.guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return req.session.guestId;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (supports both authenticated and guest users)
router.post('/', async (req, res) => {
  try {
    let {
      userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    // If no userId provided, check authentication or use guest ID
    if (!userId) {
      if (req.headers.authorization) {
        try {
          // Try to authenticate
          const jwt = require('jsonwebtoken');
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
          userId = decoded.userId;
        } catch (err) {
          // If authentication fails, use guest ID
          userId = getGuestUserId(req);
        }
      } else {
        // No auth header, use guest ID
        userId = getGuestUserId(req);
      }
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify stock availability and update product stock
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Handle Cash on Delivery orders
    if (paymentMethod === 'Cash on Delivery') {
      // Automatically confirm COD orders
      order.status = 'Confirmed';
      order.isPaid = false; // Will be paid on delivery
      
      // Assign delivery executive for COD orders
      const deliveryInfo = await assignDeliveryExecutive(order._id, shippingAddress);
      
      // Update order with delivery information
      order.deliveryPersonnel = deliveryInfo.deliveryPersonnel;
      order.deliveryPersonName = deliveryInfo.deliveryPersonName;
      order.deliveryPersonPhone = deliveryInfo.deliveryPersonPhone;
      order.deliveryPersonVehicle = deliveryInfo.deliveryPersonVehicle;
      order.deliveryPersonRating = deliveryInfo.deliveryPersonRating;
      order.deliveryAssignedAt = deliveryInfo.deliveryAssignedAt;
      order.estimatedDeliveryTime = deliveryInfo.estimatedDeliveryTime;
      
      // Create delivery tracking entry
      const trackingEntry = createDeliveryTracking(
        deliveryInfo, 
        `Order confirmed and assigned to ${deliveryInfo.deliveryPersonName}. COD order will be delivered within 24 hours.`
      );
      order.deliveryTracking = [trackingEntry];
    }

    const createdOrder = await order.save();
    
    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalAmount: 0 }
    );

    // Populate the created order with full details
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate('orderItems.product')
      .populate('deliveryPersonnel');

    res.status(201).json({
      success: true,
      message: paymentMethod === 'Cash on Delivery' 
        ? 'Order confirmed! Delivery executive assigned. You will pay on delivery.' 
        : 'Order created successfully!',
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product')
      .populate('deliveryPersonnel', 'name phone vehicle rating');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add delivery person details to the order object for easier access
    const orderData = order.toObject();
    if (order.deliveryPersonnel) {
      orderData.deliveryPersonName = order.deliveryPersonnel.name;
      orderData.deliveryPersonPhone = order.deliveryPersonnel.phone;
      orderData.deliveryPersonVehicle = order.deliveryPersonnel.vehicle;
      orderData.deliveryPersonRating = order.deliveryPersonnel.rating;
    }

    // Add customer info for display
    if (order.user) {
      orderData.customerInfo = {
        name: order.user.name,
        email: order.user.email,
        phone: order.shippingAddress?.phone,
        address: order.shippingAddress ? 
          `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}` 
          : 'N/A'
      };
    }

    // Format items for display
    if (order.orderItems) {
      orderData.items = order.orderItems.map(item => ({
        name: item.product?.name || item.name,
        description: item.product?.description || 'Product description',
        quantity: item.quantity,
        price: item.price
      }));
    }

    res.json(orderData);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/user/:userId
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Processing';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Delivered' || order.status === 'Shipped') {
      return res.status(400).json({ 
        message: 'Cannot cancel order that has been shipped or delivered' 
      });
    }

    // Restore product stock
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'Cancelled';
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
