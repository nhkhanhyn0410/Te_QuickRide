# MongoDB Database Schema Design

## Collections Overview

1. **users** - User accounts (Customer, Admin)
2. **bus_operators** - Bus company information
3. **staff** - Bus operator's staff (Drivers, Trip Managers)
4. **routes** - Bus routes/paths
5. **buses** - Vehicle information with seat layouts
6. **trips** - Scheduled trips
7. **bookings** - Booking records
8. **tickets** - E-tickets with QR codes
9. **payments** - Payment transactions
10. **reviews** - Customer reviews and ratings
11. **vouchers** - Discount vouchers
12. **loyalty_points** - Customer loyalty program
13. **notifications** - System notifications
14. **system_logs** - Audit logs

---

## 1. Users Collection

```javascript
{
  _id: ObjectId,
  email: String,              // unique, required
  phone: String,              // unique, required
  password: String,           // hashed with bcrypt
  fullName: String,           // required
  dateOfBirth: Date,
  gender: String,             // enum: ['male', 'female', 'other']
  avatar: String,             // URL
  role: String,               // enum: ['customer', 'admin']

  // OAuth
  googleId: String,
  facebookId: String,

  // Verification
  isEmailVerified: Boolean,   // default: false
  isPhoneVerified: Boolean,   // default: false
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
  loyaltyTier: String,        // enum: ['bronze', 'silver', 'gold', 'platinum']
  totalPoints: Number,        // default: 0

  // Status
  isActive: Boolean,          // default: true
  isBlocked: Boolean,         // default: false

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
users.createIndex({ email: 1 }, { unique: true })
users.createIndex({ phone: 1 }, { unique: true })
users.createIndex({ googleId: 1 })
users.createIndex({ facebookId: 1 })
```

---

## 2. Bus Operators Collection

```javascript
{
  _id: ObjectId,
  companyName: String,        // required, unique
  email: String,              // unique, required
  phone: String,              // required
  password: String,           // hashed

  // Business Info
  businessLicense: String,    // required
  taxCode: String,            // required
  logo: String,               // URL
  description: String,
  website: String,

  // Address
  address: {
    street: String,
    ward: String,
    district: String,
    city: String,
    country: String
  },

  // Bank Info for settlements
  bankAccount: {
    bankName: String,
    accountNumber: String,
    accountHolder: String
  },

  // Approval
  verificationStatus: String, // enum: ['pending', 'approved', 'rejected']
  verifiedAt: Date,
  verifiedBy: ObjectId,       // ref: User (admin)
  rejectionReason: String,

  // Rating
  averageRating: Number,      // default: 0
  totalReviews: Number,       // default: 0

  // Statistics
  totalTrips: Number,
  totalRevenue: Number,

  // Commission
  commissionRate: Number,     // percentage (e.g., 5 = 5%)

  // Status
  isActive: Boolean,          // default: true
  isSuspended: Boolean,       // default: false
  suspensionReason: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
bus_operators.createIndex({ companyName: 1 }, { unique: true })
bus_operators.createIndex({ email: 1 }, { unique: true })
bus_operators.createIndex({ verificationStatus: 1 })
```

---

## 3. Staff Collection

```javascript
{
  _id: ObjectId,
  operatorId: ObjectId,       // ref: BusOperator, required
  staffCode: String,          // unique, required
  fullName: String,           // required
  phone: String,              // required
  email: String,
  password: String,           // hashed

  role: String,               // enum: ['driver', 'trip_manager']

  // Driver specific
  licenseNumber: String,
  licenseExpiry: Date,

  // Status
  isActive: Boolean,          // default: true

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
staff.createIndex({ staffCode: 1 }, { unique: true })
staff.createIndex({ operatorId: 1, role: 1 })
```

---

## 4. Routes Collection

```javascript
{
  _id: ObjectId,
  operatorId: ObjectId,       // ref: BusOperator, required

  routeName: String,          // required (e.g., "Hà Nội - Đà Nẵng")
  routeCode: String,          // unique (e.g., "HN-DN-01")

  // Origin & Destination
  origin: {
    city: String,             // required
    province: String,         // required
    station: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  destination: {
    city: String,             // required
    province: String,         // required
    station: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Pickup & Dropoff Points (within origin/destination areas)
  pickupPoints: [{
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],

  dropoffPoints: [{
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],

  // Route Details
  distance: Number,           // in kilometers
  estimatedDuration: Number,  // in minutes

  // Status
  isActive: Boolean,          // default: true

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
routes.createIndex({ routeCode: 1 }, { unique: true })
routes.createIndex({ operatorId: 1 })
routes.createIndex({ "origin.city": 1, "destination.city": 1 })
```

