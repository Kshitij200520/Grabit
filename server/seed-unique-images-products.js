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
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
    featured: true
  },
  {
    name: "MacBook Pro 16-inch M3 Max",
    description: "Professional laptop with M3 Max chip and 16-inch Liquid Retina XDR display",
    price: 399900,
    category: "Electronics", 
    stock: 15,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    featured: true
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Premium Android smartphone with S Pen and advanced camera system",
    price: 139900,
    category: "Electronics",
    stock: 30,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
    featured: true
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones",
    price: 29990,
    category: "Electronics",
    stock: 50,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500"
  },
  {
    name: "Dell XPS 13 Laptop",
    description: "Ultra-portable laptop with InfinityEdge display",
    price: 124990,
    category: "Electronics", 
    stock: 20,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"
  },
  {
    name: "Nike Air Jordan 4 Retro",
    description: "Classic basketball shoes in Black Cat colorway",
    price: 21000,
    category: "Fashion",
    stock: 40,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
    featured: true
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with Boost technology",
    price: 18000,
    category: "Fashion",
    stock: 35,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500"
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans in vintage wash",
    price: 7999,
    category: "Fashion",
    stock: 60,
    image: "https://images.unsplash.com/photo-1542272454315-7e61eff2b0a0?w=500"
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Iconic aviator sunglasses with UV protection",
    price: 15000,
    category: "Fashion",
    stock: 45,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
  },
  {
    name: "Tommy Hilfiger Polo Shirt",
    description: "Classic polo shirt in premium cotton",
    price: 4999,
    category: "Fashion",
    stock: 80,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500"
  },
  {
    name: "IKEA MALM Bed Frame",
    description: "Modern bed frame in white with storage",
    price: 24999,
    category: "Home & Garden",
    stock: 15,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
    featured: true
  },
  {
    name: "West Elm Mid-Century Sofa",
    description: "Comfortable 3-seater sofa in modern design",
    price: 129999,
    category: "Home & Garden",
    stock: 8,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500",
    featured: true
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "Professional 5-quart stand mixer in classic white",
    price: 37999,
    category: "Home & Garden",
    stock: 25,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500",
    featured: true
  },
  {
    name: "Dyson V15 Detect Vacuum",
    description: "Advanced cordless vacuum with laser detection",
    price: 84999,
    category: "Home & Garden",
    stock: 12,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500"
  },
  {
    name: "Philips Air Fryer",
    description: "Digital air fryer with rapid air technology",
    price: 12999,
    category: "Home & Garden",
    stock: 30,
    image: "https://images.unsplash.com/photo-1621959275044-fb2c001a9357?w=500"
  },
  {
    name: "Peloton Bike+",
    description: "Interactive fitness bike with rotating touchscreen",
    price: 269500,
    category: "Sports & Fitness",
    stock: 5,
    image: "https://www.garagegymreviews.com/wp-content/uploads/peloton-bike-plus-white-background.jpg",
    featured: true
  },
  {
    name: "Dumbbells Set 20kg",
    description: "Adjustable dumbbell set for home workouts", 
    price: 8999,
    category: "Sports & Fitness",
    stock: 40,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500"
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat in eco-friendly material",
    price: 2999,
    category: "Sports & Fitness", 
    stock: 100,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
  },
  {
    name: "Protein Powder Whey",
    description: "Premium whey protein isolate 2kg tub",
    price: 5999,
    category: "Sports & Fitness",
    stock: 75,
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500"
  },
  {
    name: "Running Shoes Nike Air",
    description: "Lightweight running shoes with air cushioning",
    price: 12999,
    category: "Sports & Fitness",
    stock: 55,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
  },
  {
    name: "L'Oreal Paris Foundation",
    description: "True Match foundation with 24h wear",
    price: 1299,
    category: "Beauty & Personal Care",
    stock: 120,
    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500"
  },
  {
    name: "Dyson Hair Dryer",
    description: "Supersonic hair dryer with magnetic attachments",
    price: 39999,
    category: "Beauty & Personal Care",
    stock: 18,
    image: "https://media.istockphoto.com/id/1643940503/photo/fashionable-high-end-hair-dryer.jpg?s=1024x1024&w=is&k=20&c=Db1DCliOJlaL6mqzXXQ0C8pz6-lfMd0jklDZuRal-as=",
    featured: true
  },
  {
    name: "Perfume Chanel No. 5",
    description: "Classic women's fragrance 100ml",
    price: 14999,
    category: "Beauty & Personal Care",
    stock: 25,
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500"
  },
  {
    name: "Skincare Set The Ordinary", 
    description: "Complete skincare routine set for all skin types",
    price: 4999,
    category: "Beauty & Personal Care",
    stock: 80,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500"
  },
  {
    name: "Electric Toothbrush Oral-B",
    description: "Rechargeable electric toothbrush with timer",
    price: 7999,
    category: "Beauty & Personal Care",
    stock: 45,
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500"
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