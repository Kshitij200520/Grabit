const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { 
  authenticate, 
  authMiddleware, 
  authorize, 
  authorizeAdmin,
  loginRateLimit,
  registrationRateLimit,
  validateRegistration,
  validateLogin,
  handleValidationErrors
} = require('../middleware/auth');
const { securityLogger, sanitizeInput } = require('../middleware/security');

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'demo@example.com',
      pass: process.env.EMAIL_PASS || 'demo-password'
    }
  });
};

// Helper function to generate JWT (legacy)
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });
};

// @desc    Register new user with email verification
// @route   POST /api/users/register
// @access  Public
router.post('/register', 
  registrationRateLimit,
  sanitizeInput,
  validateRegistration,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, password, phone, address } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        securityLogger('REGISTRATION_ATTEMPT_EXISTING_EMAIL', req, { email });
        return res.status(400).json({ 
          success: false,
          message: 'User already exists with this email' 
        });
      }
      
      // Create user (password will be hashed by pre-save middleware)
      const user = new User({
        name,
        email,
        password,
        phone,
        address,
        role: 'customer'
      });

      // Generate email verification token
      const emailVerificationToken = user.generateEmailVerificationToken();
      await user.save();
      
      // Generate tokens
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      await user.save(); // Save refresh token
      
      // Send verification email (in production)
      if (process.env.NODE_ENV === 'production') {
        try {
          const transporter = createEmailTransporter();
          const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`;
          
          await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@grabit.com',
            to: email,
            subject: 'Verify Your Email - Grabit E-commerce',
            html: `
              <h2>Welcome to Grabit!</h2>
              <p>Thank you for registering. Please verify your email by clicking the link below:</p>
              <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
              <p>If you didn't create this account, please ignore this email.</p>
            `
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }
      }
      
      securityLogger('USER_REGISTERED', req, { userId: user._id, email });
      
      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification.',
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @desc    Login user with advanced security
// @route   POST /api/users/login
// @access  Public
router.post('/login', 
  loginRateLimit,
  sanitizeInput,
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, twoFactorToken } = req.body;
      
      // Find user and include password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        securityLogger('LOGIN_ATTEMPT_INVALID_EMAIL', req, { email });
        return res.status(400).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }
      
      // Check password using enhanced model method
      try {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          securityLogger('LOGIN_ATTEMPT_INVALID_PASSWORD', req, { userId: user._id, email });
          return res.status(400).json({ 
            success: false,
            message: 'Invalid credentials' 
          });
        }
      } catch (lockError) {
        securityLogger('LOGIN_ATTEMPT_LOCKED_ACCOUNT', req, { userId: user._id, email });
        return res.status(423).json({
          success: false,
          message: 'Account temporarily locked due to multiple failed attempts'
        });
      }

      // Check 2FA if enabled
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return res.status(200).json({
            success: false,
            message: 'Two-factor authentication required',
            requiresTwoFactor: true
          });
        }

        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: twoFactorToken,
          window: 1
        });

        if (!verified) {
          securityLogger('LOGIN_ATTEMPT_INVALID_2FA', req, { userId: user._id });
          return res.status(400).json({
            success: false,
            message: 'Invalid two-factor authentication code'
          });
        }
      }
      
      // Generate new tokens
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      
      // Clean expired refresh tokens
      user.cleanExpiredRefreshTokens();
      await user.save();
      
      securityLogger('USER_LOGIN_SUCCESS', req, { userId: user._id, email });
      
      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({
        success: true,
        message: 'Login successful',
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          isAdmin: user.isAdmin,
          isEmailVerified: user.isEmailVerified,
          twoFactorEnabled: user.twoFactorEnabled
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      securityLogger('LOGIN_ERROR', req, { error: error.message });
      res.status(500).json({ 
        success: false,
        message: 'Server error during login' 
      });
    }
  }
);

// @desc    Refresh access token
// @route   POST /api/users/refresh
// @access  Private (refresh token required)
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret');
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenExists = user.refreshTokens.some(token => token.token === hashedRefreshToken);

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();
    
    securityLogger('TOKEN_REFRESHED', req, { userId: user._id });

    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      // Remove refresh token from database
      req.user.removeRefreshToken(refreshToken);
      await req.user.save();
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    securityLogger('USER_LOGOUT', req, { userId: req.user._id });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
});

// @desc    Logout from all devices
// @route   POST /api/users/logout-all
// @access  Private
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    // Clear all refresh tokens
    req.user.refreshTokens = [];
    await req.user.save();

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    securityLogger('USER_LOGOUT_ALL_DEVICES', req, { userId: req.user._id });

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
});

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email (in production)
    if (process.env.NODE_ENV === 'production') {
      try {
        const transporter = createEmailTransporter();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@grabit.com',
          to: email,
          subject: 'Password Reset Request - Grabit',
          html: `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `
        });
      } catch (emailError) {
        console.error('Password reset email failed:', emailError);
      }
    }

    securityLogger('PASSWORD_RESET_REQUESTED', req, { userId: user._id, email });

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing password reset request'
    });
  }
});

// @desc    Reset password
// @route   POST /api/users/reset-password/:resetToken
// @access  Public
router.post('/reset-password/:resetToken', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Hash the token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password (will be hashed by pre-save middleware)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    // Clear all refresh tokens for security
    user.refreshTokens = [];
    
    await user.save();

    securityLogger('PASSWORD_RESET_COMPLETED', req, { userId: user._id });

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
});

// @desc    Enable Two-Factor Authentication
// @route   POST /api/users/enable-2fa
// @access  Private
router.post('/enable-2fa', authenticate, async (req, res) => {
  try {
    if (req.user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is already enabled'
      });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      length: 32,
      name: `Grabit (${req.user.email})`,
      issuer: 'Grabit E-commerce'
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Temporarily store secret (not yet activated)
    req.user.twoFactorSecret = secret.base32;
    await req.user.save();

    res.json({
      success: true,
      message: 'Scan the QR code with your authenticator app',
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enabling two-factor authentication'
    });
  }
});

// @desc    Verify and activate Two-Factor Authentication
// @route   POST /api/users/verify-2fa
// @access  Private
router.post('/verify-2fa', authenticate, async (req, res) => {
  try {
    const { token } = req.body;

    if (!req.user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication not initiated'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authentication code'
      });
    }

    // Activate 2FA
    req.user.twoFactorEnabled = true;
    await req.user.save();

    securityLogger('TWO_FACTOR_ENABLED', req, { userId: req.user._id });

    res.json({
      success: true,
      message: 'Two-factor authentication enabled successfully'
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying two-factor authentication'
    });
  }
});

// @desc    Disable Two-Factor Authentication
// @route   POST /api/users/disable-2fa
// @access  Private
router.post('/disable-2fa', authenticate, async (req, res) => {
  try {
    const { password, twoFactorToken } = req.body;

    // Verify password
    const user = await User.findById(req.user._id).select('+password');
    const isValidPassword = await user.matchPassword(password);
    
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Verify 2FA token if enabled
    if (req.user.twoFactorEnabled) {
      const verified = speakeasy.totp.verify({
        secret: req.user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 1
      });

      if (!verified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid authentication code'
        });
      }
    }

    // Disable 2FA
    req.user.twoFactorEnabled = false;
    req.user.twoFactorSecret = undefined;
    await req.user.save();

    securityLogger('TWO_FACTOR_DISABLED', req, { userId: req.user._id });

    res.json({
      success: true,
      message: 'Two-factor authentication disabled successfully'
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disabling two-factor authentication'
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;