import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },

  // Trip Code
  tripCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },

  // Schedule
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },

  // Pricing
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },

  // Seat Availability
  availableSeats: {
    type: Number,
    required: true
  },
  occupiedSeats: [String],
  lockedSeats: [{
    seatNumber: String,
    lockedUntil: Date,
    sessionId: String
  }],

  // Status
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes
tripSchema.index({ tripCode: 1 });
tripSchema.index({ operatorId: 1, departureTime: 1 });
tripSchema.index({ routeId: 1, departureTime: 1 });
tripSchema.index({ departureTime: 1, status: 1 });

// Virtual for checking if seat is available
tripSchema.methods.isSeatAvailable = function(seatNumber) {
  // Check if seat is occupied
  if (this.occupiedSeats.includes(seatNumber)) {
    return false;
  }

  // Check if seat is locked
  const now = new Date();
  const lockedSeat = this.lockedSeats.find(
    ls => ls.seatNumber === seatNumber && ls.lockedUntil > now
  );

  return !lockedSeat;
};

// Method to lock seats temporarily
tripSchema.methods.lockSeats = function(seatNumbers, sessionId, durationMinutes = 15) {
  const lockUntil = new Date(Date.now() + durationMinutes * 60 * 1000);

  seatNumbers.forEach(seatNumber => {
    // Remove existing lock for this seat
    this.lockedSeats = this.lockedSeats.filter(ls => ls.seatNumber !== seatNumber);

    // Add new lock
    this.lockedSeats.push({
      seatNumber,
      lockedUntil: lockUntil,
      sessionId
    });
  });

  return this.save();
};

// Method to release locks
tripSchema.methods.releaseLocks = function(sessionId) {
  this.lockedSeats = this.lockedSeats.filter(ls => ls.sessionId !== sessionId);
  return this.save();
};

// Method to occupy seats (after successful booking)
tripSchema.methods.occupySeats = function(seatNumbers) {
  seatNumbers.forEach(seatNumber => {
    if (!this.occupiedSeats.includes(seatNumber)) {
      this.occupiedSeats.push(seatNumber);
      this.availableSeats--;
    }
  });

  // Remove locks for these seats
  this.lockedSeats = this.lockedSeats.filter(
    ls => !seatNumbers.includes(ls.seatNumber)
  );

  return this.save();
};

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
