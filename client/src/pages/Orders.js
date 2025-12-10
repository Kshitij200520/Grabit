import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCart();
  const location = useLocation();

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders(user._id);
      setOrders(response.data);
      
      // Check if user came from checkout (show welcome message)
      if (location.state?.fromCheckout) {
        toast.success('🎊 Welcome! Your order has been placed successfully and appears below.');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
    
    // Clean up the location state after showing the success message
    if (location.state?.fromCheckout) {
      const timer = setTimeout(() => {
        // Clear the state to prevent showing the banner on refresh
        window.history.replaceState({}, document.title);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'Processing': return '#007bff';
      case 'Shipped': return '#17a2b8';
      case 'Delivered': return '#28a745';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (!user) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="text-center">
            <h2>Please login to view your orders</h2>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        {location.state?.fromCheckout && (
          <div className="success-banner">
            <div className="success-content">
              <span className="success-icon">🎉</span>
              <div className="success-text">
                <h3>Order Placed Successfully!</h3>
                <p>Your order has been confirmed and will be delivered within 10 minutes.</p>
              </div>
            </div>
          </div>
        )}
        
        <h1>My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div 
                key={order._id} 
                className={`order-card ${
                  location.state?.fromCheckout && index === 0 ? 'newest-order' : ''
                }`}
              >
                {location.state?.fromCheckout && index === 0 && (
                  <div className="new-order-badge">
                    <span>🆕 Latest Order</span>
                  </div>
                )}
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="order-items">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name} × {item.quantity}</span>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="more-items">
                      +{order.orderItems.length - 3} more items
                    </div>
                  )}
                </div>
                
                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: ₹{order.totalPrice.toFixed(2)}</strong>
                    </div>
                  <Link 
                    to={`/orders/${order._id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
