import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true,
    index: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  // Rating
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },

  // Review Content
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // Categories Rating
  serviceRating: {
    type: Number,
    min: 1,
    max: 5
  },
  driverRating: {
    type: Number,
    min: 1,
    max: 5
  },
  vehicleRating: {
    type: Number,
    min: 1,
    max: 5
  },
  punctualityRating: {
    type: Number,
    min: 1,
    max: 5
  },

  // Images
  images: [String],

  // Operator Response
  operatorResponse: {
    message: {
      type: String,
      maxlength: 1000
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusOperator'
    }
  },

  // Status
  isApproved: {
    type: Boolean,
    default: false // Needs moderation
  },
  isHidden: {
    type: Boolean,
    default: false
  },

  // Helpful votes
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ customerId: 1, tripId: 1 }, { unique: true }); // One review per customer per trip
reviewSchema.index({ operatorId: 1, isApproved: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Static method to update operator rating
reviewSchema.statics.updateOperatorRating = async function(operatorId) {
  const BusOperator = mongoose.model('BusOperator');

  const stats = await this.aggregate([
    {
      $match: {
        operatorId: new mongoose.Types.ObjectId(operatorId),
        isApproved: true,
        isHidden: false
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await BusOperator.findByIdAndUpdate(operatorId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  }
};

// Post save hook to update operator rating
reviewSchema.post('save', async function() {
  await this.constructor.updateOperatorRating(this.operatorId);
});

// Post remove hook to update operator rating
reviewSchema.post('remove', async function() {
  await this.constructor.updateOperatorRating(this.operatorId);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
