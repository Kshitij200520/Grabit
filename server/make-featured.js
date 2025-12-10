const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const makeFeatured = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    
    // Get all products and make the first 8 featured
    const products = await Product.find().limit(8);
    console.log(`📦 Found ${products.length} products to make featured`);
    
    if (products.length === 0) {
      console.log('❌ No products found. Running seed first...');
      await mongoose.disconnect();
      return;
    }
    
    // Update these products to be featured
    const updatePromises = products.map(product => 
      Product.findByIdAndUpdate(product._id, { featured: true })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Successfully made ${products.length} products featured!`);
    
    // Show the featured products
    const featuredProducts = await Product.find({ featured: true });
    console.log(`🌟 Total featured products: ${featuredProducts.length}`);
    
    featuredProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

makeFeatured();