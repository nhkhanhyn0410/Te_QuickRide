# 📚 Te_QuickRide - Tài Liệu Hệ Thống

## Tổng Quan Các Tài Liệu

Dự án có các file tài liệu sau để hỗ trợ development và testing:

### 🚀 Quick Start
- **`QUICK_START.md`** - Hướng dẫn khởi động nhanh dự án
  - Cài đặt dependencies
  - Cấu hình environment
  - Seed database
  - Start services
  - Test accounts

### 🔧 Debugging & Troubleshooting
- **`DEBUG_ROUTES_ISSUE.md`** - Debug vấn đề routes không tải
  - Checklist kiểm tra từng bước
  - Các lỗi thường gặp và cách fix
  - Commands hữu ích

### ✅ Sync & Verification
- **`SYNC_CHECKLIST.md`** - Checklist đồng bộ Backend-Frontend-Database
  - 8 phases kiểm tra chi tiết
  - Database structure
  - Backend API endpoints
  - Frontend services
  - Field mappings
  - Authentication flow
  - CRUD operations
  - Integration testing

### 🧪 Testing
- **`TESTING.md`** - Quy trình test tất cả tính năng
  - 75+ test cases
  - Expected results
  - Error case handling
  - Checklist tổng thể

### 📝 Change Log
- **`CHANGELOG_FIX.md`** - Chi tiết tất cả thay đổi đã làm
  - Bug fixes
  - New features
  - Field mappings
  - Files modified/created
  - Migration guide

### 🔍 Automated Checks
- **`backend/check-sync.js`** - Script tự động kiểm tra sync
  - Database connection
  - Collections check
  - Document counts
  - Field names verification
  - Data integrity

- **`check-all.bat`** - Windows batch script
  - Check MongoDB running
  - Check dependencies installed
  - Run database sync check
  - Show next steps

---

## 🎯 Workflow Khuyến Nghị

### Lần Đầu Setup

```bash
# 1. Đọc quick start
cat QUICK_START.md

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Setup environment
cd backend
cp .env.example .env
# Edit .env file

# 4. Seed database
npm run seed

# 5. Chạy automated check
node check-sync.js

# Hoặc trên Windows:
# Double-click: check-all.bat
```

### Khi Gặp Lỗi

```bash
# 1. Check SYNC_CHECKLIST.md
# Xem Phase tương ứng với lỗi

# 2. Nếu lỗi routes
cat DEBUG_ROUTES_ISSUE.md

# 3. Run automated check
cd backend
node check-sync.js

# 4. Check logs
# Backend: npm run dev (xem console)
# Frontend: F12 → Console tab
```

### Trước Khi Deploy

```bash
# 1. Run full sync check
cd backend
node check-sync.js

# 2. Run all tests theo TESTING.md
# Check từng module

# 3. Verify bằng SYNC_CHECKLIST.md
# Đi qua tất cả 8 phases

# 4. Review CHANGELOG_FIX.md
# Đảm bảo hiểu tất cả thay đổi
```

---

## 📖 Cách Sử Dụng Từng File

### QUICK_START.md
**Dùng khi:** Setup project lần đầu hoặc onboard developer mới

**Nội dung:**
- Installation steps
- Configuration guide
- Seed data setup
- Start commands
- Test accounts
- Common commands
- Troubleshooting basics

**Command:**
```bash
cat QUICK_START.md | less
# Hoặc mở trong VS Code
```

---

### DEBUG_ROUTES_ISSUE.md
**Dùng khi:** Trang `/routes` hoặc API không load data

**Nội dung:**
- 5-step checklist debug
- Backend API testing
- Frontend DevTools checking
- CORS issues
- Response format issues
- Common errors & fixes

**Command:**
```bash
# Follow step by step
cat DEBUG_ROUTES_ISSUE.md
```

---

### SYNC_CHECKLIST.md
**Dùng khi:** Cần verify toàn bộ hệ thống hoặc tìm vấn đề đồng bộ

