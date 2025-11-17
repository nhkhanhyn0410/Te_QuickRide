# DEBUG: Routes không hiển thị

## Vấn đề
Database có tuyến đường nhưng không được tải lên trang `/routes`

## Checklist Kiểm Tra

### 1. Kiểm tra Backend đang chạy
```bash
# Terminal 1
cd backend
npm run dev

# Kiểm tra có log: "Server running on port 5000"
```

### 2. Kiểm tra Database có data
```bash
# Mở MongoDB Compass hoặc mongo shell
# Connect to: mongodb://localhost:27017/te_quickride

# Chạy query:
db.routes.find({ isActive: true }).pretty()

# Expected: Nên thấy 2 routes (SGN-DL và SGN-NT)
```

### 3. Test API trực tiếp

**Option A: Dùng Browser**
```
Mở: http://localhost:5000/api/routes/public
```

**Option B: Dùng PowerShell**
```powershell
# Test health
Invoke-WebRequest -Uri "http://localhost:5000/health" | Select-Object -Expand Content

# Test routes API
Invoke-WebRequest -Uri "http://localhost:5000/api/routes/public" | Select-Object -Expand Content
```

**Option C: Dùng curl (nếu có Git Bash)**
```bash
curl http://localhost:5000/api/routes/public
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Public routes retrieved successfully",
  "data": [
    {
      "_id": "650000000000000000000301",
      "routeName": "Sài Gòn - Đà Lạt",
      "routeCode": "SGN-DL-001",
      "origin": { ... },
      "destination": { ... }
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "totalPages": 1
  }
}
```

### 4. Kiểm tra Frontend

**Mở Chrome DevTools (F12) trên trang http://localhost:5173/routes**

**Console Tab - Kiểm tra logs:**
```
Nên thấy:
✅ "Routes API Response: ..."
✅ "Parsed routes data: [...]"

Nếu thấy lỗi:
❌ "Network Error" → Backend không chạy
❌ "CORS Error" → CORS config sai
❌ "404 Not Found" → Route không tồn tại
```

**Network Tab - Kiểm tra request:**
```
1. Filter: "public"
2. Click vào request "public"
3. Kiểm tra:
   - Status: 200 OK ✅
   - Response có data không?
   - Headers có CORS headers không?
```

### 5. Nếu vẫn không hiển thị

**Check 5.1: CORS**
File: `backend/src/app.js`
```javascript
// Đảm bảo có:
app.use(cors({
  origin: 'http://localhost:5173', // ← Frontend URL
  credentials: true
}));
```

**Check 5.2: Response Format**
Mở Console trong browser, paste:
```javascript
// Kiểm tra response format
fetch('http://localhost:5000/api/routes/public')
  .then(res => res.json())
  .then(data => {
    console.log('Full response:', data);
    console.log('Data field:', data.data);
    console.log('Is array?', Array.isArray(data.data));
    console.log('Length:', data.data?.length);
  });
```

**Check 5.3: Seed Data**
Nếu database trống:
```bash
cd backend
npm run seed
# Hoặc: node src/seeders/seed.js
```

**Check 5.4: Route Ordering**
File: `backend/src/routes/routes.js`

Đảm bảo `/public` route TRƯỚC `protect` middleware:
```javascript
// ✅ ĐÚNG
router.get('/public', getPublicRoutes);  // Public first
router.use(protect);  // Protected after

// ❌ SAI
router.use(protect);  // Protected first
router.get('/public', getPublicRoutes);  // Public blocked!
```

## Các Lỗi Thường Gặp

### Lỗi 1: "Cannot GET /api/routes/public"
**Nguyên nhân:** Route chưa được register hoặc backend chưa chạy

**Fix:**
1. Check `backend/src/app.js` có: `app.use('/api/routes', routeRoutes);`
2. Restart backend: `npm run dev`

### Lỗi 2: Data trả về rỗng []
**Nguyên nhân:** Database không có routes với `isActive: true`

**Fix:**
```bash
cd backend
npm run seed
```

### Lỗi 3: CORS Error
**Nguyên nhân:** Frontend URL không match CORS config

**Fix:**
File `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

File `backend/src/app.js`:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### Lỗi 4: Frontend không parse được data
**Nguyên nhân:** Response format không đúng expected

**Fix:**
File: `frontend/src/pages/public/Routes.jsx` (ĐÃ FIX)
```javascript
const routesData = response.data.data || [];
```

## Quick Fix Commands

```bash
# 1. Restart Backend
cd backend
npm run dev

# 2. Reseed Database
cd backend
npm run seed

# 3. Restart Frontend
cd frontend
npm run dev

# 4. Clear Browser Cache
# Chrome: Ctrl+Shift+Del → Clear cache
# Or hard reload: Ctrl+Shift+R
```

## Expected Result

Sau khi fix, trên trang http://localhost:5173/routes nên thấy:

✅ 2 tuyến đường:
- Sài Gòn - Đà Lạt (SGN-DL-001)
- Sài Gòn - Nha Trang (SGN-NT-001)

✅ Mỗi card hiển thị:
- Tên tuyến
- Mã tuyến (Tag màu xanh)
- Điểm đi / Điểm đến
- Khoảng cách (km)
- Thời gian (giờ)
- Nút "Tìm chuyến xe"

## Liên Hệ

Nếu vẫn lỗi sau khi làm theo checklist, cung cấp:
1. Screenshot Console (F12)
2. Screenshot Network tab
3. Backend logs
4. Database screenshot (MongoDB Compass)
