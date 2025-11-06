import React, { useState, useEffect } from 'react';
import DeliveryNotifications from './DeliveryNotifications';
import { toast } from 'react-toastify';
import './OrderStatus.css';

const OrderStatus = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        
        // Show notification if status changed
        if (order && order.status !== orderData.status) {
          toast.success(`Order status updated to: ${orderData.status}`, {
            position: "top-right",
            autoClose: 4000,
          });
        }
        
        setOrder(orderData);
        setError('');
      } else {
        setError('Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Error loading order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchOrderDetails, 30000);
      return () => clearInterval(interval);
    }
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update current time every second for countdown
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const refreshOrderDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
        toast.info('Order details refreshed!', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        setError('Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Error loading order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status) => {
    const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Nearby', 'Delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return Math.max(0, (currentIndex + 1) / statusOrder.length * 100);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'preparing': return '#fd7e14';
      case 'out for delivery': return '#6f42c1';
      case 'nearby': return '#dc3545';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatCurrency = (amount) => {
    // Handle invalid amounts
    const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(validAmount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) {
      return { date: 'N/A', time: 'N/A' };
    }
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
    
    return {
      date: date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    };
  };

  const formatTimeRemaining = (deliveryTime) => {
    if (!deliveryTime) return "Delivery time not available";
    
    const now = currentTime;
    const delivery = new Date(deliveryTime);
    
    // Validate delivery date
    if (isNaN(delivery.getTime())) {
      return "Invalid delivery time";
    }
    
    const diffMs = delivery.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return "Delivery time reached";
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s remaining`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s remaining`;
    } else {
      return `${seconds}s remaining`;
    }
  };

  if (loading) {
    return (
      <div className="order-status-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-status-container">
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={fetchOrderDetails} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-status-container">
        <div className="no-order">
          <h3>📦 No Order Found</h3>
          <p>Order ID: {orderId}</p>
        </div>
      </div>
    );
  }

  const orderDateTime = formatDateTime(order.createdAt);

  return (
    <div className="order-status-container">
      {/* Order Header */}
      <div className="order-header">
        <div className="order-title">
          <h2>📦 Order #{order._id.slice(-8).toUpperCase()}</h2>
          <p className="order-date">
            Placed on {orderDateTime.date} at {orderDateTime.time}
          </p>
        </div>
        <div className="order-amount">
          <h3>{formatCurrency(order.totalPrice || order.totalAmount || 0)}</h3>
          <span className="payment-method">
            {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
          </span>
        </div>
      </div>

      {/* Status Progress Bar */}
      <div className="status-progress">
        <div className="progress-header">
          <h3>📊 Order Progress</h3>
          <span className="current-status" style={{ color: getStatusColor(order.status) }}>
            {order.status}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${getStatusProgress(order.status)}%`,
              backgroundColor: getStatusColor(order.status)
            }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>Confirmed</span>
          <span>Preparing</span>
          <span>Out for Delivery</span>
          <span>Delivered</span>
        </div>
      </div>

      {/* Delivery Information */}
      {order.deliveryPersonName && (
        <div className="delivery-info-card">
          <div className="card-header">
            <h3>🚚 Delivery Information</h3>
            <button 
              onClick={() => setShowNotifications(true)}
              className="view-details-btn"
            >
              📱 View Full Timeline
            </button>
          </div>
          
          <div className="delivery-executive">
            <div className="executive-avatar">
              {(order.deliveryPersonName || 'D').charAt(0).toUpperCase()}
            </div>
            <div className="executive-details">
              <h4>{order.deliveryPersonName || 'Delivery Executive'}</h4>
              <p>📞 {order.deliveryPersonPhone || 'N/A'}</p>
              <p>🛵 {order.deliveryPersonVehicle || 'N/A'}</p>
              <div className="rating">
                {'⭐'.repeat(Math.floor(order.deliveryPersonRating || 4.5))} 
                <span>{order.deliveryPersonRating || 4.5}/5</span>
              </div>
            </div>
            <div className="executive-actions">
              <button 
                className="call-btn"
                onClick={() => window.open(`tel:${order.deliveryPersonPhone || ''}`)}
              >
                📞 Call
              </button>
              <button className="track-btn">
                📍 Track
              </button>
            </div>
          </div>

          {order.estimatedDeliveryTime && (
            <div className="estimated-delivery">
              <h4>⏰ Estimated Delivery</h4>
              <p className="delivery-time">
                {formatDateTime(order.estimatedDeliveryTime).date} at {formatDateTime(order.estimatedDeliveryTime).time}
              </p>
              <p className="time-remaining">
                🕒 {formatTimeRemaining(order.estimatedDeliveryTime)}
              </p>
            </div>
          )}

          {/* Latest Update */}
          {order.deliveryTracking && order.deliveryTracking.length > 0 && (
            <div className="latest-update">
              <h4>📢 Latest Update</h4>
              <div className="update-card">
                <div className="update-status" style={{ color: getStatusColor(order.status) }}>
                  {order.status}
                </div>
                <p>{order.deliveryTracking[order.deliveryTracking.length - 1].message || 'No message available'}</p>
                <small>
                  {formatDateTime(order.deliveryTracking[order.deliveryTracking.length - 1].timestamp).time}
                </small>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Items */}
      <div className="order-items-card">
        <h3>🛍️ Order Items</h3>
        <div className="items-list">
          {order.items?.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </div>
              <div className="item-quantity">
                <span>Qty: {item.quantity}</span>
              </div>
              <div className="item-price">
                <span>{formatCurrency((item.price || 0) * (item.quantity || 1))}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="order-total">
          <div className="total-row">
            <span>Total Amount:</span>
            <span className="total-amount">{formatCurrency(order.totalPrice || order.totalAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="customer-info-card">
        <h3>👤 Customer Information</h3>
        <div className="customer-details">
          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{order.customerInfo?.name || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{order.customerInfo?.email || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{order.customerInfo?.phone || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Address:</span>
            <span className="value">{order.customerInfo?.address || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-actions">
        <button 
          onClick={() => setShowNotifications(true)}
          className="action-btn primary"
        >
          📱 View Full Timeline
        </button>
        <button 
          onClick={refreshOrderDetails}
          className="action-btn secondary"
        >
          🔄 Refresh Status
        </button>
        <button className="action-btn secondary">
          📄 Download Invoice
        </button>
      </div>

      {/* Delivery Notifications Modal */}
      {showNotifications && (
        <DeliveryNotifications 
          order={order}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default OrderStatus;
