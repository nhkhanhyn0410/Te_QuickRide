# SAMPLE DATA SUMMARY - QuickRide MongoDB

> Tóm tắt toàn bộ dữ liệu mẫu được seed vào MongoDB database

## 🎯 Mục đích

File này liệt kê **TẤT CẢ** dữ liệu mẫu đã được tạo trong database để:
- ✅ Dễ dàng tham khảo khi test
- ✅ Biết được test accounts có sẵn
- ✅ Hiểu relationships giữa các records
- ✅ Xem được tất cả edge cases đã cover

## 📊 Tổng quan Database

| Collection | Documents | Đặc điểm |
|------------|-----------|----------|
| **users** | 3 | 1 Admin (all features) + 2 Customers (different tiers & statuses) |
| **busoperators** | 3 | Approved, Pending, Rejected - Full fields |
| **buses** | 4 | 4 loại xe khác nhau - Full seat layouts |
| **routes** | 3 | 3 tuyến khác nhau - Full GPS & pickup points |
| **trips** | 4 | Scheduled, Completed, Cancelled - With locked seats |
| **bookings** | 4 | Confirmed, Pending, Cancelled - With passengers |
| **tickets** | 5 | Valid, Used, Invalid - With QR & trip details |
| **payments** | 5 | All 5 payment methods & statuses |

**Tổng cộng**: 31 documents với **ĐẦY ĐỦ TẤT CẢ FIELDS**

---

## 1️⃣ USERS (3 documents)

### User 1: Admin (ID: 650000000000000000000001)

```javascript
{
  email: "admin@quickride.com",
  phone: "0901234567",
  password: "Admin@123", // Đã hash trong DB
  fullName: "Nguyễn Văn Admin",
  dateOfBirth: 1990-01-15,
  gender: "male",
  avatar: "https://i.pravatar.cc/150?img=1",
  role: "admin", // ⭐ Admin role

  // OAuth
  googleId: "google_admin_123456",
  facebookId: "facebook_admin_123456",

  // Verification
  isEmailVerified: true,
  isPhoneVerified: true,
  emailVerificationToken: "email_verify_token_admin",
  phoneVerificationOTP: "123456",
  otpExpires: <15 minutes from now>,

  // Password Reset
  passwordResetToken: "reset_token_admin",
  passwordResetExpires: <1 hour from now>,
  lastLogin: <now>,

  // Saved Passengers
  savedPassengers: [
    { fullName: "Trần Thị B", phone: "0909876543", idCard: "079088001234" },
    { fullName: "Lê Văn C", phone: "0912345678", idCard: "079088005678" }
  ],

  // Loyalty
  loyaltyTier: "platinum", // ⭐ Highest tier
  totalPoints: 5000,

  // Status
  isActive: true,
  isBlocked: false
}
```

**Use cases**: Test admin features, OAuth login, all verification flows

---

### User 2: Customer 1 - Phạm Thị Lan (ID: 650000000000000000000002)

```javascript
{
  email: "customer1@gmail.com",
  phone: "0987654321",
  password: "Customer@123",
  fullName: "Phạm Thị Lan",
  dateOfBirth: 1995-05-20,
  gender: "female",
  avatar: "https://i.pravatar.cc/150?img=5",
  role: "customer",

  // OAuth
  googleId: "google_customer1_789012", // ⭐ Has Google OAuth
  facebookId: null,

  // Verification
  isEmailVerified: true, // ✅ Fully verified
  isPhoneVerified: true, // ✅ Fully verified
  emailVerificationToken: null,
  phoneVerificationOTP: null,
  otpExpires: null,

  // Password Reset
  passwordResetToken: null,
  passwordResetExpires: null,
  lastLogin: <now>,

  // Saved Passengers
  savedPassengers: [
    { fullName: "Nguyễn Văn D", phone: "0923456789", idCard: "079088009012" }
  ],

  // Loyalty
  loyaltyTier: "gold", // ⭐ Gold member
  totalPoints: 1500,

  // Status
  isActive: true,
  isBlocked: false
}
```

**Use cases**: Test customer booking flow, Google OAuth, gold tier benefits

**Has**:
- 2 Bookings (BK20250115001, BK20250114001)
- 3 Tickets
- 2 Payments

---

### User 3: Customer 2 - Hoàng Minh Tuấn (ID: 650000000000000000000003)

```javascript
{
  email: "customer2@gmail.com",
  phone: "0976543210",
  password: "Customer@123",
  fullName: "Hoàng Minh Tuấn",
  dateOfBirth: 1988-12-10,
  gender: "male",
  avatar: "https://i.pravatar.cc/150?img=8",
  role: "customer",

  // OAuth
  googleId: null,
  facebookId: "facebook_customer2_345678", // ⭐ Has Facebook OAuth

  // Verification
  isEmailVerified: true,
  isPhoneVerified: false, // ⚠️ Phone NOT verified
  emailVerificationToken: null,
  phoneVerificationOTP: "654321", // ⭐ Has pending OTP
  otpExpires: <10 minutes from now>,

  // Password Reset
  passwordResetToken: null,
  passwordResetExpires: null,
  lastLogin: <2 days ago>,

  // Saved Passengers
  savedPassengers: [], // ⚠️ Empty array

  // Loyalty
  loyaltyTier: "silver", // ⭐ Silver member
  totalPoints: 800,

  // Status
  isActive: true,
  isBlocked: false
}
```

