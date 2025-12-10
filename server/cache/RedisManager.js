const redis = require('redis');

class RedisManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.errorLogged = false;
  }

  async connect() {
    try {
      // Skip Redis if explicitly disabled or in development without Redis
      if (process.env.DISABLE_REDIS === 'true') {
        console.log('💡 Redis disabled by configuration - using memory cache');
        this.isConnected = false;
        return null;
      }

      // Create Redis client with timeout
      this.client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        commandTimeout: 2000
      });

      // Handle connection events
      this.client.on('connect', () => {
        console.log('🔗 Redis client connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        if (!this.errorLogged) {
          console.log('💡 Redis not available - continuing with memory cache only');
          this.errorLogged = true;
        }
        this.isConnected = false;
      });

      this.client.on('end', () => {
        console.log('👋 Redis client disconnected');
        this.isConnected = false;
      });

      // Try to connect with timeout
      const connectTimeout = setTimeout(() => {
        if (!this.isConnected) {
          console.log('💡 Redis connection timeout - using memory cache');
          this.isConnected = false;
        }
      }, 2000);

      await this.client.connect();
      clearTimeout(connectTimeout);
      console.log('✅ Redis connection established');
      return this.client;
    } catch (error) {
      console.log('� Redis not available - using memory cache only');
      this.isConnected = false;
      return null;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  // Cache operations
  async set(key, value, expireSeconds = 3600) {
    if (!this.isConnected || !this.client) return false;
    
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, expireSeconds, serializedValue);
      return true;
    } catch (error) {
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected || !this.client) return null;
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  }

  async del(key) {
    if (!this.isConnected || !this.client) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected || !this.client) return false;
    
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      return false;
    }
  }

  async flush() {
    if (!this.isConnected || !this.client) return false;
    
    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Session operations
  async setSession(sessionId, sessionData, expireSeconds = 86400) {
    return await this.set(`session:${sessionId}`, sessionData, expireSeconds);
  }

  async getSession(sessionId) {
    return await this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId) {
    return await this.del(`session:${sessionId}`);
  }

  // Cache products with categories
  async cacheProducts(products, expireSeconds = 1800) {
    const cacheKey = 'products:all';
    return await this.set(cacheKey, products, expireSeconds);
  }

  async getCachedProducts() {
    return await this.get('products:all');
  }

  // Cache user data
  async cacheUser(userId, userData, expireSeconds = 3600) {
    const cacheKey = `user:${userId}`;
    return await this.set(cacheKey, userData, expireSeconds);
  }

  async getCachedUser(userId) {
    return await this.get(`user:${userId}`);
  }

  // Cache cart data
  async cacheCart(userId, cartData, expireSeconds = 1800) {
    const cacheKey = `cart:${userId}`;
    return await this.set(cacheKey, cartData, expireSeconds);
  }

  async getCachedCart(userId) {
    return await this.get(`cart:${userId}`);
  }

  async deleteCachedCart(userId) {
    return await this.del(`cart:${userId}`);
  }

  // Rate limiting
  async checkRateLimit(key, maxRequests = 100, windowSeconds = 3600) {
    if (!this.isConnected || !this.client) return { allowed: true, remaining: maxRequests };

    try {
      const current = await this.client.incr(key);
      
      if (current === 1) {
        await this.client.expire(key, windowSeconds);
      }
      
      const remaining = Math.max(0, maxRequests - current);
      const allowed = current <= maxRequests;
      
      return { allowed, remaining, current };
    } catch (error) {
      return { allowed: true, remaining: maxRequests };
    }
  }

  // Health check
  async ping() {
    if (!this.isConnected || !this.client) return false;
    
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get cache statistics
  async getStats() {
    if (!this.isConnected || !this.client) {
      return { 
        connected: false, 
        error: 'Redis not connected' 
      };
    }

    try {
      const info = await this.client.info();
      return {
        connected: this.isConnected,
        info: info,
        memoryUsage: await this.client.memory('USAGE'),
        dbSize: await this.client.dbSize()
      };
    } catch (error) {
      return { 
        connected: false, 
        error: error.message 
      };
    }
  }
}

// Create singleton instance
const redisManager = new RedisManager();

module.exports = redisManager;