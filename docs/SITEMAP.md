# SITEMAP - QuickRide

> Sơ đồ cấu trúc trang web đầy đủ

## 🌐 PUBLIC PAGES

```
/
├── / (Landing Page) ⭐⭐⭐
├── /search (Search Results) ⭐⭐⭐
├── /trips/:tripId/seats (Trip Detail & Seat Selection) ⭐⭐⭐
├── /about (About Us)
├── /contact (Contact)
├── /blog (Blog/News)
│   └── /blog/:slug (Blog Post Detail)
├── /promotions (Promotions)
└── /help (Help Center / FAQ) ⭐⭐
```

---

## 🔐 AUTHENTICATION

```
/auth
├── /login ⭐⭐⭐
├── /register ⭐⭐⭐
├── /forgot-password
├── /reset-password/:token
├── /verify-email/:token
└── /verify-phone
```

---

## 👤 CUSTOMER PORTAL

```
/customer
├── /profile ⭐⭐
│   ├── /profile#personal
│   ├── /profile#saved-passengers
│   ├── /profile#change-password
│   └── /profile#loyalty
│
├── /bookings ⭐⭐⭐
│   ├── /bookings (List)
│   ├── /bookings/:bookingId (Detail)
│   └── /bookings/:bookingId/track (Tracking)
│
├── /tickets ⭐⭐
│   ├── /tickets (List)
│   └── /tickets/:ticketId (Detail with QR)
│
├── /reviews
│   ├── /reviews (List)
│   └── /bookings/:bookingId/review (Write Review)
│
├── /vouchers
│   ├── /vouchers#available
│   ├── /vouchers#collected
│   └── /vouchers#used
│
└── /notifications ⭐⭐
```

### CUSTOMER BOOKING FLOW

```
Booking Flow:
/
└── /search?from=...&to=...&date=...
    └── /trips/:tripId/seats (Select seats)
        └── /booking/passengers (Passenger info) ⭐⭐⭐
            └── /booking/payment (Payment) ⭐⭐⭐
                └── /booking/success/:bookingId (Success) ⭐⭐⭐
```

---

## 🚌 BUS OPERATOR PORTAL

```
/operator
├── /dashboard ⭐⭐
│
├── /profile ⭐⭐
│   ├── /profile#company
│   ├── /profile#address
│   ├── /profile#bank
│   └── /profile#verification
│
├── /buses ⭐⭐
│   ├── /buses (List)
│   ├── /buses/create (Create)
│   └── /buses/:busId/edit (Edit)
│
├── /routes ⭐⭐
│   ├── /routes (List)
│   ├── /routes/create (Create)
│   └── /routes/:routeId/edit (Edit)
│
├── /trips ⭐⭐
│   ├── /trips (List)
│   ├── /trips/create (Create) ⭐⭐
│   ├── /trips/:tripId/edit (Edit)
│   └── /trips/:tripId/bookings (Bookings for trip)
│
├── /bookings ⭐⭐
│   ├── /bookings (List)
│   └── /bookings/:bookingId (Detail)
│
├── /staff
│   ├── /staff (List)
│   ├── /staff/create (Create)
│   └── /staff/:staffId/edit (Edit)
│
├── /analytics ⭐⭐
│   ├── /analytics#revenue
│   ├── /analytics#trips
│   └── /analytics#occupancy
│
├── /reviews
│   ├── /reviews (List)
│   └── /reviews/:reviewId/respond (Respond)
│
└── /promotions
    ├── /promotions (List)
    ├── /promotions/create (Create)
    └── /promotions/:promotionId/edit (Edit)
```

---

## 👨‍💼 ADMIN PORTAL