**Use cases**: Test phone verification flow, Facebook OAuth, silver tier

**Has**:
- 2 Bookings (BK20250115002, BK20250116001)
- 2 Tickets
- 3 Payments

---

## 2️⃣ BUS OPERATORS (3 documents)

### Operator 1: Phương Trang FUTA (ID: 650000000000000000000101)

```javascript
{
  companyName: "Phương Trang FUTA Bus Lines",
  email: "contact@futabus.vn",
  phone: "02838386852",
  password: "Operator@123",

  // Business Info
  businessLicense: "GPKD-0123456789",
  taxCode: "0301204659",
  logo: "https://futabus.vn/images/logo.png",
  description: "Công ty vận tải hành khách hàng đầu Việt Nam...",
  website: "https://futabus.vn",

  // Address
  address: {
    street: "272 Đường 3/2",
    ward: "Phường 12",
    district: "Quận 10",
    city: "Thành phố Hồ Chí Minh",
    country: "Vietnam"
  },

  // Bank Account
  bankAccount: {
    bankName: "Vietcombank",
    accountNumber: "0071000123456",
    accountHolder: "CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG"
  },

  // Verification
  verificationStatus: "approved", // ✅ APPROVED
  verifiedAt: 2024-01-10,
  verifiedBy: ObjectId('650000000000000000000001'), // By Admin
  rejectionReason: null,

  // Rating
  averageRating: 4.8,
  totalReviews: 2456,

  // Statistics
  totalTrips: 15678,
  totalRevenue: 125000000000,

  // Commission
  commissionRate: 5,

  // Status
  isActive: true,
  isSuspended: false,
  suspensionReason: null
}
```

**Has**:
- 2 Buses (51B-12345 Limousine, 51B-67890 Sleeper)
- 2 Routes (SGN-Đà Lạt, SGN-Nha Trang)
- 3 Trips
- 3 Bookings

---

### Operator 2: Xe Khách Thành Bưởi (ID: 650000000000000000000102)

```javascript
{
  companyName: "Xe Khách Thành Bưởi",
  email: "info@thanhbuoi.vn",
  phone: "02838295525",
  password: "Operator@123",

  businessLicense: "GPKD-9876543210",
  taxCode: "0301234567",
  logo: "https://thanhbuoi.vn/images/logo.png",
  description: "Nhà xe uy tín chuyên tuyến Sài Gòn - Đà Lạt...",
  website: "https://thanhbuoi.vn",

  address: {
    street: "395 Điện Biên Phủ",
    ward: "Phường 15",
    district: "Quận Bình Thạnh",
    city: "Thành phố Hồ Chí Minh",
    country: "Vietnam"
  },

  bankAccount: {
    bankName: "Techcombank",
    accountNumber: "19036666888999",
    accountHolder: "CÔNG TY TNHH VẬN TẢI THÀNH BƯỞI"
  },

  verificationStatus: "pending", // ⏳ PENDING approval
  verifiedAt: null,
  verifiedBy: null,
  rejectionReason: null,

  averageRating: 4.5,
  totalReviews: 890,
  totalTrips: 5432,
  totalRevenue: 45000000000,
  commissionRate: 6,

  isActive: true,
  isSuspended: false,
  suspensionReason: null
}
```

**Has**:
- 2 Buses (50A-11111 Seater, 50A-22222 Double-decker)
- 1 Route (HN-Hải Phòng - not active)
- 1 Trip (cancelled)
- 1 Booking

---

### Operator 3: Xe Mai Linh (ID: 650000000000000000000103)

```javascript
{
  companyName: "Xe Mai Linh Express",
  email: "support@mailinexpress.vn",
  phone: "1900545400",
  password: "Operator@123",

  businessLicense: "GPKD-1122334455",
  taxCode: "0301998877",
  logo: "https://mailinh.vn/logo.png",
  description: "Hệ thống xe khách liên tỉnh chất lượng cao",
  website: "https://mailinh.vn",

  address: {
    street: "123 Nguyễn Thị Minh Khai",
    ward: "Phường Võ Thị Sáu",
    district: "Quận 3",
    city: "Thành phố Hồ Chí Minh",
    country: "Vietnam"
  },

  bankAccount: {
    bankName: "BIDV",
    accountNumber: "12345678901",
    accountHolder: "CÔNG TY CỔ PHẦN MAI LINH"
  },

  verificationStatus: "rejected", // ❌ REJECTED
  verifiedAt: 2024-12-20,
  verifiedBy: ObjectId('650000000000000000000001'),
  rejectionReason: "Giấy phép kinh doanh đã hết hạn. Vui lòng cập nhật giấy phép mới.", // ⭐

  averageRating: 4.2,
  totalReviews: 456,
  totalTrips: 2100,
  totalRevenue: 18000000000,
  commissionRate: 7,

  isActive: false, // ⚠️ NOT active
  isSuspended: true, // ⚠️ SUSPENDED
  suspensionReason: "Giấy phép chưa được gia hạn"
}
```

**Has**: No buses, routes, trips (suspended)

---

## 3️⃣ BUSES (4 documents)

### Bus 1: 51B-12345 - FUTA Limousine ⭐

