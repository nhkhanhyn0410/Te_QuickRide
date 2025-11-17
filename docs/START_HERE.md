# 🚀 START HERE - Te_QuickRide

## Bạn đang ở đâu?

Đây là dự án **Te_QuickRide** - Hệ thống đặt vé xe khách online.

---

## ⚡ Khởi Động Nhanh (5 phút)

### Bước 1: Kiểm Tra Hệ Thống
```bash
# Windows - Double click:
check-all.bat

# Hoặc Mac/Linux:
cd backend && node check-sync.js
```

### Bước 2: Nếu Lần Đầu Chạy
```bash
# Backend
cd backend
npm install
npm run seed    # Tạo dữ liệu mẫu
npm run dev     # Start server

# Frontend (Terminal mới)
cd frontend
npm install
npm run dev     # Start app
```

### Bước 3: Mở Trình Duyệt
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

### Bước 4: Test Login
```
Customer:
  Email: customer@example.com
  Password: Password123!

Operator (Approved):
  Email: futa@buslines.vn
  Password: Password123!

Admin:
  Email: admin@tequickride.vn
  Password: AdminPassword123!
```

---

## 📚 Tài Liệu Nào Dành Cho Bạn?

### 👨‍💻 Developer Mới
**Đọc theo thứ tự:**
1. ✅ `QUICK_START.md` - Setup project (10 phút)
2. ✅ `README_DOCUMENTATION.md` - Tổng quan tài liệu (5 phút)
3. ✅ Run `check-sync.js` - Verify setup
4. ✅ `TESTING.md` - Hiểu features (30 phút)

### 🐛 Đang Debug Lỗi
**Tùy loại lỗi:**
- Trang `/routes` không load? → `DEBUG_ROUTES_ISSUE.md`
- API 404? → `SYNC_CHECKLIST.md` Phase 2
- Database issues? → Run `npm run check`
- Field errors? → `SYNC_CHECKLIST.md` Phase 4
- Auth errors? → `SYNC_CHECKLIST.md` Phase 5

### 🧪 QA / Testing
**Sử dụng:**
- `TESTING.md` - 75+ test cases
- `SYNC_CHECKLIST.md` - Verification phases
- Run `npm run check` trước mỗi test session

### 📊 Technical Lead / Reviewer
**Review:**
- `CHANGELOG_FIX.md` - Recent changes (17 fixes)
- `SYNC_CHECKLIST.md` - All 8 phases
- `check-sync.js` output - Database status

---

## 🆘 Gặp Vấn Đề?

### Vấn đề Phổ Biến

| Triệu chứng | File cần đọc | Quick fix |
|-------------|--------------|-----------|
| Routes không load | `DEBUG_ROUTES_ISSUE.md` | `npm run seed` |
| API 404 | `SYNC_CHECKLIST.md` Phase 2 | Check `app.js` routes |
| Database trống | `QUICK_START.md` | `npm run seed` |
| Field errors | `CHANGELOG_FIX.md` | Re-seed database |
| Auth fail | `SYNC_CHECKLIST.md` Phase 5 | Check token |

### Commands Hữu Ích

```bash
# Kiểm tra sync
cd backend && npm run check

# Reset database
cd backend && npm run db:reset

# Restart everything
# Ctrl+C to stop, then:
npm run dev

# Check logs
# Backend: xem terminal
# Frontend: F12 → Console
```

---

## 📖 Danh Sách Tài Liệu Đầy Đủ

### Setup & Getting Started
- ✅ **`START_HERE.md`** (file này) - Điểm bắt đầu
- ✅ **`QUICK_START.md`** - Hướng dẫn setup chi tiết
- ✅ **`README_DOCUMENTATION.md`** - Tổng quan tất cả docs

### Debugging
- ✅ **`DEBUG_ROUTES_ISSUE.md`** - Debug routes không load
- ✅ **`SYNC_CHECKLIST.md`** - Kiểm tra đồng bộ toàn diện

### Testing
- ✅ **`TESTING.md`** - 75+ test cases

### Reference
- ✅ **`CHANGELOG_FIX.md`** - Lịch sử thay đổi

### Tools
- ✅ **`backend/check-sync.js`** - Auto check script
- ✅ **`check-all.bat`** - Windows one-click check

---

## 🎯 Workflow Khuyến Nghị

### Mỗi Ngày Làm Việc

```bash
# 1. Pull code mới
git pull

# 2. Check sync
cd backend && npm run check

# 3. Nếu có issues, re-seed
npm run seed

# 4. Start dev
npm run dev  # Backend
cd ../frontend && npm run dev  # Frontend

# 5. Kiểm tra health
curl http://localhost:5000/health
```

### Trước Khi Commit

```bash
# 1. Run check
cd backend && npm run check

# 2. Test relevant features (TESTING.md)

# 3. Check console không có errors
# F12 → Console tab

# 4. Commit
git add .
git commit -m "Your message"
```

