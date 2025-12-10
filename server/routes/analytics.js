const express = require('express');
const router = express.Router();
const DatabaseManager = require('../database/DatabaseManager');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @desc    Get database health status
// @route   GET /api/analytics/health
// @access  Public
router.get('/health', async (req, res) => {
  try {
    const health = await DatabaseManager.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking database health',
      error: error.message
    });
  }
});

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private (Admin only)
router.get('/products', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const analytics = await DatabaseManager.getProductAnalytics();
    
    res.json({
      success: true,
      message: 'Product analytics retrieved successfully',
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving product analytics',
      error: error.message
    });
  }
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private (Admin only)
router.get('/users', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const analytics = await DatabaseManager.getUserAnalytics();
    
    res.json({
      success: true,
      message: 'User analytics retrieved successfully',
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user analytics',
      error: error.message
    });
  }
});

// @desc    Get order analytics
// @route   GET /api/analytics/orders
// @access  Private (Admin only)
router.get('/orders', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if dates not provided
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const analytics = await DatabaseManager.getOrderAnalytics(start, end);
    
    res.json({
      success: true,
      message: 'Order analytics retrieved successfully',
      data: analytics,
      period: {
        startDate: start.toISOString(),
        endDate: end.toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving order analytics',
      error: error.message
    });
  }
});

// @desc    Get database statistics
// @route   GET /api/analytics/database
// @access  Private (Admin only)
router.get('/database', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await DatabaseManager.getDatabaseStats();
    
    res.json({
      success: true,
      message: 'Database statistics retrieved successfully',
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving database statistics',
      error: error.message
    });
  }
});

// @desc    Get comprehensive dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private (Admin only)
router.get('/dashboard', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [productAnalytics, userAnalytics, orderAnalytics, dbStats] = await Promise.all([
      DatabaseManager.getProductAnalytics(),
      DatabaseManager.getUserAnalytics(),
      DatabaseManager.getOrderAnalytics(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        new Date()
      ),
      DatabaseManager.getDatabaseStats()
    ]);

    res.json({
      success: true,
      message: 'Dashboard analytics retrieved successfully',
      data: {
        products: productAnalytics,
        users: userAnalytics,
        orders: orderAnalytics,
        database: dbStats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard analytics',
      error: error.message
    });
  }
});

module.exports = router;