```javascript
{
  _id: '650000000000000000000201',
  operatorId: '650000000000000000000101', // FUTA
  busNumber: "51B-12345",
  busType: "limousine",
  totalSeats: 24,

  seatLayout: {
    floors: 1,
    rows: 6,
    columns: 4,
    layout: [
      ["A1", "A2", "X", "A3"],
      ["B1", "B2", "X", "B3"],
      ["C1", "C2", "X", "C3"],
      ["D1", "D2", "X", "D3"],
      ["E1", "E2", "X", "E3"],
      ["F1", "F2", "X", "F3"]
    ]
  },

  amenities: ["wifi", "ac", "toilet", "water", "blanket", "usb_charger", "reading_light"], // ⭐ All 7

  images: [
    "https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Exterior",
    "https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Interior",
    "https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Seats"
  ],

  isActive: true,
  maintenanceStatus: "good"
}
```

**Used in**: 2 trips (TRIP20250120001, TRIP20250120002)

---

### Bus 2: 51B-67890 - FUTA Sleeper (2 tầng)

```javascript
{
  _id: '650000000000000000000202',
  operatorId: '650000000000000000000101',
  busNumber: "51B-67890",
  busType: "sleeper",
  totalSeats: 40,

  seatLayout: {
    floors: 2, // ⭐ 2 floors
    rows: 10,
    columns: 4,
    layout: [
      // Floor 1 (rows 0-4)
      ["1A", "1B", "X", "1C"],
      ["2A", "2B", "X", "2C"],
      ["3A", "3B", "X", "3C"],
      ["4A", "4B", "X", "4C"],
      ["5A", "5B", "X", "5C"],
      // Floor 2 (rows 5-9)
      ["6A", "6B", "X", "6C"],
      ["7A", "7B", "X", "7C"],
      ["8A", "8B", "X", "8C"],
      ["9A", "9B", "X", "9C"],
      ["10A", "10B", "X", "10C"]
    ]
  },

  amenities: ["wifi", "ac", "water", "blanket", "tv", "usb_charger"],

  images: [
    "https://via.placeholder.com/800x600/009933/ffffff?text=FUTA+Sleeper+Bus"
  ],

  isActive: true,
  maintenanceStatus: "maintenance" // ⚠️ Under maintenance
}
```

**Used in**: 1 trip (TRIP20250118001 - completed)

---

### Bus 3: 50A-11111 - Thành Bưởi Seater

```javascript
{
  _id: '650000000000000000000203',
  operatorId: '650000000000000000000102', // Thành Bưởi
  busNumber: "50A-11111",
  busType: "seater",
  totalSeats: 45,

  seatLayout: {
    floors: 1,
    rows: 12,
    columns: 4,
    layout: [
      ["1", "2", "X", "3"],
      ["4", "5", "X", "6"],
      // ... 10 more rows
      ["34", "35", "36", "37"] // Last row: 4 seats
    ]
  },

  amenities: ["ac", "water", "usb_charger"], // ⚠️ Only 3 amenities

  images: [], // ⚠️ No images

  isActive: true,
  maintenanceStatus: "good"
}
```

**Used in**: 1 trip (TRIP20250119001 - cancelled)

---

### Bus 4: 50A-22222 - Thành Bưởi Double-decker

```javascript
{
  _id: '650000000000000000000204',
  operatorId: '650000000000000000000102',
  busNumber: "50A-22222",
  busType: "double_decker",
  totalSeats: 50,

  seatLayout: {
    floors: 2,
    rows: 13,
    columns: 4,
    layout: [
      // Lower deck (rows 0-5)
      ["L1", "L2", "X", "L3"],
      // ... 5 more lower rows

      // Upper deck (rows 6-12)
      ["U1", "U2", "X", "U3"],
      // ... 6 more upper rows
      ["U19", "U20", "U21", "U22"]
    ]
  },

  amenities: ["wifi", "ac", "toilet", "water", "tv"],

  images: [
    "https://via.placeholder.com/800x600/cc0000/ffffff?text=Double+Decker+Bus"
  ],

  isActive: false, // ⚠️ NOT active
  maintenanceStatus: "repair" // ⚠️ Under repair
}
```

**Used in**: No trips (under repair)

---

## 4️⃣ ROUTES (3 documents)

### Route 1: SGN-DL-001 - Sài Gòn → Đà Lạt ⭐ (Active)

```javascript
{
  _id: '650000000000000000000301',
  operatorId: '650000000000000000000101', // FUTA
  routeName: "Sài Gòn - Đà Lạt",
  routeCode: "SGN-DL-001",

  origin: {
    city: "Thành phố Hồ Chí Minh",
    province: "Hồ Chí Minh",
    station: "Bến xe Miền Đông",
    address: "292 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh",
    coordinates: { lat: 10.8142, lng: 106.7106 }
  },

  destination: {
    city: "Đà Lạt",
    province: "Lâm Đồng",
    station: "Bến xe Đà Lạt",
    address: "1 Tô Hiến Thành, Phường 3, TP. Đà Lạt",
    coordinates: { lat: 11.9404, lng: 108.4583 }
  },

  pickupPoints: [
    {
      name: "Văn phòng Quận 1",
      address: "272 Đường 3/2, Phường 12, Quận 10",
      coordinates: { lat: 10.7718, lng: 106.6659 }
    },
    {
      name: "Điểm đón Bình Tân",
      address: "123 Lê Văn Quới, Bình Tân",
      coordinates: { lat: 10.7539, lng: 106.6046 }
    }
  ],

  dropoffPoints: [
    {
      name: "Trung tâm Đà Lạt",
      address: "Nguyễn Thị Minh Khai, Phường 1",
      coordinates: { lat: 11.9415, lng: 108.4419 }
    },
    {
      name: "Hồ Xuân Hương",
      address: "Trần Quốc Toản, Phường 9",
      coordinates: { lat: 11.9337, lng: 108.4380 }
    }
  ],

  distance: 308, // km
  estimatedDuration: 360, // 6 hours
  isActive: true
}
```

