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

// Enhanced products data with genuine rates and multiple categories
const enhancedProducts = [
  // Electronics Category (25 items)
  {
    name: "iPhone 15 Pro Max 256GB",
    description: "Latest iPhone with titanium design, A17 Pro chip, and professional camera system",
    price: 1299,
    category: "Electronics",
    stock: 50,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and AI features",
    price: 1199,
    category: "Electronics",
    stock: 45,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop"
  },
  {
    name: "MacBook Air M3 13-inch",
    description: "Ultra-portable laptop with M3 chip, 18-hour battery life, and Liquid Retina display",
    price: 1099,
    category: "Electronics",
    stock: 30,
    featured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop"
  },
  {
    name: "iPad Pro 12.9-inch M2",
    description: "Professional tablet with M2 chip, Apple Pencil support, and Liquid Retina XDR display",
    price: 1099,
    category: "Electronics",
    stock: 25,
    featured: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with premium sound quality",
    price: 399,
    category: "Electronics",
    stock: 60,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop"
  },
  {
    name: "Apple Watch Series 9 GPS",
    description: "Advanced health monitoring, fitness tracking, and smart features on your wrist",
    price: 399,
    category: "Electronics",
    stock: 40,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop"
  },
  {
    name: "Samsung 65-inch QLED 4K TV",
    description: "Premium 4K Smart TV with Quantum Dot technology and HDR10+ support",
    price: 1299,
    category: "Electronics",
    stock: 15,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop"
  },
  {
    name: "Nintendo Switch OLED",
    description: "Portable gaming console with vibrant OLED screen and versatile play modes",
    price: 349,
    category: "Electronics",
    stock: 35,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop"
  },
  {
    name: "Canon EOS R5 Camera",
    description: "Professional mirrorless camera with 45MP sensor and 8K video recording",
    price: 3899,
    category: "Electronics",
    stock: 10,
    featured: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop"
  },
  {
    name: "Dell XPS 13 Laptop",
    description: "Ultra-portable Windows laptop with Intel i7 processor and InfinityEdge display",
    price: 1199,
    category: "Electronics",
    stock: 20,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"
  },
  {
    name: "AirPods Pro (2nd Gen)",
    description: "Wireless earbuds with active noise cancellation and spatial audio",
    price: 249,
    category: "Electronics",
    stock: 80,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop"
  },
  {
    name: "Gaming Desktop PC RTX 4080",
    description: "High-performance gaming PC with NVIDIA RTX 4080, Intel i7, and 32GB RAM",
    price: 2499,
    category: "Electronics",
    stock: 8,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=300&fit=crop"
  },
  {
    name: "Sony PlayStation 5",
    description: "Next-gen gaming console with 4K gaming, ray tracing, and ultra-fast SSD",
    price: 499,
    category: "Electronics",
    stock: 12,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop"
  },
  {
    name: "Microsoft Surface Pro 9",
    description: "2-in-1 tablet laptop with Intel i5 processor and detachable keyboard",
    price: 999,
    category: "Electronics",
    stock: 18,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop"
  },
  {
    name: "Google Pixel 8 Pro",
    description: "AI-powered Android phone with advanced computational photography",
    price: 999,
    category: "Electronics",
    stock: 30,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop"
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    description: "Large Android tablet with S Pen for productivity and entertainment",
    price: 1199,
    category: "Electronics",
    stock: 22,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop"
  },
  {
    name: "LG OLED 55-inch TV",
    description: "Premium OLED TV with perfect blacks, infinite contrast, and webOS smart platform",
    price: 1499,
    category: "Electronics",
    stock: 14,
    featured: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop"
  },
  {
    name: "Bose QuietComfort Earbuds",
    description: "True wireless earbuds with world-class noise cancellation",
    price: 279,
    category: "Electronics",
    stock: 45,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop"
  },
  {
    name: "HP Spectre x360 Convertible",
    description: "Premium 2-in-1 laptop with 360-degree hinge and Intel Evo platform",
    price: 1299,
    category: "Electronics",
    stock: 16,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"
  },
  {
    name: "Roku Ultra 4K Streaming Device",
    description: "Premium streaming device with 4K HDR, Dolby Vision, and voice remote",
    price: 99,
    category: "Electronics",
    stock: 50,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop"
  },
  {
    name: "Fitbit Versa 4 Smartwatch",
    description: "Health and fitness smartwatch with GPS, music storage, and 6+ day battery",
    price: 199,
    category: "Electronics",
    stock: 40,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop"
  },
  {
    name: "JBL Charge 5 Bluetooth Speaker",
    description: "Portable waterproof speaker with powerful sound and 20-hour battery life",
    price: 179,
    category: "Electronics",
    stock: 60,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop"
  },
  {
    name: "ASUS ROG Gaming Monitor 27-inch",
    description: "144Hz gaming monitor with G-Sync, 1ms response time, and QHD resolution",
    price: 399,
    category: "Electronics",
    stock: 25,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
  },
  {
    name: "Logitech MX Master 3S Mouse",
    description: "Advanced wireless mouse with ultra-precise scrolling and multi-device connectivity",
    price: 99,
    category: "Electronics",
    stock: 70,
    featured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
  },
  {
    name: "Ring Video Doorbell Pro 2",
    description: "Smart doorbell with 1536p HD video, advanced motion detection, and Alexa compatibility",
    price: 249,
    category: "Electronics",
    stock: 35,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"
  },

  // Clothing Category (25 items)
  {
    name: "Nike Air Force 1 '07",
    description: "Classic white leather sneakers with iconic design and all-day comfort",
    price: 90,
    category: "Clothing",
    stock: 100,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans with authentic fit and premium denim quality",
    price: 69,
    category: "Clothing",
    stock: 120,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop"
  },
  {
    name: "Adidas Originals Hoodie",
    description: "Comfortable cotton-blend hoodie with iconic 3-stripes and trefoil logo",
    price: 65,
    category: "Clothing",
    stock: 80,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop"
  },
  {
    name: "Champion Reverse Weave Sweatshirt",
    description: "Premium heavyweight sweatshirt with signature horizontal weave construction",
    price: 55,
    category: "Clothing",
    stock: 60,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop"
  },
  {
    name: "Uniqlo Heattech Ultra Warm Crew Neck T-Shirt",
    description: "Advanced thermal technology for ultra-warm comfort in cold weather",
    price: 19.90,
    category: "Clothing",
    stock: 150,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  },
  {
    name: "Patagonia Better Sweater Fleece Jacket",
    description: "Sustainable fleece jacket made from recycled polyester with classic styling",
    price: 99,
    category: "Clothing",
    stock: 45,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop"
  },
  {
    name: "North Face Denali Fleece Jacket",
    description: "Iconic fleece jacket with recycled materials and classic outdoor styling",
    price: 179,
    category: "Clothing",
    stock: 30,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop"
  },
  {
    name: "Ralph Lauren Polo Shirt",
    description: "Classic fit polo shirt in soft cotton mesh with signature pony logo",
    price: 89,
    category: "Clothing",
    stock: 70,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop"
  },
  {
    name: "Zara Slim Fit Chinos",
    description: "Modern slim-fit chino pants in stretch cotton with versatile styling",
    price: 39.95,
    category: "Clothing",
    stock: 90,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop"
  },
  {
    name: "H&M Organic Cotton T-Shirt Pack (3-pack)",
    description: "Basic crew neck t-shirts made from organic cotton in essential colors",
    price: 24.99,
    category: "Clothing",
    stock: 200,
    featured: false,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  },
  {
    name: "Converse Chuck Taylor All Star High Top",
    description: "Iconic canvas sneakers with timeless design and comfortable fit",
    price: 60,
    category: "Clothing",
    stock: 110,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
  },
  {
    name: "Tommy Hilfiger Denim Jacket",
    description: "Classic denim jacket with signature flag logo and timeless americana styling",
    price: 129,
    category: "Clothing",
    stock: 40,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop"
  },
  {
    name: "Gap Vintage Khakis",
    description: "Comfortable khaki pants with classic fit and vintage-inspired wash",
    price: 59.95,
    category: "Clothing",
    stock: 75,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop"
  },
  {
    name: "Old Navy Performance Fleece Zip Hoodie",
    description: "Active fleece hoodie with moisture-wicking technology and full zip design",
    price: 34.99,
    category: "Clothing",
    stock: 85,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop"
  },
  {
    name: "Banana Republic Merino Wool Sweater",
    description: "Luxury merino wool crew neck sweater with refined fit and soft texture",
    price: 98,
    category: "Clothing",
    stock: 35,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=300&fit=crop"
  },
  {
    name: "J.Crew Oxford Button-Down Shirt",
    description: "Classic oxford cloth button-down shirt with perfect collar and tailored fit",
    price: 79.50,
    category: "Clothing",
    stock: 55,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop"
  },
  {
    name: "Vans Old Skool Sneakers",
    description: "Classic skate shoes with signature side stripe and durable canvas upper",
    price: 65,
    category: "Clothing",
    stock: 95,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
  },
  {
    name: "Under Armour HeatGear T-Shirt",
    description: "Performance t-shirt with moisture-wicking technology and anti-odor treatment",
    price: 25,
    category: "Clothing",
    stock: 120,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  },
  {
    name: "Dockers Alpha Khaki Pants",
    description: "Modern tapered khakis with flex waistband and wrinkle-resistant fabric",
    price: 59.50,
    category: "Clothing",
    stock: 65,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop"
  },
  {
    name: "Columbia Flash Forward Windbreaker",
    description: "Lightweight windbreaker with water-resistant finish and packable design",
    price: 45,
    category: "Clothing",
    stock: 50,
    featured: false,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop"
  },
  {
    name: "American Eagle Skinny Jeans",
    description: "Stretch denim skinny jeans with comfortable fit and classic wash",
    price: 49.95,
    category: "Clothing",
    stock: 80,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop"
  },
  {
    name: "Hollister Graphic T-Shirt",
    description: "Casual graphic tee with vintage-inspired design and soft cotton blend",
    price: 19.95,
    category: "Clothing",
    stock: 100,
    featured: false,
    rating: 3.9,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  },
  {
    name: "Abercrombie & Fitch Joggers",
    description: "Comfortable jogger pants with tapered fit and soft fleece interior",
    price: 39,
    category: "Clothing",
    stock: 70,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop"
  },
  {
    name: "Forever 21 Cropped Hoodie",
    description: "Trendy cropped hoodie with drawstring hood and kangaroo pocket",
    price: 22.90,
    category: "Clothing",
    stock: 60,
    featured: false,
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop"
  },
  {
    name: "Urban Outfitters Vintage Band Tee",
    description: "Retro band t-shirt with distressed finish and authentic vintage styling",
    price: 34,
    category: "Clothing",
    stock: 45,
    featured: false,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  },

  // Home & Kitchen Category (25 items)
  {
    name: "KitchenAid Stand Mixer Classic",
    description: "Iconic stand mixer with 4.5-quart bowl, 10 speeds, and durable metal construction",
    price: 279,
    category: "Home & Kitchen",
    stock: 25,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574781330855-d0db90726ceb?w=300&h=300&fit=crop"
  },
  {
    name: "Instant Pot Duo 7-in-1 Pressure Cooker",
    description: "Multi-functional electric pressure cooker with 7 appliances in one",
    price: 99,
    category: "Home & Kitchen",
    stock: 40,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1585515656245-1d4c1c4a3e45?w=300&h=300&fit=crop"
  },
  {
    name: "Ninja Professional Blender",
    description: "High-powered blender with 1000-watt motor and total crushing technology",
    price: 89,
    category: "Home & Kitchen",
    stock: 35,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop"
  },
  {
    name: "All-Clad D3 Stainless Steel Cookware Set",
    description: "Professional-grade 10-piece cookware set with tri-ply construction",
    price: 599,
    category: "Home & Kitchen",
    stock: 15,
    featured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Cuisinart Coffee Maker 12-Cup",
    description: "Programmable drip coffee maker with auto shut-off and brew strength control",
    price: 79,
    category: "Home & Kitchen",
    stock: 50,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop"
  },
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    description: "Advanced cordless vacuum with laser detection and intelligent suction",
    price: 749,
    category: "Home & Kitchen",
    stock: 20,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"
  },
  {
    name: "Le Creuset Cast Iron Dutch Oven",
    description: "Premium enameled cast iron pot perfect for braising, baking, and roasting",
    price: 349,
    category: "Home & Kitchen",
    stock: 18,
    featured: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Keurig K-Supreme Coffee Maker",
    description: "Single-serve coffee maker with multiple brew sizes and strong brew option",
    price: 149,
    category: "Home & Kitchen",
    stock: 30,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop"
  },
  {
    name: "OXO Good Grips Knife Set",
    description: "Professional 15-piece knife set with magnetic block and precision edges",
    price: 199,
    category: "Home & Kitchen",
    stock: 25,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Breville Smart Oven Air Fryer Pro",
    description: "Countertop convection oven with air fry function and 13 cooking presets",
    price: 399,
    category: "Home & Kitchen",
    stock: 22,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1585515656245-1d4c1c4a3e45?w=300&h=300&fit=crop"
  },
  {
    name: "Vitamix 5200 Professional Blender",
    description: "Commercial-grade blender with variable speed control and self-cleaning",
    price: 449,
    category: "Home & Kitchen",
    stock: 12,
    featured: false,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop"
  },
  {
    name: "Lodge Cast Iron Skillet 12-inch",
    description: "Pre-seasoned cast iron skillet with superior heat retention and even cooking",
    price: 39,
    category: "Home & Kitchen",
    stock: 60,
    featured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Shark Navigator Upright Vacuum",
    description: "Lightweight upright vacuum with lift-away technology and HEPA filtration",
    price: 179,
    category: "Home & Kitchen",
    stock: 28,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"
  },
  {
    name: "Hamilton Beach Food Processor",
    description: "10-cup food processor with multiple attachments for chopping and slicing",
    price: 69,
    category: "Home & Kitchen",
    stock: 35,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1585515656245-1d4c1c4a3e45?w=300&h=300&fit=crop"
  },
  {
    name: "Pyrex Glass Storage Set",
    description: "18-piece glass food storage containers with airtight lids",
    price: 49,
    category: "Home & Kitchen",
    stock: 45,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Calphalon Nonstick Cookware Set",
    description: "10-piece hard-anodized nonstick cookware with stay-cool handles",
    price: 299,
    category: "Home & Kitchen",
    stock: 20,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Bissell CrossWave Pet Pro Cleaner",
    description: "Multi-surface wet dry vacuum for simultaneous vacuuming and washing",
    price: 229,
    category: "Home & Kitchen",
    stock: 18,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"
  },
  {
    name: "Rachael Ray Cucina Cookware Set",
    description: "12-piece hard porcelain enamel cookware with rustic styling",
    price: 149,
    category: "Home & Kitchen",
    stock: 25,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Black+Decker Toaster Oven",
    description: "6-slice digital convection toaster oven with multiple cooking functions",
    price: 89,
    category: "Home & Kitchen",
    stock: 32,
    featured: false,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1585515656245-1d4c1c4a3e45?w=300&h=300&fit=crop"
  },
  {
    name: "Rubbermaid Brilliance Food Storage",
    description: "10-piece airtight food storage containers with leak-proof seals",
    price: 39,
    category: "Home & Kitchen",
    stock: 50,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Mr. Coffee 12-Cup Programmable Maker",
    description: "Auto-pause and pour coffee maker with programmable brewing timer",
    price: 39,
    category: "Home & Kitchen",
    stock: 40,
    featured: false,
    rating: 3.9,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop"
  },
  {
    name: "Oster Classic 76 Hair Clipper",
    description: "Professional-grade hair clipper with detachable blades and powerful motor",
    price: 89,
    category: "Home & Kitchen",
    stock: 25,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"
  },
  {
    name: "Nordic Ware Bundt Pan",
    description: "Classic aluminum bundt pan with superior heat conductivity and nonstick coating",
    price: 24,
    category: "Home & Kitchen",
    stock: 35,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },
  {
    name: "Hoover Linx Cordless Stick Vacuum",
    description: "Lightweight cordless stick vacuum with WindTunnel technology",
    price: 79,
    category: "Home & Kitchen",
    stock: 30,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"
  },
  {
    name: "Martha Stewart Collection Cookware",
    description: "14-piece enameled cast iron and stainless steel cookware collection",
    price: 199,
    category: "Home & Kitchen",
    stock: 15,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
  },

  // Sports & Fitness Category (25 items)
  {
    name: "Peloton Bike+ Interactive Fitness",
    description: "Premium exercise bike with rotating HD touchscreen and live classes",
    price: 2495,
    category: "Sports & Fitness",
    stock: 8,
    featured: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
  },
  {
    name: "Bowflex SelectTech Dumbbells",
    description: "Adjustable dumbbells that replace 30 individual weights (5-52.5 lbs each)",
    price: 549,
    category: "Sports & Fitness",
    stock: 15,
    featured: true,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "NordicTrack Treadmill Commercial",
    description: "Professional treadmill with iFit technology and incline training",
    price: 1799,
    category: "Sports & Fitness",
    stock: 10,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
  },
  {
    name: "Resistance Bands Set with Handles",
    description: "11-piece resistance band set with door anchor and workout guides",
    price: 29,
    category: "Sports & Fitness",
    stock: 80,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "Nike Metcon 9 Training Shoes",
    description: "Cross-training shoes designed for high-intensity workouts and lifting",
    price: 130,
    category: "Sports & Fitness",
    stock: 45,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
  },
  {
    name: "Yoga Mat Premium Non-Slip",
    description: "Extra thick yoga mat with superior grip and cushioning for all poses",
    price: 39,
    category: "Sports & Fitness",
    stock: 60,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop"
  },
  {
    name: "Perfect Pushup Elite Handles",
    description: "Rotating pushup handles that reduce wrist strain and target more muscles",
    price: 24,
    category: "Sports & Fitness",
    stock: 50,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "Garmin Forerunner 945 GPS Watch",
    description: "Advanced GPS running watch with music, maps, and performance metrics",
    price: 599,
    category: "Sports & Fitness",
    stock: 20,
    featured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop"
  },
  {
    name: "TRX All-in-One Suspension Trainer",
    description: "Complete bodyweight training system with anchor, straps, and workout guides",
    price: 165,
    category: "Sports & Fitness",
    stock: 25,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "CAP Barbell Olympic Weight Set",
    description: "300 lb Olympic weight set with 7-foot barbell and cast iron plates",
    price: 399,
    category: "Sports & Fitness",
    stock: 12,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "Hydro Flask Water Bottle 32oz",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours",
    price: 44.95,
    category: "Sports & Fitness",
    stock: 70,
    featured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop"
  },
  {
    name: "Adidas Ultraboost 22 Running Shoes",
    description: "Premium running shoes with Boost midsole and Primeknit upper",
    price: 190,
    category: "Sports & Fitness",
    stock: 35,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
  },
  {
    name: "Rogue Fitness Power Rack",
    description: "Professional-grade power rack for home gym setups with pull-up bar",
    price: 1195,
    category: "Sports & Fitness",
    stock: 6,
    featured: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "Foam Roller High Density",
    description: "Professional foam roller for muscle recovery and myofascial release",
    price: 29,
    category: "Sports & Fitness",
    stock: 40,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop"
  },
  {
    name: "Under Armour HOVR Basketball Shoes",
    description: "High-performance basketball shoes with responsive cushioning",
    price: 120,
    category: "Sports & Fitness",
    stock: 30,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
  },
  {
    name: "Kettlebell Cast Iron 35 lb",
    description: "Professional-grade cast iron kettlebell with wide handle for comfort",
    price: 59,
    category: "Sports & Fitness",
    stock: 25,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "Fitbit Charge 5 Fitness Tracker",
    description: "Advanced fitness tracker with built-in GPS and health monitoring",
    price: 179,
    category: "Sports & Fitness",
    stock: 40,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop"
  },
  {
    name: "Medicine Ball 15 lb",
    description: "Durable rubber medicine ball perfect for core and strength training",
    price: 39,
    category: "Sports & Fitness",
    stock: 35,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "ProForm Elliptical Trainer",
    description: "Front-drive elliptical with 18 workout programs and heart rate monitoring",
    price: 799,
    category: "Sports & Fitness",
    stock: 8,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
  },
  {
    name: "Schwinn IC4 Indoor Cycling Bike",
    description: "Connected indoor cycling bike with Bluetooth and app compatibility",
    price: 899,
    category: "Sports & Fitness",
    stock: 12,
    featured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
  },
  {
    name: "Pull-Up Bar Doorway Mount",
    description: "Easy-install doorway pull-up bar with multiple grip positions",
    price: 29,
    category: "Sports & Fitness",
    stock: 50,
    featured: false,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  },
  {
    name: "Nike Pro Dri-FIT Shorts",
    description: "Moisture-wicking training shorts with compression fit and flexibility",
    price: 35,
    category: "Sports & Fitness",
    stock: 60,
    featured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1506629905607-94c96e85e9be?w=300&h=300&fit=crop"
  },
  {
    name: "Whey Protein Powder 5 lb",
    description: "Premium whey protein isolate with 25g protein per serving, vanilla flavor",
    price: 69,
    category: "Sports & Fitness",
    stock: 45,
    featured: false,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop"
  },
  {
    name: "Balance Ball with Pump",
    description: "65cm exercise ball with pump for core training and rehabilitation",
    price: 24,
    category: "Sports & Fitness",
    stock: 30,
    featured: false,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop"
  },
  {
    name: "Everlast Heavy Bag 70 lb",
    description: "Professional heavy punching bag with reinforced stitching and chains",
    price: 149,
    category: "Sports & Fitness",
    stock: 15,
    featured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop"
  }
];

// Seed function
const seedProducts = async () => {
  try {
    console.log('🌱 Seeding enhanced products with genuine rates...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert enhanced products
    await Product.insertMany(enhancedProducts);
    console.log('✅ Enhanced products seeded successfully');
    
    const count = await Product.countDocuments();
    console.log(`📦 Total products in database: ${count}`);
    
    // Show category breakdown
    const categories = await Product.distinct('category');
    console.log('\n📊 Products by Category:');
    for (const category of categories) {
      const categoryCount = await Product.countDocuments({ category });
      console.log(`   ${category}: ${categoryCount} items`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

// Run seeding
seedProducts().then(() => {
  console.log('\n🎉 Enhanced product seeding completed with genuine rates!');
  console.log('💰 Categories include: Electronics, Clothing, Home & Kitchen, Sports & Fitness');
  console.log('🏷️ All products have realistic market prices and stock levels');
  process.exit(0);
});
