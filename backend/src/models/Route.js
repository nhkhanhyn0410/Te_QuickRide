import mongoose from 'mongoose';

const locationSchema = {
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  station: String,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
};

const pointSchema = {
  name: String,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
};

const routeSchema = new mongoose.Schema({
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true
  },
  routeName: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true
  },
  routeCode: {
    type: String,
    required: [true, 'Route code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },

  // Origin & Destination
  origin: {
    type: locationSchema,
    required: true
  },
  destination: {
    type: locationSchema,
    required: true
  },

  // Pickup & Dropoff Points
  pickupPoints: [pointSchema],
  dropoffPoints: [pointSchema],

  // Route Details
  distance: {
    type: Number,
    required: [true, 'Distance is required'],
    min: 0
  },
  estimatedDuration: {
    type: Number,
    required: [true, 'Estimated duration is required'],
    min: 0
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
routeSchema.index({ routeCode: 1 });
routeSchema.index({ operatorId: 1 });
routeSchema.index({ 'origin.city': 1, 'destination.city': 1 });

const Route = mongoose.model('Route', routeSchema);

export default Route;
