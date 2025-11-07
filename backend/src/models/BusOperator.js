import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const busOperatorSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },

  // Business Info
  businessLicense: {
    type: String,
    required: [true, 'Business license is required']
  },
  taxCode: {
    type: String,
    required: [true, 'Tax code is required']
  },
  logo: String,
  description: String,
  website: String,

  // Address
  address: {
    street: String,
    ward: String,
    district: String,
    city: String,
    country: {
      type: String,
      default: 'Vietnam'
    }
  },

  // Bank Info
  bankAccount: {
    bankName: String,
    accountNumber: String,
    accountHolder: String
  },

  // Approval
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,

  // Rating
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },

  // Statistics
  totalTrips: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },

  // Commission
  commissionRate: {
    type: Number,
    default: 5,  // 5%
    min: 0,
    max: 100
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String
}, {
  timestamps: true
});

// Indexes
busOperatorSchema.index({ companyName: 1 });
busOperatorSchema.index({ email: 1 });
busOperatorSchema.index({ verificationStatus: 1 });

// Hash password before saving
busOperatorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
busOperatorSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to hide sensitive data
busOperatorSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const BusOperator = mongoose.model('BusOperator', busOperatorSchema);

export default BusOperator;
