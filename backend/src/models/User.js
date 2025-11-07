import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false  // Don't include password in queries by default
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  avatar: String,
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },

  // OAuth
  googleId: String,
  facebookId: String,

  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  phoneVerificationOTP: String,
  otpExpires: Date,

  // Security
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,

  // Preferences
  savedPassengers: [{
    fullName: String,
    phone: String,
    idCard: String
  }],

  // Loyalty
  loyaltyTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  totalPoints: {
    type: Number,
    default: 0
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to hide sensitive data
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.emailVerificationToken;
  delete obj.phoneVerificationOTP;
  delete obj.otpExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