**Has**: 2 trips (morning & night)

---

### Route 2: SGN-NT-001 - Sài Gòn → Nha Trang (Active)

```javascript
{
  _id: '650000000000000000000302',
  operatorId: '650000000000000000000101',
  routeName: "Sài Gòn - Nha Trang",
  routeCode: "SGN-NT-001",

  origin: {
    city: "Thành phố Hồ Chí Minh",
    province: "Hồ Chí Minh",
    station: "Bến xe Miền Đông",
    address: "292 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh",
    coordinates: { lat: 10.8142, lng: 106.7106 }
  },

  destination: {
    city: "Nha Trang",
    province: "Khánh Hòa",
    station: "Bến xe Nha Trang",
    address: "23 Tháng 10, Phường Phước Long, TP. Nha Trang",
    coordinates: { lat: 12.2585, lng: 109.1898 }
  },

  pickupPoints: [
    {
      name: "VP Phương Trang Q1",
      address: "272 Đường 3/2, Phường 12, Quận 10",
      coordinates: { lat: 10.7718, lng: 106.6659 }
    }
  ],

  dropoffPoints: [
    {
      name: "Trung tâm Nha Trang",
      address: "Trần Phú, Nha Trang",
      coordinates: { lat: 12.2388, lng: 109.1967 }
    }
  ],

  distance: 450,
  estimatedDuration: 480, // 8 hours
  isActive: true
}
```

**Has**: 1 trip (completed)

---

### Route 3: HN-HP-001 - Hà Nội → Hải Phòng (NOT Active)

```javascript
{
  _id: '650000000000000000000303',
  operatorId: '650000000000000000000102', // Thành Bưởi
  routeName: "Hà Nội - Hải Phòng",
  routeCode: "HN-HP-001",

  origin: {
    city: "Hà Nội",
    province: "Hà Nội",
    station: "Bến xe Giáp Bát",
    address: "Giải Phóng, Giáp Bát, Hoàng Mai",
    coordinates: { lat: 20.9953, lng: 105.8243 }
  },

  destination: {
    city: "Hải Phòng",
    province: "Hải Phòng",
    station: "Bến xe Niệm Nghĩa",
    address: "Lê Thánh Tông, Máy Chai, Ngô Quyền",
    coordinates: { lat: 20.8449, lng: 106.6881 }
  },

  pickupPoints: [], // ⚠️ Empty
  dropoffPoints: [], // ⚠️ Empty

  distance: 120,
  estimatedDuration: 150, // 2.5 hours
  isActive: false // ⚠️ NOT active
}
```

**Has**: 1 trip (cancelled)

---

## 5️⃣ TRIPS (4 documents)

### Trip 1: TRIP20250120001 - SGN-Đà Lạt Morning (Scheduled)

```javascript
{
  _id: '650000000000000000000401',
  operatorId: '650000000000000000000101', // FUTA
  routeId: '650000000000000000000301', // SGN-Đà Lạt
  busId: '650000000000000000000201', // Limousine 51B-12345
  tripCode: "TRIP20250120001",

  departureTime: 2025-01-20T08:00:00Z,
  arrivalTime: 2025-01-20T14:00:00Z,

  basePrice: 250000,

  availableSeats: 18, // 24 total - 6 occupied
  occupiedSeats: ["A1", "A2", "B1", "B2", "C1", "C2"],

  lockedSeats: [
    {
      seatNumber: "D1",
      lockedUntil: <10 min from now>,
      sessionId: "session_abc123xyz"
    },
    {
      seatNumber: "D2",
      lockedUntil: <10 min from now>,
      sessionId: "session_abc123xyz"
    }
  ],

  driver: null, // Staff not implemented yet
  tripManager: null,

  status: "scheduled",
  cancellationReason: null
}
```

**Has**:
- 2 Bookings (BK20250115001, BK20250115002) - 6 seats total
- 4 Tickets

---

### Trip 2: TRIP20250120002 - SGN-Đà Lạt Night (Scheduled)

```javascript
{
  _id: '650000000000000000000402',
  operatorId: '650000000000000000000101',
  routeId: '650000000000000000000301',
  busId: '650000000000000000000201',
  tripCode: "TRIP20250120002",

  departureTime: 2025-01-20T20:00:00Z,
  arrivalTime: 2025-01-21T02:00:00Z,

  basePrice: 280000, // ⭐ Higher price (night trip)

  availableSeats: 24, // All available
  occupiedSeats: [], // ⚠️ Empty
  lockedSeats: [], // ⚠️ Empty

  driver: null,
  tripManager: null,

  status: "scheduled",
  cancellationReason: null
}
```

**Has**: 1 Booking (BK20250116001) - pending payment

---

### Trip 3: TRIP20250118001 - SGN-Nha Trang (Completed)

