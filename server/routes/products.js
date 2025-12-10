const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

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
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return res.json({ 
        message: 'Products already seeded',
        count: existingProducts 
      });
    }

    // Sample products for seeding
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
      }
    ];

    const products = await Product.insertMany(sampleProducts);
    
    res.status(201).json({
      message: 'Products seeded successfully',
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
