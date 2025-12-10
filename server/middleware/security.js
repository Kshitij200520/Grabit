const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');

// Security configuration
const securityConfig = {
  // Helmet configuration for security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.unsplash.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "https://api.razorpay.com"],
      },
    },
    crossOriginEmbedderPolicy: false, // For development
  },

  // CORS configuration
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://grabit-ecommerce-fullstack-r2h2im72x-kshitij-kohlis-projects.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'Accept',
      'Origin',
      'X-Guest-ID'
    ],
  },

  // Rate limiting configuration
  rateLimit: {
    // General API rate limit
    general: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(15 * 60 * 1000 / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
    }),

    // Strict rate limit for sensitive endpoints
    strict: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // Limit each IP to 10 requests per windowMs
      message: {
        error: 'Too many requests to this endpoint, please try again later.',
        retryAfter: Math.ceil(15 * 60 * 1000 / 1000)
      },
    }),

    // Auth specific rate limits
    auth: {
      login: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 login attempts per 15 minutes
        message: {
          error: 'Too many login attempts, please try again later.',
          retryAfter: Math.ceil(15 * 60 * 1000 / 1000)
        },
        skipSuccessfulRequests: true, // Don't count successful requests
      }),

      registration: rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3, // 3 registrations per hour
        message: {
          error: 'Too many registration attempts, please try again later.',
          retryAfter: Math.ceil(60 * 60 * 1000 / 1000)
        },
      }),

      passwordReset: rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3, // 3 password reset attempts per hour
        message: {
          error: 'Too many password reset attempts, please try again later.',
          retryAfter: Math.ceil(60 * 60 * 1000 / 1000)
        },
      }),
    }
  }
};

// Security middleware setup
const setupSecurity = (app) => {
  // Trust proxy for accurate IP addresses
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet(securityConfig.helmet));

  // CORS
  app.use(cors(securityConfig.cors));

  // Compression
  app.use(compression({
    level: 6, // Compression level (0-9)
    threshold: 1024, // Only compress responses > 1kb
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));

  // Request logging
  const logFormat = process.env.NODE_ENV === 'production' 
    ? 'combined' 
    : 'dev';
  
  app.use(morgan(logFormat));

  // General rate limiting
  app.use('/api/', securityConfig.rateLimit.general);

  // Remove X-Powered-By header
  app.disable('x-powered-by');

  // Additional security middleware
  app.use((req, res, next) => {
    // Remove sensitive headers
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');

    // Add custom security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Only set HSTS in production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    next();
  });

  console.log('✅ Security middleware configured successfully');
};

// Middleware to log security events
const securityLogger = (event, req, additionalInfo = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    ...additionalInfo
  };

  console.log(`🔒 Security Event: ${JSON.stringify(logEntry)}`);
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Basic XSS protection for common fields
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    }
    return value;
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeValue(req.body[key]);
    });
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitizeValue(req.query[key]);
    });
  }

  next();
};

// File upload security
const fileUploadSecurity = {
  // Allowed file types
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Maximum file size (5MB)
  maxSize: 5 * 1024 * 1024,
  
  // Validate file upload
  validateFile: (file) => {
    if (!file) return { valid: false, error: 'No file provided' };
    
    if (!fileUploadSecurity.allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Invalid file type' };
    }
    
    if (file.size > fileUploadSecurity.maxSize) {
      return { valid: false, error: 'File too large' };
    }
    
    return { valid: true };
  }
};

module.exports = {
  securityConfig,
  setupSecurity,
  securityLogger,
  sanitizeInput,
  fileUploadSecurity
};