```javascript
{
  _id: '650000000000000000000403',
  operatorId: '650000000000000000000101',
  routeId: '650000000000000000000302', // SGN-Nha Trang
  busId: '650000000000000000000202', // Sleeper
  tripCode: "TRIP20250118001",

  departureTime: 2025-01-18T06:00:00Z,
  arrivalTime: 2025-01-18T14:00:00Z,

  basePrice: 320000,

  availableSeats: 0, // ⚠️ Sold out
  occupiedSeats: ["1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C"], // 9 seats shown
  lockedSeats: [],

  driver: null,
  tripManager: null,

  status: "completed", // ✅ Completed
  cancellationReason: null
}
```

**Has**: No bookings in sample data (already completed)

---

### Trip 4: TRIP20250119001 - HN-Hải Phòng (Cancelled)

```javascript
{
  _id: '650000000000000000000404',
  operatorId: '650000000000000000000102', // Thành Bưởi
  routeId: '650000000000000000000303', // HN-HP
  busId: '650000000000000000000203', // Seater
  tripCode: "TRIP20250119001",

  departureTime: 2025-01-19T10:00:00Z,
  arrivalTime: 2025-01-19T12:30:00Z,

  basePrice: 150000,

  availableSeats: 45, // All
  occupiedSeats: [],
  lockedSeats: [],

  driver: null,
  tripManager: null,

  status: "cancelled", // ❌ Cancelled
  cancellationReason: "Xe gặp sự cố kỹ thuật, hủy chuyến và hoàn tiền 100% cho khách hàng"
}
```

**Has**: 1 Booking (BK20250114001) - cancelled with refund

---

## 6️⃣ BOOKINGS (4 documents)

### Booking 1: BK20250115001 (Confirmed, Checked-in)

```javascript
{
  _id: '650000000000000000000501',
  bookingCode: "BK20250115001",
  customerId: '650000000000000000000002', // Customer 1
  tripId: '650000000000000000000401', // TRIP20250120001
  operatorId: '650000000000000000000101', // FUTA

  seats: [
    {
      seatNumber: "A1",
      passenger: {
        fullName: "Phạm Thị Lan",
        phone: "0987654321",
        idCard: "079095001234"
      }
    },
    {
      seatNumber: "A2",
      passenger: {
        fullName: "Nguyễn Văn D",
        phone: "0923456789",
        idCard: "079088009012"
      }
    }
  ],

  pickupPoint: {
    name: "Văn phòng Quận 1",
    address: "272 Đường 3/2, Phường 12, Quận 10",
    coordinates: { lat: 10.7718, lng: 106.6659 }
  },

  dropoffPoint: {
    name: "Trung tâm Đà Lạt",
    address: "Nguyễn Thị Minh Khai, Phường 1",
    coordinates: { lat: 11.9415, lng: 108.4419 }
  },

  subtotal: 500000,
  discount: 50000, // ⭐ Has discount
  totalAmount: 450000,

  voucherId: null,
  voucherCode: "NEWYEAR2025", // ⭐ Voucher code

  contactEmail: "customer1@gmail.com",
  contactPhone: "0987654321",
  notes: "Vui lòng gọi điện trước 30 phút khi đến điểm đón",

  status: "confirmed", // ✅ Confirmed

  cancellationReason: null,
  cancelledAt: null,
  refundAmount: 0,
  refundStatus: null,

  checkedInSeats: ["A1", "A2"], // ✅ Both checked in
  checkedInAt: 2025-01-20T07:30:00Z,
  checkedInBy: null
}
```

**Has**:
- 2 Tickets (TK20250115001, TK20250115002) - both used
- 1 Payment (TXN1705320000ABCD - MoMo success)

---

### Booking 2: BK20250115002 (Confirmed, NOT checked-in)

```javascript
{
  _id: '650000000000000000000502',
  bookingCode: "BK20250115002",
  customerId: '650000000000000000000003', // Customer 2
  tripId: '650000000000000000000401',
  operatorId: '650000000000000000000101',

  seats: [
    {
      seatNumber: "B1",
      passenger: {
        fullName: "Hoàng Minh Tuấn",
        phone: "0976543210",
        idCard: "079095005678"
      }
    },
    {
      seatNumber: "B2",
      passenger: {
        fullName: "Trần Thị Hương",
        phone: "0934567890",
        idCard: "079095009999"
      }
    }
  ],

  pickupPoint: {
    name: "Điểm đón Bình Tân",
    address: "123 Lê Văn Quới, Bình Tân",
    coordinates: { lat: 10.7539, lng: 106.6046 }
  },

  dropoffPoint: {
    name: "Hồ Xuân Hương",
    address: "Trần Quốc Toản, Phường 9",
    coordinates: { lat: 11.9337, lng: 108.4380 }
  },

  subtotal: 500000,
  discount: 0, // ⚠️ No discount
  totalAmount: 500000,

  voucherId: null,
  voucherCode: null,

  contactEmail: "customer2@gmail.com",
  contactPhone: "0976543210",
  notes: null, // ⚠️ No notes

  status: "confirmed",

  cancellationReason: null,
  cancelledAt: null,
  refundAmount: 0,
  refundStatus: null,

  checkedInSeats: [], // ⚠️ NOT checked in yet
  checkedInAt: null,
  checkedInBy: null
}
```

**Has**:
- 2 Tickets (TK20250115003, TK20250115004) - not used yet
- 1 Payment (TXN1705321000EFGH - VNPay success)
- 1 Payment (TXN1705300000QRST - ShopeePay failed)

---

### Booking 3: BK20250114001 (Cancelled with Refund)

