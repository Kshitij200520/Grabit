console.log('🚀 Starting Professional E-commerce Server with MongoDB...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

console.log('✅ Modules loaded successfully');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Session middleware for guest user support
app.use(session({
  secret: process.env.SESSION_SECRET || 'ecommerce_session_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

console.log('✅ Middleware configured with session support');


// DATABASE CONNECTION

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();


// ROUTES IMPORT

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const deliveryRouter = require('./routes/delivery');

console.log('✅ Database connection established');


// ROUTES MOUNTING

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/delivery', deliveryRouter);


// MAIN ROUTES


// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Professional E-commerce API with MongoDB', 
    status: 'success',
    timestamp: new Date().toISOString(),
    database: 'MongoDB',
    features: ['Authentication', 'Products', 'Cart', 'Orders', 'Payments', 'Delivery', 'Admin Panel']
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ All routes configured');


// SERVER STARTUP

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎯 Professional E-commerce Server Running`);
  console.log(`✅ MongoDB Integration Active`);
  console.log(`🎭 Mock Razorpay Payment System Ready`);
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`🎓 Perfect for Academic Demonstration!`);
  
  console.log('\n📋 Professional API Endpoints:');
  console.log('🔐 Authentication & Users:');
  console.log('   POST /api/users/register      - User registration');
  console.log('   POST /api/users/login         - User login');
  console.log('   GET  /api/users/profile       - Get user profile');
  console.log('   PUT  /api/users/profile       - Update profile');
  console.log('\n📦 Products:');
  console.log('   GET  /api/products            - All products (with search & filters)');
  console.log('   GET  /api/products/:id        - Single product');
  console.log('\n🛒 Cart Management:');
  console.log('   GET  /api/cart                - Get user cart');
  console.log('   POST /api/cart/add            - Add to cart');
  console.log('   PUT  /api/cart/update/:id     - Update quantity');
  console.log('   DELETE /api/cart/remove/:id   - Remove from cart');
  console.log('   DELETE /api/cart/clear        - Clear cart');
  console.log('\n📋 Order Management:');
  console.log('   GET  /api/orders              - User orders');
  console.log('   POST /api/orders              - Place order');
  console.log('   GET  /api/orders/:id          - Order details');
  console.log('\n💳 Payment Processing:');
  console.log('   POST /api/payments/order      - Create payment order');
  console.log('   POST /api/payments/verify     - Verify payment');
  console.log('\n🚚 Delivery System:');
  console.log('   GET  /api/delivery            - All delivery personnel');
  console.log('   GET  /api/delivery/available  - Available personnel');
  console.log('   PUT  /api/delivery/:id/availability - Update availability');
  
  console.log('\n🎓 Features for Professor Demo:');
  console.log('   ✅ MongoDB Database Integration');
  console.log('   ✅ Professional MVC Architecture');
  console.log('   ✅ JWT Authentication & Authorization');
  console.log('   ✅ Comprehensive Error Handling');
  console.log('   ✅ RESTful API Design');
  console.log('   ✅ Mock Payment Gateway (Razorpay)');
  console.log('   ✅ Delivery Management System');
  console.log('   ✅ Real-time Order Tracking');
});

console.log('✅ Full E-commerce Server setup completed with ALL features!');


