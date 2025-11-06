const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Guest user session helper
const getGuestUserId = (req) => {
  // Use session ID or create a temporary guest ID
  if (!req.session.guestId) {
    req.session.guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return req.session.guestId;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Public (supports both authenticated and guest users)
router.get('/', async (req, res) => {
  try {
    let userId;
    
    // Check if user is authenticated
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
    
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public (supports both authenticated and guest users)
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    let userId;
    
    // Check if user is authenticated
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
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{
          product: productId,
          quantity,
          price: product.price
        }]
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price
        });
      }
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Public (supports both authenticated and guest users)
router.delete('/remove/:productId', async (req, res) => {
  try {
    let userId;
    
    // Check if user is authenticated
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
    
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:productId
// @access  Public (supports both authenticated and guest users)
router.put('/update/:productId', async (req, res) => {
  try {
    let userId;
    
    // Check if user is authenticated
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
    
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    const product = await Product.findById(req.params.productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Public (supports both authenticated and guest users)
router.delete('/clear', async (req, res) => {
  try {
    let userId;
    
    // Check if user is authenticated
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
    
    await Cart.findOneAndDelete({ user: userId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;