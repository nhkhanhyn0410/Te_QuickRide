import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Recipient
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  recipientType: {
    type: String,
    enum: ['user', 'operator', 'staff'],
    required: true
  },

  // Type
  type: {
    type: String,
    enum: [
      'booking_confirmed',
      'booking_cancelled',
      'payment_success',
      'payment_failed',
      'trip_reminder',
      'trip_delayed',
      'trip_cancelled',
      'review_request',
      'operator_approved',
      'operator_rejected',
      'promotion',
      'system'
    ],
    required: true,
    index: true
  },

  // Content
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },

  // Data payload
  data: {
    type: mongoose.Schema.Types.Mixed
    // Can contain bookingId, tripId, etc.
  },

  // Action
  actionUrl: {
    type: String
    // Deep link or URL to navigate to
  },
  actionLabel: {
    type: String
    // Button label like "View Booking", "Rate Trip"
  },

  // Status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },

  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Icon/Image
  icon: {
    type: String
  },
  image: {
    type: String
  },

  // Expiry
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, recipientType: 1 });
notificationSchema.index({ expiresAt: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return this;
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(recipientId, recipientType, type, title, message, data = {}) {
  return this.create({
    recipientId,
    recipientType,
    type,
    title,
    message,
    data,
    priority: 'normal'
  });
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(recipientId, recipientType) {
  return this.countDocuments({
    recipientId,
    recipientType,
    isRead: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(recipientId, recipientType) {
  return this.updateMany(
    {
      recipientId,
      recipientType,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );
};

// Static method to delete expired notifications
notificationSchema.statics.deleteExpired = async function() {
  return this.deleteMany({
    expiresAt: { $lte: new Date() }
  });
};

// Static method to send booking confirmation notification
notificationSchema.statics.sendBookingConfirmation = async function(booking) {
  const Trip = mongoose.model('Trip');
  const trip = await Trip.findById(booking.tripId).populate('routeId');

  return this.create({
    recipientId: booking.customerId,
    recipientType: 'user',
    type: 'booking_confirmed',
    title: 'Đặt vé thành công',
    message: `Vé của bạn cho chuyến ${trip.routeId.routeName} đã được xác nhận. Mã đặt vé: ${booking.bookingCode}`,
    data: {
      bookingId: booking._id,
      bookingCode: booking.bookingCode,
      tripId: trip._id
    },
    actionUrl: `/bookings/${booking._id}`,
    actionLabel: 'Xem chi tiết',
    priority: 'high'
  });
};

// Static method to send trip reminder
notificationSchema.statics.sendTripReminder = async function(booking, hoursBeforeDeparture = 24) {
  const Trip = mongoose.model('Trip');
  const trip = await Trip.findById(booking.tripId).populate('routeId');

  return this.create({
    recipientId: booking.customerId,
    recipientType: 'user',
    type: 'trip_reminder',
    title: 'Nhắc nhở chuyến đi',
    message: `Chuyến ${trip.routeId.routeName} của bạn sẽ khởi hành trong ${hoursBeforeDeparture} giờ nữa.`,
    data: {
      bookingId: booking._id,
      tripId: trip._id,
      departureTime: trip.departureTime
    },
    actionUrl: `/bookings/${booking._id}`,
    actionLabel: 'Xem vé',
    priority: 'high'
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
