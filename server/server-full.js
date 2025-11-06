console.log('🚀 Starting Full E-commerce Server with All Features...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('✅ Middleware configured');

// In-memory storage for development (works without MongoDB)
let users = [];
let products = [
  {
    _id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features and excellent camera quality',
    price: 999,
    category: 'Electronics',
    stock: 50,
    featured: true,
    rating: 4.8,
    image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro'
  },
  {
    _id: '2',
    name: 'MacBook Air M2',
    description: 'Powerful laptop with M2 chip, perfect for work and creativity',
    price: 1199,
    category: 'Electronics',
    stock: 30,
    featured: true,
    rating: 4.9,
    image: 'https://via.placeholder.com/300x300?text=MacBook+Air'
  },
  {
    _id: '3',
    name: 'Nike Air Max',
    description: 'Comfortable running shoes with excellent cushioning',
    price: 129,
    category: 'Footwear', 
    stock: 100,
    featured: false,
    rating: 4.5,
    image: 'https://via.placeholder.com/300x300?text=Nike+Air+Max'
  },
  {
    _id: '4',
    name: 'Samsung 4K TV',
    description: '55-inch 4K Smart TV with HDR and streaming apps',
    price: 699,
    category: 'Electronics',
    stock: 25,
    featured: true,
    rating: 4.6,
    image: 'https://via.placeholder.com/300x300?text=Samsung+TV'
  },
  {
    _id: '5',
    name: 'Sony Headphones',
    description: 'Wireless noise-canceling headphones with premium sound',
    price: 299,
    category: 'Electronics',
    stock: 75,
    featured: true,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x300?text=Sony+Headphones'
  }
];

let carts = [];
let orders = [];
let deliveryPersonnel = [
  {
    _id: 'del1',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'rajesh@delivery.com',
    vehicle: 'Motorcycle',
    area: 'North Delhi',
    rating: 4.8,
    isAvailable: true,
    totalDeliveries: 150
  },
  {
    _id: 'del2',
    name: 'Priya Sharma',
    phone: '+91-9876543211',
    email: 'priya@delivery.com',
    vehicle: 'Scooter',
    area: 'South Delhi',
    rating: 4.9,
    isAvailable: true,
    totalDeliveries: 200
  },
  {
    _id: 'del3',
    name: 'Amit Singh',
    phone: '+91-9876543212',
    email: 'amit@delivery.com',
    vehicle: 'Bicycle',
    area: 'East Delhi',
    rating: 4.6,
    isAvailable: false,
    totalDeliveries: 120
  }
];

let notifications = [];

// Helper functions
const generateId = () => Date.now().toString();
const generateToken = (userId) => jwt.sign({ userId }, 'your-secret-key', { expiresIn: '24h' });

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Database connection (optional)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🚀 Server continuing with in-memory storage...');
  }
};

connectDB();

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running!', 
    status: 'success',
    timestamp: new Date().toISOString(),
    features: ['Products', 'Users', 'Cart', 'Orders', 'Payments', 'Delivery', 'Notifications']
  });
});

