import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './DeliveryNotifications.css';

const DeliveryNotifications = ({ order, onClose }) => {
  const [currentStatus, setCurrentStatus] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (order && order.deliveryTracking) {
      setNotifications(order.deliveryTracking);
      setCurrentStatus(order.status);
      
      // Show latest notification as toast
      const latestTracking = order.deliveryTracking[order.deliveryTracking.length - 1];
      if (latestTracking && latestTracking.message) {
        toast.info(`📦 ${latestTracking.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }
  }, [order]);

  // Update current time every second for countdown
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'assigned': return '👨‍💼';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'out for delivery': return '🚗';
      case 'nearby': return '📍';
      case 'delivered': return '🎉';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'assigned': return '#17a2b8';
      case 'confirmed': return '#28a745';
      case 'preparing': return '#fd7e14';
      case 'out for delivery': return '#6f42c1';
      case 'nearby': return '#dc3545';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTimeRemaining = (deliveryTime) => {
    const now = currentTime; // Use the currentTime state for real-time updates
    const delivery = new Date(deliveryTime);
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

  if (!order || !notifications.length) return null;

  return (
    <div className="delivery-notifications-overlay">
      <div className="delivery-notifications-modal">
        <div className="delivery-header">
          <h3>🚚 Delivery Updates</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Current Status */}
        <div className="current-status">
          <div className="status-badge" style={{ backgroundColor: getStatusColor(currentStatus) }}>
            {getStatusIcon(currentStatus)} {currentStatus}
          </div>
        </div>

        {/* Delivery Executive Info */}
        {order.deliveryPersonName && (
          <div className="delivery-executive-info">
            <h4>👨‍💼 Delivery Executive</h4>
            <div className="executive-details">
              <div className="executive-card">
                <div className="executive-avatar">
                  {(order.deliveryPersonName || 'D').charAt(0).toUpperCase()}
                </div>
                <div className="executive-info">
                  <h5>{order.deliveryPersonName || 'Delivery Executive'}</h5>
                  <p>📞 {order.deliveryPersonPhone || 'N/A'}</p>
                  <p>🛵 {order.deliveryPersonVehicle || 'N/A'}</p>
                  <div className="rating">
                    {'⭐'.repeat(Math.floor(order.deliveryPersonRating || 4.5))} 
                    <span>{order.deliveryPersonRating || 4.5}/5</span>
                  </div>
                </div>
                <div className="executive-actions">
                  <button className="call-btn" onClick={() => window.open(`tel:${order.deliveryPersonPhone || ''}`)}>
                    📞 Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estimated Delivery */}
        {order.estimatedDeliveryTime && (
          <div className="estimated-delivery">
            <h4>⏰ Estimated Delivery</h4>
            <p className="delivery-time">
              {formatDate(order.estimatedDeliveryTime)} at {formatTime(order.estimatedDeliveryTime)}
            </p>
            <p className="time-remaining">
              🕒 {formatTimeRemaining(order.estimatedDeliveryTime)}
            </p>
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="tracking-timeline">
          <h4>📋 Order Timeline</h4>
          <div className="timeline">
            {notifications.map((notification, index) => (
              <div key={notification._id || index} className="timeline-item">
                <div className="timeline-marker" style={{ backgroundColor: getStatusColor(notification.status) }}>
                  {getStatusIcon(notification.status)}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h5>{notification.status || 'Status Update'}</h5>
                    <span className="timeline-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p>{notification.message || 'No message available'}</p>
                  {notification.deliveryPerson && (
                    <div className="timeline-person">
                      <small>
                        {notification.deliveryPerson.name || 'Delivery Executive'} • {notification.deliveryPerson.phone || 'N/A'} • {notification.deliveryPerson.vehicle || 'N/A'}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Actions */}
        <div className="order-actions">
          <button className="action-btn primary">
            📍 Track Live Location
          </button>
          <button className="action-btn secondary">
            💬 Chat with Delivery Partner
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryNotifications;
