import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import './RealTimeNotifications.css';

const RealTimeNotifications = () => {
  const { 
    notifications, 
    markNotificationRead, 
    subscribeToNotifications,
    isConnected 
  } = useWebSocket();
  
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isConnected) {
      subscribeToNotifications(['order', 'promotion', 'security', 'inventory']);
    }
  }, [isConnected, subscribeToNotifications]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleMarkAsRead = (notificationId) => {
    markNotificationRead(notificationId);
  };

  const handleMarkAllRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead(notification.id);
      }
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'security':
        return '🔒';
      case 'inventory':
        return '📊';
      case 'chat':
        return '💬';
      case 'delivery':
        return '🚚';
      default:
        return '🔔';
    }
  };

  const getNotificationClass = (type, read) => {
    let className = 'notification-item';
    if (!read) className += ' unread';
    className += ` notification-${type}`;
    return className;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime.toLocaleDateString();
  };

  return (
    <div className="realtime-notifications">
      <div className="notification-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
        <span className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Real-time Notifications</h3>
            <div className="header-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read-btn"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                >
                  ✓ All
                </button>
              )}
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="no-notifications-icon">🔔</span>
                <p>No notifications yet</p>
                <small>You'll see real-time updates here</small>
              </div>
            ) : (
              notifications.slice(0, 20).map((notification) => (
                <div 
                  key={notification.id} 
                  className={getNotificationClass(notification.type, notification.read)}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-icon-type">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-details">
                      <div className="notification-title">
                        {notification.title || 'Notification'}
                        {!notification.read && <span className="unread-dot">●</span>}
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-time">
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                  {notification.actionUrl && (
                    <div className="notification-action">
                      <a href={notification.actionUrl} className="action-link">
                        View →
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 20 && (
            <div className="notification-footer">
              <small>Showing 20 most recent notifications</small>
            </div>
          )}

          <div className="notification-info">
            <div className="connection-info">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              <small>
                {isConnected 
                  ? '🚀 Real-time updates active' 
                  : '⚠️ Offline - reconnecting...'
                }
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeNotifications;