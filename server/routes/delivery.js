const express = require('express');
const router = express.Router();
const DeliveryPersonnel = require('../models/DeliveryPersonnel');
const Order = require('../models/Order');

// @desc    Get all delivery personnel
// @route   GET /api/delivery
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const deliveryPersonnel = await DeliveryPersonnel.find({})
      .sort({ totalDeliveries: -1 });
    
    res.json(deliveryPersonnel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get delivery personnel by ID
// @route   GET /api/delivery/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPersonnel.findById(req.params.id);
    
    if (!deliveryPerson) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }
    
    // Get recent orders assigned to this delivery person
    const recentOrders = await Order.find({ 
      deliveryPersonnel: req.params.id 
    }).sort({ createdAt: -1 }).limit(10);
    
    res.json({
      deliveryPerson,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update delivery personnel availability
// @route   PUT /api/delivery/:id/availability
// @access  Private/Admin
router.put('/:id/availability', async (req, res) => {
  try {
    const { isAvailable, status } = req.body;
    
    const deliveryPerson = await DeliveryPersonnel.findById(req.params.id);
    if (!deliveryPerson) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }
    
    deliveryPerson.isAvailable = isAvailable;
    if (status) {
      deliveryPerson.status = status;
    }
    
    const updatedPerson = await deliveryPerson.save();
    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add new delivery personnel
// @route   POST /api/delivery
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      vehicleType,
      currentLocation
    } = req.body;
    
    const deliveryPerson = new DeliveryPersonnel({
      name,
      phone,
      vehicleType,
      currentLocation,
      isAvailable: true,
      status: 'Active'
    });
    
    const savedPerson = await deliveryPerson.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get delivery statistics
// @route   GET /api/delivery/stats
// @access  Private/Admin
router.get('/stats/summary', async (req, res) => {
  try {
    const totalPersonnel = await DeliveryPersonnel.countDocuments();
    const availablePersonnel = await DeliveryPersonnel.countDocuments({ isAvailable: true });
    const onDeliveryPersonnel = await DeliveryPersonnel.countDocuments({ status: 'On Delivery' });
    const activePersonnel = await DeliveryPersonnel.countDocuments({ status: 'Active' });
    
    const totalDeliveries = await Order.countDocuments({ 
      deliveryPersonnel: { $exists: true } 
    });
    
    const pendingDeliveries = await Order.countDocuments({ 
      status: { $in: ['Confirmed', 'Preparing', 'Out for Delivery'] }
    });
    
    res.json({
      totalPersonnel,
      availablePersonnel,
      onDeliveryPersonnel,
      activePersonnel,
      totalDeliveries,
      pendingDeliveries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
