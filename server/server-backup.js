console.log('Starting server...');

const express = require('express');
const cors = require('cors');

console.log('Express loaded');

const app = express();

console.log('App created');

app.use(cors());
app.use(express.json());

console.log('Middleware set');

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.get('/api/products', (req, res) => {
  res.json([
    { _id: '1', name: 'Test Product', price: 100, featured: true }
  ]);
});

console.log('Routes set');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🎉 Test your API at http://localhost:${PORT}`);
});

console.log('Listen called');