---

## 5. Buses Collection

```javascript
{
  _id: ObjectId,
  operatorId: ObjectId,       // ref: BusOperator, required

  busNumber: String,          // required (license plate)
  busType: String,            // enum: ['limousine', 'sleeper', 'seater', 'double_decker']

  // Seat Configuration
  totalSeats: Number,         // required
  seatLayout: {
    floors: Number,           // 1 or 2
    rows: Number,
    columns: Number,
    layout: [[String]]        // 2D array, e.g., [["A1","A2"],["B1","B2"]]
  },

  // Amenities
  amenities: [String],        // e.g., ['wifi', 'ac', 'toilet', 'water', 'blanket', 'tv']

  // Images
  images: [String],           // URLs

  // Status
  isActive: Boolean,          // default: true
  maintenanceStatus: String,  // enum: ['good', 'maintenance', 'repair']

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
buses.createIndex({ operatorId: 1 })
buses.createIndex({ busNumber: 1 }, { unique: true })
```

---

## 6. Trips Collection

```javascript
{
  _id: ObjectId,
  operatorId: ObjectId,       // ref: BusOperator, required
  routeId: ObjectId,          // ref: Route, required
  busId: ObjectId,            // ref: Bus, required

  // Trip Code
  tripCode: String,           // unique (e.g., "HN-DN-20250107-001")

  // Schedule
  departureTime: Date,        // required
  arrivalTime: Date,          // required

  // Pricing
  basePrice: Number,          // required

  // Seat Availability
  availableSeats: Number,
  occupiedSeats: [String],    // array of seat numbers
  lockedSeats: [{
    seatNumber: String,
    lockedUntil: Date,
    sessionId: String
  }],

  // Staff Assignment
  driver: ObjectId,           // ref: Staff
  tripManager: ObjectId,      // ref: Staff

  // Status
  status: String,             // enum: ['scheduled', 'boarding', 'in_progress', 'completed', 'cancelled']
  cancellationReason: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
trips.createIndex({ tripCode: 1 }, { unique: true })
trips.createIndex({ operatorId: 1, departureTime: 1 })
trips.createIndex({ routeId: 1, departureTime: 1 })
trips.createIndex({ departureTime: 1, status: 1 })
```

---

## 7. Bookings Collection

```javascript
{
  _id: ObjectId,
  bookingCode: String,        // unique (e.g., "BK20250107001")

  customerId: ObjectId,       // ref: User, required
  tripId: ObjectId,           // ref: Trip, required
  operatorId: ObjectId,       // ref: BusOperator

  // Seats
  seats: [{
    seatNumber: String,
    passenger: {
      fullName: String,
      phone: String,
      idCard: String
    }
  }],

  // Pickup & Dropoff
  pickupPoint: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  dropoffPoint: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Pricing
  subtotal: Number,           // seats * basePrice
  discount: Number,           // from voucher
  totalAmount: Number,        // final amount

  // Voucher
  voucherId: ObjectId,        // ref: Voucher
  voucherCode: String,

  // Contact
  contactEmail: String,
  contactPhone: String,
  notes: String,

  // Status
  status: String,             // enum: ['pending', 'confirmed', 'cancelled', 'completed']

  // Cancellation
  cancellationReason: String,
  cancelledAt: Date,
  refundAmount: Number,
  refundStatus: String,       // enum: ['pending', 'processed', 'failed']

  // Check-in
  checkedInSeats: [String],
  checkedInAt: Date,
  checkedInBy: ObjectId,      // ref: Staff

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
bookings.createIndex({ bookingCode: 1 }, { unique: true })
bookings.createIndex({ customerId: 1 })
bookings.createIndex({ tripId: 1 })
bookings.createIndex({ status: 1 })
```

---

## 8. Tickets Collection

