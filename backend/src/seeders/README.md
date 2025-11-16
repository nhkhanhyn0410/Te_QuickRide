# Database Seeder - QuickRide

Thư mục này chứa script để seed (tạo dữ liệu mẫu) vào MongoDB database.

## Mục đích

Script `seedData.js` tạo dữ liệu mẫu **ĐẦY ĐỦ TẤT CẢ FIELDS** cho tất cả 8 collections trong database QuickRide, giúp:

1. ✅ **Hiển thị đầy đủ schema** trong MongoDB Compass
2. ✅ **Testing & Development** với dữ liệu thực tế
3. ✅ **Demo** ứng dụng với dữ liệu hoàn chỉnh
4. ✅ **Kiểm tra relationships** giữa các collections

## Cách sử dụng

### Bước 1: Cài đặt dependencies

Đảm bảo bạn đã cài đặt tất cả packages cần thiết:

```bash
cd backend
npm install
```

### Bước 2: Cấu hình MongoDB URI

Có 2 cách:

**Cách 1**: Sử dụng file `.env`
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/quickride
```

**Cách 2**: Script sẽ tự động dùng `mongodb://localhost:27017/quickride` nếu không có `.env`

### Bước 3: Chạy seeder

```bash
# Từ thư mục backend
node src/seeders/seedData.js

# Hoặc từ root project
node backend/src/seeders/seedData.js
```

### Bước 4: Xem kết quả trong MongoDB Compass

1. Mở **MongoDB Compass**
2. Connect tới `mongodb://localhost:27017`
3. Chọn database `quickride`
4. Xem từng collection - **TẤT CẢ FIELDS ĐỀU HIỂN THỊ ĐẦY ĐỦ**!

## Dữ liệu được tạo

### 📊 Tổng quan

| Collection | Số lượng | Mô tả |
|------------|----------|-------|
| **users** | 3 | 1 admin + 2 customers (đầy đủ OAuth, verification, loyalty) |
| **busoperators** | 3 | Approved, Pending, Rejected (đầy đủ bank, address, ratings) |
| **buses** | 4 | Limousine, Sleeper, Seater, Double-decker (đầy đủ layout, amenities) |
| **routes** | 3 | SGN-Đà Lạt, SGN-Nha Trang, HN-Hải Phòng (đầy đủ GPS, pickup/dropoff) |
| **trips** | 4 | Scheduled, Completed, Cancelled (đầy đủ locked seats) |
| **bookings** | 4 | Confirmed, Pending, Cancelled (đầy đủ passengers, pickup/dropoff) |
| **tickets** | 5 | Valid, Used, Invalid (đầy đủ QR, PDF, trip details) |
| **payments** | 5 | Success, Pending, Failed, Refunded (đầy đủ gateway responses) |

### 👤 Test Accounts

#### Admin
```
Email: admin@quickride.com
Password: Admin@123
Role: admin
Features: Tất cả fields bao gồm OAuth, saved passengers, loyalty platinum
```

#### Customer 1 (Phạm Thị Lan)
```
Email: customer1@gmail.com
Password: Customer@123
Role: customer
Features: Gold tier, có saved passengers, có bookings
```

#### Customer 2 (Hoàng Minh Tuấn)
```
Email: customer2@gmail.com
Password: Customer@123
Role: customer
Features: Silver tier, phone chưa verify, có OTP
```

#### Bus Operator 1 (FUTA)
```
Email: contact@futabus.vn
Password: Operator@123
Status: Approved
Features: Đầy đủ bank account, address, high ratings
```

#### Bus Operator 2 (Thành Bưởi)
```
Email: info@thanhbuoi.vn
Password: Operator@123
Status: Pending
```

#### Bus Operator 3 (Mai Linh)
```
Email: support@mailinexpress.vn
Password: Operator@123
Status: Rejected (với rejection reason)
```

## Chi tiết dữ liệu mẫu

### 🚌 Buses

1. **51B-12345** - Limousine (24 ghế, 7 tiện ích)
2. **51B-67890** - Sleeper (40 ghế, 2 tầng, đang bảo trì)
3. **50A-11111** - Seater (45 ghế)
4. **50A-22222** - Double-decker (50 ghế, đang sửa chữa)

### 🛣️ Routes