// User Authentication Routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      _id: generateId(),
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      createdAt: new Date()
    };
    
    users.push(user);
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { _id: user._id, name, email, phone, address }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Product Routes
app.get('/api/products', (req, res) => {
  const { featured, category } = req.query;
  
  let filteredProducts = products;
  
  if (featured === 'true') {
    filteredProducts = products.filter(p => p.featured);
  }
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Cart Routes
app.get('/api/cart', authMiddleware, (req, res) => {
  const userCart = carts.find(c => c.userId === req.userId) || { items: [], total: 0 };
  res.json(userCart);
});

app.post('/api/cart/add', authMiddleware, (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = products.find(p => p._id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let userCart = carts.find(c => c.userId === req.userId);
    if (!userCart) {
      userCart = {
        userId: req.userId,
        items: [],
        total: 0
      };
      carts.push(userCart);
    }
    
    const existingItem = userCart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userCart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }
    
    // Calculate total
    userCart.total = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ message: 'Item added to cart', cart: userCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/cart/remove/:productId', authMiddleware, (req, res) => {
  try {
    const { productId } = req.params;
    
    const userCart = carts.find(c => c.userId === req.userId);
    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    userCart.items = userCart.items.filter(item => item.productId !== productId);
    userCart.total = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ message: 'Item removed from cart', cart: userCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Order Routes
app.get('/api/orders', authMiddleware, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.userId);
  res.json(userOrders);
});

app.post('/api/orders', authMiddleware, (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const userCart = carts.find(c => c.userId === req.userId);
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Assign available delivery personnel
    const availableDelivery = deliveryPersonnel.find(d => d.isAvailable);
    if (availableDelivery) {
      availableDelivery.isAvailable = false;
    }
    
    const order = {
      _id: generateId(),
      userId: req.userId,
      items: userCart.items,
      total: userCart.total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      deliveryPersonId: availableDelivery?._id,
      deliveryPerson: availableDelivery ? {
        name: availableDelivery.name,
        phone: availableDelivery.phone,
        vehicle: availableDelivery.vehicle
      } : null,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    orders.push(order);
    
    // Clear cart
    const cartIndex = carts.findIndex(c => c.userId === req.userId);
    if (cartIndex > -1) {
      carts.splice(cartIndex, 1);
    }
    
    // Add notification
    notifications.push({
      _id: generateId(),
      userId: req.userId,
      type: 'order_placed',
      title: 'Order Placed Successfully',
      message: `Your order #${order._id} has been placed and will be delivered by ${availableDelivery?.name || 'our delivery team'}`,
      createdAt: new Date(),
      read: false
    });
    
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Payment Routes (Mock Razorpay)
app.post('/api/payments/create-order', authMiddleware, (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    
    const razorpayOrder = {
      id: 'order_' + generateId(),
      entity: 'order',
      amount: amount * 100, // Razorpay amount in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: 'receipt_' + generateId(),
      status: 'created',
      created_at: Math.floor(Date.now() / 1000)
    };
    
    res.json({
      success: true,
      order: razorpayOrder,
      key: 'rzp_test_mock_key_for_demo'
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment order creation failed', error: error.message });
  }
});

app.post('/api/payments/verify', authMiddleware, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Mock verification (always successful for demo)
    const payment = {
      id: razorpay_payment_id || 'pay_' + generateId(),
      order_id: razorpay_order_id,
      status: 'captured',
      amount: 99900, // Mock amount
      currency: 'INR',
      method: 'card',
      created_at: Math.floor(Date.now() / 1000)
    };
    
    // Add notification
    notifications.push({
      _id: generateId(),
      userId: req.userId,
      type: 'payment_success',
      title: 'Payment Successful',
      message: `Payment of ₹${payment.amount / 100} has been processed successfully`,
      createdAt: new Date(),
      read: false
    });
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

// Delivery Routes
app.get('/api/delivery', (req, res) => {
  res.json(deliveryPersonnel);
});

app.get('/api/delivery/available', (req, res) => {
  const available = deliveryPersonnel.filter(d => d.isAvailable);
  res.json(available);
});

app.put('/api/delivery/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;
    
    const delivery = deliveryPersonnel.find(d => d._id === id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }
    
    delivery.isAvailable = isAvailable;
    res.json({ message: 'Status updated', delivery });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Notification Routes
app.get('/api/notifications', authMiddleware, (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.userId);
  res.json(userNotifications);
});

app.put('/api/notifications/:id/read', authMiddleware, (req, res) => {
  try {
    const notification = notifications.find(n => n._id === req.params.id && n.userId === req.userId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notification.read = true;
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Routes (for demo purposes)
app.get('/api/admin/stats', (req, res) => {
  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalDeliveryPersonnel: deliveryPersonnel.length,
    availableDeliveryPersonnel: deliveryPersonnel.filter(d => d.isAvailable).length,
    recentOrders: orders.slice(-5)
  };
  res.json(stats);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎭 Mock Razorpay Payment System Initialized`);
  console.log(`✅ Perfect for project demonstrations!`);
  console.log(`💡 No real bank details required`);
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`🎉 Full E-commerce API with ALL features restored!`);
  
  console.log('\n📋 Available endpoints:');
  console.log('🔐 Authentication:');
  console.log('   POST /api/users/register      - User registration');
  console.log('   POST /api/users/login         - User login');
  console.log('\n📦 Products:');
  console.log('   GET  /api/products            - All products');
  console.log('   GET  /api/products?featured=true - Featured products');
  console.log('   GET  /api/products/:id        - Single product');
  console.log('\n🛒 Cart:');
  console.log('   GET  /api/cart                - Get user cart');
  console.log('   POST /api/cart/add            - Add to cart');
  console.log('   DELETE /api/cart/remove/:id   - Remove from cart');
  console.log('\n📋 Orders:');
  console.log('   GET  /api/orders              - User orders');
  console.log('   POST /api/orders              - Place order');
  console.log('\n💳 Payments (Mock Razorpay):');
  console.log('   POST /api/payments/create-order - Create payment order');
  console.log('   POST /api/payments/verify     - Verify payment');
  console.log('\n🚚 Delivery:');
  console.log('   GET  /api/delivery            - All delivery personnel');
  console.log('   GET  /api/delivery/available  - Available delivery personnel');
  console.log('\n🔔 Notifications:');
  console.log('   GET  /api/notifications       - User notifications');
  console.log('   PUT  /api/notifications/:id/read - Mark as read');
  console.log('\n📊 Admin:');
  console.log('   GET  /api/admin/stats         - System statistics');
  
  console.log('\n🎯 Features Restored:');
  console.log('   ✅ User Authentication & JWT');
  console.log('   ✅ Product Management');
  console.log('   ✅ Shopping Cart');
  console.log('   ✅ Order Processing');
  console.log('   ✅ Mock Razorpay Payments');
  console.log('   ✅ Delivery Personnel Assignment');
  console.log('   ✅ Real-time Notifications');
  console.log('   ✅ Admin Dashboard Stats');
  console.log('   ✅ In-memory Storage (works without MongoDB)');
});

console.log('✅ Full E-commerce Server setup completed with ALL features!');