### Trước Khi Deploy

```bash
# 1. Full sync check
cd backend && npm run check

# 2. Follow SYNC_CHECKLIST.md - All 8 phases

# 3. Run critical tests (TESTING.md)

# 4. Review CHANGELOG_FIX.md

# 5. Deploy
```

---

## 🔧 NPM Scripts Có Sẵn

### Backend
```bash
npm run dev       # Start development server
npm run start     # Start production server
npm run seed      # Seed database with sample data
npm run check     # Run sync checker
npm run db:reset  # Clean & re-seed database
npm test          # Run tests
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 📊 Cấu Trúc Dự Án

```
Te_QuickRide/
├── 📄 START_HERE.md          ← BẠN ĐANG Ở ĐÂY
├── 📄 QUICK_START.md         ← Setup guide
├── 📄 SYNC_CHECKLIST.md      ← Full verification
├── 📄 TESTING.md             ← Test guide
├── 📄 DEBUG_ROUTES_ISSUE.md  ← Debug guide
├── 📄 CHANGELOG_FIX.md       ← Change history
├── 📄 README_DOCUMENTATION.md ← Docs overview
│
├── backend/
│   ├── check-sync.js         ← Auto checker
│   ├── src/
│   │   ├── controllers/      ← Business logic
│   │   ├── models/           ← Database schemas
│   │   ├── routes/           ← API routes
│   │   ├── middlewares/      ← Auth, validation
│   │   └── seeders/          ← Seed data
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/            ← Page components
│   │   ├── components/       ← Reusable components
│   │   ├── services/         ← API services
│   │   └── redux/            ← State management
│   └── package.json
│
└── check-all.bat             ← Windows checker
```

---

## ✅ Checklist Lần Đầu

- [ ] MongoDB installed & running
- [ ] Node.js >= 18 installed
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database seeded (`npm run seed`)
- [ ] Sync check passed (`npm run check`)
- [ ] Backend running (http://localhost:5000/health)
- [ ] Frontend running (http://localhost:5173)
- [ ] Test login works

---

## 🎓 Học Tập Dần Dần

### Week 1: Setup & Basic
- [ ] Setup theo `QUICK_START.md`
- [ ] Run `check-sync.js` hiểu output
- [ ] Đọc `README_DOCUMENTATION.md`
- [ ] Test login với tất cả roles

### Week 2: Development
- [ ] Đọc `SYNC_CHECKLIST.md` Phase 1-4
- [ ] Hiểu backend API structure
- [ ] Hiểu frontend services
- [ ] Test một feature end-to-end

### Week 3: Testing & Debug
- [ ] Làm 20 test cases trong `TESTING.md`
- [ ] Practice debug với `DEBUG_ROUTES_ISSUE.md`
- [ ] Hiểu `CHANGELOG_FIX.md`

### Week 4: Advanced
- [ ] Hoàn thành tất cả `SYNC_CHECKLIST.md`
- [ ] Contribute tests vào `TESTING.md`
- [ ] Optimize theo findings

---

## 💡 Pro Tips

### Quick Commands
```bash
# All-in-one check (Windows)
check-all.bat

# Quick sync check
cd backend && npm run check

# Quick restart
# Ctrl+C then ↑ Enter

# View logs real-time
tail -f backend/logs/*.log  # if logging configured
```

### VS Code Extensions
- ESLint
- Prettier
- MongoDB for VS Code
- REST Client (test APIs)
- GitLens

### Browser Extensions
- React Developer Tools
- Redux DevTools
- JSON Formatter

---

## 🚨 Quan Trọng!

### ⚠️ KHÔNG commit các file:
- `.env`
- `node_modules/`
- Build files (`dist/`, `build/`)
- Logs

### ✅ NÊN commit:
- Source code
- Documentation (*.md)
- Config examples (`.env.example`)
- Package files (`package.json`, `package-lock.json`)

---

## 📞 Cần Giúp Đỡ?

### Thứ tự xử lý vấn đề:
1. **Run `npm run check`** → Fix issues shown
2. **Search docs** → Ctrl+F trong relevant file
3. **Check DevTools** → F12 → Console & Network tabs
4. **Review logs** → Backend terminal output
5. **Ask team** → With logs & screenshots

### Khi hỏi, cung cấp:
- Screenshot Console (F12)
- Screenshot Network tab (F12)
- Backend terminal logs
- Output của `npm run check`
- Steps to reproduce

---

## 🎉 Bắt Đầu Nào!

Nếu đã setup xong:

```bash
# Backend terminal:
cd backend && npm run dev

# Frontend terminal:
cd frontend && npm run dev

# Browser:
http://localhost:5173

# Đăng nhập và khám phá! 🚀
```

---

**Happy Coding! 💻✨**

*Last updated: 2025-01-17*
