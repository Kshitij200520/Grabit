// Central in-memory store for demo mode (no MongoDB required)
// All modules should import from here to share the same data references.

// Users
const users = [];

// Products (seeded)
const products = [
  {
    _id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features and excellent camera quality',
    price: 999,
    category: 'Electronics',
    stock: 50,
    featured: true,
    rating: 4.8,
    image: 'https://picsum.photos/300/300?random=1'
  },
  {
    _id: '2',
    name: 'MacBook Air M2',
    description: 'Powerful laptop with M2 chip, perfect for work and creativity',
    price: 1199,
    category: 'Electronics',
    stock: 30,
    featured: true,
    rating: 4.9,
    image: 'https://picsum.photos/300/300?random=2'
  },
  {
    _id: '3',
    name: 'Nike Air Max',
    description: 'Comfortable running shoes with excellent cushioning',
    price: 129,
    category: 'Footwear',
    stock: 100,
    featured: false,
    rating: 4.5,
    image: 'https://picsum.photos/300/300?random=3'
  },
  {
    _id: '4',
    name: 'Samsung 4K TV',
    description: '55-inch 4K Smart TV with HDR and streaming apps',
    price: 699,
    category: 'Electronics',
    stock: 25,
    featured: true,
    rating: 4.6,
    image: 'https://picsum.photos/300/300?random=4'
  },
  {
    _id: '5',
    name: 'Sony Headphones',
    description: 'Wireless noise-canceling headphones with premium sound',
    price: 299,
    category: 'Electronics',
    stock: 75,
    featured: true,
    rating: 4.7,
    image: 'https://picsum.photos/300/300?random=5'
  }
];

// Carts
const carts = [];

// Orders
const orders = [];

// Delivery Personnel (seeded)
const deliveryPersonnel = [
  {
    _id: 'del1',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'rajesh@delivery.com',
    vehicle: 'Motorcycle',
    area: 'North Delhi',
    rating: 4.8,
    isAvailable: true,
    totalDeliveries: 150
  },
  {
    _id: 'del2',
    name: 'Priya Sharma',
    phone: '+91-9876543211',
    email: 'priya@delivery.com',
    vehicle: 'Scooter',
    area: 'South Delhi',
    rating: 4.9,
    isAvailable: true,
    totalDeliveries: 200
  },
  {
    _id: 'del3',
    name: 'Amit Singh',
    phone: '+91-9876543212',
    email: 'amit@delivery.com',
    vehicle: 'Bicycle',
    area: 'East Delhi',
    rating: 4.6,
    isAvailable: false,
    totalDeliveries: 120
  }
];

// Notifications
const notifications = [];

module.exports = {
  users,
  products,
  carts,
  orders,
  deliveryPersonnel,
  notifications,
};