```
/admin
├── /dashboard ⭐⭐
│
├── /operators ⭐⭐
│   ├── /operators (List)
│   ├── /operators/:operatorId (Detail)
│   ├── /operators/:operatorId/approve (Approve)
│   └── /operators/:operatorId/suspend (Suspend)
│
├── /users ⭐⭐
│   ├── /users (List)
│   ├── /users/:userId (Detail)
│   └── /users/:userId/block (Block/Unblock)
│
├── /bookings ⭐⭐
│   ├── /bookings (List)
│   ├── /bookings/:bookingId (Detail)
│   └── /bookings/:bookingId/refund (Process Refund)
│
├── /vouchers
│   ├── /vouchers (List)
│   ├── /vouchers/create (Create)
│   └── /vouchers/:voucherId/edit (Edit)
│
├── /analytics ⭐⭐
│   ├── /analytics#revenue
│   ├── /analytics#bookings
│   ├── /analytics#users
│   └── /analytics#operators
│
└── /settings
    ├── /settings#general
    ├── /settings#payment
    ├── /settings#email
    ├── /settings#sms
    ├── /settings#notifications
    └── /settings#security
```

---

## 📊 PAGES BY PHASE

### PHASE 1: MVP (15 pages)

```
Public (5):
✅ / (Landing)
✅ /search
✅ /trips/:tripId/seats
✅ /about
✅ /contact

Auth (3):
✅ /login
✅ /register
✅ /forgot-password

Customer (5):
✅ /booking/passengers
✅ /booking/payment
✅ /booking/success/:bookingId
✅ /customer/bookings
✅ /customer/bookings/:bookingId

Operator (2):
✅ /operator/dashboard
✅ /operator/trips/create
```

---

### PHASE 2: Enhanced (12 pages)

```
Customer (4):
✅ /customer/profile
✅ /customer/tickets
✅ /customer/tickets/:ticketId
✅ /customer/bookings/:bookingId/track

Operator (6):
✅ /operator/profile
✅ /operator/buses
✅ /operator/buses/create & edit
✅ /operator/routes
✅ /operator/routes/create & edit
✅ /operator/trips

Admin (2):
✅ /admin/dashboard
✅ /admin/operators
```

---

### PHASE 3: Advanced (10 pages)

```
Customer (3):
✅ /customer/reviews
✅ /bookings/:bookingId/review
✅ /customer/notifications

Operator (4):
✅ /operator/bookings
✅ /operator/analytics
✅ /operator/reviews
✅ /operator/staff

Admin (3):
✅ /admin/users
✅ /admin/bookings
✅ /admin/analytics
```

---

### PHASE 4: Premium (8 pages)

```
Public (4):
✅ /blog
✅ /blog/:slug
✅ /promotions
✅ /help

Customer (1):
✅ /customer/vouchers

Operator (1):
✅ /operator/promotions

Admin (2):
✅ /admin/vouchers
✅ /admin/settings
```

---

## 🔗 NAVIGATION STRUCTURE

