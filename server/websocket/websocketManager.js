const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class WebSocketManager {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // Store user connections
    this.adminSockets = new Set(); // Track admin connections
    this.deliverySockets = new Map(); // Track delivery personnel
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001", 
          "https://grabit-ecommerce-fullstack-r2h2im72x-kshitij-kohlis-projects.vercel.app",
          process.env.FRONTEND_URL
        ].filter(Boolean),
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Authentication middleware for Socket.IO
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token || token === 'guest') {
          // Allow anonymous connections for public features
          socket.isAuthenticated = false;
          socket.role = 'guest';
          socket.userId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          console.log(`👤 Guest connection established: ${socket.userId}`);
          return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id || decoded.userId).select('-password');
        
        if (!user) {
          console.log('⚠️ User not found, allowing as guest connection');
          socket.isAuthenticated = false;
          socket.role = 'guest';
          socket.userId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          return next();
        }

        socket.isAuthenticated = true;
        socket.userId = user._id;
        socket.userEmail = user.email;
        socket.userName = user.name;
        socket.role = user.role;
        socket.isAdmin = user.isAdmin;

        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });

    this.setupEventHandlers();
    console.log('✅ WebSocket server initialized with advanced features');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 User connected: ${socket.userName || 'Guest'} (${socket.id})`);

      // Store authenticated user connections
      if (socket.isAuthenticated) {
        this.connectedUsers.set(socket.userId.toString(), socket);
        
        // Track admin connections
        if (socket.isAdmin || socket.role === 'admin') {
          this.adminSockets.add(socket);
        }

        // Track delivery personnel
        if (socket.role === 'delivery') {
          this.deliverySockets.set(socket.userId.toString(), socket);
        }

        // Join user to their personal room
        socket.join(`user_${socket.userId}`);
        
        // Join role-based rooms
        socket.join(`role_${socket.role}`);
        if (socket.isAdmin) socket.join('admins');
      }

      // Join general public room for announcements
      socket.join('public');

      // Send welcome message
      socket.emit('welcome', {
        message: 'Connected to Grabit real-time service',
        timestamp: new Date(),
        features: ['order_updates', 'chat', 'notifications', 'inventory_updates']
      });

      // Handle order tracking
      this.handleOrderTracking(socket);
      
      // Handle live chat
      this.handleLiveChat(socket);
      
      // Handle notifications
      this.handleNotifications(socket);
      
      // Handle inventory updates
      this.handleInventoryUpdates(socket);
      
      // Handle admin features
      if (socket.isAdmin || socket.role === 'admin') {
        this.handleAdminFeatures(socket);
      }

      // Handle delivery tracking
      if (socket.role === 'delivery') {
        this.handleDeliveryTracking(socket);
      }

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`👋 User disconnected: ${socket.userName || 'Guest'} (${socket.id})`);
        
        if (socket.isAuthenticated) {
          this.connectedUsers.delete(socket.userId.toString());
          this.adminSockets.delete(socket);
          this.deliverySockets.delete(socket.userId.toString());
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
        socket.emit('error', { message: 'An error occurred', timestamp: new Date() });
      });
    });
  }

  handleOrderTracking(socket) {
    // Subscribe to order updates
    socket.on('track_order', (data) => {
      const { orderId } = data;
      if (!orderId) return socket.emit('error', { message: 'Order ID required' });
      
      socket.join(`order_${orderId}`);
      socket.emit('order_tracking_started', { orderId, timestamp: new Date() });
    });

    // Unsubscribe from order updates
    socket.on('untrack_order', (data) => {
      const { orderId } = data;
      if (!orderId) return;
      
      socket.leave(`order_${orderId}`);
      socket.emit('order_tracking_stopped', { orderId, timestamp: new Date() });
    });
  }

  handleLiveChat(socket) {
    if (!socket.isAuthenticated) return;

    // Join chat room
    socket.on('join_chat', (data) => {
      const { chatId, type = 'support' } = data;
      const roomName = `chat_${type}_${chatId || socket.userId}`;
      
      socket.join(roomName);
      socket.currentChatRoom = roomName;
      
      socket.emit('chat_joined', { 
        chatId: chatId || socket.userId, 
        type, 
        roomName,
        timestamp: new Date() 
      });

      // Notify admins of new chat request
      if (type === 'support') {
        this.adminSockets.forEach(adminSocket => {
          adminSocket.emit('new_chat_request', {
            userId: socket.userId,
            userName: socket.userName,
            userEmail: socket.userEmail,
            chatId: chatId || socket.userId,
            timestamp: new Date()
          });
        });
      }
    });

    // Send message
    socket.on('send_message', (data) => {
      const { message, chatId, type = 'support' } = data;
      
      if (!message || !message.trim()) {
        return socket.emit('error', { message: 'Message cannot be empty' });
      }

      const roomName = socket.currentChatRoom || `chat_${type}_${chatId || socket.userId}`;
      
      const messageData = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: message.trim(),
        sender: {
          id: socket.userId,
          name: socket.userName,
          role: socket.role
        },
        timestamp: new Date(),
        chatId: chatId || socket.userId
      };

      // Broadcast to chat room
      this.io.to(roomName).emit('new_message', messageData);
    });

    // Leave chat
    socket.on('leave_chat', () => {
      if (socket.currentChatRoom) {
        socket.leave(socket.currentChatRoom);
        socket.emit('chat_left', { timestamp: new Date() });
        socket.currentChatRoom = null;
      }
    });
  }

  handleNotifications(socket) {
    // Send demo notifications for all users (including guests)
    if (!socket.isAuthenticated) {
      // Send demo notifications for guest users
      setTimeout(() => {
        socket.emit('notification', {
          id: 'demo_1',
          type: 'promotion',
          title: '🎉 Welcome to Grabit!',
          message: 'Enjoy live real-time features! Add items to cart to see updates.',
          timestamp: new Date(),
          read: false
        });
      }, 2000);

      setTimeout(() => {
        socket.emit('notification', {
          id: 'demo_2', 
          type: 'inventory',
          title: '📊 Real-time Inventory',
          message: 'Product stock updates in real-time as you browse.',
          timestamp: new Date(),
          read: false
        });
      }, 5000);

      setTimeout(() => {
        socket.emit('notification', {
          id: 'demo_3',
          type: 'security',
          title: '🔒 Secure Shopping',
          message: 'Your data is protected with advanced security measures.',
          timestamp: new Date(),
          read: false
        });
      }, 8000);
    }

    // Mark notification as read
    socket.on('mark_notification_read', (data) => {
      const { notificationId } = data;
      socket.emit('notification_read', { notificationId, timestamp: new Date() });
    });

    // Subscribe to notification types
    socket.on('subscribe_notifications', (data) => {
      const { types = ['order', 'promotion', 'security'] } = data;
      
      types.forEach(type => {
        socket.join(`notifications_${type}`);
      });
      
      socket.emit('notifications_subscribed', { types, timestamp: new Date() });
    });
  }

  handleInventoryUpdates(socket) {
    // Subscribe to product inventory updates
    socket.on('subscribe_inventory', (data) => {
      const { productIds } = data;
      
      if (Array.isArray(productIds)) {
        productIds.forEach(productId => {
          socket.join(`inventory_${productId}`);
        });
      } else {
        socket.join('inventory_all');
      }
      
      socket.emit('inventory_subscribed', { productIds, timestamp: new Date() });
    });

    // Unsubscribe from inventory updates
    socket.on('unsubscribe_inventory', (data) => {
      const { productIds } = data;
      
      if (Array.isArray(productIds)) {
        productIds.forEach(productId => {
          socket.leave(`inventory_${productId}`);
        });
      } else {
        socket.leave('inventory_all');
      }
    });
  }

  handleAdminFeatures(socket) {
    // Real-time user activity monitoring
    socket.on('monitor_users', () => {
      socket.join('admin_monitoring');
      
      const userStats = {
        totalConnected: this.connectedUsers.size,
        adminConnected: this.adminSockets.size,
        deliveryConnected: this.deliverySockets.size,
        timestamp: new Date()
      };
      
      socket.emit('user_stats', userStats);
    });

    // Broadcast announcement to all users
    socket.on('broadcast_announcement', (data) => {
      const { message, type = 'info', targetRole = 'all' } = data;
      
      if (!message) return socket.emit('error', { message: 'Announcement message required' });
      
      const announcement = {
        id: `announcement_${Date.now()}`,
        message,
        type,
        sender: 'Admin',
        timestamp: new Date()
      };

      if (targetRole === 'all') {
        this.io.to('public').emit('announcement', announcement);
      } else {
        this.io.to(`role_${targetRole}`).emit('announcement', announcement);
      }

      socket.emit('announcement_sent', { ...announcement, targetRole });
    });
  }

  handleDeliveryTracking(socket) {
    // Update delivery location
    socket.on('update_location', (data) => {
      const { latitude, longitude, orderId } = data;
      
      if (!latitude || !longitude) {
        return socket.emit('error', { message: 'Location coordinates required' });
      }

      const locationUpdate = {
        deliveryPersonId: socket.userId,
        deliveryPersonName: socket.userName,
        latitude,
        longitude,
        timestamp: new Date(),
        orderId
      };

      // Broadcast to order tracking room if order specified
      if (orderId) {
        this.io.to(`order_${orderId}`).emit('delivery_location_update', locationUpdate);
      }

      // Broadcast to admin monitoring
      this.io.to('admin_monitoring').emit('delivery_location_update', locationUpdate);
      
      socket.emit('location_updated', { timestamp: new Date() });
    });

    // Update delivery status
    socket.on('update_delivery_status', (data) => {
      const { orderId, status, message } = data;
      
      if (!orderId || !status) {
        return socket.emit('error', { message: 'Order ID and status required' });
      }

      const statusUpdate = {
        orderId,
        status,
        message,
        deliveryPersonId: socket.userId,
        deliveryPersonName: socket.userName,
        timestamp: new Date()
      };

      // Broadcast to order tracking room
      this.io.to(`order_${orderId}`).emit('delivery_status_update', statusUpdate);
      
      // Broadcast to admin monitoring
      this.io.to('admin_monitoring').emit('delivery_status_update', statusUpdate);
      
      socket.emit('status_updated', { timestamp: new Date() });
    });
  }

  // Public methods for emitting events from other parts of the application

  notifyOrderUpdate(orderId, update) {
    if (!this.io) return;
    
    this.io.to(`order_${orderId}`).emit('order_update', {
      orderId,
      ...update,
      timestamp: new Date()
    });
  }

  notifyInventoryUpdate(productId, stock) {
    if (!this.io) return;
    
    const inventoryUpdate = {
      productId,
      stock,
      timestamp: new Date()
    };

    this.io.to(`inventory_${productId}`).emit('inventory_update', inventoryUpdate);
    this.io.to('inventory_all').emit('inventory_update', inventoryUpdate);
  }

  notifyUser(userId, notification) {
    if (!this.io) return;
    
    const socket = this.connectedUsers.get(userId.toString());
    if (socket) {
      socket.emit('notification', {
        ...notification,
        timestamp: new Date()
      });
    }
  }

  broadcastToRole(role, event, data) {
    if (!this.io) return;
    
    this.io.to(`role_${role}`).emit(event, {
      ...data,
      timestamp: new Date()
    });
  }

  getConnectedStats() {
    return {
      totalConnected: this.connectedUsers.size,
      adminConnected: this.adminSockets.size,
      deliveryConnected: this.deliverySockets.size,
      timestamp: new Date()
    };
  }
}

module.exports = new WebSocketManager();