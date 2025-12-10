const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'vendor', 'delivery'],
    default: 'customer'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days
    }
  }],
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for performance optimization
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving with advanced security
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  // Advanced password hashing with higher salt rounds
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Handle account locking
userSchema.pre('save', function(next) {
  // If we have a previous value but not a current value
  if (this.isModified('loginAttempts') && this.loginAttempts > 0) {
    this.lockUntil = Date.now() + (this.loginAttempts * 60000); // Lock for attempts * 1 minute
  }
  next();
});

// Advanced password comparison with rate limiting
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.isLocked) {
    throw new Error('Account temporarily locked due to too many failed login attempts');
  }
  
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  
  if (!isMatch) {
    this.loginAttempts += 1;
    await this.save();
    return false;
  }
  
  // Reset login attempts on successful login
  if (this.loginAttempts > 0) {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    this.lastLogin = new Date();
    await this.save();
  }
  
  return true;
};

// Generate JWT Access Token
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role,
      isAdmin: this.isAdmin 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { 
      expiresIn: process.env.JWT_EXPIRE || '15m',
      issuer: 'grabit-ecommerce',
      audience: this.email
    }
  );
};

// Generate JWT Refresh Token
userSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign(
    { id: this._id, tokenType: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
      issuer: 'grabit-ecommerce'
    }
  );
  
  // Store refresh token in database
  this.refreshTokens.push({
    token: crypto.createHash('sha256').update(refreshToken).digest('hex')
  });
  
  return refreshToken;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  this.refreshTokens = this.refreshTokens.filter(
    refreshToken => refreshToken.token !== hashedToken
  );
};

// Clean expired refresh tokens
userSchema.methods.cleanExpiredRefreshTokens = function() {
  this.refreshTokens = this.refreshTokens.filter(
    refreshToken => refreshToken.createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) > Date.now()
  );
};

module.exports = mongoose.model('User', userSchema);
