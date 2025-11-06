const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Sample products data
const sampleProducts = [
  {
    name: "MacBook Pro M3",
    description: "Latest MacBook Pro with M3 chip, 16GB RAM, 512GB SSD",
    price: 89999,
    category: "Electronics",
    stock: 10,
    featured: true,
    imageUrl: "https://via.placeholder.com/300x200?text=MacBook+Pro"
  },
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip, 128GB storage",
    price: 79999,
    category: "Electronics",
    stock: 15,
    featured: true,
    imageUrl: "https://via.placeholder.com/300x200?text=iPhone+15+Pro"
  },
  {
    name: "Samsung Galaxy S24",
    description: "Premium Android smartphone with 256GB storage",
    price: 69999,
    category: "Electronics",
    stock: 12,
    featured: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Galaxy+S24"
  },
  {
    name: "Sony WH-1000XM5",
    description: "Noise-canceling wireless headphones",
    price: 24999,
    category: "Electronics",
    stock: 25,
    featured: true,
    imageUrl: "https://via.placeholder.com/300x200?text=Sony+Headphones"
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max technology",
    price: 8999,
    category: "Fashion",
    stock: 30,
    featured: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Nike+Air+Max"
  },
  {
    name: "Levi's 501 Jeans",
    description: "Classic straight-fit jeans, 100% cotton",
    price: 3999,
    category: "Fashion",
    stock: 50,
    featured: false,
    imageUrl: "https://via.placeholder.com/300x200?text=Levis+Jeans"
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Starting product seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert new products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully created ${createdProducts.length} products`);
    
    console.log('📦 Products in database:');
    createdProducts.forEach(product => {
      console.log(`  - ${product.name}: ₹${product.price}`);
    });
    
    console.log('🎉 Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Connect and seed
mongoose.connection.once('open', () => {
  console.log('📡 Connected to MongoDB');
  seedProducts();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
