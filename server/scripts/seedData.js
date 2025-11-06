const mongoose = require('mongoose');
const Product = require('../models/Product');
const DeliveryPersonnel = require('../models/DeliveryPersonnel');
require('dotenv').config();

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features, A17 Pro chip, and excellent camera quality with professional photography capabilities',
    price: 999,
    category: 'Electronics',
    stock: 50,
    featured: true,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop&crop=center'
  },
  {
    name: 'MacBook Air M2',
    description: 'Powerful laptop with M2 chip, perfect for work and creativity. Ultra-thin design with all-day battery life',
    price: 1199,
    category: 'Electronics',
    stock: 30,
    featured: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center'
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with excellent cushioning and modern design for everyday wear',
    price: 129,
    category: 'Footwear',
    stock: 100,
    featured: false,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center'
  },
  {
    name: 'Samsung 4K Smart TV',
    description: '55-inch 4K Smart TV with HDR, streaming apps, and crystal clear picture quality',
    price: 699,
    category: 'Electronics',
    stock: 25,
    featured: true,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop&crop=center'
  },
  {
    name: 'Sony WH-1000XM4 Headphones',
    description: 'Wireless noise-canceling headphones with premium sound quality and 30-hour battery life',
    price: 299,
    category: 'Electronics',
    stock: 75,
    featured: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center'
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with responsive cushioning and sustainable materials',
    price: 180,
    category: 'Footwear',
    stock: 60,
    featured: false,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop&crop=center'
  },
  {
    name: 'Dell XPS 13',
    description: 'Ultra-portable laptop with InfinityEdge display and powerful performance',
    price: 899,
    category: 'Electronics',
    stock: 40,
    featured: true,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&crop=center'
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-fit jeans made with premium denim. Timeless style and comfort',
    price: 89,
    category: 'Clothing',
    stock: 120,
    featured: false,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&crop=center'
  }
];

const deliveryPersonnel = [
  {
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    vehicleType: 'Bike',
    isAvailable: true,
    currentLocation: { lat: 28.6139, lng: 77.2090 }, // Delhi coordinates
    rating: 4.8,
    totalDeliveries: 150
  },
  {
    name: 'Priya Sharma',
    phone: '+91-9876543211',
    vehicleType: 'Car',
    isAvailable: true,
    currentLocation: { lat: 28.5355, lng: 77.3910 }, // Noida coordinates
    rating: 4.9,
    totalDeliveries: 200
  },
  {
    name: 'Amit Singh',
    phone: '+91-9876543212',
    vehicleType: 'Bicycle',
    isAvailable: false,
    currentLocation: { lat: 28.4595, lng: 77.0266 }, // Gurgaon coordinates
    rating: 4.6,
    totalDeliveries: 120
  },
  {
    name: 'Sunita Devi',
    phone: '+91-9876543213',
    vehicleType: 'Bike',
    isAvailable: true,
    currentLocation: { lat: 28.7041, lng: 77.1025 }, // North Delhi
    rating: 4.7,
    totalDeliveries: 180
  },
  {
    name: 'Mohammed Ali',
    phone: '+91-9876543214',
    vehicleType: 'Car',
    isAvailable: true,
    currentLocation: { lat: 28.5244, lng: 77.1855 }, // South Delhi
    rating: 4.5,
    totalDeliveries: 95
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Connected to MongoDB for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await DeliveryPersonnel.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 Seeded ${createdProducts.length} products`);

    // Insert delivery personnel
    const createdDeliveryPersonnel = await DeliveryPersonnel.insertMany(deliveryPersonnel);
    console.log(`🚚 Seeded ${createdDeliveryPersonnel.length} delivery personnel`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Delivery Personnel: ${createdDeliveryPersonnel.length}`);
    console.log(`   Categories: Electronics, Footwear, Clothing`);
    console.log(`   Featured Products: ${createdProducts.filter(p => p.featured).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, products, deliveryPersonnel };
