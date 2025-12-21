const mongoose = require('mongoose');

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
  }

  async connect(uri) {
    try {
      // Advanced MongoDB connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
        // Buffering settings
        maxPoolSize: 10, // Connection pool size
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        
        // Heartbeat settings
        heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
        
        // Read/Write concerns
        readConcern: { level: 'majority' },
        writeConcern: { 
          w: 'majority',
          j: true, // Wait for journal acknowledgment
          wtimeout: 5000 // Write timeout after 5 seconds
        },

        // Replica set settings
        readPreference: 'primaryPreferred',
        maxStalenessSeconds: 120,

        // Compression
        compressors: ['zlib'],
        
        // Authentication
        authSource: 'admin',
        
        // TLS/SSL settings for production
        ...(process.env.NODE_ENV === 'production' && {
          ssl: true,
          sslValidate: true,
          sslCA: process.env.MONGODB_SSL_CA,
        })
      };

      const connection = await mongoose.connect(uri, options);
      
      this.isConnected = true;
      this.retryCount = 0;
      
      console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
      console.log(`📊 Connection State: ${mongoose.connection.readyState}`);
      console.log(`🏗️  Database: ${connection.connection.name}`);
      
      // Setup connection event handlers
      this.setupConnectionHandlers();
      
      // Create indexes
      await this.createIndexes();
      
      // Setup database hooks
      this.setupDatabaseHooks();
      
      return connection;
    } catch (error) {
      console.error(`❌ MongoDB connection failed (attempt ${this.retryCount + 1}):`, error.message);
      
      this.retryCount++;
      if (this.retryCount < this.maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000); // Exponential backoff
        console.log(`🔄 Retrying connection in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.connect(uri);
      } else {
        console.error('❌ Max retry attempts reached. Exiting...');
        process.exit(1);
      }
    }
  }

  setupConnectionHandlers() {
    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    db.on('error', (error) => {
      console.error('❌ Mongoose connection error:', error);
      this.isConnected = false;
    });

    db.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
      this.isConnected = false;
      
      // Attempt to reconnect
      if (this.retryCount < this.maxRetries) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect to MongoDB...');
          this.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        }, 5000);
      }
    });

    db.on('reconnected', () => {
      console.log('✅ Mongoose reconnected to MongoDB');
      this.isConnected = true;
      this.retryCount = 0;
    });

    // Graceful shutdown - only on actual user interruption
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT signal - gracefully shutting down server...');
      try {
        await db.close();
        console.log('🛑 Mongoose connection closed due to app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM signal - gracefully shutting down server...');
      try {
        await db.close();
        console.log('🛑 Mongoose connection closed due to app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });
  }

  async createIndexes() {
    try {
      console.log('🏗️  Creating database indexes...');

      // User indexes
      const User = mongoose.model('User');
      try {
        await User.collection.dropIndexes();
      } catch (e) {
        // Ignore if no indexes to drop
      }
      await User.collection.createIndex({ email: 1 }, { unique: true });
      await User.collection.createIndex({ role: 1 });
      await User.collection.createIndex({ createdAt: -1 });
      await User.collection.createIndex({ 'address.zipCode': 1 });
      await User.collection.createIndex({ name: 'text', email: 'text' });

      // Product indexes
      const Product = mongoose.model('Product');
      try {
        await Product.collection.dropIndexes();
      } catch (e) {
        // Ignore if no indexes to drop
      }
      await Product.collection.createIndex({ name: 'text', description: 'text' });
      await Product.collection.createIndex({ category: 1 });
      await Product.collection.createIndex({ price: 1 });
      await Product.collection.createIndex({ featured: 1 });
      await Product.collection.createIndex({ stock: 1 });
      await Product.collection.createIndex({ createdAt: -1 });
      await Product.collection.createIndex({ category: 1, price: 1 });
      await Product.collection.createIndex({ featured: 1, category: 1, createdAt: -1 });

      // Order indexes
      const Order = mongoose.model('Order');
      if (Order) {
        try {
          await Order.collection.dropIndexes();
        } catch (e) {
          // Ignore if no indexes to drop
        }
        await Order.collection.createIndex({ userId: 1 });
        await Order.collection.createIndex({ status: 1 });
        await Order.collection.createIndex({ createdAt: -1 });
        await Order.collection.createIndex({ userId: 1, createdAt: -1 });
        await Order.collection.createIndex({ status: 1, createdAt: -1 });
      }

      // Cart indexes
      const Cart = mongoose.model('Cart');
      if (Cart) {
        try {
          await Cart.collection.dropIndexes();
        } catch (e) {
          // Ignore if no indexes to drop
        }
        // Clean up carts with null userId first
        await Cart.deleteMany({ userId: null });
        await Cart.collection.createIndex({ userId: 1 }, { unique: true });
        await Cart.collection.createIndex({ 'items.productId': 1 });
        await Cart.collection.createIndex({ updatedAt: 1 });
      }

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
      // Don't throw - let the app continue even if indexes fail
    }
  }

  setupDatabaseHooks() {
    // Add global plugins and middleware here
    
    // Performance monitoring
    mongoose.plugin((schema) => {
      schema.pre(['find', 'findOne', 'findOneAndUpdate'], function() {
        this.startTime = Date.now();
      });

      schema.post(['find', 'findOne', 'findOneAndUpdate'], function() {
        if (this.startTime) {
          const duration = Date.now() - this.startTime;
          if (duration > 100) { // Log slow queries (>100ms)
            console.log(`🐌 Slow query detected: ${this.getQuery()} took ${duration}ms`);
          }
        }
      });
    });

    // Auto-populate common fields
    mongoose.plugin((schema) => {
      schema.add({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      });

      schema.pre('save', function() {
        this.updatedAt = Date.now();
      });
    });
  }

  // Advanced aggregation pipelines
  async getProductAnalytics() {
    const Product = mongoose.model('Product');
    
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalStock: { $sum: '$stock' },
          featuredCount: {
            $sum: {
              $cond: [{ $eq: ['$featured', true] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { totalProducts: -1 }
      },
      {
        $project: {
          category: '$_id',
          totalProducts: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          totalValue: { $round: ['$totalValue', 2] },
          minPrice: 1,
          maxPrice: 1,
          totalStock: 1,
          featuredCount: 1,
          featuredPercentage: {
            $round: [
              { $multiply: [{ $divide: ['$featuredCount', '$totalProducts'] }, 100] },
              1
            ]
          }
        }
      }
    ]);

    return analytics;
  }

  async getUserAnalytics() {
    const User = mongoose.model('User');
    
    const analytics = await User.aggregate([
      {
        $group: {
          _id: '$role',
          totalUsers: { $sum: 1 },
          verifiedUsers: {
            $sum: {
              $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0]
            }
          },
          activeUsers: {
            $sum: {
              $cond: [
                { $gte: ['$lastLogin', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          role: '$_id',
          totalUsers: 1,
          verifiedUsers: 1,
          activeUsers: 1,
          verificationRate: {
            $round: [
              { $multiply: [{ $divide: ['$verifiedUsers', '$totalUsers'] }, 100] },
              1
            ]
          },
          activityRate: {
            $round: [
              { $multiply: [{ $divide: ['$activeUsers', '$totalUsers'] }, 100] },
              1
            ]
          }
        }
      }
    ]);

    return analytics;
  }

  async getOrderAnalytics(startDate, endDate) {
    const Order = mongoose.model('Order');
    
    const analytics = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            status: '$status'
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month'
          },
          statusBreakdown: {
            $push: {
              status: '$_id.status',
              count: '$totalOrders',
              revenue: '$totalRevenue'
            }
          },
          totalMonthlyOrders: { $sum: '$totalOrders' },
          totalMonthlyRevenue: { $sum: '$totalRevenue' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    return analytics;
  }

  // Performance optimization methods
  async optimizeQueries() {
    console.log('🎯 Running query optimization...');
    
    // Enable query profiling
    const db = mongoose.connection.db;
    await db.admin().command({ profile: 2, slowms: 100 });
    
    console.log('✅ Query profiling enabled for slow queries (>100ms)');
  }

  async getDatabaseStats() {
    const db = mongoose.connection.db;
    
    const stats = await db.admin().command({ dbStats: 1, scale: 1024 * 1024 }); // MB
    const serverStatus = await db.admin().command({ serverStatus: 1 });
    
    return {
      database: {
        name: stats.db,
        collections: stats.collections,
        objects: stats.objects,
        dataSize: `${stats.dataSize.toFixed(2)} MB`,
        storageSize: `${stats.storageSize.toFixed(2)} MB`,
        indexSize: `${stats.indexSize.toFixed(2)} MB`
      },
      server: {
        version: serverStatus.version,
        uptime: `${(serverStatus.uptime / 3600).toFixed(2)} hours`,
        connections: serverStatus.connections,
        memory: serverStatus.mem
      }
    };
  }

  // Health check method
  async healthCheck() {
    try {
      const isConnected = mongoose.connection.readyState === 1;
      const stats = await this.getDatabaseStats();
      
      return {
        status: isConnected ? 'healthy' : 'unhealthy',
        database: isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        stats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = new DatabaseManager();