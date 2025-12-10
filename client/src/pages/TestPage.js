import React, { useState, useEffect } from 'react';
import OrderStatus from '../components/OrderStatus';
import DeliveryNotifications from '../components/DeliveryNotifications';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TestPage.css';

const TestPage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [orderId, setOrderId] = useState('689c822ba89dd55d26c15cb3');
  const [apiTest, setApiTest] = useState({
    status: 'Testing...',
    products: [],
    error: null,
    backend: 'Unknown',
    frontend: 'Loaded'
  });

  // Test API connectivity on component mount
  useEffect(() => {
    console.log('TestPage mounted, testing API...');
    
    const testAPI = async () => {
      try {
        setApiTest(prev => ({ ...prev, status: 'Testing Backend Connection...' }));
        
        // Test backend health
        const healthResponse = await fetch('http://localhost:5000/api/analytics/health');
        if (healthResponse.ok) {
          setApiTest(prev => ({ ...prev, backend: '✅ Connected', status: 'Loading Products...' }));
          
          // Test products API
          const productsResponse = await fetch('http://localhost:5000/api/products');
          const productsData = await productsResponse.json();
          
          setApiTest(prev => ({ 
            ...prev, 
            status: `✅ Success! Loaded ${productsData.length} products`,
            products: productsData.slice(0, 3) // Show first 3 products
          }));
        } else {
          throw new Error('Backend health check failed');
        }
      } catch (error) {
        console.error('API Test failed:', error);
        setApiTest(prev => ({ 
          ...prev, 
          status: '❌ API Connection Failed',
          error: error.message,
          backend: '❌ Offline'
        }));
      }
    };

    testAPI();
  }, []);

  // Sample order data for testing notifications
  const sampleOrder = {
    _id: '689c822ba89dd55d26c15cb3',
    status: 'Confirmed',
    totalAmount: 148440,
    paymentMethod: 'cod',
    deliveryPersonName: 'Rajesh Gupta',
    deliveryPersonPhone: '+91-9876543214',
    deliveryPersonVehicle: 'Van',
    deliveryPersonRating: 4.4,
    estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    deliveryTracking: [
      {
        _id: '1',
        status: 'Confirmed',
        message: 'Order confirmed and assigned to Rajesh Gupta. COD order will be delivered within 24 hours.',
        timestamp: new Date().toISOString(),
        deliveryPerson: {
          name: 'Rajesh Gupta',
          phone: '+91-9876543214',
          vehicle: 'Van'
        }
      },
      {
        _id: '2',
        status: 'Preparing',
        message: 'Your order is being prepared for dispatch.',
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        deliveryPerson: {
          name: 'Rajesh Gupta',
          phone: '+91-9876543214',
          vehicle: 'Van'
        }
      }
    ],
    items: [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone 15 Pro with titanium design',
        quantity: 1,
        price: 134900
      }
    ],
    customerInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543211',
      address: '456 Test Avenue, Delhi, Delhi 110001'
    },
    createdAt: new Date().toISOString()
  };

  return (
    <div className="test-page">
      <div className="container">
        <div className="test-header">
          <h1>🧪 System Test & Diagnostics</h1>
          <p>Real-time testing of API connectivity and delivery notification system.</p>
        </div>

        {/* API Connection Test Results */}
        <div className="api-test-section" style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px', 
          marginBottom: '20px',
          border: apiTest.error ? '2px solid #dc3545' : '2px solid #28a745'
        }}>
          <h2>🔗 API Connection Test</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <strong>Frontend:</strong> <span style={{ color: '#28a745' }}>{apiTest.frontend}</span>
            </div>
            <div>
              <strong>Backend:</strong> <span style={{ color: apiTest.backend.includes('✅') ? '#28a745' : '#dc3545' }}>{apiTest.backend}</span>
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: apiTest.error ? '#dc3545' : '#28a745' }}>
            Status: {apiTest.status}
          </div>
          
          {apiTest.error && (
            <div style={{ color: '#dc3545', marginTop: '10px', padding: '10px', background: '#f8d7da', borderRadius: '5px' }}>
              <strong>Error:</strong> {apiTest.error}
            </div>
          )}

          {apiTest.products.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4>📦 Sample Products from Database:</h4>
              <ul>
                {apiTest.products.map((product, index) => (
                  <li key={index} style={{ margin: '5px 0' }}>
                    <strong>{product.title}</strong> - ₹{product.price} ({product.category})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="test-controls">
          <div className="control-group">
            <label htmlFor="orderIdInput">Order ID:</label>
            <input
              id="orderIdInput"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
              className="order-input"
            />
          </div>
          
          <div className="control-buttons">
            <button 
              onClick={() => setShowNotifications(true)}
              className="test-btn primary"
            >
              📱 Show Delivery Notifications
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="test-btn secondary"
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>

        <div className="demo-section">
          <h2>📦 Live Order Status</h2>
          <p>Enter an order ID above and see real-time delivery information below:</p>
          <OrderStatus orderId={orderId} />
        </div>

        <div className="demo-info">
          <h3>✨ Features Demonstrated:</h3>
          <ul>
            <li>🎯 <strong>Real-time Order Tracking:</strong> Live status updates with progress indicators</li>
            <li>👨‍💼 <strong>Delivery Executive Details:</strong> Name, phone, vehicle type, and ratings</li>
            <li>📱 <strong>Interactive Notifications:</strong> Toast notifications and detailed timeline</li>
            <li>📞 <strong>Direct Communication:</strong> One-click calling to delivery personnel</li>
            <li>⏰ <strong>Estimated Delivery:</strong> Accurate time predictions with live updates</li>
            <li>📋 <strong>Complete Timeline:</strong> Full tracking history with timestamps</li>
            <li>💰 <strong>COD Support:</strong> Automatic delivery assignment for Cash on Delivery orders</li>
            <li>📊 <strong>Order Summary:</strong> Complete order details with customer information</li>
          </ul>
        </div>

        <div className="sample-data">
          <h3>🧪 Test Data Available:</h3>
          <div className="test-order-cards">
            <div className="test-card">
              <h4>📱 Current Test Order</h4>
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Product:</strong> iPhone 15 Pro</p>
              <p><strong>Delivery Person:</strong> Rajesh Gupta</p>
              <p><strong>Status:</strong> Confirmed</p>
              <p><strong>Payment:</strong> Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* Demo Notification Modal */}
        {showNotifications && (
          <DeliveryNotifications 
            order={sampleOrder}
            onClose={() => setShowNotifications(false)}
          />
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default TestPage;