### PUBLIC HEADER

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] QuickRide    Trang chủ  Về chúng tôi  Khuyến mãi    │
│                     Liên hệ    Blog           [Đăng nhập]   │
└─────────────────────────────────────────────────────────────┘
```

---

### CUSTOMER SIDEBAR/MENU

```
┌──────────────────────┐
│ 👤 Profile           │
├──────────────────────┤
│ 📋 Đặt vé của tôi    │
│ 🎫 Vé của tôi        │
│ ⭐ Đánh giá          │
│ 🎁 Voucher           │
│ 🔔 Thông báo         │
│ ⚙️ Cài đặt           │
│ 🚪 Đăng xuất         │
└──────────────────────┘
```

---

### OPERATOR SIDEBAR/MENU

```
┌──────────────────────┐
│ 📊 Dashboard         │
├──────────────────────┤
│ 🚌 Quản lý xe        │
│ 🛣️ Quản lý tuyến     │
│ 🗓️ Quản lý chuyến    │
│ 📋 Đặt vé            │
│ 👥 Nhân viên         │
│ 📈 Thống kê          │
│ ⭐ Đánh giá          │
│ 🎁 Khuyến mãi        │
│ 👤 Hồ sơ công ty     │
│ 🚪 Đăng xuất         │
└──────────────────────┘
```

---

### ADMIN SIDEBAR/MENU

```
┌──────────────────────┐
│ 📊 Dashboard         │
├──────────────────────┤
│ 🏢 Nhà xe            │
│ 👥 Người dùng        │
│ 📋 Đặt vé            │
│ 🎫 Voucher           │
│ 📈 Thống kê          │
│ ⚙️ Cài đặt hệ thống  │
│ 🚪 Đăng xuất         │
└──────────────────────┘
```

---

## 📱 MOBILE BOTTOM NAVIGATION

### Customer Mobile App

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  🏠     │  🔍     │  📋     │  🎫     │  👤     │
│ Trang   │ Tìm     │  Đặt    │  Vé     │  Tôi    │
│  chủ    │ kiếm    │  vé     │         │         │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

### Operator Mobile App

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  📊     │  🗓️     │  📋     │  📈     │  👤     │
│ Tổng    │ Chuyến  │  Đặt    │ Thống   │ Hồ sơ   │
│ quan    │  đi     │  vé     │  kê     │         │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

---

## 🎨 LAYOUT TEMPLATES

### Template 1: Public Layout
**Used for**: Landing, Search, About, Contact, Blog

```
┌─────────────────────────────────────────┐
│           Header + Navigation           │
├─────────────────────────────────────────┤
│                                         │
│              Main Content               │
│                                         │
├─────────────────────────────────────────┤
│               Footer                    │
└─────────────────────────────────────────┘
```

---

### Template 2: Dashboard Layout
**Used for**: Customer/Operator/Admin portals

```
┌──────────┬──────────────────────────────┐
│          │        Top Bar               │
│          ├──────────────────────────────┤
│          │                              │
│ Sidebar  │       Main Content           │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

---

### Template 3: Booking Flow Layout
**Used for**: Seat selection, Passenger info, Payment

```
┌─────────────────────────────────────────┐
│         Header (Minimal)                │
├─────────────────────────────────────────┤
│  Progress: Step 1 → Step 2 → Step 3    │
├──────────────────────┬──────────────────┤
│                      │                  │
│    Main Content      │  Summary (Sticky)│
│                      │                  │
└──────────────────────┴──────────────────┘
```

---

## 🔒 ACCESS CONTROL

### Public Access (No login required)
- `/`
- `/search`
- `/trips/:tripId/seats`
- `/about`
- `/contact`
- `/blog`
- `/promotions`
- `/help`
- `/login`
- `/register`

---

### Customer Only
- `/customer/*`
- `/booking/*` (after seat selection)

---

### Operator Only
- `/operator/*`

---

### Admin Only
- `/admin/*`

---

### Shared (All authenticated users)
- `/notifications`
- `/profile` (redirects to role-specific profile)

---

## 🌍 INTERNATIONALIZATION (i18n)

### Supported Languages (Future)
- 🇻🇳 Vietnamese (Default)
- 🇬🇧 English
- 🇰🇷 Korean
- 🇯🇵 Japanese

### URL Structure
```
/vi-VN/...  (Vietnamese)
/en-US/...  (English)
/ko-KR/...  (Korean)
/ja-JP/...  (Japanese)
```

---

## 📄 TOTAL PAGE COUNT

| Category | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|----------|---------|---------|---------|---------|-------|
| **Public** | 5 | 0 | 0 | 4 | **9** |
| **Auth** | 3 | 0 | 0 | 0 | **3** |
| **Customer** | 5 | 4 | 3 | 1 | **13** |
| **Operator** | 2 | 6 | 4 | 1 | **13** |
| **Admin** | 0 | 2 | 3 | 2 | **7** |
| **Total** | **15** | **12** | **10** | **8** | **45** |

---

**Version**: 1.0
**Last Updated**: 2025-01-16
