# 🌱 HƯỚNG DẪN SEED DỮ LIỆU VÀO MONGODB

> Hướng dẫn từng bước để tạo dữ liệu mẫu đầy đủ vào MongoDB database

## 📋 Tổng quan

Script seed sẽ tạo **31 documents** với **đầy đủ tất cả fields** trong **8 collections**:

| Collection | Documents | Highlights |
|------------|-----------|------------|
| users | 3 | Admin + 2 Customers (OAuth, Loyalty, Verification) |
| busoperators | 3 | Approved, Pending, Rejected |
| buses | 4 | 4 loại xe + Full seat layouts 2D |
| routes | 3 | GPS coordinates + Pickup/Dropoff points |
| trips | 4 | Scheduled, Completed, Cancelled + Locked seats |
| bookings | 4 | Confirmed, Pending, Cancelled + Refund |
| tickets | 5 | QR codes + Trip details (denormalized) |
| payments | 5 | All payment methods + Gateway responses |

---

## ⚡ Quick Start

### Cách 1: Sử dụng npm script (Khuyến nghị)

```bash
# Di chuyển vào thư mục backend
cd backend

# Chạy seeder
npm run seed
```

### Cách 2: Chạy trực tiếp với Node

```bash
# Từ thư mục root
node backend/src/seeders/seedData.js

# Hoặc từ thư mục backend
cd backend
node src/seeders/seedData.js
```

---

## 📝 Yêu cầu trước khi chạy

### 1. MongoDB đang chạy

**Windows**:
```bash
# Kiểm tra service
services.msc
# Tìm "MongoDB Server" và đảm bảo status là "Running"
```

**macOS**:
```bash
# Kiểm tra MongoDB
brew services list | grep mongodb

# Khởi động nếu chưa chạy
brew services start mongodb-community
```

**Linux**:
```bash
# Kiểm tra status
sudo systemctl status mongod

# Khởi động nếu chưa chạy
sudo systemctl start mongod
```

### 2. Dependencies đã được cài đặt

```bash
cd backend
npm install
```

### 3. File .env (Optional)

Tạo file `.env` trong thư mục `backend`:

```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/quickride
```

**Lưu ý**: Nếu không có `.env`, script sẽ tự động dùng `mongodb://localhost:27017/quickride`

---

## 🚀 Chạy Seeder

### Bước 1: Chạy script

```bash
cd backend
npm run seed
```

### Bước 2: Xem output

Script sẽ hiển thị progress:

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing existing data...
✅ Cleared all collections

🔐 Hashing passwords...
✅ Passwords hashed

📝 Inserting sample data...
   → Inserting Users...
   ✅ Inserted 3 users
   → Inserting BusOperators...
   ✅ Inserted 3 bus operators
   → Inserting Buses...
   ✅ Inserted 4 buses
   → Inserting Routes...
   ✅ Inserted 3 routes
   → Inserting Trips...
   ✅ Inserted 4 trips
   → Inserting Bookings...
   ✅ Inserted 4 bookings
   → Inserting Tickets...
   ✅ Inserted 5 tickets
   → Inserting Payments...
   ✅ Inserted 5 payments

============================================================
🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!
============================================================

📊 Summary:
   • Users:        3
   • BusOperators: 3
   • Buses:        4
   • Routes:       3
   • Trips:        4
   • Bookings:     4
   • Tickets:      5
   • Payments:     5

📌 Test Accounts:
   Admin:
     Email: admin@quickride.com
     Password: Admin@123
   Customer 1:
     Email: customer1@gmail.com
     Password: Customer@123
   Customer 2:
     Email: customer2@gmail.com
     Password: Customer@123
   Bus Operator:
     Email: contact@futabus.vn
     Password: Operator@123

✅ You can now open MongoDB Compass to view all fields!

🔌 Disconnected from MongoDB
```

---

## 🔍 Xem kết quả trong MongoDB Compass

### Bước 1: Mở MongoDB Compass

1. Khởi động **MongoDB Compass**
2. Connect tới: `mongodb://localhost:27017`
3. Click vào database `quickride`

### Bước 2: Explore collections

#### Collection: users (3 documents)

Click vào collection `users`, bạn sẽ thấy **TẤT CẢ FIELDS**:

