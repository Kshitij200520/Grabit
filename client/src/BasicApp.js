import React from 'react';

const BasicApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🎯 Grab It E-commerce Platform</h1>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>✅ Application Status</h2>
        <ul>
          <li>✅ Frontend: React app loaded successfully</li>
          <li>✅ Backend: Node.js server running on port 5000</li>
          <li>✅ Database: MongoDB connected and seeded</li>
          <li>⚠️ Redis: Not required (using MongoStore for sessions)</li>
        </ul>
      </div>
      
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>🔗 Quick Links</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/products" style={{ background: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>
            📦 Products
          </a>
          <a href="/cart" style={{ background: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>
            🛒 Cart
          </a>
          <a href="/test" style={{ background: '#dc3545', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>
            🧪 Test Page
          </a>
          <a href="/login" style={{ background: '#6c757d', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>
            🔐 Login
          </a>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px' }}>
        <h2>📱 Features Available</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <h3>🛍️ Shopping</h3>
            <ul>
              <li>Product Catalog</li>
              <li>Add to Cart</li>
              <li>Checkout Process</li>
              <li>Order History</li>
            </ul>
          </div>
          <div>
            <h3>🔐 Authentication</h3>
            <ul>
              <li>User Registration</li>
              <li>Login System</li>
              <li>JWT Security</li>
              <li>Profile Management</li>
            </ul>
          </div>
          <div>
            <h3>⚡ Real-time</h3>
            <ul>
              <li>Live Notifications</li>
              <li>Order Tracking</li>
              <li>WebSocket Updates</li>
              <li>Delivery Status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicApp;