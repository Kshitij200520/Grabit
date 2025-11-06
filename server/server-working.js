console.log('🚀 Starting Minimal E-commerce Server...');

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('✅ Middleware configured');

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running!', 
    status: 'success',
    timestamp: new Date().toISOString(),
    features: ['Products', 'Users', 'Cart', 'Orders', 'Payments', 'Delivery']
  });
});

// Products route
app.get('/api/products', (req, res) => {
  const { featured } = req.query;
  
  const sampleProducts = [
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
    }
  ];

  let filteredProducts = sampleProducts;
  
  if (featured === 'true') {
    filteredProducts = sampleProducts.filter(p => p.featured);
  }

  res.json(filteredProducts);
});

const PORT = process.env.PORT || 5000;

console.log(`🚀 Starting server on port ${PORT}...`);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`🎉 E-commerce API ready!`);
  
  console.log('\n📋 Available endpoints:');
  console.log('   GET  /                    - API status');
  console.log('   GET  /api/products        - All products');
  console.log('   GET  /api/products?featured=true - Featured products');
});

console.log('✅ Server setup completed');
