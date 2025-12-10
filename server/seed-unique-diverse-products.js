const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product schema
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
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
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

// Professional E-commerce Product Catalog with UNIQUE Images for Each Product
const uniqueProducts = [
  // Electronics & Technology - All Different Images
  {
    name: "iPhone 15 Pro Max 1TB Titanium",
    description: "Latest iPhone with titanium design, A17 Pro chip, Action Button, and professional camera system with 5x telephoto zoom",
    price: 1599,
    category: "Electronics",
    stock: 25,
    featured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop"
  },
  {
    name: "MacBook Pro 16-inch M3 Max",
    description: "Professional laptop with M3 Max chip, 36GB RAM, 1TB SSD, and Liquid Retina XDR display for creative professionals",
    price: 3999,
    category: "Electronics",
    stock: 15,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop"
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Premium Android flagship with S Pen, 200MP camera, AI features, and titanium frame for ultimate productivity",
    price: 1399,
    category: "Electronics",
    stock: 30,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling headphones with 30-hour battery, multipoint connection, and crystal-clear calls",
    price: 399,
    category: "Electronics",
    stock: 50,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"
  },
  {
    name: "iPad Pro 12.9-inch M2 1TB",
    description: "Professional tablet with M2 chip, Liquid Retina XDR display, Apple Pencil hover, and all-day battery life",
    price: 1399,
    category: "Electronics",
    stock: 20,
    featured: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop"
  },
  {
    name: "Gaming Desktop RTX 4090 Ultimate",
    description: "High-end gaming PC with RTX 4090, Intel i9-13900K, 64GB DDR5 RAM, and liquid cooling for 4K gaming",
    price: 4999,
    category: "Electronics",
    stock: 8,
    featured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=500&fit=crop"
  },
  {
    name: "Sony Alpha a7R V Camera",
    description: "61MP full-frame camera with 8K video, AI-powered autofocus, and professional-grade image stabilization",
    price: 3899,
    category: "Electronics",
    stock: 12,
    featured: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop"
  },
  {
    name: "LG OLED C3 77-inch 4K TV",
    description: "Premium OLED TV with perfect blacks, Dolby Vision IQ, α9 Gen6 AI Processor, and gaming features",
    price: 2999,
    category: "Electronics",
    stock: 10,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop"
  },
  {
    name: "Apple Watch Ultra 2 GPS",
    description: "Rugged smartwatch with titanium case, precision dual-frequency GPS, and up to 36 hours battery life",
    price: 799,
    category: "Electronics",
    stock: 35,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop"
  },
  {
    name: "PlayStation 5 Pro Console",
    description: "Next-gen gaming console with 8K support, ray tracing, ultra-fast SSD, and backwards compatibility",
    price: 699,
    category: "Electronics",
    stock: 18,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop"
  },

  // Fashion & Apparel - All Different Images
  {
    name: "Nike Air Jordan 4 Retro Black Cat",
    description: "Iconic basketball sneakers with premium black nubuck upper, Air-Sole units, and classic Jordan styling",
    price: 210,
    category: "Fashion",
    stock: 40,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop"
  },
  {
    name: "Levi's 501 Original Fit Jeans",
    description: "Classic straight-leg jeans with authentic fit, premium denim quality, and timeless American styling",
    price: 89,
    category: "Fashion",
    stock: 60,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop"
  },
  {
    name: "Patagonia Down Sweater Jacket",
    description: "Lightweight down insulation jacket made with recycled materials, perfect for outdoor adventures",
    price: 229,
    category: "Fashion",
    stock: 35,
    featured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop"
  },
  {
    name: "Adidas Ultraboost 23 Running Shoes",
    description: "Premium running shoes with Boost midsole, Primeknit upper, and Continental rubber outsole",
    price: 190,
    category: "Fashion",
    stock: 45,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
  },
  {
    name: "Ralph Lauren Polo Bear Sweater",
    description: "Classic crew neck sweater featuring the iconic Polo Bear design in premium cotton blend",
    price: 165,
    category: "Fashion",
    stock: 25,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop"
  },
  {
    name: "Canada Goose Expedition Parka",
    description: "Arctic-grade parka with coyote fur trim, down insulation, and weather-resistant construction",
    price: 1095,
    category: "Fashion",
    stock: 12,
    featured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop"
  },
  {
    name: "Gucci Ace Leather Sneakers",
    description: "Luxury leather sneakers with signature green and red stripe, gold bee embroidery, and Italian craftsmanship",
    price: 650,
    category: "Fashion",
    stock: 20,
    featured: true,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop"
  },
  {
    name: "Supreme Box Logo Hoodie",
    description: "Iconic streetwear hoodie with embroidered box logo, heavyweight cotton fleece, and limited availability",
    price: 168,
    category: "Fashion",
    stock: 15,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop"
  },
  {
    name: "Rolex Submariner Date Watch",
    description: "Luxury dive watch with 40mm Oystersteel case, ceramic bezel, and automatic movement with 70-hour power reserve",
    price: 9150,
    category: "Fashion",
    stock: 5,
    featured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&h=500&fit=crop"
  },
  {
    name: "Burberry Trench Coat Classic",
    description: "Iconic gabardine trench coat with signature check lining, storm shield, and timeless British design",
    price: 1890,
    category: "Fashion",
    stock: 18,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"
  },

  // Home & Garden - All Different Images
  {
    name: "KitchenAid Artisan Stand Mixer 5Qt",
    description: "Professional stand mixer with 10 speeds, tilt-head design, and multiple attachment compatibility",
    price: 379,
    category: "Home & Garden",
    stock: 30,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574781330855-d0db90726ceb?w=500&h=500&fit=crop"
  },
  {
    name: "Dyson V15 Detect Absolute Vacuum",
    description: "Intelligent cordless vacuum with laser dust detection, LCD screen, and powerful suction technology",
    price: 849,
    category: "Home & Garden",
    stock: 25,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop"
  },
  {
    name: "Le Creuset Cast Iron Dutch Oven",
    description: "Premium enameled cast iron cookware with superior heat retention and even cooking distribution",
    price: 349,
    category: "Home & Garden",
    stock: 20,
    featured: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop"
  },
  {
    name: "Nespresso Vertuo Coffee Machine",
    description: "Premium coffee maker with centrifusion technology, multiple cup sizes, and smart connectivity",
    price: 199,
    category: "Home & Garden",
    stock: 40,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop"
  },
  {
    name: "West Elm Mid-Century Modern Sofa",
    description: "Stylish 3-seater sofa with kiln-dried hardwood frame, performance velvet upholstery, and tapered legs",
    price: 1299,
    category: "Home & Garden",
    stock: 8,
    featured: true,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop"
  },
  {
    name: "Nest Learning Thermostat 4th Gen",
    description: "Smart thermostat with auto-schedule, energy saving features, and smartphone control",
    price: 249,
    category: "Home & Garden",
    stock: 30,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500&h=500&fit=crop"
  },
  {
    name: "Pottery Barn Farmhouse Dining Table",
    description: "Solid wood dining table with rustic finish, seats 8 people, and timeless farmhouse design",
    price: 1599,
    category: "Home & Garden",
    stock: 6,
    featured: true,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop"
  },
  {
    name: "Weber Genesis II Gas Grill",
    description: "High-performance gas grill with GS4 grilling system, porcelain-enameled cooking grates, and side burner",
    price: 899,
    category: "Home & Garden",
    stock: 12,
    featured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=500&fit=crop"
  },
  {
    name: "Casper Original Hybrid Mattress Queen",
    description: "Premium hybrid mattress with zoned support, cooling technology, and 100-night sleep trial",
    price: 1095,
    category: "Home & Garden",
    stock: 15,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop"
  },
  {
    name: "Philips Hue Smart Lighting Kit",
    description: "Smart LED bulbs with 16 million colors, voice control compatibility, and smartphone app control",
    price: 199,
    category: "Home & Garden",
    stock: 35,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop"
  },

  // Sports & Fitness - All Different Images
  {
    name: "Peloton Bike+ Interactive Fitness",
    description: "Premium exercise bike with rotating 23.8-inch HD touchscreen, live classes, and auto-resistance",
    price: 2695,
    category: "Sports & Fitness",
    stock: 10,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop"
  },
  {
    name: "Bowflex SelectTech 552 Dumbbells",
    description: "Adjustable dumbbells replacing 30 individual weights, 5-52.5 lbs per dumbbell with quick weight changes",
    price: 549,
    category: "Sports & Fitness",
    stock: 20,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=500&fit=crop"
  },
  {
    name: "NordicTrack Commercial X32i Trainer",
    description: "Incline trainer with 40% incline, -6% decline, 32-inch smart HD touchscreen, and iFIT workouts",
    price: 2999,
    category: "Sports & Fitness",
    stock: 8,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500&h=500&fit=crop"
  },
  {
    name: "Hydro Flask Wide Mouth 40oz",
    description: "Insulated stainless steel water bottle keeping drinks cold 24hrs/hot 12hrs with flex cap",
    price: 49.95,
    category: "Sports & Fitness",
    stock: 80,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&h=500&fit=crop"
  },
  {
    name: "Garmin Forerunner 965 GPS Watch",
    description: "Advanced GPS running watch with AMOLED display, training readiness, and up to 23 days battery life",
    price: 599,
    category: "Sports & Fitness",
    stock: 25,
    featured: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop"
  },
  {
    name: "Lululemon Align High-Rise Pant",
    description: "Buttery-soft yoga pants with four-way stretch, weightless feel, and non-restrictive design",
    price: 128,
    category: "Sports & Fitness",
    stock: 50,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1506629905607-94c96e85e9be?w=500&h=500&fit=crop"
  },
  {
    name: "Rogue Echo Bike Assault AirBike",
    description: "Commercial-grade assault bike with unlimited resistance, belt drive, and full-body workout capability",
    price: 795,
    category: "Sports & Fitness",
    stock: 12,
    featured: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&h=500&fit=crop"
  },
  {
    name: "Manduka PRO Yoga Mat 6mm",
    description: "Professional yoga mat with superior cushioning, lifetime guarantee, and non-slip surface",
    price: 120,
    category: "Sports & Fitness",
    stock: 40,
    featured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop"
  },
  {
    name: "Theragun PRO Percussive Massager",
    description: "Professional-grade massage device with QuietForce technology, 6 attachments, and 150-minute battery",
    price: 599,
    category: "Sports & Fitness",
    stock: 18,
    featured: true,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&h=500&fit=crop"
  },
  {
    name: "WHOOP 4.0 Fitness Tracker",
    description: "24/7 health monitoring with strain coaching, recovery metrics, and sleep optimization insights",
    price: 239,
    category: "Sports & Fitness",
    stock: 35,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&h=500&fit=crop"
  },

  // Beauty & Personal Care - All Different Images
  {
    name: "Dyson Airwrap Multi-Styler Complete",
    description: "Revolutionary hair styling tool with Coanda airflow technology for curling, waving, and smoothing",
    price: 599,
    category: "Beauty & Personal Care",
    stock: 20,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop"
  },
  {
    name: "La Mer Crème de la Mer Moisturizer",
    description: "Luxury face cream with Miracle Broth for healing, hydrating, and transforming skin texture",
    price: 190,
    category: "Beauty & Personal Care",
    stock: 25,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1620916297617-b269bd6f8fa0?w=500&h=500&fit=crop"
  },
  {
    name: "Fenty Beauty Pro Filt'r Foundation",
    description: "Full-coverage foundation with 50 shades, long-wearing formula, and climate-adaptive technology",
    price: 40,
    category: "Beauty & Personal Care",
    stock: 60,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop"
  },
  {
    name: "Charlotte Tilbury Pillow Talk Lipstick",
    description: "Iconic matte lipstick in universally flattering nude-pink shade with buildable coverage",
    price: 38,
    category: "Beauty & Personal Care",
    stock: 45,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop"
  },
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    description: "High-strength vitamin and mineral serum for reducing appearance of blemishes and congestion",
    price: 7.9,
    category: "Beauty & Personal Care",
    stock: 100,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&h=500&fit=crop"
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with UNIQUE product images...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert new products
    await Product.insertMany(uniqueProducts);
    
    const count = await Product.countDocuments();
    console.log(`✅ Successfully seeded ${count} products with unique images`);
    
    // Display product summary
    const categories = await Product.distinct('category');
    console.log('\n📊 Product Categories:');
    for (const category of categories) {
      const categoryCount = await Product.countDocuments({ category });
      console.log(`   ${category}: ${categoryCount} items`);
    }
    
    console.log('\n🎯 All products now have UNIQUE images - No more duplicates!');
    console.log('🖼️ Each product has its own distinct, high-quality image');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();