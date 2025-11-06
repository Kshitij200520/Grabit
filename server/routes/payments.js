const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

// Payment Schema for mock payments
const PaymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  mockPaymentId: String,
  mockOrderId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', PaymentSchema);

console.log('🎭 Mock Razorpay Payment System Initialized');
console.log('✅ Perfect for project demonstrations!');
console.log('💡 No real bank details required');

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Mock Razorpay Payment API is working!',
    endpoints: [
      'POST /api/payments/order - Create payment order',
      'POST /api/payments/verify - Verify payment',
      'GET /api/payments/:orderId - Get payment details'
    ],
    status: 'ready'
  });
});

// @route   POST /api/payments/order
// @desc    Create mock payment order (looks like real Razorpay)
// @access  Private
router.post('/order', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    console.log('🎬 Creating MOCK payment order for demo:', { orderId, amount });

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate realistic mock IDs that look like Razorpay
    const mockOrderId = `order_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const mockKeyId = 'rzp_test_demo_for_project';

    // Save mock payment record
    const payment = new Payment({
      orderId: orderId,
      mockOrderId: mockOrderId,
      amount: amount,
      currency: 'INR',
      status: 'created'
    });

    await payment.save();
    console.log('💾 Mock payment record saved:', payment._id);

    // Return response that looks exactly like real Razorpay
    res.json({
      id: mockOrderId,
      currency: 'INR',
      amount: Math.round(amount * 100), // Convert to paise like real Razorpay
      key: mockKeyId,
      name: 'E-Shop Demo',
      description: 'Mock Payment for Project Demo',
      prefill: {
        name: order.shippingAddress?.fullName || 'Demo Customer',
        email: 'demo@example.com',
        contact: order.shippingAddress?.phone || '9999999999'
      },
      theme: {
        color: '#3399cc'
      },
      notes: {
        demo: 'This is a mock payment for project demonstration',
        orderId: orderId
      }
    });

  } catch (error) {
    console.error('Mock payment order creation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Alias for create-order (for frontend compatibility)
router.post('/create-order', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    console.log('🎬 Creating MOCK payment order for demo (create-order endpoint):', { orderId, amount });

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate realistic mock IDs that look like Razorpay
    const mockOrderId = `order_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const mockKeyId = 'rzp_test_demo_for_project';

    // Save mock payment record
    const payment = new Payment({
      orderId: orderId,
      mockOrderId: mockOrderId,
      amount: amount || order.totalPrice,
      currency: 'INR',
      status: 'created'
    });

    await payment.save();
    console.log('💾 Mock payment record saved:', payment._id);

    // Return response that looks exactly like real Razorpay
    res.json({
      success: true,
      order: {
        id: mockOrderId,
        currency: 'INR',
        amount: Math.round((amount || order.totalPrice) * 100), // Convert to paise like real Razorpay
        key: mockKeyId,
        name: 'E-Shop Demo',
        description: 'Mock Payment for Project Demo',
        prefill: {
          name: order.shippingAddress?.fullName || 'Demo Customer',
          email: 'demo@example.com',
          contact: order.shippingAddress?.phone || '9999999999'
        },
        theme: {
          color: '#3399cc'
        },
        notes: {
          demo: 'This is a mock payment for project demonstration',
          orderId: orderId
        }
      },
      key: mockKeyId
    });

  } catch (error) {
    console.error('Mock payment order creation error (create-order):', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify mock payment (always succeeds for demo)
// @access  Private
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    console.log('🎭 Mock payment verification (demo mode):', { 
      razorpay_order_id, 
      razorpay_payment_id, 
      orderId 
    });

    // Generate mock payment ID if not provided
    const mockPaymentId = razorpay_payment_id || `pay_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Always succeed in demo mode
    const isPaymentValid = true;

    if (isPaymentValid) {
      // Update mock payment record
      const payment = await Payment.findOne({ mockOrderId: razorpay_order_id });
      if (payment) {
        payment.mockPaymentId = mockPaymentId;
        payment.status = 'paid';
        payment.paymentMethod = 'Mock Card Payment';
        await payment.save();
        console.log('✅ Mock payment record updated:', payment._id);
      }

      // Update order
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'Paid';
        order.paymentResult = {
          id: mockPaymentId,
          status: 'paid',
          update_time: new Date(),
          email_address: 'demo@example.com',
          demo_note: 'Mock payment for project demonstration'
        };
        await order.save();
        console.log('🎉 Order updated to paid (demo mode):', order._id);

        // Start automated order processing
        setTimeout(async () => {
          try {
            order.status = 'Preparing';
            order.deliveryTracking = [
              {
                status: 'Order Confirmed',
                timestamp: new Date(),
                message: '🎉 Your order has been confirmed! (Demo Payment Successful)'
              }
            ];
            await order.save();
            console.log('📦 Order status updated to Preparing');
          } catch (error) {
            console.error('Error updating order status:', error);
          }
        }, 1000);

        // Assign delivery executive after 30 seconds
        setTimeout(async () => {
          try {
            const deliveryExecutives = [
              { name: 'Ravi Kumar', phone: '+91-9876543210', vehicle: 'Bike - KA01AB1234', rating: 4.8 },
              { name: 'Priya Sharma', phone: '+91-9876543211', vehicle: 'Scooter - KA02CD5678', rating: 4.9 },
              { name: 'Amit Singh', phone: '+91-9876543212', vehicle: 'Bike - KA03EF9012', rating: 4.7 },
              { name: 'Neha Patel', phone: '+91-9876543213', vehicle: 'Electric Bike - KA04GH3456', rating: 4.9 },
              { name: 'Rohit Verma', phone: '+91-9876543214', vehicle: 'Bike - KA05IJ7890', rating: 4.6 },
              { name: 'Sunita Devi', phone: '+91-9876543215', vehicle: 'Scooter - KA06KL2345', rating: 4.8 },
              { name: 'Vikash Kumar', phone: '+91-9876543216', vehicle: 'Bike - KA07MN6789', rating: 4.7 },
              { name: 'Kavita Singh', phone: '+91-9876543217', vehicle: 'Electric Scooter - KA08OP0123', rating: 4.9 }
            ];

            const randomExecutive = deliveryExecutives[Math.floor(Math.random() * deliveryExecutives.length)];
            
            // Assign delivery executive properly like COD orders
            order.deliveryPerson = randomExecutive;
            order.deliveryPersonName = randomExecutive.name;
            order.deliveryPersonPhone = randomExecutive.phone;
            order.deliveryPersonVehicle = randomExecutive.vehicle;
            order.deliveryPersonRating = randomExecutive.rating;
            order.deliveryAssignedAt = new Date();
            order.estimatedDeliveryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for online payment
            order.status = 'Out for Delivery';
            
            order.deliveryTracking.push({
              status: 'Delivery Executive Assigned',
              timestamp: new Date(),
              message: `🚚 ${randomExecutive.name} has been assigned for delivery. Contact: ${randomExecutive.phone}`,
              deliveryPerson: {
                name: randomExecutive.name,
                phone: randomExecutive.phone,
                vehicle: randomExecutive.vehicle,
                rating: randomExecutive.rating
              }
            });
            
            await order.save();
            console.log(`🚴‍♂️ Delivery executive assigned: ${randomExecutive.name}`);
          } catch (error) {
            console.error('Error assigning delivery executive:', error);
          }
        }, 30000); // 30 seconds

        // Simulate delivery completion after 10 minutes
        setTimeout(async () => {
          try {
            order.status = 'Delivered';
            order.deliveredAt = new Date();
            order.deliveryTracking.push({
              status: 'Delivered',
              timestamp: new Date(),
              message: '✅ Order delivered successfully within 10 minutes! (Demo Project)'
            });
            await order.save();
            console.log('🎯 Order marked as delivered (demo completed)');
          } catch (error) {
            console.error('Error updating delivery status:', error);
          }
        }, 600000); // 10 minutes
      }

      res.json({ 
        success: true, 
        message: 'Mock payment verified successfully - Perfect for demo!',
        orderId: orderId,
        demo_note: 'This is a simulated payment for project demonstration'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Mock payment verification failed' 
      });
    }

  } catch (error) {
    console.error('Mock payment verification error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// @route   GET /api/payments/:orderId
// @desc    Get mock payment details for an order
// @access  Private
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      ...payment.toObject(),
      demo_note: 'Mock payment data for project demonstration'
    });
  } catch (error) {
    console.error('Get mock payment error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
