import React, { useState } from 'react';
import OrderStatus from '../components/OrderStatus';
import DeliveryNotifications from '../components/DeliveryNotifications';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TestPage.css';

const TestPage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [orderId, setOrderId] = useState('689c822ba89dd55d26c15cb3'); // Default test order ID

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
          <h1>🚚 Delivery Notification System Test</h1>
          <p>This page demonstrates the real-time delivery notifications and order tracking system.</p>
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
