# Database Scripts - Hướng Dẫn Sử Dụng

## Tổng Quan

Thư mục này chứa các scripts để quản lý database của hệ thống Te_QuickRide.

## Scripts Có Sẵn

### 1. cleanDatabase.js
**Mục đích**: Xóa toàn bộ dữ liệu trong MongoDB database

**Chức năng**:
- Kết nối đến MongoDB
- Liệt kê tất cả các collections
- Xóa từng collection
- Đóng kết nối

**Cảnh báo**: Script này sẽ XÓA TOÀN BỘ dữ liệu. Chỉ sử dụng trong môi trường development!

### 2. seedDatabase.js
**Mục đích**: Tạo dữ liệu mẫu đầy đủ cho hệ thống

**Dữ liệu được tạo**:
- **Users**:
  - 1 Admin
  - 3 Customers với loyalty tiers khác nhau

- **Bus Operators**:
  - 2 nhà xe đã được duyệt (FUTA, Mai Linh)
  - 1 nhà xe chờ duyệt (Hà Linh)

- **Staff**:
  - 2 tài xế
  - 1 quản lý

- **Buses**:
  - Limousine (24 ghế)
  - Sleeper (40 ghế, 2 tầng)
  - Seater (45 ghế)
  Tất cả với đầy đủ amenities và seat layouts

- **Routes**:
  - HCM - Đà Lạt
  - HCM - Nha Trang
  - HCM - Vũng Tàu
  Với pickup/dropoff points đầy đủ

- **Trips**:
  - 6 chuyến đi sắp tới
  - Các trạng thái khác nhau (scheduled, có ghế đã đặt)

- **Bookings**:
  - 2 đặt vé mẫu với trạng thái confirmed
  - Có sử dụng voucher

- **Vouchers**:
  - 3 vouchers active (Summer 2024, New User, Gold Member)
  - 1 voucher expired

- **Reviews**:
  - 2 đánh giá từ khách hàng

- **Notifications**:
  - 3 thông báo mẫu

## Yêu Cầu

### 1. MongoDB Server
Cần có MongoDB server đang chạy. Có 2 cách:

#### Option A: Sử dụng Docker (Khuyến nghị)
```bash
# Khởi động MongoDB bằng Docker Compose
cd /path/to/Te_QuickRide
docker-compose up -d mongodb

# Kiểm tra MongoDB đã chạy
docker-compose ps
```

#### Option B: MongoDB Local
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 2. Environment Variables
Đảm bảo file `.env` có MongoDB URI chính xác:

**Nếu dùng Docker Compose:**
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/te_quickride?authSource=admin
```

**Nếu dùng MongoDB local không có auth:**
```env
MONGODB_URI=mongodb://localhost:27017/te_quickride
```

### 3. Dependencies
```bash
# Cài đặt dependencies nếu chưa có
cd backend
npm install
```

## Cách Sử Dụng

### Bước 1: Khởi động MongoDB
```bash
# Sử dụng Docker Compose
docker-compose up -d mongodb
```

### Bước 2: Clean Database (Xóa dữ liệu cũ)
```bash
cd backend
node src/scripts/cleanDatabase.js
```

**Output mong đợi:**
```
Connecting to MongoDB...
✓ Connected to MongoDB

Found X collections
Dropping collection: users...
✓ Dropped users
Dropping collection: busoperators...
✓ Dropped busoperators
...

✓ All collections dropped successfully!
Database is now clean.

Database connection closed.
```

### Bước 3: Seed Database (Tạo dữ liệu mới)
```bash
cd backend
node src/scripts/seedDatabase.js
```

**Output mong đợi:**
```
Connecting to MongoDB...
✓ Connected to MongoDB

Creating users...
✓ Created 4 users (1 admin, 3 customers)

Creating bus operators...
✓ Created 3 bus operators

Creating staff members...
✓ Created 3 staff members

Creating buses...
✓ Created 3 buses

Creating routes...
✓ Created 3 routes

Creating trips...
✓ Created 6 trips

Creating vouchers...
✓ Created 4 vouchers

Creating bookings...
✓ Created 2 bookings

Creating reviews...
✓ Created 2 reviews

Creating notifications...
✓ Created 3 notifications

═══════════════════════════════════════
✓ DATABASE SEEDED SUCCESSFULLY!
═══════════════════════════════════════
Users: 4 (1 admin, 3 customers)
Bus Operators: 3 (2 approved, 1 pending)
Staff: 3
Buses: 3
Routes: 3
Trips: 6
Bookings: 2
Vouchers: 4 (3 active)
Reviews: 2
Notifications: 3
═══════════════════════════════════════

Default Login Credentials:
-------------------------------------------
Admin:
  Email: admin@tequickride.com
  Password: Admin@123

Customers:
  Email: customer1@example.com
  Password: Customer@123
  (customer2, customer3 same password)

Operators:
  Email: contact@futa.vn
  Password: Operator@123
  (All operators same password)