```javascript
{
  _id: ObjectId,
  ticketCode: String,         // unique (e.g., "TK20250107001")
  bookingId: ObjectId,        // ref: Booking, required

  customerId: ObjectId,       // ref: User
  tripId: ObjectId,           // ref: Trip

  seatNumber: String,
  passenger: {
    fullName: String,
    phone: String,
    idCard: String
  },

  // QR Code
  qrCode: String,             // base64 or URL
  qrData: String,             // encrypted data

  // Ticket PDF
  ticketPDF: String,          // URL

  // Validation
  isValid: Boolean,           // default: true
  isUsed: Boolean,            // default: false
  usedAt: Date,
  validatedBy: ObjectId,      // ref: Staff

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
tickets.createIndex({ ticketCode: 1 }, { unique: true })
tickets.createIndex({ bookingId: 1 })
tickets.createIndex({ qrData: 1 })
```

---

## 9. Payments Collection

```javascript
{
  _id: ObjectId,
  transactionId: String,      // unique
  bookingId: ObjectId,        // ref: Booking, required
  customerId: ObjectId,       // ref: User

  // Amount
  amount: Number,             // required
  currency: String,           // default: 'VND'

  // Payment Method
  paymentMethod: String,      // enum: ['momo', 'vnpay', 'zalopay', 'atm', 'visa', 'mastercard', 'cod']

  // Gateway Info
  gatewayTransactionId: String,
  gatewayResponse: Object,

  // Status
  status: String,             // enum: ['pending', 'success', 'failed', 'refunded']

  // Refund
  refundAmount: Number,
  refundedAt: Date,
  refundReason: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
payments.createIndex({ transactionId: 1 }, { unique: true })
payments.createIndex({ bookingId: 1 })
payments.createIndex({ customerId: 1 })
payments.createIndex({ status: 1 })
```

---

## 10. Reviews Collection

```javascript
{
  _id: ObjectId,
  customerId: ObjectId,       // ref: User, required
  tripId: ObjectId,           // ref: Trip, required
  operatorId: ObjectId,       // ref: BusOperator, required
  bookingId: ObjectId,        // ref: Booking, required

  // Rating
  rating: Number,             // 1-5, required

  // Review Content
  title: String,
  comment: String,

  // Categories Rating
  serviceRating: Number,      // 1-5
  driverRating: Number,       // 1-5
  vehicleRating: Number,      // 1-5
  punctualityRating: Number,  // 1-5

  // Images
  images: [String],           // URLs

  // Operator Response
  operatorResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: ObjectId     // ref: BusOperator
  },

  // Status
  isApproved: Boolean,        // default: false (needs moderation)
  isHidden: Boolean,          // default: false

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
reviews.createIndex({ tripId: 1 })
reviews.createIndex({ operatorId: 1 })
reviews.createIndex({ customerId: 1, tripId: 1 }, { unique: true })
```

---

## 11. Vouchers Collection

```javascript
{
  _id: ObjectId,
  code: String,               // unique, required (e.g., "SUMMER2025")

  // Discount
  discountType: String,       // enum: ['percentage', 'fixed']
  discountValue: Number,      // required
  maxDiscount: Number,        // maximum discount amount
  minOrderValue: Number,      // minimum order to apply voucher

  // Validity
  startDate: Date,
  endDate: Date,

  // Usage Limits
  maxUsage: Number,           // total usage limit
  currentUsage: Number,       // default: 0
  maxUsagePerUser: Number,    // per-user limit

  // Applicability
  applicableTo: String,       // enum: ['all', 'specific_operators', 'specific_routes']
  operators: [ObjectId],      // ref: BusOperator
  routes: [ObjectId],         // ref: Route

  // User Targeting
  targetUsers: String,        // enum: ['all', 'new', 'loyalty_tier']
  loyaltyTiers: [String],     // ['bronze', 'silver', 'gold', 'platinum']

  // Status
  isActive: Boolean,          // default: true

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}

// Indexes
vouchers.createIndex({ code: 1 }, { unique: true })
vouchers.createIndex({ isActive: 1, startDate: 1, endDate: 1 })
```

---

## 12. Loyalty Points Collection

