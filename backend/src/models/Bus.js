import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number (license plate) is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  busType: {
    type: String,
    required: [true, 'Bus type is required'],
    enum: ['limousine', 'sleeper', 'seater', 'double_decker']
  },

  // Seat Configuration
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: 1
  },
  seatLayout: {
    floors: {
      type: Number,
      required: true,
      min: 1,
      max: 2
    },
    rows: {
      type: Number,
      required: true
    },
    columns: {
      type: Number,
      required: true
    },
    layout: {
      type: [[String]],
      required: true
    }
  },

  // Amenities
  amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'toilet', 'water', 'blanket', 'tv', 'usb_charger', 'reading_light']
  }],

  // Images
  images: [String],

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  maintenanceStatus: {
    type: String,
    enum: ['good', 'maintenance', 'repair'],
    default: 'good'
  }
}, {
  timestamps: true
});

// Indexes
busSchema.index({ operatorId: 1 });
busSchema.index({ busNumber: 1 });

const Bus = mongoose.model('Bus', busSchema);

export default Bus;