1. **SGN-DL-001**: Sài Gòn → Đà Lạt (308km, 6h)
   - Có 2 pickup points, 2 dropoff points
   - Đầy đủ GPS coordinates

2. **SGN-NT-001**: Sài Gòn → Nha Trang (450km, 8h)
   - Có 1 pickup point, 1 dropoff point

3. **HN-HP-001**: Hà Nội → Hải Phòng (120km, 2.5h)
   - Không active

### 🎫 Trips

1. **TRIP20250120001**: SGN-ĐL, 08:00 (Scheduled)
   - 18/24 ghế còn trống
   - Có occupied seats: A1, A2, B1, B2, C1, C2
   - Có locked seats: D1, D2 (với session & timeout)

2. **TRIP20250120002**: SGN-ĐL, 20:00 (Scheduled)
   - Tất cả ghế còn trống

3. **TRIP20250118001**: SGN-NT, 06:00 (Completed)
   - Đã hết ghế

4. **TRIP20250119001**: HN-HP, 10:00 (Cancelled)
   - Có cancellation reason

### 📋 Bookings

1. **BK20250115001**: Confirmed
   - 2 ghế (A1, A2)
   - Có voucher discount
   - Đã check-in cả 2 ghế
   - Có pickup & dropoff points với GPS

2. **BK20250115002**: Confirmed
   - 2 ghế (B1, B2)
   - Chưa check-in
   - Có pickup & dropoff points

3. **BK20250114001**: Cancelled
   - Có refund amount & refund status: processed
   - Có cancellation reason

4. **BK20250116001**: Pending
   - Chưa thanh toán

### 🎟️ Tickets

Mỗi seat trong booking có 1 ticket riêng:

- **TK20250115001** & **TK20250115002**: Used (đã lên xe)
- **TK20250115003** & **TK20250115004**: Valid, chưa dùng
- **TK20250114001**: Invalid (do booking bị cancel)

Mỗi ticket có:
- QR code URL
- QR data (JSON encoded)
- Ticket PDF URL
- Trip details (denormalized)

### 💳 Payments

1. **TXN1705320000ABCD**: MoMo - Success
   - Đầy đủ gateway response từ MoMo

2. **TXN1705321000EFGH**: VNPay - Success
   - Đầy đủ vnp_* parameters

3. **TXN1705280000IJKL**: ZaloPay - Refunded
   - Có refund amount, refund date, refund reason

4. **TXN1705392000MNOP**: Visa - Pending
   - Chưa có gateway response

5. **TXN1705300000QRST**: ShopeePay - Failed
   - Có error message trong gateway response

## Đặc điểm của dữ liệu

### ✅ Đầy đủ tất cả fields

**Mọi field trong schema đều có data**, bao gồm:
- Required fields
- Optional fields
- Nested objects (subdocuments)
- Arrays
- Enums (tất cả giá trị có thể)
- Timestamps
- Foreign keys (relationships)

### ✅ Realistic data

- Tên công ty, địa chỉ thật (FUTA, Thành Bưởi, Mai Linh)
- Tuyến đường thật (SGN-Đà Lạt, SGN-Nha Trang, HN-Hải Phòng)
- GPS coordinates thật
- Giá vé hợp lý
- Gateway responses giống thật (MoMo, VNPay, ZaloPay format)

### ✅ Complete relationships

Tất cả foreign keys đều có reference đúng:
- User → Booking → Ticket → Payment
- BusOperator → Bus → Route → Trip
- Trip → Booking

### ✅ Diverse statuses

Mỗi status enum đều có ví dụ:
- Trip: scheduled, boarding, in_progress, completed, cancelled
- Booking: pending, confirmed, cancelled, completed
- Payment: pending, success, failed, refunded
- Verification: pending, approved, rejected

### ✅ Edge cases

- User với OAuth (Google, Facebook)
- User với/không verified email/phone
- Bus đang maintenance/repair
- Route không active
- Booking có discount
- Booking bị cancel có refund
- Ticket invalid
- Payment failed với error message
- Locked seats với timeout

## Kiểm tra trong MongoDB Compass

### 1. Collection: users

Xem document với ID `650000000000000000000001` (Admin):

