const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product schema (copied from models/Product.js)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Product+Image'
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

// Sample products data
const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced features and excellent camera quality",
    price: 999,
    category: "Electronics",
    stock: 50,
    featured: true,
    rating: 4.8,
    image: "https://via.placeholder.com/300x300?text=iPhone+15+Pro"
  },
  {
    name: "MacBook Air M2",
    description: "Powerful laptop with M2 chip, perfect for work and creativity",
    price: 1199,
    category: "Electronics",
    stock: 30,
    featured: true,
    rating: 4.9,
    image: "https://via.placeholder.com/300x300?text=MacBook+Air"
  },
  {
    name: "Nike Air Max",
    description: "Comfortable running shoes with excellent cushioning",
    price: 129,
    category: "Footwear",
    stock: 100,
    featured: false,
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=Nike+Air+Max"
  },
  {
    name: "Samsung 4K TV",
    description: "55-inch 4K Smart TV with HDR and streaming apps",
    price: 699,
    category: "Electronics",
    stock: 25,
    featured: true,
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=Samsung+TV"
  },
  {
    name: "Adidas T-Shirt",
    description: "Comfortable cotton t-shirt for sports and casual wear",
    price: 29,
    category: "Clothing",
    stock: 200,
    featured: false,
    rating: 4.3,
    image: "https://via.placeholder.com/300x300?text=Adidas+Tshirt"
  }
];

// Seed function
const seedProducts = async () => {
  try {
    console.log('🌱 Seeding products...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products seeded successfully');
    
    const count = await Product.countDocuments();
    console.log(`📦 Total products in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

// Run seeding
seedProducts().then(() => {
  console.log('🎉 Product seeding completed');
  process.exit(0);
});
