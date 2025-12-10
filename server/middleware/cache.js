const redisManager = require('../cache/RedisManager');

// Cache middleware for GET requests
const cacheMiddleware = (expireSeconds = 3600, keyPrefix = '') => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = `${keyPrefix}${req.originalUrl || req.url}`;
      
      // Try to get from cache
      const cachedData = await redisManager.get(cacheKey);
      
      if (cachedData) {
        // Cache hit - return the cached body unchanged and add a header
        console.log(`🎯 Cache HIT: ${cacheKey}`);
        try { res.set('X-Cache-Status', 'HIT'); } catch (e) {}
        return res.json(cachedData);
      }

      console.log(`🔍 Cache MISS: ${cacheKey}`);

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response (do not mutate arrays/objects)
      res.json = function(body) {
        // Best-effort cache the raw response body
        try {
          if (redisManager && typeof redisManager.set === 'function') {
            redisManager.set(cacheKey, body, expireSeconds);
          }
        } catch (e) {
          // ignore cache errors
        }

        try { res.set('X-Cache-Status', 'MISS'); } catch (e) {}

        // Return original body unchanged
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache invalidation middleware
const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    try {
      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to invalidate cache after response
      res.json = function(body) {
        // Call original json method first
        const result = originalJson(body);

        // Then invalidate cache patterns
        if (Array.isArray(pattern)) {
          pattern.forEach(p => redisManager.del(p));
        } else {
          redisManager.del(pattern);
        }

        console.log(`🗑️ Cache invalidated: ${pattern}`);
        return result;
      };

      next();
    } catch (error) {
      console.error('Cache invalidation error:', error);
      next();
    }
  };
};

// Session cache middleware
const sessionCache = () => {
  return async (req, res, next) => {
    if (req.session && req.session.id) {
      try {
        // Get session from Redis
        const cachedSession = await redisManager.getSession(req.session.id);
        
        if (cachedSession) {
          // Merge cached session data
          Object.assign(req.session, cachedSession);
        }

        // Store original session save
        const originalSave = req.session.save.bind(req.session);

        // Override session save to also cache in Redis
        req.session.save = function(callback) {
          // Save to Redis
          redisManager.setSession(req.session.id, req.session);
          
          // Call original save
          return originalSave(callback);
        };

      } catch (error) {
        console.error('Session cache error:', error);
      }
    }

    next();
  };
};

// Rate limiting with Redis
const redisRateLimit = (maxRequests = 100, windowSeconds = 3600) => {
  return async (req, res, next) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress;
      const key = `rate_limit:${clientIP}`;
      
      const { allowed, remaining, current } = await redisManager.checkRateLimit(
        key, 
        maxRequests, 
        windowSeconds
      );

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Reset': new Date(Date.now() + windowSeconds * 1000).toISOString()
      });

      if (!allowed) {
        return res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again later.`,
          retryAfter: windowSeconds
        });
      }

      next();
    } catch (error) {
      console.error('Redis rate limit error:', error);
      next(); // Continue without rate limiting if Redis fails
    }
  };
};

// Cache warming utilities
const warmCache = {
  async products() {
    try {
      const Product = require('../models/Product');
      const products = await Product.find({}).lean();
      await redisManager.cacheProducts(products, 3600);
      console.log('🔥 Products cache warmed');
    } catch (error) {
      console.error('Error warming products cache:', error);
    }
  },

  async users() {
    try {
      const User = require('../models/User');
      const users = await User.find({}).select('-password').lean();
      
      for (const user of users) {
        await redisManager.cacheUser(user._id, user, 3600);
      }
      
      console.log(`🔥 ${users.length} users cached`);
    } catch (error) {
      console.error('Error warming users cache:', error);
    }
  }
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  sessionCache,
  redisRateLimit,
  warmCache
};