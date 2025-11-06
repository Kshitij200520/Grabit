const DeliveryPersonnel = require('../models/DeliveryPersonnel');

// Service to assign delivery executive to an order
const assignDeliveryExecutive = async (orderId, shippingAddress) => {
  try {
    // Find available delivery personnel (you can add location-based logic here)
    const availableDelivery = await DeliveryPersonnel.findOne({
      isAvailable: true,
      status: 'Active'
    }).sort({ totalDeliveries: 1 }); // Assign to least busy person

    if (!availableDelivery) {
      // If no delivery person is available, create a random assignment
      const deliveryExecutives = [
        {
          name: 'Rahul Kumar',
          phone: '+91-9876543210',
          vehicle: 'Bike',
          rating: 4.5
        },
        {
          name: 'Priya Sharma',
          phone: '+91-9876543211',
          vehicle: 'Scooter',
          rating: 4.7
        },
        {
          name: 'Amit Singh',
          phone: '+91-9876543212',
          vehicle: 'Car',
          rating: 4.3
        },
        {
          name: 'Sneha Patel',
          phone: '+91-9876543213',
          vehicle: 'Bike',
          rating: 4.8
        },
        {
          name: 'Rajesh Gupta',
          phone: '+91-9876543214',
          vehicle: 'Van',
          rating: 4.4
        }
      ];

      // Randomly assign one of the executives
      const randomExecutive = deliveryExecutives[Math.floor(Math.random() * deliveryExecutives.length)];
      
      return {
        deliveryPersonName: randomExecutive.name,
        deliveryPersonPhone: randomExecutive.phone,
        deliveryPersonVehicle: randomExecutive.vehicle,
        deliveryPersonRating: randomExecutive.rating,
        deliveryAssignedAt: new Date(),
        estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };
    }

    // Mark delivery person as busy
    availableDelivery.isAvailable = false;
    availableDelivery.status = 'On Delivery';
    availableDelivery.totalDeliveries += 1;
    await availableDelivery.save();

    return {
      deliveryPersonnel: availableDelivery._id,
      deliveryPersonName: availableDelivery.name,
      deliveryPersonPhone: availableDelivery.phone,
      deliveryPersonVehicle: availableDelivery.vehicleType,
      deliveryPersonRating: availableDelivery.rating,
      deliveryAssignedAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };
  } catch (error) {
    console.error('Error assigning delivery executive:', error);
    // Fallback assignment
    return {
      deliveryPersonName: 'Delivery Executive',
      deliveryPersonPhone: '+91-9999999999',
      deliveryPersonVehicle: 'Bike',
      deliveryPersonRating: 4.5,
      deliveryAssignedAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }
};

// Service to create delivery tracking entry
const createDeliveryTracking = (deliveryPersonInfo, message = 'Order assigned to delivery executive') => {
  return {
    status: 'Assigned',
    message: message,
    deliveryPerson: {
      name: deliveryPersonInfo.deliveryPersonName,
      phone: deliveryPersonInfo.deliveryPersonPhone,
      vehicle: deliveryPersonInfo.deliveryPersonVehicle,
      rating: deliveryPersonInfo.deliveryPersonRating
    },
    timestamp: new Date()
  };
};

// Seed delivery personnel if not exists
const seedDeliveryPersonnel = async () => {
  try {
    const count = await DeliveryPersonnel.countDocuments();
    if (count === 0) {
      const deliveryPersonnel = [
        {
          name: 'Rahul Kumar',
          phone: '+91-9876543210',
          vehicleType: 'Bike',
          rating: 4.5,
          totalDeliveries: 25,
          isAvailable: true,
          status: 'Active',
          currentLocation: { lat: 28.6139, lng: 77.2090 }
        },
        {
          name: 'Priya Sharma',
          phone: '+91-9876543211',
          vehicleType: 'Car',
          rating: 4.7,
          totalDeliveries: 18,
          isAvailable: true,
          status: 'Active',
          currentLocation: { lat: 28.7041, lng: 77.1025 }
        },
        {
          name: 'Amit Singh',
          phone: '+91-9876543212',
          vehicleType: 'Bike',
          rating: 4.3,
          totalDeliveries: 32,
          isAvailable: false,
          status: 'On Delivery',
          currentLocation: { lat: 28.5355, lng: 77.3910 }
        },
        {
          name: 'Sneha Patel',
          phone: '+91-9876543213',
          vehicleType: 'Bicycle',
          rating: 4.8,
          totalDeliveries: 12,
          isAvailable: true,
          status: 'Active',
          currentLocation: { lat: 28.4595, lng: 77.0266 }
        }
      ];

      await DeliveryPersonnel.insertMany(deliveryPersonnel);
      console.log('✅ Delivery personnel seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding delivery personnel:', error);
  }
};

module.exports = {
  assignDeliveryExecutive,
  createDeliveryTracking,
  seedDeliveryPersonnel
};
