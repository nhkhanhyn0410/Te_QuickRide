import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const staffSchema = new mongoose.Schema({
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true,
    index: true
  },
  employeeCode: {
    type: String,
    required: [true, 'Employee code is required'],
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(0|\+84)[0-9]{9,10}$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['driver', 'trip_manager'],
    required: true
  },
  licenseNumber: {
    type: String,
    required: function() {
      return this.role === 'driver';
    }
  },
  licenseExpiry: {
    type: Date,
    required: function() {
      return this.role === 'driver';
    }
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    province: String
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
staffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
staffSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate employee code
staffSchema.statics.generateEmployeeCode = async function(operatorId) {
  const count = await this.countDocuments({ operatorId });
  const code = `EMP${String(count + 1).padStart(6, '0')}`;
  return code;
};

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
