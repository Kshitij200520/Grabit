const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/delivery', require('./routes/delivery'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎭 Mock Razorpay Payment System Initialized`);
  console.log(`✅ Perfect for project demonstrations!`);
  console.log(`💡 No real bank details required`);
  console.log(`Server is running on port ${PORT}`);
});
