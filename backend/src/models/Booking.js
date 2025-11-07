import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true
  },

  // Seats
  seats: [{
    seatNumber: {
      type: String,
      required: true
    },
    passenger: {
      fullName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      idCard: String
    }
  }],

  // Pickup & Dropoff
  pickupPoint: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dropoffPoint: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Voucher
  voucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher'
  },
  voucherCode: String,

  // Contact
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  notes: String,

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },

  // Cancellation
  cancellationReason: String,
  cancelledAt: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed']
  },

  // Check-in
  checkedInSeats: [String],
  checkedInAt: Date,
  checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ bookingCode: 1 });
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ tripId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Generate unique booking code
bookingSchema.statics.generateBookingCode = async function() {
  const prefix = 'BK';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  let unique = false;
  let code;
  let counter = 1;

  while (!unique) {
    const sequence = String(counter).padStart(4, '0');
    code = `${prefix}${date}${sequence}`;

    const existing = await this.findOne({ bookingCode: code });
    if (!existing) {
      unique = true;
    } else {
      counter++;
    }
  }

  return code;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
