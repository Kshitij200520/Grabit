const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');

async function createTestOrder() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Find the demo user
    const user = await User.findOne({ email: 'demo@example.com' });
    if (!user) {
      console.log('Demo user not found');
      return;
    }

    // Create a test order with proper amounts
    const testOrder = new Order({
      user: user._id,
      orderItems: [
        {
          product: new mongoose.Types.ObjectId(),
          name: 'Test MacBook Pro',
          quantity: 1,
          price: 89999
        },
        {
          product: new mongoose.Types.ObjectId(), 
          name: 'Test iPhone',
          quantity: 1,
          price: 79999
        }
      ],
      shippingAddress: {
        fullName: 'Demo User',
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'India'
      },
      paymentMethod: 'Razorpay',
      itemsPrice: 169998,
      taxPrice: 16999.8,
      shippingPrice: 5,
      totalPrice: 187002.8,
      status: 'Confirmed',
      isPaid: true,
      paidAt: new Date()
    });

    const savedOrder = await testOrder.save();
    console.log('Test order created successfully!');
    console.log(`Order ID: ${savedOrder._id}`);
    console.log(`Total Price: ₹${savedOrder.totalPrice}`);
    console.log(`Access at: http://localhost:3000/orders/${savedOrder._id}`);

  } catch (error) {
    console.error('Error creating test order:', error);
  } finally {
    process.exit(0);
  }
}

createTestOrder();
