import mongoose from 'mongoose';

const loyaltyPointSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Transaction
  type: {
    type: String,
    enum: ['earn', 'redeem', 'expire', 'adjust'],
    required: true
  },
  points: {
    type: Number,
    required: true
    // Positive for earn, negative for redeem/expire
  },

  // Source
  sourceType: {
    type: String,
    enum: ['booking', 'referral', 'promotion', 'manual', 'birthday', 'review'],
    required: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId
    // Reference to Booking, etc.
  },

  // Details
  description: {
    type: String,
    required: true,
    trim: true
  },

  // Balance (denormalized for quick access)
  balanceBefore: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAfter: {
    type: Number,
    required: true,
    min: 0
  },

  // Expiry (for earned points)
  expiresAt: {
    type: Date
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'used'],
    default: 'active'
  },

  // Admin who made manual adjustment
  adjustedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
loyaltyPointSchema.index({ customerId: 1, createdAt: -1 });
loyaltyPointSchema.index({ expiresAt: 1, status: 1 });
loyaltyPointSchema.index({ sourceType: 1, sourceId: 1 });

// Static method to calculate points for a booking
loyaltyPointSchema.statics.calculateBookingPoints = function(bookingAmount) {
  // Example: 1 point per 10,000 VND
  return Math.floor(bookingAmount / 10000);
};

// Static method to add points to user
loyaltyPointSchema.statics.addPoints = async function(customerId, points, sourceType, sourceId, description, expiryDays = 365) {
  const User = mongoose.model('User');
  const user = await User.findById(customerId);

  if (!user) {
    throw new Error('User not found');
  }

  const balanceBefore = user.totalPoints;
  const balanceAfter = balanceBefore + points;

  // Create loyalty point transaction
  const transaction = await this.create({
    customerId,
    type: 'earn',
    points,
    sourceType,
    sourceId,
    description,
    balanceBefore,
    balanceAfter,
    expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
    status: 'active'
  });

  // Update user's total points and tier
  user.totalPoints = balanceAfter;
  user.loyaltyTier = this.calculateTier(balanceAfter);
  await user.save();

  return transaction;
};

// Static method to redeem points
loyaltyPointSchema.statics.redeemPoints = async function(customerId, points, sourceType, sourceId, description) {
  const User = mongoose.model('User');
  const user = await User.findById(customerId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.totalPoints < points) {
    throw new Error('Insufficient points');
  }

  const balanceBefore = user.totalPoints;
  const balanceAfter = balanceBefore - points;

  // Create redemption transaction
  const transaction = await this.create({
    customerId,
    type: 'redeem',
    points: -points,
    sourceType,
    sourceId,
    description,
    balanceBefore,
    balanceAfter,
    status: 'used'
  });

  // Update user's total points and tier
  user.totalPoints = balanceAfter;
  user.loyaltyTier = this.calculateTier(balanceAfter);
  await user.save();

  return transaction;
};

// Static method to calculate loyalty tier
loyaltyPointSchema.statics.calculateTier = function(totalPoints) {
  if (totalPoints >= 10000) return 'platinum';
  if (totalPoints >= 5000) return 'gold';
  if (totalPoints >= 2000) return 'silver';
  return 'bronze';
};

// Static method to expire old points
loyaltyPointSchema.statics.expireOldPoints = async function() {
  const now = new Date();
  const expiredTransactions = await this.find({
    expiresAt: { $lte: now },
    status: 'active'
  });

  for (const transaction of expiredTransactions) {
    const User = mongoose.model('User');
    const user = await User.findById(transaction.customerId);

    if (user) {
      const balanceBefore = user.totalPoints;
      const balanceAfter = Math.max(0, balanceBefore - transaction.points);

      // Create expiry transaction
      await this.create({
        customerId: transaction.customerId,
        type: 'expire',
        points: -transaction.points,
        sourceType: 'manual',
        sourceId: transaction._id,
        description: `Points expired from ${transaction.description}`,
        balanceBefore,
        balanceAfter,
        status: 'expired'
      });

      // Update user
      user.totalPoints = balanceAfter;
      user.loyaltyTier = this.calculateTier(balanceAfter);
      await user.save();

      // Mark original transaction as expired
      transaction.status = 'expired';
      await transaction.save();
    }
  }
};

const LoyaltyPoint = mongoose.model('LoyaltyPoint', loyaltyPointSchema);

export default LoyaltyPoint;
