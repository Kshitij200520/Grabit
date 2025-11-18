const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createDemoUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@test.com' });
    if (existingUser) {
      console.log('🔍 Demo user already exists');
      console.log('📧 Email: demo@test.com');
      console.log('🔑 Password: demo123');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@test.com',
      password: hashedPassword,
      address: {
        street: '123 Demo Street',
        city: 'Demo City',
        state: 'Demo State',
        zipCode: '12345',
        country: 'India'
      }
    });

    await demoUser.save();
    
    console.log('🎉 Demo user created successfully!');
    console.log('📧 Email: demo@test.com');
    console.log('🔑 Password: demo123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    process.exit(1);
  }
};

createDemoUser();