═══════════════════════════════════════
```

### Bước 4: Verify Data
```bash
# Kết nối MongoDB CLI để kiểm tra
mongosh "mongodb://admin:admin123@localhost:27017/te_quickride?authSource=admin"

# Trong mongosh
use te_quickride
show collections
db.users.countDocuments()
db.trips.find().pretty()
```

## Chạy Cả Hai Scripts Liên Tiếp

### Bash Script (Linux/macOS)
```bash
#!/bin/bash
cd backend
echo "Cleaning database..."
node src/scripts/cleanDatabase.js
echo ""
echo "Seeding database..."
node src/scripts/seedDatabase.js
```

### PowerShell (Windows)
```powershell
cd backend
Write-Host "Cleaning database..."
node src/scripts/cleanDatabase.js
Write-Host ""
Write-Host "Seeding database..."
node src/scripts/seedDatabase.js
```

### npm scripts (Khuyến nghị)
Thêm vào `package.json`:
```json
{
  "scripts": {
    "db:clean": "node src/scripts/cleanDatabase.js",
    "db:seed": "node src/scripts/seedDatabase.js",
    "db:reset": "npm run db:clean && npm run db:seed"
  }
}
```

Sau đó chạy:
```bash
cd backend
npm run db:reset
```

## Troubleshooting

### Lỗi: MongooseServerSelectionError: connect ECONNREFUSED
**Nguyên nhân**: MongoDB server không chạy

**Giải pháp**:
```bash
# Khởi động MongoDB
docker-compose up -d mongodb

# Hoặc
sudo systemctl start mongod
```

### Lỗi: Authentication failed
**Nguyên nhân**: MongoDB URI không đúng

**Giải pháp**: Kiểm tra lại MONGODB_URI trong file `.env`

### Lỗi: Cannot find module
**Nguyên nhân**: Dependencies chưa được cài đặt

**Giải pháp**:
```bash
cd backend
npm install
```

## Tài Khoản Mặc Định Sau Khi Seed

### Admin
- **Email**: admin@tequickride.com
- **Password**: Admin@123
- **Role**: admin
- **Loyalty**: Platinum

### Khách Hàng 1
- **Email**: customer1@example.com
- **Password**: Customer@123
- **Họ tên**: Nguyễn Văn An
- **Loyalty**: Gold
- **Points**: 1200

### Khách Hàng 2
- **Email**: customer2@example.com
- **Password**: Customer@123
- **Họ tên**: Trần Thị Bích
- **Loyalty**: Silver
- **Points**: 500

### Khách Hàng 3
- **Email**: customer3@example.com
- **Password**: Customer@123
- **Họ tên**: Lê Minh Cường
- **Loyalty**: Bronze
- **Points**: 100

### Nhà Xe 1 (FUTA)
- **Email**: contact@futa.vn
- **Password**: Operator@123
- **Trạng thái**: Approved
- **Rating**: 4.5/5

### Nhà Xe 2 (Mai Linh)
- **Email**: info@mailinh.vn
- **Password**: Operator@123
- **Trạng thái**: Approved
- **Rating**: 4.3/5

### Nhà Xe 3 (Hà Linh)
- **Email**: contact@halinh.vn
- **Password**: Operator@123
- **Trạng thái**: Pending (Chờ duyệt)

## Lưu Ý Quan Trọng

1. **KHÔNG chạy scripts này trên production database!**
2. Scripts này chỉ dành cho môi trường development
3. Luôn backup dữ liệu trước khi chạy cleanDatabase.js
4. Mật khẩu mặc định nên được thay đổi trước khi deploy production
5. Seed data chứa thông tin mẫu, không phải dữ liệu thật

## Cấu Trúc Dữ Liệu

### Users
- Admin account với full permissions
- Customer accounts với các loyalty tiers khác nhau
- Saved passengers data
- Email và phone verification status

### Bus Operators
- Company information đầy đủ
- Business license và tax code
- Bank account details
- Verification status (approved/pending)
- Rating và revenue statistics

### Buses
- Bus types: limousine, sleeper, seater
- Seat layouts chi tiết (1-2 tầng)
- Amenities: wifi, ac, toilet, etc.
- Maintenance status

### Routes
- Origin và destination với coordinates
- Pickup/dropoff points
- Distance và estimated duration

### Trips
- Scheduled trips với departure/arrival times
- Seat availability tracking
- Occupied và locked seats
- Driver và manager assignments

### Bookings
- Complete passenger information
- Pickup/dropoff points
- Pricing với voucher discount
- Booking status tracking

### Vouchers
- Percentage và fixed discount types
- Usage limits (total và per user)
- Target users (all, new, loyalty tiers)
- Validity period

## Support

Nếu gặp vấn đề:
1. Kiểm tra MongoDB đã chạy chưa
2. Kiểm tra file .env
3. Kiểm tra logs/errors
4. Liên hệ team dev

---

**Cập nhật lần cuối**: 2024
**Version**: 1.0.0
