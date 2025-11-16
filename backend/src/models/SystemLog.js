import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
  // Log Level
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical', 'debug'],
    required: true,
    index: true
  },

  // Category
  category: {
    type: String,
    enum: [
      'auth',
      'booking',
      'payment',
      'user',
      'operator',
      'trip',
      'system',
      'security',
      'api',
      'database'
    ],
    required: true,
    index: true
  },

  // Action
  action: {
    type: String,
    required: true,
    index: true
    // e.g., 'login', 'create_booking', 'payment_success'
  },

  // Message
  message: {
    type: String,
    required: true
  },

  // User/Actor
  userId: {
    type: mongoose.Schema.Types.ObjectId
    // Can be User, BusOperator, or Staff
  },
  userType: {
    type: String,
    enum: ['user', 'operator', 'staff', 'system']
  },
  userName: {
    type: String
  },

  // Request Info
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  requestMethod: {
    type: String
  },
  requestUrl: {
    type: String
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed
  },

  // Response Info
  responseStatus: {
    type: Number
  },
  responseTime: {
    type: Number // in milliseconds
  },

  // Error Info
  error: {
    message: String,
    stack: String,
    code: String
  },

  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
    // Additional context-specific data
  },

  // Resource affected
  resourceType: {
    type: String
    // e.g., 'Booking', 'Trip', 'User'
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },

  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false,
  // Use capped collection for performance (optional)
  capped: { size: 104857600, max: 1000000 } // 100MB, max 1M documents
});

// Indexes
systemLogSchema.index({ timestamp: -1 });
systemLogSchema.index({ level: 1, timestamp: -1 });
systemLogSchema.index({ category: 1, timestamp: -1 });
systemLogSchema.index({ userId: 1, timestamp: -1 });

// Static method to log info
systemLogSchema.statics.info = async function(category, action, message, metadata = {}) {
  return this.create({
    level: 'info',
    category,
    action,
    message,
    metadata,
    timestamp: new Date()
  });
};

// Static method to log warning
systemLogSchema.statics.warning = async function(category, action, message, metadata = {}) {
  return this.create({
    level: 'warning',
    category,
    action,
    message,
    metadata,
    timestamp: new Date()
  });
};

// Static method to log error
systemLogSchema.statics.error = async function(category, action, message, error = null, metadata = {}) {
  const logData = {
    level: 'error',
    category,
    action,
    message,
    metadata,
    timestamp: new Date()
  };

  if (error) {
    logData.error = {
      message: error.message,
      stack: error.stack,
      code: error.code
    };
  }

  return this.create(logData);
};

// Static method to log critical
systemLogSchema.statics.critical = async function(category, action, message, error = null, metadata = {}) {
  const logData = {
    level: 'critical',
    category,
    action,
    message,
    metadata,
    timestamp: new Date()
  };

  if (error) {
    logData.error = {
      message: error.message,
      stack: error.stack,
      code: error.code
    };
  }

  return this.create(logData);
};

// Static method to log user action
systemLogSchema.statics.logUserAction = async function(userId, userType, category, action, message, metadata = {}) {
  return this.create({
    level: 'info',
    category,
    action,
    message,
    userId,
    userType,
    metadata,
    timestamp: new Date()
  });
};

// Static method to log API request
systemLogSchema.statics.logApiRequest = async function(req, res, responseTime) {
  return this.create({
    level: 'info',
    category: 'api',
    action: `${req.method} ${req.path}`,
    message: `API request: ${req.method} ${req.path}`,
    userId: req.user?._id,
    userType: req.userType,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    requestMethod: req.method,
    requestUrl: req.originalUrl,
    responseStatus: res.statusCode,
    responseTime,
    timestamp: new Date()
  });
};

// Static method to delete old logs
systemLogSchema.statics.deleteOldLogs = async function(daysToKeep = 90) {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    timestamp: { $lt: cutoffDate },
    level: { $nin: ['critical', 'error'] } // Keep errors and critical logs
  });
};

const SystemLog = mongoose.model('SystemLog', systemLogSchema);

export default SystemLog;
