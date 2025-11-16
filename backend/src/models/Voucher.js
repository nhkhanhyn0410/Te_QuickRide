import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Voucher code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },

  // Discount
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 0
  },
  maxDiscount: {
    type: Number, // Maximum discount amount (for percentage type)
    min: 0
  },
  minOrderValue: {
    type: Number, // Minimum order to apply voucher
    default: 0,
    min: 0
  },

  // Validity
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

  // Usage Limits
  maxUsage: {
    type: Number, // Total usage limit
    min: 1
  },
  currentUsage: {
    type: Number,
    default: 0,
    min: 0
  },
  maxUsagePerUser: {
    type: Number, // Per-user limit
    default: 1,
    min: 1
  },

  // Applicability
  applicableTo: {
    type: String,
    enum: ['all', 'specific_operators', 'specific_routes'],
    default: 'all'
  },
  operators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusOperator'
  }],
  routes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }],

  // User Targeting
  targetUsers: {
    type: String,
    enum: ['all', 'new', 'loyalty_tier'],
    default: 'all'
  },
  loyaltyTiers: [{
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum']
  }],

  // Description
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin who created it
  }
}, {
  timestamps: true
});

// Indexes
voucherSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
voucherSchema.index({ code: 1 }, { unique: true });

// Virtual to check if voucher is valid
voucherSchema.virtual('isValid').get(function() {
  const now = new Date();
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now &&
    (!this.maxUsage || this.currentUsage < this.maxUsage)
  );
});

// Method to check if user can use voucher
voucherSchema.methods.canBeUsedBy = async function(userId, orderValue) {
  // Check if voucher is valid
  if (!this.isValid) {
    return { valid: false, reason: 'Voucher is not valid or has expired' };
  }

  // Check minimum order value
  if (orderValue < this.minOrderValue) {
    return {
      valid: false,
      reason: `Minimum order value is ${this.minOrderValue} VND`
    };
  }

  // Check user usage
  const Booking = mongoose.model('Booking');
  const userUsageCount = await Booking.countDocuments({
    customerId: userId,
    voucherCode: this.code,
    status: { $in: ['confirmed', 'completed'] }
  });

  if (userUsageCount >= this.maxUsagePerUser) {
    return {
      valid: false,
      reason: `You have already used this voucher ${this.maxUsagePerUser} time(s)`
    };
  }

  // Check user targeting
  if (this.targetUsers !== 'all') {
    const User = mongoose.model('User');
    const user = await User.findById(userId);

    if (this.targetUsers === 'new') {
      const bookingCount = await Booking.countDocuments({
        customerId: userId,
        status: { $in: ['confirmed', 'completed'] }
      });
      if (bookingCount > 0) {
        return { valid: false, reason: 'This voucher is only for new users' };
      }
    }

    if (this.targetUsers === 'loyalty_tier') {
      if (!this.loyaltyTiers.includes(user.loyaltyTier)) {
        return {
          valid: false,
          reason: `This voucher is only for ${this.loyaltyTiers.join(', ')} members`
        };
      }
    }
  }

  return { valid: true };
};

// Method to calculate discount amount
voucherSchema.methods.calculateDiscount = function(orderValue) {
  let discount = 0;

  if (this.discountType === 'percentage') {
    discount = (orderValue * this.discountValue) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.discountType === 'fixed') {
    discount = this.discountValue;
  }

  // Discount cannot exceed order value
  if (discount > orderValue) {
    discount = orderValue;
  }

  return Math.round(discount);
};

// Method to increment usage
voucherSchema.methods.incrementUsage = async function() {
  this.currentUsage += 1;
  return this.save();
};

const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;
