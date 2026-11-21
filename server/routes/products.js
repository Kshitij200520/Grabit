const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { cacheMiddleware } = require('../middleware/cache');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', cacheMiddleware(1800, 'products:'), async (req, res) => {
  try {
    const { featured, category, search } = req.query;
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', cacheMiddleware(3600, 'product:'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Seed products (for development)
// @route   POST /api/products/seed
// @access  Public (for demo purposes)
router.post('/seed', async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling wireless headphones',
        price: 2999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        stock: 50,
        featured: true
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        price: 4999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
        stock: 30,
        featured: true
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable athletic shoes for running and sports',
        price: 3999,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        stock: 100,
        featured: false
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Compact wireless speaker with rich stereo sound',
        price: 2499,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
        stock: 45,
        featured: true
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated reusable bottle for hot and cold drinks',
        price: 699,
        category: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        stock: 80,
        featured: true
      },
      {
        name: 'Everyday Laptop Backpack',
        description: 'Lightweight backpack with padded laptop storage',
        price: 1899,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        stock: 35,
        featured: false
      },
      {
        name: 'Adjustable Desk Lamp',
        description: 'Modern LED desk lamp with adjustable brightness',
        price: 1299,
        category: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
        stock: 25,
        featured: true
      },
      {
        name: 'Classic UV Sunglasses',
        description: 'Lightweight sunglasses with UV protection',
        price: 999,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop',
        stock: 60,
        featured: false
      },
      {
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of two durable ceramic mugs for everyday use',
        price: 799,
        category: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
        stock: 40,
        featured: false
      },
      {
        name: 'Non-Slip Yoga Mat',
        description: 'Comfortable exercise mat for yoga and home workouts',
        price: 1499,
        category: 'Sports & Fitness',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
        stock: 30,
        featured: true
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'Responsive mechanical keyboard with RGB backlighting',
        price: 3299,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
        stock: 20,
        featured: false
      }
    ];

    const result = await Product.bulkWrite(sampleProducts.map(product => ({
      updateOne: {
        filter: { name: product.name },
        update: { $setOnInsert: product },
        upsert: true
      }
    })));
    const products = await Product.find({
      name: { $in: sampleProducts.map(product => product.name) }
    }).sort({ createdAt: -1 });
    
    res.status(result.upsertedCount ? 201 : 200).json({
      message: 'Demo products added successfully',
      added: result.upsertedCount,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