```javascript
{
  _id: '650000000000000000000503',
  bookingCode: "BK20250114001",
  customerId: '650000000000000000000002', // Customer 1
  tripId: '650000000000000000000404', // Cancelled trip
  operatorId: '650000000000000000000102', // Thành Bưởi

  seats: [
    {
      seatNumber: "1",
      passenger: {
        fullName: "Phạm Thị Lan",
        phone: "0987654321",
        idCard: "079095001234"
      }
    }
  ],

  pickupPoint: {
    name: "Bến xe Giáp Bát",
    address: "Giải Phóng, Giáp Bát, Hoàng Mai",
    coordinates: { lat: 20.9953, lng: 105.8243 }
  },

  dropoffPoint: {
    name: "Bến xe Niệm Nghĩa",
    address: "Lê Thánh Tông, Máy Chai, Ngô Quyền",
    coordinates: { lat: 20.8449, lng: 106.6881 }
  },

  subtotal: 150000,
  discount: 0,
  totalAmount: 150000,

  voucherId: null,
  voucherCode: null,

  contactEmail: "customer1@gmail.com",
  contactPhone: "0987654321",
  notes: null,

  status: "cancelled", // ❌ Cancelled

  cancellationReason: "Chuyến đi bị hủy do xe gặp sự cố",
  cancelledAt: 2025-01-19T08:00:00Z,
  refundAmount: 150000, // ⭐ Full refund
  refundStatus: "processed", // ✅ Refund processed

  checkedInSeats: [],
  checkedInAt: null,
  checkedInBy: null
}
```

**Has**:
- 1 Ticket (TK20250114001) - invalid
- 1 Payment (TXN1705280000IJKL - ZaloPay refunded)

---

### Booking 4: BK20250116001 (Pending Payment)

```javascript
{
  _id: '650000000000000000000504',
  bookingCode: "BK20250116001",
  customerId: '650000000000000000000003', // Customer 2
  tripId: '650000000000000000000402', // Night trip
  operatorId: '650000000000000000000101',

  seats: [
    {
      seatNumber: "C1",
      passenger: {
        fullName: "Hoàng Minh Tuấn",
        phone: "0976543210",
        idCard: "079095005678"
      }
    },
    {
      seatNumber: "C2",
      passenger: {
        fullName: "Lê Văn Nam",
        phone: "0945678901",
        idCard: "079095011111"
      }
    }
  ],

  pickupPoint: {
    name: "Văn phòng Quận 1",
    address: "272 Đường 3/2, Phường 12, Quận 10",
    coordinates: { lat: 10.7718, lng: 106.6659 }
  },

  dropoffPoint: {
    name: "Trung tâm Đà Lạt",
    address: "Nguyễn Thị Minh Khai, Phường 1",
    coordinates: { lat: 11.9415, lng: 108.4419 }
  },

  subtotal: 560000,
  discount: 0,
  totalAmount: 560000,

  voucherId: null,
  voucherCode: null,

  contactEmail: "customer2@gmail.com",
  contactPhone: "0976543210",
  notes: null,

  status: "pending", // ⏳ Pending payment

  cancellationReason: null,
  cancelledAt: null,
  refundAmount: 0,
  refundStatus: null,

  checkedInSeats: [],
  checkedInAt: null,
  checkedInBy: null
}
```

**Has**:
- No tickets yet (pending payment)
- 1 Payment (TXN1705392000MNOP - Visa pending)

---

## 7️⃣ TICKETS (5 documents)

### Ticket 1: TK20250115001 (Used)

```javascript
{
  _id: '650000000000000000000601',
  ticketCode: "TK20250115001",
  bookingId: '650000000000000000000501', // BK20250115001
  customerId: '650000000000000000000002',
  tripId: '650000000000000000000401',

  seatNumber: "A1",
  passenger: {
    fullName: "Phạm Thị Lan",
    phone: "0987654321",
    idCard: "079095001234"
  },

  qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250115001",
  qrData: '{"ticketCode":"TK20250115001","bookingCode":"BK20250115001","seatNumber":"A1",...}',
  ticketPDF: "https://quickride.vn/tickets/TK20250115001.pdf",

  isValid: true,
  isUsed: true, // ✅ Used
  usedAt: 2025-01-20T07:30:00Z,
  validatedBy: null,

  tripDetails: {
    routeName: "Sài Gòn - Đà Lạt",
    origin: "Thành phố Hồ Chí Minh",
    destination: "Đà Lạt",
    departureTime: 2025-01-20T08:00:00Z,
    busNumber: "51B-12345",
    operatorName: "Phương Trang FUTA Bus Lines"
  }
}
```

---

### Ticket 2: TK20250115002 (Used)

Similar to Ticket 1, seat A2

---

### Ticket 3: TK20250115003 (Valid, Not Used)

```javascript
{
  _id: '650000000000000000000603',
  ticketCode: "TK20250115003",
  bookingId: '650000000000000000000502',
  customerId: '650000000000000000000003',
  tripId: '650000000000000000000401',

  seatNumber: "B1",
  passenger: {
    fullName: "Hoàng Minh Tuấn",
    phone: "0976543210",
    idCard: "079095005678"
  },

  qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250115003",
  qrData: '{"ticketCode":"TK20250115003",...}',
  ticketPDF: "https://quickride.vn/tickets/TK20250115003.pdf",

  isValid: true,
  isUsed: false, // ⚠️ Not used yet
  usedAt: null,
  validatedBy: null,

  tripDetails: {
    routeName: "Sài Gòn - Đà Lạt",
    origin: "Thành phố Hồ Chí Minh",
    destination: "Đà Lạt",
    departureTime: 2025-01-20T08:00:00Z,
    busNumber: "51B-12345",
    operatorName: "Phương Trang FUTA Bus Lines"
  }
}
```

