# DATA MODELS DOCUMENTATION - QuickRide

> Tài liệu mô tả chi tiết toàn bộ cấu trúc dữ liệu của hệ thống QuickRide

## Mục lục
1. [User - Người dùng](#1-user---người-dùng)
2. [BusOperator - Nhà xe](#2-busoperator---nhà-xe)
3. [Bus - Xe buýt](#3-bus---xe-buýt)
4. [Route - Tuyến đường](#4-route---tuyến-đường)
5. [Trip - Chuyến đi](#5-trip---chuyến-đi)
6. [Booking - Đặt vé](#6-booking---đặt-vé)
7. [Ticket - Vé điện tử](#7-ticket---vé-điện-tử)
8. [Payment - Thanh toán](#8-payment---thanh-toán)

---

## 1. User - Người dùng

**File**: `backend/src/models/User.js`

**Mô tả**: Quản lý thông tin người dùng (khách hàng và quản trị viên) bao gồm xác thực, phân quyền, OAuth, xác minh email/phone, và hệ thống điểm thưởng.

### Schema Definition

| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của người dùng |
| `email` | String | Yes | Yes | - | Email format, lowercase | Email đăng nhập |
| `phone` | String | Yes | Yes | - | - | Số điện thoại |
| `password` | String | Yes | No | - | Min 8 chars | Mật khẩu (hashed, select: false) |
| `fullName` | String | Yes | No | - | - | Họ và tên đầy đủ |
| `dateOfBirth` | Date | No | No | - | - | Ngày sinh |
| `gender` | String (Enum) | No | No | - | ['male', 'female', 'other'] | Giới tính |
| `avatar` | String | No | No | - | URL | Link ảnh đại diện |
| `role` | String (Enum) | No | No | 'customer' | ['customer', 'admin'] | Vai trò trong hệ thống |

#### OAuth Integration
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `googleId` | String | No | Yes (sparse) | - | Google OAuth ID |
| `facebookId` | String | No | Yes (sparse) | - | Facebook OAuth ID |

#### Email & Phone Verification
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `isEmailVerified` | Boolean | No | false | Trạng thái xác minh email |
| `isPhoneVerified` | Boolean | No | false | Trạng thái xác minh số điện thoại |
| `emailVerificationToken` | String | No | - | Token xác minh email |
| `phoneVerificationOTP` | String | No | - | OTP xác minh phone |
| `otpExpires` | Date | No | - | Thời gian hết hạn OTP |

#### Password Reset
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `passwordResetToken` | String | No | - | Token để reset mật khẩu |
| `passwordResetExpires` | Date | No | - | Thời gian hết hạn token reset |
| `lastLogin` | Date | No | - | Lần đăng nhập cuối cùng |

#### Saved Passengers (Array of Objects)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `savedPassengers` | Array | No | Danh sách hành khách thường dùng |
| `savedPassengers[].fullName` | String | Yes | Tên hành khách |
| `savedPassengers[].phone` | String | Yes | SĐT hành khách |
| `savedPassengers[].idCard` | String | No | CMND/CCCD hành khách |

#### Loyalty Program
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `loyaltyTier` | String (Enum) | No | 'bronze' | ['bronze', 'silver', 'gold', 'platinum'] | Hạng thành viên |
| `totalPoints` | Number | No | 0 | Min: 0 | Tổng điểm tích lũy |

#### Account Status
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `isActive` | Boolean | No | true | Tài khoản đang hoạt động |
| `isBlocked` | Boolean | No | false | Tài khoản bị khóa |

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
email (unique)
phone (unique)
googleId (unique, sparse)
facebookId (unique, sparse)
```

### Methods
- **Instance Methods**: N/A
- **Static Methods**: Standard Mongoose methods
- **Virtuals**: N/A

### Relationships
- **1:N** → Booking (customerId)
- **1:N** → Ticket (customerId)
- **1:N** → Payment (customerId)
- **1:N** → BusOperator (verifiedBy - chỉ admin)

---

## 2. BusOperator - Nhà xe

**File**: `backend/src/models/BusOperator.js`

**Mô tả**: Quản lý thông tin công ty vận tải, bao gồm thông tin doanh nghiệp, xác minh, đánh giá, và thống kê doanh thu.

### Schema Definition

#### Basic Information
| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của nhà xe |
| `companyName` | String | Yes | Yes | - | Trim | Tên công ty |
| `email` | String | Yes | Yes | - | Email format, lowercase | Email liên hệ |
| `phone` | String | Yes | No | - | - | Số điện thoại liên hệ |
| `password` | String | Yes | No | - | Min 8 chars | Mật khẩu (hashed, select: false) |

#### Business Information
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `businessLicense` | String | Yes | - | Giấy phép kinh doanh |
| `taxCode` | String | Yes | - | Mã số thuế |
| `logo` | String | No | - | Link logo công ty |
| `description` | String | No | - | Mô tả về công ty |
| `website` | String | No | - | Website công ty |

#### Address (Subdocument)
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `address` | Object | No | - | Địa chỉ công ty |
| `address.street` | String | No | - | Số nhà, tên đường |
| `address.ward` | String | No | - | Phường/Xã |
| `address.district` | String | No | - | Quận/Huyện |
| `address.city` | String | No | - | Thành phố/Tỉnh |
| `address.country` | String | No | 'Vietnam' | Quốc gia |

#### Bank Account (Subdocument)
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `bankAccount` | Object | No | - | Thông tin tài khoản ngân hàng |
| `bankAccount.bankName` | String | No | - | Tên ngân hàng |
| `bankAccount.accountNumber` | String | No | - | Số tài khoản |
| `bankAccount.accountHolder` | String | No | - | Tên chủ tài khoản |

#### Verification & Approval
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `verificationStatus` | String (Enum) | No | 'pending' | ['pending', 'approved', 'rejected'] | Trạng thái xét duyệt |
| `verifiedAt` | Date | No | - | - | Thời gian được xét duyệt |
| `verifiedBy` | ObjectId | No | - | Ref: 'User' | Admin xét duyệt |
| `rejectionReason` | String | No | - | - | Lý do từ chối (nếu rejected) |

#### Rating & Reviews
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `averageRating` | Number | No | 0 | Min: 0, Max: 5 | Đánh giá trung bình |
| `totalReviews` | Number | No | 0 | Min: 0 | Tổng số đánh giá |

#### Statistics
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `totalTrips` | Number | No | 0 | Min: 0 | Tổng số chuyến đã chạy |
| `totalRevenue` | Number | No | 0 | Min: 0 | Tổng doanh thu |

#### Commission
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `commissionRate` | Number | No | 5 | Min: 0, Max: 100 | Tỷ lệ hoa hồng (%) |

#### Status
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `isActive` | Boolean | No | true | Nhà xe đang hoạt động |
| `isSuspended` | Boolean | No | false | Nhà xe bị tạm ngưng |
| `suspensionReason` | String | No | - | Lý do tạm ngưng |

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
companyName (unique)
email (unique)
verificationStatus
```

### Relationships
- **N:1** ← User (verifiedBy)
- **1:N** → Bus (operatorId)
- **1:N** → Route (operatorId)
- **1:N** → Trip (operatorId)
- **1:N** → Booking (operatorId)

---

## 3. Bus - Xe buýt

**File**: `backend/src/models/Bus.js`

**Mô tả**: Quản lý thông tin phương tiện vận chuyển bao gồm loại xe, sơ đồ ghế, tiện ích và trạng thái bảo trì.

### Schema Definition

#### Basic Information
| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của xe |
| `operatorId` | ObjectId | Yes | No | - | Ref: 'BusOperator' | Nhà xe sở hữu |
| `busNumber` | String | Yes | Yes | - | Uppercase, trim | Biển số xe |
| `busType` | String (Enum) | Yes | No | - | ['limousine', 'sleeper', 'seater', 'double_decker'] | Loại xe |

#### Seat Configuration
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `totalSeats` | Number | Yes | - | Min: 1 | Tổng số ghế |
| `seatLayout` | Object | Yes | - | - | Sơ đồ bố trí ghế |
| `seatLayout.floors` | Number | Yes | - | Min: 1, Max: 2 | Số tầng (1 hoặc 2) |
| `seatLayout.rows` | Number | Yes | - | Min: 1 | Số hàng ghế |
| `seatLayout.columns` | Number | Yes | - | Min: 1 | Số cột ghế |
| `seatLayout.layout` | Array\<Array\<String\>\> | Yes | - | - | Mảng 2D sơ đồ ghế |

**Layout Format**: Mảng 2 chiều, mỗi phần tử là:
- Số ghế (ví dụ: "A1", "B2")
- "X" cho vị trí không có ghế (lối đi, cửa, toilet)
- "" (empty string) cho khoảng trống

**Ví dụ**:
```javascript
seatLayout: {
  floors: 1,
  rows: 8,
  columns: 4,
  layout: [
    ["A1", "A2", "X", "A3"],
    ["B1", "B2", "X", "B3"],
    // ... more rows
  ]
}
```

#### Amenities
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `amenities` | Array\<String\> | No | [] | Enum values | Các tiện ích trên xe |

**Amenities Enum**:
- `'wifi'` - WiFi miễn phí
- `'ac'` - Điều hòa
- `'toilet'` - Toilet
- `'water'` - Nước uống
- `'blanket'` - Chăn
- `'tv'` - TV/Giải trí
- `'usb_charger'` - Cổng sạc USB
- `'reading_light'` - Đèn đọc sách

#### Images
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `images` | Array\<String\> | No | [] | Danh sách URL hình ảnh xe |

#### Status
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `isActive` | Boolean | No | true | - | Xe đang hoạt động |
| `maintenanceStatus` | String (Enum) | No | 'good' | ['good', 'maintenance', 'repair'] | Trạng thái bảo trì |

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
operatorId
busNumber (unique)
```

### Relationships
- **N:1** ← BusOperator (operatorId)
- **1:N** → Trip (busId)

---

## 4. Route - Tuyến đường

**File**: `backend/src/models/Route.js`

**Mô tả**: Định nghĩa các tuyến đường xe chạy, bao gồm điểm đi, điểm đến, điểm đón/trả khách và thông tin khoảng cách.

### Schema Definition

#### Basic Information
| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của tuyến |
| `operatorId` | ObjectId | Yes | No | - | Ref: 'BusOperator' | Nhà xe quản lý tuyến |
| `routeName` | String | Yes | No | - | Trim | Tên tuyến đường |
| `routeCode` | String | Yes | Yes | - | Uppercase, trim | Mã tuyến (ví dụ: SGN-HN-001) |

#### Location Subdocument Schema
Cấu trúc dùng chung cho `origin` và `destination`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `city` | String | Yes | Thành phố |
| `province` | String | Yes | Tỉnh/Thành phố |
| `station` | String | No | Tên bến xe |
| `address` | String | No | Địa chỉ cụ thể |
| `coordinates` | Object | No | Tọa độ GPS |
| `coordinates.lat` | Number | No | Vĩ độ |
| `coordinates.lng` | Number | No | Kinh độ |

#### Origin & Destination
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `origin` | LocationSchema | Yes | Điểm xuất phát |
| `destination` | LocationSchema | Yes | Điểm đến |

#### Point Subdocument Schema
Cấu trúc dùng cho `pickupPoints` và `dropoffPoints`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | No | Tên điểm |
| `address` | String | No | Địa chỉ |
| `coordinates` | Object | No | Tọa độ GPS |
| `coordinates.lat` | Number | No | Vĩ độ |
| `coordinates.lng` | Number | No | Kinh độ |

#### Pickup & Dropoff Points
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `pickupPoints` | Array\<PointSchema\> | No | [] | Các điểm đón khách |
| `dropoffPoints` | Array\<PointSchema\> | No | [] | Các điểm trả khách |

#### Route Details
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `distance` | Number | Yes | Min: 0 | Khoảng cách (km) |
| `estimatedDuration` | Number | Yes | Min: 0 | Thời gian ước tính (phút) |

#### Status
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `isActive` | Boolean | No | true | Tuyến đang hoạt động |

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
routeCode (unique)
operatorId
{ 'origin.city': 1, 'destination.city': 1 } (compound index)
```

### Relationships
- **N:1** ← BusOperator (operatorId)
- **1:N** → Trip (routeId)

---

## 5. Trip - Chuyến đi

**File**: `backend/src/models/Trip.js`

**Mô tả**: Quản lý các chuyến đi cụ thể trên tuyến đường, bao gồm lịch trình, giá vé, quản lý ghế và trạng thái chuyến.

### Schema Definition

#### Basic Information
| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của chuyến |
| `operatorId` | ObjectId | Yes | No | - | Ref: 'BusOperator' | Nhà xe vận hành |
| `routeId` | ObjectId | Yes | No | - | Ref: 'Route' | Tuyến đường |
| `busId` | ObjectId | Yes | No | - | Ref: 'Bus' | Xe thực hiện chuyến |
| `tripCode` | String | Yes | Yes | - | Uppercase, trim | Mã chuyến (ví dụ: TRIP20250116001) |

#### Schedule
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `departureTime` | Date | Yes | Thời gian khởi hành |
| `arrivalTime` | Date | Yes | Thời gian đến dự kiến |

#### Pricing
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `basePrice` | Number | Yes | Min: 0 | Giá vé cơ bản (VNĐ) |

#### Seat Management
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `availableSeats` | Number | Yes | - | Min: 0 | Số ghế còn trống |
| `occupiedSeats` | Array\<String\> | No | [] | - | Danh sách số ghế đã đặt |

#### Locked Seats (Array of Objects)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lockedSeats` | Array | No | Danh sách ghế đang khóa tạm |
| `lockedSeats[].seatNumber` | String | Yes | Số ghế bị khóa |
| `lockedSeats[].lockedUntil` | Date | Yes | Thời gian hết hạn khóa |
| `lockedSeats[].sessionId` | String | Yes | ID session đặt vé |

**Mục đích**: Khi khách hàng đang trong quá trình đặt vé (chọn ghế nhưng chưa thanh toán), ghế sẽ bị khóa tạm trong 10-15 phút để tránh người khác đặt cùng lúc.

#### Staff Assignment (Chưa implement)
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `driver` | ObjectId | No | - | Tài xế (Ref: 'Staff' - chưa có model) |
| `tripManager` | ObjectId | No | - | Quản lý chuyến (Ref: 'Staff' - chưa có model) |

#### Status
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `status` | String (Enum) | No | 'scheduled' | ['scheduled', 'boarding', 'in_progress', 'completed', 'cancelled'] | Trạng thái chuyến |
| `cancellationReason` | String | No | - | - | Lý do hủy chuyến |

**Status Flow**:
1. `scheduled` - Chuyến đã lên lịch
2. `boarding` - Đang lên xe
3. `in_progress` - Đang chạy
4. `completed` - Đã hoàn thành
5. `cancelled` - Đã hủy

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
tripCode (unique)
{ operatorId: 1, departureTime: 1 } (compound)
{ routeId: 1, departureTime: 1 } (compound)
{ departureTime: 1, status: 1 } (compound)
```

### Instance Methods

#### `isSeatAvailable(seatNumber)`
Kiểm tra ghế có sẵn để đặt không.
```javascript
/**
 * @param {String} seatNumber - Số ghế cần kiểm tra
 * @returns {Boolean} - true nếu ghế còn trống
 */
```

#### `lockSeats(seatNumbers, sessionId, durationMinutes = 10)`
Khóa tạm các ghế trong quá trình đặt vé.
```javascript
/**
 * @param {Array<String>} seatNumbers - Danh sách số ghế cần khóa
 * @param {String} sessionId - ID session của người đặt
 * @param {Number} durationMinutes - Thời gian khóa (phút)
 */
```

#### `releaseLocks(sessionId)`
Giải phóng khóa ghế của một session.
```javascript
/**
 * @param {String} sessionId - ID session cần giải phóng
 */
```

#### `occupySeats(seatNumbers)`
Đánh dấu ghế đã được đặt (sau khi thanh toán thành công).
```javascript
/**
 * @param {Array<String>} seatNumbers - Danh sách số ghế đã đặt
 */
```

### Relationships
- **N:1** ← BusOperator (operatorId)
- **N:1** ← Route (routeId)
- **N:1** ← Bus (busId)
- **1:N** → Booking (tripId)
- **1:N** → Ticket (tripId)

---

## 6. Booking - Đặt vé

**File**: `backend/src/models/Booking.js`

**Mô tả**: Quản lý thông tin đặt vé của khách hàng, bao gồm thông tin hành khách, điểm đón/trả, thanh toán và trạng thái đặt vé.

### Schema Definition

#### Basic Information
| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của booking |
| `bookingCode` | String | Yes | Yes | Auto | Uppercase | Mã đặt vé (BK20250116001) |
| `customerId` | ObjectId | Yes | No | - | Ref: 'User' | Khách hàng đặt vé |
| `tripId` | ObjectId | Yes | No | - | Ref: 'Trip' | Chuyến đi |
| `operatorId` | ObjectId | Yes | No | - | Ref: 'BusOperator' | Nhà xe |

#### Passenger Subdocument Schema
Cấu trúc thông tin hành khách:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | String | Yes | Họ tên hành khách |
| `phone` | String | Yes | Số điện thoại |
| `idCard` | String | No | Số CMND/CCCD |

#### Seats (Array of Objects)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `seats` | Array | Yes | Danh sách ghế đã đặt |
| `seats[].seatNumber` | String | Yes | Số ghế |
| `seats[].passenger` | PassengerSchema | Yes | Thông tin hành khách ngồi ghế này |

**Ví dụ**:
```javascript
seats: [
  {
    seatNumber: "A1",
    passenger: {
      fullName: "Nguyễn Văn A",
      phone: "0901234567",
      idCard: "079088001234"
    }
  },
  {
    seatNumber: "A2",
    passenger: {
      fullName: "Trần Thị B",
      phone: "0909876543",
      idCard: "079088005678"
    }
  }
]
```

#### Point Subdocument Schema
Cấu trúc điểm đón/trả:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | No | Tên điểm |
| `address` | String | No | Địa chỉ |
| `coordinates` | Object | No | Tọa độ GPS |
| `coordinates.lat` | Number | No | Vĩ độ |
| `coordinates.lng` | Number | No | Kinh độ |

#### Pickup & Dropoff Points
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pickupPoint` | PointSchema | No | Điểm đón khách |
| `dropoffPoint` | PointSchema | No | Điểm trả khách |

#### Pricing
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `subtotal` | Number | Yes | - | Min: 0 | Tổng tiền trước giảm giá |
| `discount` | Number | No | 0 | Min: 0 | Số tiền giảm giá |
| `totalAmount` | Number | Yes | - | Min: 0 | Tổng tiền sau giảm giá |

#### Voucher (Chưa implement)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `voucherId` | ObjectId | No | ID voucher (Ref: 'Voucher' - chưa có model) |
| `voucherCode` | String | No | Mã voucher đã sử dụng |

#### Contact Information
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `contactEmail` | String | Yes | Email format | Email liên hệ |
| `contactPhone` | String | Yes | - | SĐT liên hệ |
| `notes` | String | No | - | Ghi chú thêm |

#### Booking Status
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `status` | String (Enum) | No | 'pending' | ['pending', 'confirmed', 'cancelled', 'completed'] | Trạng thái đặt vé |

**Status Flow**:
1. `pending` - Chờ xác nhận/thanh toán
2. `confirmed` - Đã xác nhận (đã thanh toán)
3. `cancelled` - Đã hủy
4. `completed` - Đã hoàn thành chuyến

#### Cancellation
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `cancellationReason` | String | No | - | Lý do hủy vé |
| `cancelledAt` | Date | No | - | Thời gian hủy |
| `refundAmount` | Number | No | 0 | Số tiền hoàn lại |
| `refundStatus` | String (Enum) | No | - | ['pending', 'processed', 'failed'] |

#### Check-in
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `checkedInSeats` | Array\<String\> | No | [] | Danh sách ghế đã check-in |
| `checkedInAt` | Date | No | - | Thời gian check-in |
| `checkedInBy` | ObjectId | No | - | Nhân viên check-in (Ref: 'Staff' - chưa có model) |

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
bookingCode (unique)
customerId
tripId
status
createdAt (descending)
```

### Static Methods

#### `generateBookingCode()`
Tự động tạo mã booking duy nhất theo format `BK{YYYYMMDD}{0001}`.
```javascript
/**
 * @returns {String} - Booking code (e.g., "BK202501160001")
 */
```

**Logic**:
1. Lấy ngày hiện tại (YYYYMMDD)
2. Đếm số booking trong ngày
3. Tăng số thứ tự + 1, format 4 chữ số (0001, 0002, ...)

### Relationships
- **N:1** ← User (customerId)
- **N:1** ← Trip (tripId)
- **N:1** ← BusOperator (operatorId)
- **1:N** → Ticket (bookingId)
- **1:1** → Payment (bookingId)

---

## 7. Ticket - Vé điện tử

**File**: `backend/src/models/Ticket.js`

**Mô tả**: Quản lý vé điện tử cho từng hành khách, mỗi ghế có một vé riêng. Ticket được tạo tự động sau khi booking được xác nhận.

### Schema Definition

#### Basic Information
| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của vé |
| `ticketCode` | String | Yes | Yes | Auto | Uppercase | Mã vé (TK20250116001) |
| `bookingId` | ObjectId | Yes | No | - | Ref: 'Booking' | Booking tạo vé này |
| `customerId` | ObjectId | Yes | No | - | Ref: 'User' | Khách hàng sở hữu |
| `tripId` | ObjectId | Yes | No | - | Ref: 'Trip' | Chuyến đi |

#### Seat & Passenger
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `seatNumber` | String | Yes | Số ghế |
| `passenger` | Object | Yes | Thông tin hành khách |
| `passenger.fullName` | String | Yes | Họ tên hành khách |
| `passenger.phone` | String | Yes | SĐT hành khách |
| `passenger.idCard` | String | No | Số CMND/CCCD |

#### QR Code & Documents
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `qrCode` | String | Yes | URL hình ảnh QR code |
| `qrData` | String | Yes | Dữ liệu được mã hóa trong QR |
| `ticketPDF` | String | No | URL file PDF vé |

**QR Data Format**: Mã hóa JSON string chứa:
```javascript
{
  ticketCode: "TK20250116001",
  bookingCode: "BK20250116001",
  seatNumber: "A1",
  passengerName: "Nguyễn Văn A",
  departureTime: "2025-01-20T08:00:00Z"
}
```

#### Validation Status
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `isValid` | Boolean | No | true | Vé có hiệu lực |
| `isUsed` | Boolean | No | false | Vé đã được sử dụng (đã lên xe) |
| `usedAt` | Date | No | - | Thời gian sử dụng vé |
| `validatedBy` | ObjectId | No | - | Nhân viên xác thực (Ref: 'Staff' - chưa có model) |

#### Trip Details (Denormalized)
Lưu thông tin chuyến đi để truy vấn nhanh mà không cần join:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tripDetails` | Object | No | Thông tin chuyến đi |
| `tripDetails.routeName` | String | No | Tên tuyến |
| `tripDetails.origin` | String | No | Điểm đi |
| `tripDetails.destination` | String | No | Điểm đến |
| `tripDetails.departureTime` | Date | No | Giờ khởi hành |
| `tripDetails.busNumber` | String | No | Biển số xe |
| `tripDetails.operatorName` | String | No | Tên nhà xe |

**Lợi ích Denormalization**:
- Truy vấn thông tin vé nhanh hơn (không cần JOIN)
- Giữ nguyên thông tin gốc khi trip bị sửa/xóa
- Phù hợp cho in vé PDF

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo vé |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
ticketCode (unique)
bookingId
qrData
customerId
```

### Static Methods

#### `generateTicketCode()`
Tự động tạo mã vé duy nhất theo format `TK{YYYYMMDD}{0001}`.
```javascript
/**
 * @returns {String} - Ticket code (e.g., "TK202501160001")
 */
```

**Logic**: Tương tự `generateBookingCode()` nhưng prefix là "TK".

### Relationships
- **N:1** ← Booking (bookingId)
- **N:1** ← User (customerId)
- **N:1** ← Trip (tripId)

---

## 8. Payment - Thanh toán

**File**: `backend/src/models/Payment.js`

**Mô tả**: Ghi nhận các giao dịch thanh toán từ khách hàng, hỗ trợ nhiều cổng thanh toán khác nhau.

### Schema Definition

#### Basic Information
| Field | Type | Required | Unique | Default | Validation | Description |
|-------|------|----------|--------|---------|------------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | - | ID duy nhất của giao dịch |
| `transactionId` | String | Yes | Yes | Auto | - | Mã giao dịch (TXN1705392000001) |
| `bookingId` | ObjectId | Yes | No | - | Ref: 'Booking' | Booking cần thanh toán |
| `customerId` | ObjectId | Yes | No | - | Ref: 'User' | Khách hàng thanh toán |

#### Amount
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `amount` | Number | Yes | - | Min: 0 | Số tiền thanh toán |
| `currency` | String | No | 'VND' | - | Đơn vị tiền tệ |

#### Payment Method
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `paymentMethod` | String (Enum) | Yes | Enum values | Phương thức thanh toán |

**Payment Method Enum**:
- `'momo'` - Ví MoMo
- `'vnpay'` - VNPay
- `'zalopay'` - ZaloPay
- `'shopeepay'` - ShopeePay
- `'atm'` - Thẻ ATM nội địa
- `'visa'` - Thẻ Visa
- `'mastercard'` - Thẻ Mastercard
- `'cod'` - Thanh toán khi lên xe (Cash on Delivery)

#### Gateway Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gatewayTransactionId` | String | No | Mã giao dịch từ cổng thanh toán |
| `gatewayResponse` | Mixed | No | Response JSON từ gateway (toàn bộ object) |

**Gateway Response Example**:
```javascript
{
  partnerCode: "MOMO",
  orderId: "BK202501160001",
  requestId: "1705392000001",
  amount: 250000,
  responseTime: 1705392123456,
  message: "Successful",
  resultCode: 0,
  // ... other fields from gateway
}
```

#### Payment Status
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `status` | String (Enum) | No | 'pending' | ['pending', 'success', 'failed', 'refunded'] | Trạng thái thanh toán |

**Status Flow**:
1. `pending` - Đang chờ thanh toán
2. `success` - Thanh toán thành công
3. `failed` - Thanh toán thất bại
4. `refunded` - Đã hoàn tiền

#### Refund
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `refundAmount` | Number | No | 0 | Số tiền đã hoàn |
| `refundedAt` | Date | No | - | Thời gian hoàn tiền |
| `refundReason` | String | No | - | Lý do hoàn tiền |

#### Timestamps
| Field | Type | Auto | Description |
|-------|------|------|-------------|
| `createdAt` | Date | Yes | Thời gian tạo giao dịch |
| `updatedAt` | Date | Yes | Thời gian cập nhật |

### Indexes
```javascript
transactionId (unique)
bookingId
customerId
status
createdAt (descending)
```

### Static Methods

#### `generateTransactionId()`
Tự động tạo mã giao dịch duy nhất theo format `TXN{timestamp}{random}`.
```javascript
/**
 * @returns {String} - Transaction ID (e.g., "TXN1705392000ABCD")
 */
```

**Logic**:
1. Lấy timestamp hiện tại (milliseconds)
2. Thêm 4 ký tự random (A-Z, 0-9)
3. Format: `TXN{timestamp}{random}`

### Relationships
- **N:1** ← Booking (bookingId) - mỗi booking có thể có nhiều payment (refund, retry, etc.)
- **N:1** ← User (customerId)

---

## Tổng kết Schema

### Tổng số Collections: 8
1. User (người dùng)
2. BusOperator (nhà xe)
3. Bus (xe buýt)
4. Route (tuyến đường)
5. Trip (chuyến đi)
6. Booking (đặt vé)
7. Ticket (vé điện tử)
8. Payment (thanh toán)

### Các Collection chưa implement:
1. **Staff** - Nhân viên (tài xế, quản lý chuyến, check-in staff)
2. **Voucher** - Mã giảm giá
3. **Review** - Đánh giá của khách hàng (có thể)
4. **Notification** - Thông báo (có thể)

### Design Patterns được sử dụng:

#### 1. Denormalization
- **Ticket.tripDetails**: Lưu trữ thông tin chuyến đi để truy vấn nhanh
- Lợi: Tốc độ đọc nhanh, không cần JOIN
- Nhược: Dữ liệu có thể không đồng bộ khi cập nhật

#### 2. Soft Locking
- **Trip.lockedSeats**: Khóa tạm ghế với timeout
- Tránh race condition khi nhiều người đặt cùng lúc

#### 3. Auto-generated Codes
- Booking: `BK{YYYYMMDD}{0001}`
- Ticket: `TK{YYYYMMDD}{0001}`
- Payment: `TXN{timestamp}{random}`

#### 4. Subdocuments
- User.savedPassengers
- BusOperator.address, bankAccount
- Route.origin, destination, pickupPoints, dropoffPoints
- Bus.seatLayout
- Booking.seats, pickupPoint, dropoffPoint
- Trip.lockedSeats

#### 5. References (Foreign Keys)
Tất cả quan hệ N:1 đều dùng ObjectId reference:
- BusOperator → User (verifiedBy)
- Bus → BusOperator
- Route → BusOperator
- Trip → BusOperator, Route, Bus
- Booking → User, Trip, BusOperator
- Ticket → Booking, User, Trip
- Payment → Booking, User

#### 6. Enums
Đảm bảo data integrity:
- User.role, gender, loyaltyTier
- BusOperator.verificationStatus
- Bus.busType, maintenanceStatus, amenities
- Trip.status
- Booking.status, refundStatus
- Payment.paymentMethod, status

#### 7. Timestamps
Tất cả collections đều có `createdAt` và `updatedAt` tự động

#### 8. Security
- Password được hash và có `select: false`
- Validation email format
- Min/Max constraints cho số tiền, rating, etc.

### Indexes Strategy

#### Unique Indexes:
- Email, phone (User, BusOperator)
- Business codes (bookingCode, ticketCode, transactionId, routeCode)
- OAuth IDs (googleId, facebookId)

#### Compound Indexes:
- Trip: (operatorId + departureTime), (routeId + departureTime), (departureTime + status)
- Route: (origin.city + destination.city)

#### Single Field Indexes:
- Foreign keys: operatorId, customerId, tripId, bookingId
- Status fields: verificationStatus, status
- Dates: createdAt (descending for pagination)
- QR: qrData (for quick validation)

---

## Validation Rules Summary

### String Validations:
- Email: lowercase, email format
- Phone: required for contact
- Password: min 8 characters, hashed
- Uppercase: routeCode, tripCode, bookingCode, ticketCode, busNumber

### Number Validations:
- Min 0: prices, amounts, ratings, counts, distances
- Min 1: seats, floors, rows, columns
- Max constraints: rating (0-5), commission (0-100), floors (1-2)

### Array Validations:
- Enums: Strict list of allowed values
- Non-empty: seats (Booking), layout (Bus)

### Date Validations:
- OTP expiry, password reset expiry
- Departure < Arrival (Trip)

### Object Validations:
- Required nested fields: origin.city, destination.city (Route)
- Optional nested: coordinates, address details

---

## Best Practices Observed:

1. ✅ Consistent naming conventions (camelCase)
2. ✅ Proper use of required/optional fields
3. ✅ Default values where appropriate
4. ✅ Indexes on frequently queried fields
5. ✅ Timestamps on all collections
6. ✅ Security considerations (password hashing, select: false)
7. ✅ Data integrity (enums, validations)
8. ✅ Clear foreign key relationships
9. ✅ Subdocuments for related data
10. ✅ Auto-generation for unique codes

---

**Cập nhật lần cuối**: 2025-01-16
**Phiên bản**: 1.0
**Database**: MongoDB 6.x
**ODM**: Mongoose 7.x
