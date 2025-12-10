const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const uniqueProducts = [
  {
    name: "iPhone 15 Pro Max 1TB Titanium",
    description: "Latest iPhone 15 Pro Max with 1TB storage and titanium design",
    price: 159900,
    category: "Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
    featured: true
  },
  {
    name: "MacBook Pro 16-inch M3 Max",
    description: "Professional laptop with M3 Max chip and 16-inch Liquid Retina XDR display",
    price: 399900,
    category: "Electronics", 
    stock: 15,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
    featured: true
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Premium Android smartphone with S Pen and advanced camera system",
    price: 139900,
    category: "Electronics",
    stock: 30,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    featured: true
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones",
    price: 29990,
    category: "Electronics",
    stock: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
  },
  {
    name: "Dell XPS 13 Laptop",
    description: "Ultra-portable laptop with InfinityEdge display",
    price: 124990,
    category: "Electronics", 
    stock: 20,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
  },
  {
    name: "Nike Air Jordan 4 Retro",
    description: "Classic basketball shoes in Black Cat colorway",
    price: 21000,
    category: "Fashion",
    stock: 40,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    featured: true
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with Boost technology",
    price: 18000,
    category: "Fashion",
    stock: 35,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans in vintage wash",
    price: 7999,
    category: "Fashion",
    stock: 60,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Iconic aviator sunglasses with UV protection",
    price: 15000,
    category: "Fashion",
    stock: 45,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"
  },
  {
    name: "Tommy Hilfiger Polo Shirt",
    description: "Classic polo shirt in premium cotton",
    price: 4999,
    category: "Fashion",
    stock: 80,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
  },
  {
    name: "IKEA MALM Bed Frame",
    description: "Modern bed frame in white with storage",
    price: 24999,
    category: "Home & Garden",
    stock: 15,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    featured: true
  },
  {
    name: "West Elm Mid-Century Sofa",
    description: "Comfortable 3-seater sofa in modern design",
    price: 129999,
    category: "Home & Garden",
    stock: 8,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
    featured: true
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "Professional 5-quart stand mixer in classic white",
    price: 37999,
    category: "Home & Garden",
    stock: 25,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    featured: true
  },
  {
    name: "Dyson V15 Detect Vacuum",
    description: "Advanced cordless vacuum with laser detection",
    price: 84999,
    category: "Home & Garden",
    stock: 12,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"
  },
  {
    name: "Philips Air Fryer",
    description: "Digital air fryer with rapid air technology",
    price: 12999,
    category: "Home & Garden",
    stock: 30,
    image: "https://images.unsplash.com/photo-1585488768889-3400c5b4b7ff?w=500"
  },
  {
    name: "Peloton Bike+",
    description: "Interactive fitness bike with rotating touchscreen",
    price: 269500,
    category: "Sports & Fitness",
    stock: 5,
    image: "https://images.unsplash.com/photo-1571019613914-85e3cbcc1413?w=500",
    featured: true
  },
  {
    name: "Dumbbells Set 20kg",
    description: "Adjustable dumbbell set for home workouts", 
    price: 8999,
    category: "Sports & Fitness",
    stock: 40,
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500"
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat in eco-friendly material",
    price: 2999,
    category: "Sports & Fitness", 
    stock: 100,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"
  },
  {
    name: "Protein Powder Whey",
    description: "Premium whey protein isolate 2kg tub",
    price: 5999,
    category: "Sports & Fitness",
    stock: 75,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500"
  },
  {
    name: "Running Shoes Nike Air",
    description: "Lightweight running shoes with air cushioning",
    price: 12999,
    category: "Sports & Fitness",
    stock: 55,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"
  },
  {
    name: "L'Oreal Paris Foundation",
    description: "True Match foundation with 24h wear",
    price: 1299,
    category: "Beauty & Personal Care",
    stock: 120,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"
  },
  {
    name: "Dyson Hair Dryer",
    description: "Supersonic hair dryer with magnetic attachments",
    price: 39999,
    category: "Beauty & Personal Care",
    stock: 18,
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500",
    featured: true
  },
  {
    name: "Perfume Chanel No. 5",
    description: "Classic women's fragrance 100ml",
    price: 14999,
    category: "Beauty & Personal Care",
    stock: 25,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
  },
  {
    name: "Skincare Set The Ordinary", 
    description: "Complete skincare routine set for all skin types",
    price: 4999,
    category: "Beauty & Personal Care",
    stock: 80,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500"
  },
  {
    name: "Electric Toothbrush Oral-B",
    description: "Rechargeable electric toothbrush with timer",
    price: 7999,
    category: "Beauty & Personal Care",
    stock: 45,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500"
  }
];

async function seedUniqueProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('🌱 Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert new unique products
    const createdProducts = await Product.insertMany(uniqueProducts);
    console.log(`✅ Successfully created ${createdProducts.length} unique products!`);

    // Show categories
    const categories = [...new Set(uniqueProducts.map(p => p.category))];
    console.log(`\n📊 Categories created: ${categories.join(', ')}`);

    // Show featured products
    const featuredProducts = uniqueProducts.filter(p => p.featured);
    console.log(`\n🌟 Featured products: ${featuredProducts.length}`);
    featuredProducts.forEach(p => console.log(`   - ${p.title} - ${p.category} - ₹${p.price}`));

    console.log('\n🎉 Database seeded with unique product images!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedUniqueProducts();