# QUICK START - Te_QuickRide

## Khởi động nhanh dự án

### Bước 1: Cài đặt Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (Terminal mới)
cd frontend
npm install
```

### Bước 2: Cấu hình Environment

```bash
# Backend
cd backend
cp .env.example .env

# Chỉnh sửa .env:
MONGODB_URI=mongodb://localhost:27017/te_quickride
JWT_SECRET=your-super-secret-key-change-this
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Bước 3: Seed Database

```bash
cd backend
npm run seed
```

**Expected output:**
```
✅ Connected to MongoDB
✅ Database cleared
✅ Creating users...
✅ Creating bus operators...
✅ Creating routes...
✅ Creating trips...
✅ Seeding completed successfully!
```

### Bước 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Expected:** `Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected:** `VITE ready on http://localhost:5173`

### Bước 5: Verify

**1. Test Backend:**
```
Mở browser: http://localhost:5000/health
```

**Expected:**
```json
{
  "status": "OK",
  "message": "Te_QuickRide API is running"
}
```

**2. Test Frontend:**
```
Mở browser: http://localhost:5173
```

**Expected:** Trang chủ hiển thị với search form

**3. Test Routes Page:**
```
Mở: http://localhost:5173/routes
```

**Expected:**
- ✅ Hiển thị 2 tuyến đường
- ✅ Có filter và search
- ✅ Mỗi card có nút "Tìm chuyến xe"

## Test Accounts

### Customer Account
```
Email: customer@example.com
Password: Password123!
```

### Operator Account (Pending Approval)
```
Email: operator@example.com
Password: Password123!
Status: Pending - Cần admin approve
```

### Operator Account (Approved)
```
Email: futa@buslines.vn
Password: Password123!
Status: Approved - Có thể login và tạo trips
```

### Admin Account
```
Email: admin@tequickride.vn
Password: AdminPassword123!
```

## Common Commands

### Backend

```bash
# Development
npm run dev

# Production
npm start

# Seed database
npm run seed

# Clear database
npm run seed:clear
```

### Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Backend không start
```bash
# Check MongoDB đang chạy
# Windows: Services → MongoDB Server

# Check port 5000 có bị chiếm không
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

### Frontend không load data
```bash
# Check CORS trong backend/.env
CORS_ORIGIN=http://localhost:5173

# Clear browser cache
Ctrl+Shift+Del

# Hard reload
Ctrl+Shift+R
```

### Database connection error
```bash
# Check MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/te_quickride

# Test connection
mongosh mongodb://localhost:27017/te_quickride
```

## Project Structure

```
Te_QuickRide/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, validation
│   │   ├── utils/           # Helper functions
│   │   └── seeders/         # Seed data
│   ├── .env                 # Environment config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── redux/           # State management
│   │   └── App.jsx          # Main app
│   └── package.json
│
├── TESTING.md              # Testing guide
├── CHANGELOG_FIX.md        # Recent fixes
└── DEBUG_ROUTES_ISSUE.md   # Debug guide
```

## Next Steps

1. ✅ Backend và Frontend đang chạy
2. ✅ Database có seed data
3. ✅ Test accounts hoạt động

**Bây giờ bạn có thể:**
- Đăng ký tài khoản mới
- Login với test accounts
- Tìm kiếm chuyến xe
- Đặt vé
- Quản lý trips (Operator)
- Xem analytics (Admin)

## Support

- **Testing Guide:** Xem `TESTING.md`
- **Debug Routes:** Xem `DEBUG_ROUTES_ISSUE.md`
- **API Docs:** http://localhost:5000/api
- **Recent Changes:** Xem `CHANGELOG_FIX.md`
