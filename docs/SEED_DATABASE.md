# 🌱 Hướng Dẫn Khởi Tạo Database

Database của Te_QuickRide cần có **dữ liệu mẫu** để hiển thị đủ 14 collections. Hãy làm theo các bước sau:

---

## 📋 Phương Pháp 1: Sử Dụng Docker (Khuyến Nghị)

### Bước 1: Khởi động Docker Services

```bash
# Từ thư mục gốc của project
docker-compose up -d mongodb redis
```

### Bước 2: Chạy Seed Script

```bash
# Cách 1: Chạy trực tiếp từ backend
cd backend
npm run seed

# Cách 2: Chạy trong Docker container
docker-compose exec backend npm run seed
```

### Bước 3: Kiểm Tra Database

```bash
# Kết nối vào MongoDB container
docker-compose exec mongodb mongosh

# Trong MongoDB shell:
use tequickride
show collections

# Kiểm tra số lượng documents
db.users.countDocuments()
db.busoperators.countDocuments()
db.staff.countDocuments()
db.routes.countDocuments()
db.buses.countDocuments()
db.trips.countDocuments()
db.vouchers.countDocuments()
db.loyaltypoints.countDocuments()
db.notifications.countDocuments()
db.systemlogs.countDocuments()
```

---

## 📋 Phương Pháp 2: Chạy Local (Không Dùng Docker)

### Bước 1: Đảm Bảo MongoDB Đang Chạy

```bash
# Kiểm tra MongoDB
mongosh --eval "db.version()"

# Nếu chưa chạy, khởi động MongoDB
sudo systemctl start mongod
```

### Bước 2: Cài Đặt Dependencies

```bash
cd backend
npm install
```

### Bước 3: Cấu Hình Environment

Tạo file `.env` trong thư mục `backend/`:

```bash
cp .env.example .env
```

Sửa `MONGODB_URI` thành:
```
MONGODB_URI=mongodb://localhost:27017/tequickride
```

### Bước 4: Chạy Seed Script

```bash
npm run seed
```

---

## ✅ Kết Quả Mong Đợi

Sau khi chạy seed script thành công, bạn sẽ thấy:

```
🌱 Starting database seeding...

✅ MongoDB Connected
🗑️  Clearing existing data...
✅ Collections cleared
👤 Creating users...
✅ Created 3 users
🚌 Creating bus operators...
✅ Created 2 bus operators
👨‍✈️ Creating staff members...
✅ Created 2 staff members
🛣️  Creating routes...
✅ Created 2 routes
🚐 Creating buses...
✅ Created 2 buses
🚌 Creating trips...
✅ Created 1 trips
🎫 Creating vouchers...
✅ Created 2 vouchers
⭐ Creating loyalty points...
✅ Created 1 loyalty point transactions
🔔 Creating notifications...
✅ Created 1 notifications
📝 Creating system logs...
✅ Created 1 system logs

✅ Database seeding completed successfully!

📊 Summary:
   - 3 Users
   - 2 Bus Operators
   - 2 Staff Members
   - 2 Routes
   - 2 Buses
   - 1 Trips
   - 2 Vouchers
   - 1 Loyalty Point Transactions
   - 1 Notifications
   - 1 System Logs
```

---

## 🔑 Tài Khoản Test

Sau khi seed, bạn có thể đăng nhập với các tài khoản sau:

### Admin
- **Email:** admin@tequickride.com
- **Password:** password123
- **Quyền:** Quản trị toàn hệ thống

### Customer (Khách hàng)
- **Email:** customer1@example.com
- **Password:** password123
- **Tier:** Gold (5,500 points)

### Bus Operator (Nhà xe)
- **Email:** contact@futabus.vn
- **Password:** operator123
- **Company:** Phương Trang - FUTA Bus Lines

### Staff (Nhân viên)
- **Email:** letai@futabus.vn
- **Password:** staff123
- **Role:** Driver

---

## 📦 14 Collections Được Tạo

✅ 1. **users** - User accounts
✅ 2. **busoperators** - Bus companies
✅ 3. **staff** - Drivers & managers
✅ 4. **routes** - Bus routes
✅ 5. **buses** - Vehicles
✅ 6. **trips** - Scheduled trips
✅ 7. **bookings** - Bookings (tạo khi đặt vé)
✅ 8. **tickets** - E-tickets (tạo sau khi thanh toán)
✅ 9. **payments** - Payments (tạo khi thanh toán)
✅ 10. **reviews** - Reviews (tạo sau khi hoàn thành chuyến)
✅ 11. **vouchers** - Discount codes
✅ 12. **loyaltypoints** - Points history
✅ 13. **notifications** - System notifications
✅ 14. **systemlogs** - Audit logs

**Lưu ý:** Collections `bookings`, `tickets`, `payments`, `reviews` sẽ được tạo khi có user thực hiện các hành động tương ứng (đặt vé, thanh toán, đánh giá).

---

## 🔄 Xóa & Seed Lại Database

Nếu muốn reset database và seed lại:

```bash
# Seed script tự động xóa data cũ trước khi insert mới
npm run seed
```

---

## 🐛 Troubleshooting

### Lỗi: Cannot connect to MongoDB

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
docker-compose ps
# hoặc
sudo systemctl status mongod

# Khởi động lại MongoDB
docker-compose restart mongodb
# hoặc
sudo systemctl restart mongod
```

### Lỗi: Module not found

**Giải pháp:**
```bash
cd backend
npm install
```

### Lỗi: Permission denied

**Giải pháp:**
```bash
# Nếu dùng Docker
docker-compose exec backend npm run seed

# Nếu chạy local, kiểm tra quyền MongoDB
sudo chown -R mongodb:mongodb /var/lib/mongodb
```

---

## 📝 Notes

- Seed script có thể chạy nhiều lần - nó sẽ tự động xóa data cũ
- Mỗi lần chạy seed sẽ tạo ra trip code và timestamps mới
- Data mẫu được thiết kế để test đầy đủ các tính năng
- Password mặc định cho tất cả accounts: `password123`, `operator123`, `staff123`

---

**Made with ❤️ by Te_QuickRide Team**
