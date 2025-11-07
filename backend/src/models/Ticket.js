import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
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

  // Seat & Passenger Info
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
  },

  // QR Code
  qrCode: {
    type: String,
    required: true
  },
  qrData: {
    type: String,
    required: true
  },

  // Ticket PDF
  ticketPDF: String,

  // Validation
  isValid: {
    type: Boolean,
    default: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: Date,
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },

  // Trip Details (denormalized for quick access)
  tripDetails: {
    routeName: String,
    origin: String,
    destination: String,
    departureTime: Date,
    busNumber: String,
    operatorName: String
  }
}, {
  timestamps: true
});

// Indexes
ticketSchema.index({ ticketCode: 1 });
ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ qrData: 1 });
ticketSchema.index({ customerId: 1 });

// Generate unique ticket code
ticketSchema.statics.generateTicketCode = async function() {
  const prefix = 'TK';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  let unique = false;
  let code;
  let counter = 1;

  while (!unique) {
    const sequence = String(counter).padStart(4, '0');
    code = `${prefix}${date}${sequence}`;

    const existing = await this.findOne({ ticketCode: code });
    if (!existing) {
      unique = true;
    } else {
      counter++;
    }
  }

  return code;
};

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
