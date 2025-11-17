import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Email Settings
  emailProvider: {
    type: String,
    enum: ['smtp', 'sendgrid', 'mailgun'],
    default: 'smtp'
  },
  smtpHost: String,
  smtpPort: Number,
  smtpUser: String,
  smtpPassword: String,
  smtpSecure: {
    type: Boolean,
    default: true
  },
  emailFrom: String,
  emailFromName: String,

  // Payment Settings
  paymentGateway: {
    type: String,
    enum: ['vnpay', 'momo', 'zalopay'],
    default: 'vnpay'
  },
  vnpayTmnCode: String,
  vnpayHashSecret: String,
  vnpayUrl: String,
  momoPartnerCode: String,
  momoAccessKey: String,
  momoSecretKey: String,

  // System Settings
  siteName: {
    type: String,
    default: 'Te_QuickRide'
  },
  siteUrl: String,
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: String,

  // Booking Settings
  bookingTimeout: {
    type: Number,
    default: 15 // minutes
  },
  cancellationDeadline: {
    type: Number,
    default: 24 // hours before departure
  },
  refundPercentage: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  },

  // Commission Settings
  platformCommission: {
    type: Number,
    default: 10, // percentage
    min: 0,
    max: 100
  },

  // Notification Settings
  enableEmailNotifications: {
    type: Boolean,
    default: true
  },
  enableSmsNotifications: {
    type: Boolean,
    default: false
  },
  enablePushNotifications: {
    type: Boolean,
    default: true
  },

  // Other Settings
  defaultLanguage: {
    type: String,
    default: 'vi'
  },
  defaultCurrency: {
    type: String,
    default: 'VND'
  }
}, {
  timestamps: true
});

// Singleton pattern - only one settings document
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