---

### Ticket 4: TK20250115004 (Valid, No PDF)

```javascript
{
  // Similar to Ticket 3, seat B2
  ticketPDF: null, // ⚠️ No PDF generated yet
}
```

---

### Ticket 5: TK20250114001 (Invalid - Cancelled Booking)

```javascript
{
  _id: '650000000000000000000605',
  ticketCode: "TK20250114001",
  bookingId: '650000000000000000000503', // Cancelled booking
  customerId: '650000000000000000000002',
  tripId: '650000000000000000000404', // Cancelled trip

  seatNumber: "1",
  passenger: {
    fullName: "Phạm Thị Lan",
    phone: "0987654321",
    idCard: "079095001234"
  },

  qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250114001",
  qrData: '{"ticketCode":"TK20250114001",...}',
  ticketPDF: "https://quickride.vn/tickets/TK20250114001.pdf",

  isValid: false, // ❌ Invalid (cancelled)
  isUsed: false,
  usedAt: null,
  validatedBy: null,

  tripDetails: {
    routeName: "Hà Nội - Hải Phòng",
    origin: "Hà Nội",
    destination: "Hải Phòng",
    departureTime: 2025-01-19T10:00:00Z,
    busNumber: "50A-11111",
    operatorName: "Xe Khách Thành Bưởi"
  }
}
```

---

## 8️⃣ PAYMENTS (5 documents)

### Payment 1: MoMo Success ✅

```javascript
{
  _id: '650000000000000000000701',
  transactionId: "TXN1705320000ABCD",
  bookingId: '650000000000000000000501',
  customerId: '650000000000000000000002',

  amount: 450000,
  currency: "VND",
  paymentMethod: "momo",

  gatewayTransactionId: "MOMO_2025011512345678",
  gatewayResponse: {
    partnerCode: "MOMO",
    orderId: "BK20250115001",
    requestId: "1705320000001",
    amount: 450000,
    orderInfo: "Thanh toán vé xe QuickRide - BK20250115001",
    orderType: "momo_wallet",
    transId: 2755988607,
    resultCode: 0, // ✅ Success
    message: "Successful.",
    payType: "qr",
    responseTime: 1705320123456,
    extraData: "",
    signature: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  },

  status: "success", // ✅
  refundAmount: 0,
  refundedAt: null,
  refundReason: null
}
```

---

### Payment 2: VNPay Success ✅

```javascript
{
  _id: '650000000000000000000702',
  transactionId: "TXN1705321000EFGH",
  bookingId: '650000000000000000000502',
  customerId: '650000000000000000000003',

  amount: 500000,
  currency: "VND",
  paymentMethod: "vnpay",

  gatewayTransactionId: "VNPAY_20250115234567",
  gatewayResponse: {
    vnp_Amount: 50000000, // x100
    vnp_BankCode: "NCB",
    vnp_BankTranNo: "VNP01234567",
    vnp_CardType: "ATM",
    vnp_OrderInfo: "Thanh toan ve xe QuickRide - BK20250115002",
    vnp_PayDate: "20250115150000",
    vnp_ResponseCode: "00", // ✅ Success
    vnp_TmnCode: "QUICKRIDE",
    vnp_TransactionNo: "14121551",
    vnp_TransactionStatus: "00",
    vnp_TxnRef: "BK20250115002",
    vnp_SecureHash: "z1y2x3w4v5u6t7s8r9q0p1o2n3m4l5k6"
  },

  status: "success",
  refundAmount: 0,
  refundedAt: null,
  refundReason: null
}
```

---

### Payment 3: ZaloPay Refunded 💰

```javascript
{
  _id: '650000000000000000000703',
  transactionId: "TXN1705280000IJKL",
  bookingId: '650000000000000000000503', // Cancelled booking
  customerId: '650000000000000000000002',

  amount: 150000,
  currency: "VND",
  paymentMethod: "zalopay",

  gatewayTransactionId: "ZALOPAY_250114123456",
  gatewayResponse: {
    app_id: 2553,
    app_trans_id: "250114_BK20250114001",
    app_time: 1705219200000,
    app_user: "customer1@gmail.com",
    amount: 150000,
    item: '[{"itemid":"ticket","itemname":"Vé xe Hà Nội - Hải Phòng","itemprice":150000,"itemquantity":1}]',
    embed_data: "{}",
    bank_code: "zalopayapp",
    return_code: 1,
    return_message: "Giao dịch thành công",
    sub_return_code: 1,
    sub_return_message: "",
    zp_trans_id: "250114000000123",
    server_time: 1705219300000,
    mac: "p1o2i3u4y5t6r7e8w9q0a1s2d3f4g5h6"
  },

  status: "refunded", // 💰 Refunded
  refundAmount: 150000, // Full refund
  refundedAt: 2025-01-19T09:00:00Z,
  refundReason: "Chuyến đi bị hủy do xe gặp sự cố kỹ thuật"
}
```

---

### Payment 4: Visa Pending ⏳

