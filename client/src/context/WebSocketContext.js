import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [orderTracking, setOrderTracking] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [inventoryUpdates, setInventoryUpdates] = useState({});

  // Initialize WebSocket connection
  const connectWebSocket = useCallback((token) => {
    if (socket) {
      socket.disconnect();
    }

    const serverUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    const newSocket = io(serverUrl, {
      auth: {
        token: token || 'guest'
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      forceNew: true
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('🔗 Connected to WebSocket server');
      setIsConnected(true);
      toast.success('Real-time features activated! 🚀');
    });

    newSocket.on('disconnect', () => {
      console.log('👋 Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Welcome message
    newSocket.on('welcome', (data) => {
      console.log('Welcome message:', data);
    });

    // Order tracking events
    newSocket.on('order_update', (data) => {
      console.log('📦 Order update:', data);
      setOrderTracking(prev => ({
        ...prev,
        [data.orderId]: {
          ...prev[data.orderId],
          ...data
        }
      }));
      
      toast.info(`Order ${data.orderId} updated: ${data.status}`, {
        position: "top-right",
        autoClose: 5000
      });
    });

    newSocket.on('delivery_location_update', (data) => {
      console.log('🚚 Delivery location update:', data);
      setOrderTracking(prev => ({
        ...prev,
        [data.orderId]: {
          ...prev[data.orderId],
          deliveryLocation: {
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp
          }
        }
      }));
    });

    newSocket.on('delivery_status_update', (data) => {
      console.log('📦 Delivery status update:', data);
      setOrderTracking(prev => ({
        ...prev,
        [data.orderId]: {
          ...prev[data.orderId],
          deliveryStatus: data.status,
          statusMessage: data.message,
          lastUpdate: data.timestamp
        }
      }));
      
      toast.info(`📦 ${data.message}`, {
        position: "top-right",
        autoClose: 7000
      });
    });

    // Chat events
    newSocket.on('chat_joined', (data) => {
      console.log('💬 Joined chat:', data);
      toast.success('Connected to support chat! 💬');
    });

    newSocket.on('new_message', (data) => {
      console.log('💬 New message:', data);
      setChatMessages(prev => [...prev, data]);
      
      // Show toast for new messages (except own messages)
      if (data.sender.id !== getCurrentUserId()) {
        toast.info(`💬 ${data.sender.name}: ${data.message}`, {
          position: "bottom-right",
          autoClose: 4000
        });
      }
    });

    // Notification events
    newSocket.on('notification', (data) => {
      console.log('🔔 New notification:', data);
      setNotifications(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
      
      toast.info(`🔔 ${data.title}: ${data.message}`, {
        position: "top-right",
        autoClose: 6000
      });
    });

    newSocket.on('announcement', (data) => {
      console.log('📢 Announcement:', data);
      toast.info(`📢 ${data.message}`, {
        position: "top-center",
        autoClose: 8000,
        className: 'announcement-toast'
      });
    });

    // Inventory events
    newSocket.on('inventory_update', (data) => {
      console.log('📊 Inventory update:', data);
      setInventoryUpdates(prev => ({
        ...prev,
        [data.productId]: {
          stock: data.stock,
          timestamp: data.timestamp
        }
      }));

      // Show low stock warning
      if (data.stock <= 5 && data.stock > 0) {
        toast.warn(`⚠️ Only ${data.stock} items left in stock!`, {
          position: "bottom-left",
          autoClose: 5000
        });
      } else if (data.stock === 0) {
        toast.error(`😞 Product out of stock!`, {
          position: "bottom-left",
          autoClose: 5000
        });
      }
    });

    // Error handling
    newSocket.on('error', (data) => {
      console.error('WebSocket error:', data);
      toast.error(`Error: ${data.message}`, {
        position: "top-center",
        autoClose: 5000
      });
    });

    setSocket(newSocket);
    return newSocket;
  }, [socket]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      console.log('🔌 WebSocket disconnected manually');
    }
  }, [socket]);

  // Order tracking functions
  const trackOrder = useCallback((orderId) => {
    if (socket && orderId) {
      socket.emit('track_order', { orderId });
      console.log(`🔍 Started tracking order: ${orderId}`);
    }
  }, [socket]);

  const untrackOrder = useCallback((orderId) => {
    if (socket && orderId) {
      socket.emit('untrack_order', { orderId });
      console.log(`🛑 Stopped tracking order: ${orderId}`);
    }
  }, [socket]);

  // Chat functions
  const joinChat = useCallback((chatId = null, type = 'support') => {
    if (socket) {
      socket.emit('join_chat', { chatId, type });
      setChatMessages([]); // Clear previous messages
    }
  }, [socket]);

  const sendChatMessage = useCallback((message, chatId = null, type = 'support') => {
    if (socket && message.trim()) {
      socket.emit('send_message', { message: message.trim(), chatId, type });
    }
  }, [socket]);

  const leaveChat = useCallback(() => {
    if (socket) {
      socket.emit('leave_chat');
      setChatMessages([]);
    }
  }, [socket]);

  // Notification functions
  const markNotificationRead = useCallback((notificationId) => {
    if (socket && notificationId) {
      socket.emit('mark_notification_read', { notificationId });
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  }, [socket]);

  const subscribeToNotifications = useCallback((types = ['order', 'promotion', 'security']) => {
    if (socket) {
      socket.emit('subscribe_notifications', { types });
    }
  }, [socket]);

  // Inventory functions
  const subscribeToInventory = useCallback((productIds = null) => {
    if (socket) {
      socket.emit('subscribe_inventory', { productIds });
    }
  }, [socket]);

  const unsubscribeFromInventory = useCallback((productIds = null) => {
    if (socket) {
      socket.emit('unsubscribe_inventory', { productIds });
    }
  }, [socket]);

  // Admin functions
  const broadcastAnnouncement = useCallback((message, type = 'info', targetRole = 'all') => {
    if (socket && message.trim()) {
      socket.emit('broadcast_announcement', { message: message.trim(), type, targetRole });
    }
  }, [socket]);

  const monitorUsers = useCallback(() => {
    if (socket) {
      socket.emit('monitor_users');
    }
  }, [socket]);

  // Utility function to get current user ID
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || payload.userId;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    return null;
  };

  // Auto-connect when component mounts (for both authenticated and guest users)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!socket) {
      // Connect with token if available, otherwise as guest
      connectWebSocket(token || 'guest');
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [connectWebSocket, socket]);

  // Clear data when disconnected
  useEffect(() => {
    if (!isConnected) {
      setOrderTracking({});
      setChatMessages([]);
      setInventoryUpdates({});
    }
  }, [isConnected]);

  const value = {
    // Connection state
    socket,
    isConnected,
    
    // Connection functions
    connectWebSocket,
    disconnectWebSocket,
    
    // Order tracking
    orderTracking,
    trackOrder,
    untrackOrder,
    
    // Chat
    chatMessages,
    joinChat,
    sendChatMessage,
    leaveChat,
    
    // Notifications
    notifications,
    markNotificationRead,
    subscribeToNotifications,
    
    // Inventory
    inventoryUpdates,
    subscribeToInventory,
    unsubscribeFromInventory,
    
    // Admin functions
    broadcastAnnouncement,
    monitorUsers
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};