```javascript
{
  _id: ObjectId,
  customerId: ObjectId,       // ref: User, required

  // Transaction
  type: String,               // enum: ['earn', 'redeem', 'expire']
  points: Number,             // positive for earn, negative for redeem

  // Source
  sourceType: String,         // enum: ['booking', 'referral', 'promotion', 'manual']
  sourceId: ObjectId,         // ref to Booking, etc.

  // Details
  description: String,

  // Balance (denormalized for quick access)
  balanceBefore: Number,
  balanceAfter: Number,

  // Expiry
  expiresAt: Date,

  // Timestamps
  createdAt: Date
}

// Indexes
loyalty_points.createIndex({ customerId: 1, createdAt: -1 })
loyalty_points.createIndex({ expiresAt: 1 })
```

---

## 13. Notifications Collection

```javascript
{
  _id: ObjectId,
  recipientId: ObjectId,      // ref: User or BusOperator
  recipientType: String,      // enum: ['user', 'operator', 'staff']

  // Content
  title: String,              // required
  message: String,            // required
  type: String,               // enum: ['booking', 'payment', 'trip', 'system', 'promotion']

  // Action
  actionUrl: String,
  actionData: Object,

  // Channels
  channels: [String],         // ['in_app', 'email', 'sms', 'push']

  // Email Status
  emailSent: Boolean,
  emailSentAt: Date,

  // SMS Status
  smsSent: Boolean,
  smsSentAt: Date,

  // Read Status
  isRead: Boolean,            // default: false
  readAt: Date,

  // Timestamps
  createdAt: Date
}

// Indexes
notifications.createIndex({ recipientId: 1, isRead: 1, createdAt: -1 })
```

---

## 14. System Logs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: User, BusOperator, or Staff
  userType: String,           // enum: ['user', 'operator', 'staff', 'admin']

  // Action
  action: String,             // required (e.g., 'login', 'create_booking', 'cancel_booking')
  resource: String,           // resource affected (e.g., 'booking', 'trip')
  resourceId: ObjectId,

  // Request Details
  method: String,             // HTTP method
  endpoint: String,
  ipAddress: String,
  userAgent: String,

  // Response
  statusCode: Number,
  responseTime: Number,       // in milliseconds

  // Error (if any)
  error: {
    message: String,
    stack: String
  },

  // Timestamp
  createdAt: Date
}

// Indexes
system_logs.createIndex({ userId: 1, createdAt: -1 })
system_logs.createIndex({ action: 1, createdAt: -1 })
system_logs.createIndex({ createdAt: -1 })
```

---

## Relationships Summary

```
User (1) -----> (N) Booking
User (1) -----> (N) Review
User (1) -----> (N) LoyaltyPoints
User (1) -----> (N) Notification

BusOperator (1) -----> (N) Route
BusOperator (1) -----> (N) Bus
BusOperator (1) -----> (N) Trip
BusOperator (1) -----> (N) Staff
BusOperator (1) -----> (N) Review

Route (1) -----> (N) Trip
Bus (1) -----> (N) Trip
Trip (1) -----> (N) Booking
Trip (1) -----> (N) Review

Booking (1) -----> (N) Ticket
Booking (1) -----> (1) Payment
Booking (N) -----> (1) Voucher
```

---

## Data Size Estimations

Assuming 100 bus operators, 10,000 active users, 500 trips/day:

- **Users**: ~10,000 documents (~50MB)
- **BusOperators**: ~100 documents (~1MB)
- **Staff**: ~1,000 documents (~5MB)
- **Routes**: ~500 documents (~5MB)
- **Buses**: ~500 documents (~10MB)
- **Trips**: ~182,500/year documents (~1.5GB/year)
- **Bookings**: ~500,000/year documents (~2GB/year)
- **Tickets**: ~1,000,000/year documents (~500MB/year)
- **Payments**: ~500,000/year documents (~1GB/year)
- **Reviews**: ~100,000/year documents (~200MB/year)

**Total**: ~6-7GB/year (manageable for MongoDB)

---

## Performance Optimization

1. **Indexing**: All collections have appropriate indexes
2. **Sharding**: Consider sharding bookings and tickets by date range
3. **Archiving**: Move old trips/bookings (>1 year) to archive collections
4. **Caching**: Use Redis for frequently accessed data (trips, routes)
5. **Aggregation**: Use MongoDB aggregation pipelines for analytics
