const express = require('express');
const cors = require('cors');

console.log('🚀 Starting simple server...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});

// Simple products route without database
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Sample Product 1', price: 100 },
    { id: 2, name: 'Sample Product 2', price: 200 }
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎭 Mock Razorpay Payment System Initialized`);
  console.log(`✅ Perfect for project demonstrations!`);
  console.log(`💡 No real bank details required`);
  console.log(`Server is running on port ${PORT}`);
});