```javascript
{
  "_id": ObjectId("650000000000000000000001"),
  "email": "admin@quickride.com",
  "phone": "0901234567",
  "password": "$2a$10$...", // Hashed
  "fullName": "Nguyễn Văn Admin",
  "dateOfBirth": ISODate("1990-01-15T00:00:00.000Z"),
  "gender": "male",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "role": "admin",

  // OAuth fields
  "googleId": "google_admin_123456",
  "facebookId": "facebook_admin_123456",

  // Verification fields
  "isEmailVerified": true,
  "isPhoneVerified": true,
  "emailVerificationToken": "email_verify_token_admin",
  "phoneVerificationOTP": "123456",
  "otpExpires": ISODate("..."),

  // Password reset fields
  "passwordResetToken": "reset_token_admin",
  "passwordResetExpires": ISODate("..."),
  "lastLogin": ISODate("..."),

  // Saved passengers array
  "savedPassengers": [
    {
      "fullName": "Trần Thị B",
      "phone": "0909876543",
      "idCard": "079088001234"
    },
    {
      "fullName": "Lê Văn C",
      "phone": "0912345678",
      "idCard": "079088005678"
    }
  ],

  // Loyalty program
  "loyaltyTier": "platinum",
  "totalPoints": 5000,

  // Status
  "isActive": true,
  "isBlocked": false,

  // Timestamps
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**→ ✅ TẤT CẢ 25+ FIELDS đều hiển thị!**

#### Collection: buses (4 documents)

Click vào `buses`, xem bus Limousine:

```javascript
{
  "_id": ObjectId("650000000000000000000201"),
  "operatorId": ObjectId("650000000000000000000101"),
  "busNumber": "51B-12345",
  "busType": "limousine",
  "totalSeats": 24,

  // ⭐ Full 2D seat layout
  "seatLayout": {
    "floors": 1,
    "rows": 6,
    "columns": 4,
    "layout": [
      ["A1", "A2", "X", "A3"],
      ["B1", "B2", "X", "B3"],
      ["C1", "C2", "X", "C3"],
      ["D1", "D2", "X", "D3"],
      ["E1", "E2", "X", "E3"],
      ["F1", "F2", "X", "F3"]
    ]
  },

  // ⭐ All amenities
  "amenities": [
    "wifi",
    "ac",
    "toilet",
    "water",
    "blanket",
    "usb_charger",
    "reading_light"
  ],

  "images": [
    "https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Exterior",
    "https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Interior",
    "https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Seats"
  ],

  "isActive": true,
  "maintenanceStatus": "good",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**→ ✅ SEAT LAYOUT 2D ARRAY đầy đủ!**

#### Collection: routes (3 documents)

```javascript
{
  "_id": ObjectId("650000000000000000000301"),
  "operatorId": ObjectId("650000000000000000000101"),
  "routeName": "Sài Gòn - Đà Lạt",
  "routeCode": "SGN-DL-001",

  // ⭐ Full origin with GPS
  "origin": {
    "city": "Thành phố Hồ Chí Minh",
    "province": "Hồ Chí Minh",
    "station": "Bến xe Miền Đông",
    "address": "292 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh",
    "coordinates": {
      "lat": 10.8142,
      "lng": 106.7106
    }
  },

  // ⭐ Full destination with GPS
  "destination": {
    "city": "Đà Lạt",
    "province": "Lâm Đồng",
    "station": "Bến xe Đà Lạt",
    "address": "1 Tô Hiến Thành, Phường 3, TP. Đà Lạt",
    "coordinates": {
      "lat": 11.9404,
      "lng": 108.4583
    }
  },

  // ⭐ Pickup points array
  "pickupPoints": [
    {
      "name": "Văn phòng Quận 1",
      "address": "272 Đường 3/2, Phường 12, Quận 10",
      "coordinates": { "lat": 10.7718, "lng": 106.6659 }
    },
    {
      "name": "Điểm đón Bình Tân",
      "address": "123 Lê Văn Quới, Bình Tân",
      "coordinates": { "lat": 10.7539, "lng": 106.6046 }
    }
  ],

  // ⭐ Dropoff points array
  "dropoffPoints": [
    {
      "name": "Trung tâm Đà Lạt",
      "address": "Nguyễn Thị Minh Khai, Phường 1",
      "coordinates": { "lat": 11.9415, "lng": 108.4419 }
    },
    {
      "name": "Hồ Xuân Hương",
      "address": "Trần Quốc Toản, Phường 9",
      "coordinates": { "lat": 11.9337, "lng": 108.4380 }
    }
  ],

  "distance": 308,
  "estimatedDuration": 360,
  "isActive": true,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**→ ✅ GPS COORDINATES + PICKUP/DROPOFF POINTS đầy đủ!**

#### Collection: trips (4 documents)

```javascript
{
  "_id": ObjectId("650000000000000000000401"),
  "operatorId": ObjectId("650000000000000000000101"),
  "routeId": ObjectId("650000000000000000000301"),
  "busId": ObjectId("650000000000000000000201"),
  "tripCode": "TRIP20250120001",

  "departureTime": ISODate("2025-01-20T08:00:00.000Z"),
  "arrivalTime": ISODate("2025-01-20T14:00:00.000Z"),

  "basePrice": 250000,
  "availableSeats": 18,

  // ⭐ Occupied seats array
  "occupiedSeats": ["A1", "A2", "B1", "B2", "C1", "C2"],

  // ⭐ Locked seats with timeout
  "lockedSeats": [
    {
      "seatNumber": "D1",
      "lockedUntil": ISODate("..."),
      "sessionId": "session_abc123xyz"
    },
    {
      "seatNumber": "D2",
      "lockedUntil": ISODate("..."),
      "sessionId": "session_abc123xyz"
    }
  ],

  "driver": null,
  "tripManager": null,
  "status": "scheduled",
  "cancellationReason": null,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**→ ✅ LOCKED SEATS mechanism hoạt động!**

#### Collection: payments (5 documents)

Xem payment MoMo thành công:

```javascript
{
  "_id": ObjectId("650000000000000000000701"),
  "transactionId": "TXN1705320000ABCD",
  "bookingId": ObjectId("650000000000000000000501"),
  "customerId": ObjectId("650000000000000000000002"),

  "amount": 450000,
  "currency": "VND",
  "paymentMethod": "momo",

  "gatewayTransactionId": "MOMO_2025011512345678",

  // ⭐ Full MoMo gateway response
  "gatewayResponse": {
    "partnerCode": "MOMO",
    "orderId": "BK20250115001",
    "requestId": "1705320000001",
    "amount": 450000,
    "orderInfo": "Thanh toán vé xe QuickRide - BK20250115001",
    "orderType": "momo_wallet",
    "transId": 2755988607,
    "resultCode": 0,
    "message": "Successful.",
    "payType": "qr",
    "responseTime": 1705320123456,
    "extraData": "",
    "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  },

  "status": "success",
  "refundAmount": 0,
  "refundedAt": null,
  "refundReason": null,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**→ ✅ GATEWAY RESPONSE OBJECT đầy đủ!**

---

## 📚 Tài liệu tham khảo

### Chi tiết dữ liệu mẫu

Xem file **SAMPLE_DATA_SUMMARY.md** để biết:
- ✅ Tất cả 31 documents chi tiết
- ✅ Test accounts & passwords
- ✅ Relationships giữa các documents
- ✅ Use cases cho testing

### Data modeling

Xem file **DATA_MODELS.md** để biết:
- ✅ Schema definition đầy đủ
- ✅ Validation rules
- ✅ Indexes
- ✅ Methods & virtuals

### Seeder documentation

Xem file **backend/src/seeders/README.md** để biết:
- ✅ Cách customize data
- ✅ Troubleshooting
- ✅ Production warnings

---

## ⚠️ Lưu ý quan trọng

### 1. Script sẽ XÓA toàn bộ dữ liệu cũ

```javascript
// Script chạy các lệnh sau:
await User.deleteMany({});
await BusOperator.deleteMany({});
await Bus.deleteMany({});
// ... và tất cả collections khác
```

**→ KHÔNG BAO GIỜ chạy trên production database!**

### 2. Passwords đã được hash

Tất cả passwords trong database đã được hash bằng bcrypt:
- Plain text: `Admin@123`
- Hashed: `$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. ObjectIds cố định

Script sử dụng ObjectIds cố định để dễ reference:
- Users: `650000000000000000000001`, `650000000000000000000002`, ...
- BusOperators: `650000000000000000000101`, ...
- Buses: `650000000000000000000201`, ...

**→ Dễ test relationships!**

---

## 🔧 Troubleshooting

### Lỗi: "Cannot connect to MongoDB"

```bash
# Kiểm tra MongoDB đang chạy
# Windows
services.msc

# macOS
brew services list

# Linux
sudo systemctl status mongod
```

### Lỗi: "Cannot find module"

```bash
# Cài lại dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Model is not defined"

Đảm bảo tất cả model files tồn tại trong `backend/src/models/`:
- User.js
- BusOperator.js
- Bus.js
- Route.js
- Trip.js
- Booking.js
- Ticket.js
- Payment.js

### Lỗi: "E11000 duplicate key error"

Database đã có dữ liệu với unique keys trùng. Chạy lại script, nó sẽ tự động xóa dữ liệu cũ trước khi seed.

---

## 🎯 Next Steps

Sau khi seed xong:

### 1. Test API endpoints

```bash
# Khởi động backend server
cd backend
npm run dev

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@quickride.com","password":"Admin@123"}'
```

### 2. Test frontend

```bash
# Khởi động frontend
cd frontend
npm run dev

# Đăng nhập với:
# Email: admin@quickride.com
# Password: Admin@123
```

### 3. Explore database

Dùng MongoDB Compass để:
- ✅ Xem tất cả fields
- ✅ Test queries
- ✅ Validate relationships
- ✅ Export data

---

## 📞 Support

Nếu gặp vấn đề:

1. Xem file **backend/src/seeders/README.md**
2. Xem file **SAMPLE_DATA_SUMMARY.md**
3. Xem file **DATA_MODELS.md**

---

**Happy Coding! 🚀**
