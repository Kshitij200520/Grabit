const mongoose = require('mongoose');

const deliveryPersonnelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['Bike', 'Car', 'Bicycle'],
    default: 'Bike'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  },
  totalDeliveries: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DeliveryPersonnel', deliveryPersonnelSchema);
