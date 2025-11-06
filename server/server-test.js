const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('Server starting...');

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});

// Simple products route for testing
app.get('/api/products', (req, res) => {
  res.json([
    {
      _id: '1',
      name: 'Sample Product 1',
      price: 999,
      description: 'A sample product for testing',
      category: 'Electronics',
      featured: true
    },
    {
      _id: '2', 
      name: 'Sample Product 2',
      price: 1999,
      description: 'Another sample product',
      category: 'Clothing',
      featured: false
    }
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎭 Mock Razorpay Payment System Initialized`);
  console.log(`✅ Perfect for project demonstrations!`);
  console.log(`💡 No real bank details required`);
  console.log(`Server is running on port ${PORT}`);
});

console.log('Server setup complete');
