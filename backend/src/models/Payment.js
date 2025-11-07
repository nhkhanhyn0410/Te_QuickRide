import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
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

  // Amount
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'VND'
  },

  // Payment Method
  paymentMethod: {
    type: String,
    required: true,
    enum: ['momo', 'vnpay', 'zalopay', 'shopeepay', 'atm', 'visa', 'mastercard', 'cod']
  },

  // Gateway Info
  gatewayTransactionId: String,
  gatewayResponse: mongoose.Schema.Types.Mixed,

  // Status
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },

  // Refund
  refundAmount: {
    type: Number,
    default: 0
  },
  refundedAt: Date,
  refundReason: String
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ customerId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Generate unique transaction ID
paymentSchema.statics.generateTransactionId = async function() {
  const prefix = 'TXN';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  let unique = false;
  let transactionId;

  while (!unique) {
    transactionId = `${prefix}${timestamp}${random}`;

    const existing = await this.findOne({ transactionId });
    if (!existing) {
      unique = true;
    }
  }

  return transactionId;
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
