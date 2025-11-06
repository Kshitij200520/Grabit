const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// Simple products test
app.get('/api/products/test', (req, res) => {
  res.json([
    { name: 'Test Product 1', price: 100 },
    { name: 'Test Product 2', price: 200 }
  ]);
});

const PORT = 5001; // Using different port to avoid conflicts

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/products/test`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down gracefully...');
  process.exit(0);
});
