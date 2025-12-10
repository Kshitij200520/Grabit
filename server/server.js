console.log('🚀 Starting Professional E-commerce Server with MongoDB & Redis...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const http = require('http');
require('dotenv').config();

// Initialize Redis Manager
const redisManager = require('./cache/RedisManager');
const { sessionCache, warmCache } = require('./middleware/cache');

console.log('✅ Modules loaded successfully');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket manager
const webSocketManager = require('./websocket/websocketManager');
webSocketManager.initialize(server);

// Setup security middleware
const { setupSecurity } = require('./middleware/security');
setupSecurity(app);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://grabit-ecommerce-fullstack-r2h2im72x-kshitij-kohlis-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Guest-ID'
  ]
}));

// Session configuration for guest cart support
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: false, // set to true if using https
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add session cache middleware
app.use(sessionCache());

console.log('✅ Middleware configured');

// Database connection with advanced features
const DatabaseManager = require('./database/DatabaseManager');

// Redis connection
const connectRedis = async () => {
  try {
    await redisManager.connect();
    console.log('✅ Redis caching system initialized');
    
    // Warm up cache with initial data
    setTimeout(async () => {
      await warmCache.products();
      console.log('🔥 Cache warming completed');
    }, 5000);
    
  } catch (error) {
    console.log('⚠️ Redis unavailable, continuing without caching...');
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await DatabaseManager.connect(mongoUri);
    
    // Enable query optimization
    await DatabaseManager.optimizeQueries();
    
    console.log('✅ Advanced MongoDB features enabled');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to database and Redis
connectDB();
connectRedis();

// Import routes
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const deliveryRouter = require('./routes/delivery');
const analyticsRouter = require('./routes/analytics');

console.log('✅ Database connection established');

// Mount routes
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/analytics', analyticsRouter);

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

// All routes are now handled by their respective route files

console.log('✅ All routes configured');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🎯 Professional E-commerce Server Running`);
  console.log(`✅ MongoDB Integration Active`);
  console.log(`🎭 Mock Razorpay Payment System Ready`);
  console.log(`🔗 WebSocket Server Active - Real-time Features Available`);
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket URL: ws://localhost:${PORT}`);
  console.log(`🎓 Perfect for Academic Demonstration!`);
  
  console.log('\n📋 Professional API Endpoints:');
  console.log('🔐 Authentication & Users:');
  console.log('   POST /api/users/register      - User registration with email verification');
  console.log('   POST /api/users/login         - User login with 2FA support');
  console.log('   POST /api/users/refresh       - Refresh access token');
  console.log('   POST /api/users/logout        - Logout user');
  console.log('   POST /api/users/forgot-password - Password reset request');
  console.log('   POST /api/users/enable-2fa    - Enable two-factor authentication');
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
  
  console.log('\n📊 Advanced Analytics:');
  console.log('   GET  /api/analytics/health     - Database health check');
  console.log('   GET  /api/analytics/products   - Product analytics (Admin)');
  console.log('   GET  /api/analytics/users      - User analytics (Admin)');
  console.log('   GET  /api/analytics/orders     - Order analytics (Admin)');
  console.log('   GET  /api/analytics/database   - Database statistics (Admin)');
  console.log('   GET  /api/analytics/dashboard  - Complete dashboard (Admin)');
  
  console.log('\n🔗 Real-time WebSocket Features:');
  console.log('   📦 Order tracking and updates');
  console.log('   💬 Live chat support');
  console.log('   🔔 Real-time notifications');
  console.log('   📊 Inventory updates');
  console.log('   🚚 Delivery tracking');
  console.log('   👥 Admin monitoring dashboard');
  
  console.log('\n🎓 Advanced Features for Professor Demo:');
  console.log('   ✅ MongoDB Database Integration with Advanced Indexing');
  console.log('   ✅ Database Connection Pooling & Optimization');
  console.log('   ✅ MongoDB Aggregation Pipelines for Analytics');
  console.log('   ✅ Database Performance Monitoring & Query Profiling');
  console.log('   ✅ Professional MVC Architecture');
  console.log('   ✅ Advanced JWT Authentication & Authorization');
  console.log('   ✅ Role-based Access Control (Customer/Admin/Vendor/Delivery)');
  console.log('   ✅ Two-Factor Authentication (2FA)');
  console.log('   ✅ Password Reset & Email Verification');
  console.log('   ✅ Refresh Token Management');
  console.log('   ✅ Rate Limiting & Security Headers');
  console.log('   ✅ Input Validation & Sanitization');
  console.log('   ✅ WebSocket Integration for Real-time Features');
  console.log('   ✅ Comprehensive Error Handling');
  console.log('   ✅ RESTful API Design');
  console.log('   ✅ Mock Payment Gateway (Razorpay)');
  console.log('   ✅ Delivery Management System');
  console.log('   ✅ Real-time Order Tracking');
  console.log('   ✅ Live Chat Support System');
  console.log('   ✅ Security Event Logging');
  console.log('   ✅ Advanced Database Analytics & Reporting');
});

console.log('✅ Full E-commerce Server setup completed with ALL features!');