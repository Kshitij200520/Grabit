const mongoose = require('mongoose');

// Cart Schema (inline)
const cartSchema = new mongoose.Schema({
  user: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }
  }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    const carts = await Cart.find();
    console.log('🛒 Total carts found:', carts.length);
    
    carts.forEach((cart, index) => {
      console.log(`\nCart ${index + 1}:`);
      console.log('  User ID:', cart.user);
      console.log('  Items count:', cart.items.length);
      console.log('  Created:', cart.createdAt);
      
      cart.items.forEach((item, i) => {
        console.log(`    Item ${i + 1}: Product ID ${item.product}, Qty: ${item.quantity}, Price: ₹${item.price}`);
      });
    });
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Database error:', err.message);
    mongoose.disconnect();
  });