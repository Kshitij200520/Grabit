const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/ecommerce';

const createTestUPIOrder = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find demo user
    const user = await User.findOne({ email: 'demo@example.com' });
    if (!user) {
      console.log('❌ Demo user not found');
      return;
    }

    // Find a product to add to order
    const product = await Product.findOne();
    if (!product) {
      console.log('❌ No products found');
      return;
    }

    console.log('📦 Creating test UPI order...');

    // Create test order with UPI payment
    const testOrder = new Order({
      user: user._id,
      orderItems: [{
        product: product._id,
        name: product.name,
        quantity: 1,
        price: product.price
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '123456',
        country: 'India'
      },
      paymentMethod: 'Razorpay',
      itemsPrice: product.price,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: product.price,
      isPaid: false,  // Will be paid via UPI
      status: 'Pending'
    });

    const savedOrder = await testOrder.save();
    console.log('✅ Test UPI order created:', savedOrder._id);
    console.log('💰 Order total:', `₹${savedOrder.totalPrice}`);
    console.log('📱 Payment method:', savedOrder.paymentMethod);
    console.log('📋 Order status:', savedOrder.status);
    
    // Display delivery person info (should be empty initially)
    console.log('\n📨 Delivery Executive Info:');
    console.log('👤 Name:', savedOrder.deliveryPersonName || 'Not assigned yet');
    console.log('📞 Phone:', savedOrder.deliveryPersonPhone || 'Not assigned yet');
    console.log('🚗 Vehicle:', savedOrder.deliveryPersonVehicle || 'Not assigned yet');
    console.log('⭐ Rating:', savedOrder.deliveryPersonRating || 'Not assigned yet');

    console.log('\n🎯 Next Step: Make UPI payment for this order to test delivery executive assignment');
    console.log('🌐 Use order ID in payment:', savedOrder._id);

    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed');

  } catch (error) {
    console.error('❌ Error creating test UPI order:', error);
    process.exit(1);
  }
};

createTestUPIOrder();