**Nội dung:**
- **Phase 1:** Database Structure (collections, seed data, field names)
- **Phase 2:** Backend API Endpoints (public, protected, admin)
- **Phase 3:** Frontend Services (API calls matching backend)
- **Phase 4:** Field Mappings (Trip, Booking, User models)
- **Phase 5:** Authentication Flow (JWT, roles, permissions)
- **Phase 6:** CRUD Operations (Create, Read, Update, Delete)
- **Phase 7:** Integration Testing (complete flows)
- **Phase 8:** Final Verification (pages load, no errors)

**Command:**
```bash
# Đi qua từng phase
cat SYNC_CHECKLIST.md | grep "Phase"

# Hoặc search specific issue
cat SYNC_CHECKLIST.md | grep -A 10 "Trip Field Mapping"
```

---

### TESTING.md
**Dùng khi:** Manual testing hoặc QA

**Nội dung:**
- Chuẩn bị môi trường
- Test Authentication (5 tests)
- Test User Management (3 tests)
- Test Operator Management (3 tests)
- Test Trip & Route Management (8 tests)
- Test Booking Flow (8 tests)
- Test Payment (2 tests)
- Test Ticket (5 tests)
- Test Analytics (7 tests)
- Test Settings (4 tests)
- Test Notifications (6 tests)
- **Total: 75+ test cases**

**Command:**
```bash
# View test checklist
cat TESTING.md | grep "Test [0-9]"
```

---

### CHANGELOG_FIX.md
**Dùng khi:** Cần hiểu thay đổi gần đây hoặc migration

**Nội dung:**
- Tóm tắt thay đổi
- Critical fixes (field mismatch, 404 errors)
- New features (Settings, Analytics modules)
- Files modified (10 files)
- Files created (7 files)
- Migration guide
- Deployment notes

**Command:**
```bash
# View summary
head -50 CHANGELOG_FIX.md

# View specific section
cat CHANGELOG_FIX.md | grep -A 20 "Field Mismatch"
```

---

### check-sync.js
**Dùng khi:** Cần kiểm tra nhanh database sync

**Features:**
- Auto-connect MongoDB
- Check collections exist
- Count documents
- Verify field names (driverId vs driver)
- Check active status
- Detect orphaned data
- Summary report

**Command:**
```bash
cd backend
node check-sync.js

# Expected output:
# ✅ All checks passed! Database is in sync.
```

---

### check-all.bat
**Dùng khi:** Windows user, cần check toàn bộ một lần

**Features:**
- Check MongoDB running
- Check backend dependencies
- Check frontend dependencies
- Run database sync check
- Show next steps

**Command:**
```bash
# Double-click file trong Windows Explorer
# Hoặc:
check-all.bat
```

---

## 🔍 Troubleshooting Guide

### Vấn Đề: Không biết bắt đầu từ đâu
**Giải pháp:**
1. Đọc `QUICK_START.md`
2. Run `check-all.bat` (Windows) hoặc `node backend/check-sync.js`
3. Follow instructions

### Vấn Đề: Database không có data
**Giải pháp:**
```bash
cd backend
npm run seed
node check-sync.js
```

### Vấn Đề: API trả về 404
**Giải pháp:**
1. Đọc `DEBUG_ROUTES_ISSUE.md` - Section 3
2. Check `SYNC_CHECKLIST.md` - Phase 2
3. Verify route registered trong `backend/src/app.js`

### Vấn Đề: Frontend không parse được data
**Giải pháp:**
1. F12 → Console → Check logs
2. F12 → Network → Check response format
3. Đọc `SYNC_CHECKLIST.md` - Phase 3.3

### Vấn Đề: Field mismatch errors
**Giải pháp:**
1. Run `node backend/check-sync.js`
2. Check `SYNC_CHECKLIST.md` - Phase 4
3. Read `CHANGELOG_FIX.md` - Section về field mismatch