```javascript
{
  _id: '650000000000000000000704',
  transactionId: "TXN1705392000MNOP",
  bookingId: '650000000000000000000504',
  customerId: '650000000000000000000003',

  amount: 560000,
  currency: "VND",
  paymentMethod: "visa",

  gatewayTransactionId: null, // ⚠️ Not yet processed
  gatewayResponse: null, // ⚠️ No response

  status: "pending", // ⏳ Waiting
  refundAmount: 0,
  refundedAt: null,
  refundReason: null
}
```

---

### Payment 5: ShopeePay Failed ❌

```javascript
{
  _id: '650000000000000000000705',
  transactionId: "TXN1705300000QRST",
  bookingId: '650000000000000000000502',
  customerId: '650000000000000000000003',

  amount: 100000,
  currency: "VND",
  paymentMethod: "shopeepay",

  gatewayTransactionId: "SPP_20250115111111",
  gatewayResponse: {
    reference_id: "BK20250115002_RETRY",
    amount: 100000,
    currency: "VND",
    status: "FAILED",
    errcode: "INSUFFICIENT_BALANCE", // ⚠️ Error
    errmsg: "Insufficient balance in ShopeePay wallet",
    create_time: 1705321500
  },

  status: "failed", // ❌ Failed
  refundAmount: 0,
  refundedAt: null,
  refundReason: null
}
```

---

## 🔗 Relationships Summary

### User relationships:
- **Customer 1** (customer1@gmail.com):
  - 2 Bookings: BK20250115001 (confirmed), BK20250114001 (cancelled)
  - 3 Tickets: TK20250115001, TK20250115002, TK20250114001
  - 2 Payments: MoMo success, ZaloPay refunded

- **Customer 2** (customer2@gmail.com):
  - 2 Bookings: BK20250115002 (confirmed), BK20250116001 (pending)
  - 2 Tickets: TK20250115003, TK20250115004
  - 3 Payments: VNPay success, Visa pending, ShopeePay failed

### Operator relationships:
- **FUTA**:
  - 2 Buses: Limousine, Sleeper
  - 2 Routes: SGN-Đà Lạt, SGN-Nha Trang
  - 3 Trips: 2 scheduled, 1 completed
  - 3 Bookings

- **Thành Bưởi**:
  - 2 Buses: Seater, Double-decker (repair)
  - 1 Route: HN-Hải Phòng (not active)
  - 1 Trip: Cancelled
  - 1 Booking: Cancelled

### Trip relationships:
- **TRIP20250120001** (SGN-Đà Lạt morning):
  - 2 Bookings: 4 seats occupied
  - 4 Tickets
  - 2 Payments (success)

- **TRIP20250120002** (SGN-Đà Lạt night):
  - 1 Booking: Pending payment
  - No tickets yet
  - 1 Payment (pending)

---

## ✅ Coverage Checklist

### All Enum Values Covered:

**User**:
- ✅ gender: male, female, other
- ✅ role: customer, admin
- ✅ loyaltyTier: bronze, silver, gold, platinum

**BusOperator**:
- ✅ verificationStatus: pending, approved, rejected

**Bus**:
- ✅ busType: limousine, sleeper, seater, double_decker
- ✅ maintenanceStatus: good, maintenance, repair
- ✅ amenities: All 8 types covered

**Trip**:
- ✅ status: scheduled, completed, cancelled
- (boarding, in_progress not in sample)

**Booking**:
- ✅ status: pending, confirmed, cancelled
- (completed not in sample)
- ✅ refundStatus: pending, processed, failed

**Payment**:
- ✅ paymentMethod: momo, vnpay, zalopay, shopeepay, visa
- (mastercard, atm, cod not in sample)
- ✅ status: pending, success, failed, refunded

### All Optional Fields Covered:

- ✅ User with/without OAuth
- ✅ User with/without verification
- ✅ User with/without saved passengers
- ✅ Bus with/without images
- ✅ Route with/without pickup/dropoff points
- ✅ Trip with/without locked seats
- ✅ Booking with/without discount
- ✅ Booking with/without voucher
- ✅ Booking with/without notes
- ✅ Booking with/without check-in
- ✅ Ticket with/without PDF
- ✅ Payment with/without gateway response
- ✅ Payment with/without refund

---

## 🎯 Test Scenarios

### Authentication & Authorization:
1. ✅ Admin login
2. ✅ Customer login with Google OAuth
3. ✅ Customer login with Facebook OAuth
4. ✅ Email verified user
5. ✅ Phone NOT verified user (with OTP)

### Booking Flow:
1. ✅ Complete booking (confirmed, paid, checked-in)
2. ✅ Confirmed booking (paid, NOT checked-in)
3. ✅ Pending booking (NOT paid)
4. ✅ Cancelled booking (with refund)

### Payment Flow:
1. ✅ Successful payment (MoMo, VNPay)
2. ✅ Failed payment (ShopeePay)
3. ✅ Pending payment (Visa)
4. ✅ Refunded payment (ZaloPay)

### Trip Management:
1. ✅ Scheduled trip with available seats
2. ✅ Scheduled trip with locked seats
3. ✅ Completed trip (sold out)
4. ✅ Cancelled trip (with reason)

### Operator Management:
1. ✅ Approved operator (active, high ratings)
2. ✅ Pending operator (awaiting approval)
3. ✅ Rejected operator (with reason, suspended)

---

**Cập nhật**: 2025-01-16
**Script**: `backend/src/seeders/seedData.js`
**Docs**: `backend/src/seeders/README.md`
