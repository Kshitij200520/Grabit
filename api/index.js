console.log('🚀 Starting Vercel Serverless E-commerce API...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('✅ Modules loaded for Vercel deployment');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://grabit-ecommerce-fullstack.vercel.app',
    'https://client-hjw7qbqmp-kshitij-kohlis-projects.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

console.log('✅ Middleware configured for Vercel');

// Database connection with connection reuse for serverless
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = conn;
    console.log(`✅ MongoDB Connected for Vercel: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

// Import routes (we'll create simplified versions)
const usersRouter = require('../server/routes/users');
const productsRouter = require('../server/routes/products');
const cartRouter = require('../server/routes/cart');
const ordersRouter = require('../server/routes/orders');
const paymentsRouter = require('../server/routes/payments');

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Grabit E-commerce API - Vercel Serverless', 
    status: 'success',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas',
    deployment: 'Vercel Serverless Functions',
    frontend: 'https://client-hjw7qbqmp-kshitij-kohlis-projects.vercel.app'
  });
});

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: 'healthy',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      deployment: 'Vercel Serverless'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    res.status(503).json({ message: 'Database connection unavailable' });
  }
});

// Mount API routes
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);

console.log('✅ All API routes configured for Vercel');

// For Vercel, we export the app instead of listening
module.exports = app;