### Vấn Đề: Auth không hoạt động
**Giải pháp:**
1. Check `SYNC_CHECKLIST.md` - Phase 5
2. Test với `TESTING.md` - Authentication tests
3. Verify JWT secret trong `.env`

---

## 📊 File Summary Table

| File | Purpose | When to Use | Time to Read |
|------|---------|-------------|--------------|
| QUICK_START.md | Setup guide | First time, onboarding | 10 min |
| DEBUG_ROUTES_ISSUE.md | Debug routes | Routes 404 or empty | 15 min |
| SYNC_CHECKLIST.md | Full system check | Complete verification | 30-60 min |
| TESTING.md | Test guide | QA, manual testing | 45-90 min |
| CHANGELOG_FIX.md | Change history | Understand changes | 20 min |
| check-sync.js | Auto check | Quick verification | 1 min |
| check-all.bat | Windows check | One-click check | 2 min |

---

## 🎓 Learning Path

### Beginner (Mới join project)
1. Read `QUICK_START.md`
2. Run `check-all.bat` or `check-sync.js`
3. Follow setup steps
4. Read `TESTING.md` - hiểu features

### Intermediate (Đang develop)
1. Use `SYNC_CHECKLIST.md` - verify work
2. Run `check-sync.js` before commit
3. Test theo `TESTING.md` - relevant sections
4. Read `DEBUG_ROUTES_ISSUE.md` khi gặp lỗi

### Advanced (Debug/Optimize)
1. Use `SYNC_CHECKLIST.md` - find root cause
2. Read `CHANGELOG_FIX.md` - understand history
3. Modify `check-sync.js` - add custom checks
4. Contribute to `TESTING.md` - add new tests

---

## 🚨 Critical Files to Read Before...

### Before First Run
- [ ] QUICK_START.md
- [ ] Run check-sync.js

### Before Making Changes
- [ ] SYNC_CHECKLIST.md (relevant phase)
- [ ] CHANGELOG_FIX.md (understand current state)

### Before Deployment
- [ ] SYNC_CHECKLIST.md (all phases)
- [ ] TESTING.md (run all tests)
- [ ] check-sync.js (verify database)

### When Debugging
- [ ] DEBUG_ROUTES_ISSUE.md (if routes issue)
- [ ] SYNC_CHECKLIST.md (Phase 2-4)
- [ ] check-sync.js output

---

## 💡 Tips

### Quick Commands
```bash
# Check everything at once
cd backend && node check-sync.js

# Verify specific issue
cat SYNC_CHECKLIST.md | grep -A 10 "your-issue"

# Quick test
cat TESTING.md | grep "Test 1.1" -A 20

# See recent changes
head -100 CHANGELOG_FIX.md
```

### VS Code Tips
```json
// Add to .vscode/settings.json
{
  "files.associations": {
    "*.md": "markdown"
  },
  "markdown.preview.breaks": true
}
```

### Bookmark in Browser
- http://localhost:5000/health
- http://localhost:5000/api
- http://localhost:5173

---

## 📞 Support

### Documentation Issues
Nếu tài liệu không rõ hoặc thiếu:
1. Check file gần nhất với issue
2. Run automated checks
3. Create issue với logs

### System Issues
1. Run `check-sync.js`
2. Check relevant Phase in `SYNC_CHECKLIST.md`
3. Follow `DEBUG_ROUTES_ISSUE.md` if applicable
4. Review `CHANGELOG_FIX.md` for recent changes

---

## ✅ Quick Health Check

```bash
# 1. MongoDB running?
mongosh --eval "db.version()" --quiet

# 2. Database sync?
cd backend && node check-sync.js

# 3. Backend running?
curl http://localhost:5000/health

# 4. Frontend running?
curl http://localhost:5173

# All OK? You're good to go! 🚀
```

---

**Last Updated:** 2025-01-17
**Maintained by:** Development Team
**Version:** 1.0.0