```javascript
{
  _id: ObjectId('650000000000000000000001'),
  email: "admin@quickride.com",
  phone: "0901234567",
  password: "$2a$10$...", // Hashed
  fullName: "Nguyễn Văn Admin",
  dateOfBirth: ISODate("1990-01-15T00:00:00.000Z"),
  gender: "male",
  avatar: "https://i.pravatar.cc/150?img=1",
  role: "admin",
  googleId: "google_admin_123456",
  facebookId: "facebook_admin_123456",
  isEmailVerified: true,
  isPhoneVerified: true,
  // ... tất cả fields khác
  savedPassengers: [
    {
      fullName: "Trần Thị B",
      phone: "0909876543",
      idCard: "079088001234"
    }
  ],
  loyaltyTier: "platinum",
  totalPoints: 5000,
  // ... timestamps
}
```

**→ TẤT CẢ 25+ FIELDS ĐỀU HIỂN THỊ!**

### 2. Collection: buses

Xem bus Limousine (`51B-12345`):

```javascript
{
  _id: ObjectId('650000000000000000000201'),
  operatorId: ObjectId('650000000000000000000101'),
  busNumber: "51B-12345",
  busType: "limousine",
  totalSeats: 24,
  seatLayout: {
    floors: 1,
    rows: 6,
    columns: 4,
    layout: [
      ["A1", "A2", "X", "A3"],
      // ... full 2D array
    ]
  },
  amenities: ["wifi", "ac", "toilet", "water", "blanket", "usb_charger", "reading_light"],
  images: ["https://...", "https://...", "https://..."],
  isActive: true,
  maintenanceStatus: "good"
}
```

**→ SEATLAYOUT 2D ARRAY ĐẦY ĐỦ!**

### 3. Collection: payments

Xem payment MoMo success:

```javascript
{
  _id: ObjectId('650000000000000000000701'),
  transactionId: "TXN1705320000ABCD",
  bookingId: ObjectId('650000000000000000000501'),
  customerId: ObjectId('650000000000000000000002'),
  amount: 450000,
  currency: "VND",
  paymentMethod: "momo",
  gatewayTransactionId: "MOMO_2025011512345678",
  gatewayResponse: {
    partnerCode: "MOMO",
    orderId: "BK20250115001",
    requestId: "1705320000001",
    amount: 450000,
    // ... full MoMo response object
    resultCode: 0,
    message: "Successful.",
    signature: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  },
  status: "success",
  refundAmount: 0,
  // ... all fields
}
```

**→ GATEWAY RESPONSE OBJECT ĐẦY ĐỦ!**

## Reset Database

Nếu muốn reset và seed lại:

```bash
# Script sẽ tự động xóa dữ liệu cũ và insert dữ liệu mới
node backend/src/seeders/seedData.js
```

## Troubleshooting

### Lỗi: "Cannot find module"

```bash
# Chạy từ đúng thư mục
cd backend
node src/seeders/seedData.js
```

### Lỗi: "Connection refused"

```bash
# Kiểm tra MongoDB đang chạy
# Windows:
services.msc  # Tìm MongoDB service

# macOS/Linux:
brew services list  # hoặc
sudo systemctl status mongod
```

### Lỗi: "Model is not defined"

Đảm bảo tất cả model files tồn tại:
- `backend/src/models/User.js`
- `backend/src/models/BusOperator.js`
- `backend/src/models/Bus.js`
- `backend/src/models/Route.js`
- `backend/src/models/Trip.js`
- `backend/src/models/Booking.js`
- `backend/src/models/Ticket.js`
- `backend/src/models/Payment.js`

## Customize Data

Muốn thêm/sửa dữ liệu mẫu? Edit object `sampleData` trong file `seedData.js`:

```javascript
const sampleData = {
  users: [...],      // Thêm users
  busOperators: [...], // Thêm operators
  // ...
};
```

Sau đó chạy lại seeder!

## Production Warning

⚠️ **CẢNH BÁO**: Script này sẽ **XÓA TOÀN BỘ DỮ LIỆU** trong database trước khi seed!

**KHÔNG BAO GIỜ chạy script này trên production database!**

Chỉ dùng cho:
- ✅ Local development
- ✅ Testing environment
- ✅ Staging environment
- ✅ Demo purposes

## License

MIT
