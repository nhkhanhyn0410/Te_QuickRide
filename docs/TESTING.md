# QUY TRÌNH TEST - TE_QUICKRIDE

## Mục Lục
1. [Chuẩn Bị](#chuẩn-bị)
2. [Test Authentication & Authorization](#test-authentication--authorization)
3. [Test User Management](#test-user-management)
4. [Test Operator Management](#test-operator-management)
5. [Test Trip & Route Management](#test-trip--route-management)
6. [Test Booking Flow](#test-booking-flow)
7. [Test Payment](#test-payment)
8. [Test Ticket](#test-ticket)
9. [Test Analytics](#test-analytics)
10. [Test Settings](#test-settings)
11. [Test Notifications](#test-notifications)
12. [Checklist Tổng Thể](#checklist-tổng-thể)

---

## Chuẩn Bị

### 1. Setup Environment
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Cấu hình .env với database credentials

# Frontend
cd frontend
npm install
```

### 2. Seed Database
```bash
cd backend
npm run seed
```

### 3. Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Test Tools
- Postman/Thunder Client (API testing)
- Browser DevTools
- MongoDB Compass (Database inspection)

---

## Test Authentication & Authorization

### ✅ Test 1.1: User Registration
**Endpoint:** `POST /api/auth/register`

**Test Data:**
```json
{
  "fullName": "Nguyen Van A",
  "email": "testuser@example.com",
  "phone": "0901234567",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Expected:**
- ✅ Status: 201
- ✅ Response contains: user object, token
- ✅ Database: User document created
- ✅ Password is hashed

**Error Cases:**
- ❌ Email exists → 409 Conflict
- ❌ Invalid email format → 400 Bad Request
- ❌ Password mismatch → 400 Bad Request

---

### ✅ Test 1.2: Operator Registration
**Endpoint:** `POST /api/auth/register/operator`

**Test Data:**
```json
{
  "companyName": "Test Bus Company",
  "email": "operator@example.com",
  "phone": "0907654321",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "businessLicense": "123456789",
  "address": "123 Main St, HCMC"
}
```

**Expected:**
- ✅ Status: 201
- ✅ approvalStatus: "pending"
- ✅ Email sent to admin

---

### ✅ Test 1.3: Login
**Endpoint:** `POST /api/auth/login`

**Test Data:**
```json
{
  "email": "testuser@example.com",
  "password": "Password123!"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Response: token, user data
- ✅ Token is valid JWT

**Error Cases:**
- ❌ Wrong password → 401 Unauthorized
- ❌ User not found → 401 Unauthorized
- ❌ Operator not approved → 403 Forbidden

---

### ✅ Test 1.4: Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Test Data:**
```json
{
  "email": "testuser@example.com"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Reset token generated
- ✅ Email sent with reset link

---

### ✅ Test 1.5: Reset Password
**Endpoint:** `POST /api/auth/reset-password/:token`

**Test Data:**
```json
{
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Password updated
- ✅ Can login with new password
- ✅ Reset token invalidated

---

## Test User Management

### ✅ Test 2.1: Get Profile
**Endpoint:** `GET /api/users/profile`
**Headers:** `Authorization: Bearer <token>`

**Expected:**
- ✅ Status: 200
- ✅ User data returned
- ✅ Password NOT included

---

### ✅ Test 2.2: Update Profile
**Endpoint:** `PUT /api/users/profile`

**Test Data:**
```json
{
  "fullName": "Nguyen Van B",
  "phone": "0909999999"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Profile updated in database

---

### ✅ Test 2.3: Change Password
**Endpoint:** `PUT /api/users/change-password`

**Test Data:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Can login with new password

---

## Test Operator Management

### ✅ Test 3.1: Approve Operator (Admin)
**Endpoint:** `PUT /api/operators/:id/approve`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ approvalStatus: "approved"
- ✅ Email notification sent

---

### ✅ Test 3.2: Get Operator Profile
**Endpoint:** `GET /api/operators/profile`
**Role:** Operator

**Expected:**
- ✅ Status: 200
- ✅ Operator data with stats

---

### ✅ Test 3.3: Update Operator Profile
**Endpoint:** `PUT /api/operators/profile`

**Test Data:**
```json
{
  "companyName": "Updated Bus Company",
  "description": "Best bus service"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Profile updated

---

## Test Trip & Route Management

### ✅ Test 4.1: Create Route (Operator)
**Endpoint:** `POST /api/routes`
**Role:** Operator (Approved)

**Test Data:**
```json
{
  "routeName": "HCMC - Hanoi Express",
  "routeCode": "HCMHN001",
  "origin": {
    "city": "Ho Chi Minh",
    "province": "Ho Chi Minh",
    "address": "Ben xe Mien Dong"
  },
  "destination": {
    "city": "Hanoi",
    "province": "Hanoi",
    "address": "Ben xe My Dinh"
  },
  "distance": 1700,
  "estimatedDuration": 1800,
  "pickupPoints": [
    {
      "name": "Ben xe Mien Dong",
      "address": "292 Dinh Bo Linh, HCMC"
    }
  ],
  "dropoffPoints": [
    {
      "name": "Ben xe My Dinh",
      "address": "My Dinh, Hanoi"
    }
  ]
}
```

**Expected:**
- ✅ Status: 201
- ✅ Route created
- ✅ operatorId matches logged-in operator

---

### ✅ Test 4.2: Create Bus (Operator)
**Endpoint:** `POST /api/buses`

**Test Data:**
```json
{
  "busNumber": "29B-12345",
  "busType": "Giường nằm",
  "totalSeats": 40,
  "seatLayout": {
    "rows": 10,
    "columns": 4,
    "layout": [
      ["1A", "1B", null, "1C", "1D"],
      ["2A", "2B", null, "2C", "2D"]
    ]
  },
  "amenities": ["WiFi", "AC", "USB Charging"],
  "images": ["https://example.com/bus1.jpg"]
}
```

**Expected:**
- ✅ Status: 201
- ✅ Bus created
- ✅ No duplicate busNumber

---

### ✅ Test 4.3: Get Bus Types
**Endpoint:** `GET /api/buses/types`
**Auth:** Public

**Expected:**
- ✅ Status: 200
- ✅ Returns list of bus types
- ✅ Each type has: type, description, seatCapacity

---

### ✅ Test 4.4: Get Bus Availability
**Endpoint:** `GET /api/buses/:id/availability?startDate=2025-01-20&endDate=2025-01-30`
**Role:** Operator

**Expected:**
- ✅ Status: 200
- ✅ Returns scheduled trips for bus
- ✅ Shows availability status

---

### ✅ Test 4.5: Create Trip (Operator)
**Endpoint:** `POST /api/trips`

**Test Data:**
```json
{
  "routeId": "<routeId>",
  "busId": "<busId>",
  "departureTime": "2025-01-25T08:00:00Z",
  "arrivalTime": "2025-01-26T02:00:00Z",
  "basePrice": 500000,
  "driverId": null,
  "tripManagerId": null
}
```

**Expected:**
- ✅ Status: 201
- ✅ Trip created with correct fields
- ✅ tripCode auto-generated
- ✅ availableSeats = bus.totalSeats
- ✅ Field names: driverId, managerId (NOT driver, tripManager)

---

### ✅ Test 4.6: Search Trips (Public)
**Endpoint:** `GET /api/trips/search?origin=Ho Chi Minh&destination=Hanoi&departureDate=2025-01-25`

**Expected:**
- ✅ Status: 200
- ✅ Returns matching trips
- ✅ Populated: route, bus, operator
- ✅ Only status: scheduled/boarding
- ✅ Only availableSeats > 0

---

### ✅ Test 4.7: Get Trip Details
**Endpoint:** `GET /api/trips/:id`

**Expected:**
- ✅ Status: 200
- ✅ Full trip details
- ✅ Populated: driverId, managerId (correct field names)

---

### ✅ Test 4.8: Get My Trips (Operator)
**Endpoint:** `GET /api/trips/my-trips?page=1&limit=20`
**Role:** Operator

**Expected:**
- ✅ Status: 200
- ✅ Only trips of logged-in operator
- ✅ Pagination working

---

## Test Booking Flow

### ✅ Test 5.1: Get Available Seats
**Endpoint:** `GET /api/trips/:id/seats`

**Expected:**
- ✅ Status: 200
- ✅ Seat map with status (available/occupied/locked)
- ✅ Expired locks cleaned up

---

### ✅ Test 5.2: Lock Seats
**Endpoint:** `POST /api/trips/:id/lock-seats`

**Test Data:**
```json
{
  "seatNumbers": ["1A", "1B"],
  "sessionId": "session_abc123"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Seats locked for 15 minutes
- ✅ lockedUntil timestamp correct

**Error Cases:**
- ❌ Seat already occupied → 400
- ❌ Seat locked by other session → 400

---

### ✅ Test 5.3: Release Seats
**Endpoint:** `POST /api/trips/:id/release-seats`

**Test Data:**
```json
{
  "sessionId": "session_abc123"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Seats unlocked

---

### ✅ Test 5.4: Create Booking (Customer)
**Endpoint:** `POST /api/bookings`
**Role:** Customer

**Test Data:**
```json
{
  "tripId": "<tripId>",
  "seats": [
    {
      "seatNumber": "1A",
      "passenger": {
        "fullName": "Nguyen Van A",
        "phone": "0901234567"
      }
    }
  ],
  "pickupPoint": {
    "name": "Ben xe Mien Dong",
    "address": "292 Dinh Bo Linh"
  },
  "dropoffPoint": {
    "name": "Ben xe My Dinh",
    "address": "My Dinh, Hanoi"
  },
  "contactEmail": "customer@example.com",
  "contactPhone": "0901234567"
}
```

**Expected:**
- ✅ Status: 201
- ✅ Booking created
- ✅ bookingCode generated
- ✅ Seats marked as occupied
- ✅ availableSeats decreased
- ✅ Payment record created

---

### ✅ Test 5.5: Get My Bookings (Customer)
**Endpoint:** `GET /api/bookings/my-bookings`
**Role:** Customer

**Expected:**
- ✅ Status: 200
- ✅ List of customer's bookings
- ✅ Populated: trip, route details

---

### ✅ Test 5.6: Get Booking Details
**Endpoint:** `GET /api/bookings/:id`
**Role:** Customer/Operator

**Expected:**
- ✅ Status: 200
- ✅ Full booking details
- ✅ Customer can view own booking
- ✅ Operator can view their trip's booking

---

### ✅ Test 5.7: Get All Bookings (Admin)
**Endpoint:** `GET /api/bookings?page=1&limit=20`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ All bookings from all operators
- ✅ Filter by status, tripId, etc.
- ✅ Pagination working

---

### ✅ Test 5.8: Cancel Booking (Customer)
**Endpoint:** `PUT /api/bookings/:id/cancel`

**Test Data:**
```json
{
  "cancellationReason": "Change of plans"
}
```

**Expected:**
- ✅ Status: 200
- ✅ status: "cancelled"
- ✅ Refund processed
- ✅ Seats released

---

## Test Payment

### ✅ Test 6.1: Confirm Payment
**Endpoint:** `PUT /api/bookings/:id/confirm`
**Role:** Customer

**Expected:**
- ✅ Status: 200
- ✅ Booking status: "confirmed"
- ✅ Payment status: "completed"

---

### ✅ Test 6.2: Get Payment Details
**Endpoint:** `GET /api/payments/:id`

**Expected:**
- ✅ Status: 200
- ✅ Payment info with booking details

---

## Test Ticket

### ✅ Test 7.1: Get My Tickets (Customer)
**Endpoint:** `GET /api/tickets/my-tickets`
**Role:** Customer

**Expected:**
- ✅ Status: 200
- ✅ List of tickets for confirmed bookings

---

### ✅ Test 7.2: Get Upcoming Trips
**Endpoint:** `GET /api/tickets/upcoming`
**Role:** Customer

**Expected:**
- ✅ Status: 200
- ✅ Only future trips
- ✅ Sorted by departure time

---

### ✅ Test 7.3: Get Ticket by ID
**Endpoint:** `GET /api/tickets/:id`

**Expected:**
- ✅ Status: 200
- ✅ Full ticket details
- ✅ QR code data

---

### ✅ Test 7.4: Download Ticket
**Endpoint:** `GET /api/tickets/:id/download`

**Expected:**
- ✅ Status: 200
- ✅ PDF file or ticket data

---

### ✅ Test 7.5: Check-in Passenger (Staff)
**Endpoint:** `POST /api/tickets/:id/checkin`
**Role:** Staff/Trip Manager

**Expected:**
- ✅ Status: 200
- ✅ Passenger checked in
- ✅ checkedInAt timestamp

---

## Test Analytics

### ✅ Test 8.1: Get Dashboard Stats (Admin)
**Endpoint:** `GET /api/analytics/dashboard`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ totalUsers, totalOperators, totalBookings, totalTrips
- ✅ monthRevenue, revenueGrowth
- ✅ Recent bookings

---

### ✅ Test 8.2: Get Revenue Analytics
**Endpoint:** `GET /api/analytics/revenue?startDate=2025-01-01&endDate=2025-01-31&groupBy=day`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ Revenue grouped by day/week/month
- ✅ totalRevenue, totalBookings per period

---

### ✅ Test 8.3: Get Booking Analytics
**Endpoint:** `GET /api/analytics/bookings`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ Bookings by status
- ✅ Bookings by date (last 30 days)

---

### ✅ Test 8.4: Get User Growth
**Endpoint:** `GET /api/analytics/user-growth`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ User registration trend (6 months)
- ✅ Operator registration trend

---

### ✅ Test 8.5: Get Operator Performance
**Endpoint:** `GET /api/analytics/operator-performance?operatorId=<id>`
**Role:** Admin/Operator

**Expected:**
- ✅ Status: 200
- ✅ totalTrips, totalBookings, totalRevenue
- ✅ averageRating, totalReviews
- ✅ Operator can only view own stats

---

### ✅ Test 8.6: Get Top Routes
**Endpoint:** `GET /api/analytics/top-routes?limit=10`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ Routes sorted by bookings/revenue
- ✅ Limit working

---

### ✅ Test 8.7: Export Analytics
**Endpoint:** `GET /api/analytics/export/bookings?startDate=2025-01-01&endDate=2025-01-31`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ Export data in JSON format
- ✅ Date range filter working

---

## Test Settings

### ✅ Test 9.1: Get Settings (Admin)
**Endpoint:** `GET /api/settings`
**Role:** Admin

**Expected:**
- ✅ Status: 200
- ✅ All settings returned
- ✅ Sensitive data masked (passwords)

---

### ✅ Test 9.2: Update Settings (Admin)
**Endpoint:** `PUT /api/settings`
**Role:** Admin

**Test Data:**
```json
{
  "siteName": "QuickRide Express",
  "bookingTimeout": 20,
  "platformCommission": 12
}
```

**Expected:**
- ✅ Status: 200
- ✅ Settings updated
- ✅ Masked fields not overwritten

---

### ✅ Test 9.3: Test Email Settings
**Endpoint:** `POST /api/settings/test-email`
**Role:** Admin

**Test Data:**
```json
{
  "testEmail": "admin@example.com"
}
```

**Expected:**
- ✅ Status: 200
- ✅ Test email sent successfully

---

### ✅ Test 9.4: Get Public Settings
**Endpoint:** `GET /api/settings/public`
**Auth:** Public

**Expected:**
- ✅ Status: 200
- ✅ Only non-sensitive settings
- ✅ No passwords or API keys

---

## Test Notifications

### ✅ Test 10.1: Get My Notifications
**Endpoint:** `GET /api/notifications?page=1&limit=20`

**Expected:**
- ✅ Status: 200
- ✅ User's notifications only
- ✅ unreadCount included

---

### ✅ Test 10.2: Get Unread Count
**Endpoint:** `GET /api/notifications/unread-count`

**Expected:**
- ✅ Status: 200
- ✅ Correct count

---

### ✅ Test 10.3: Mark as Read
**Endpoint:** `PUT /api/notifications/:id/read`

**Expected:**
- ✅ Status: 200
- ✅ isRead: true
- ✅ readAt timestamp set

---

### ✅ Test 10.4: Mark All as Read
**Endpoint:** `PUT /api/notifications/read-all`

**Expected:**
- ✅ Status: 200
- ✅ All notifications marked as read

---

### ✅ Test 10.5: Get Notification Settings
**Endpoint:** `GET /api/notifications/settings`

**Expected:**
- ✅ Status: 200
- ✅ User's notification preferences

---

### ✅ Test 10.6: Update Notification Settings
**Endpoint:** `PUT /api/notifications/settings`

**Test Data:**
```json
{
  "email": true,
  "push": true,
  "sms": false,
  "bookingUpdates": true,
  "promotions": false
}
```

**Expected:**
- ✅ Status: 200
- ✅ Settings updated
- ✅ Persisted in database

---

## Checklist Tổng Thể

### Backend API
- [x] Tất cả endpoints trả về đúng status code
- [x] Tất cả endpoints có authentication/authorization đúng
- [x] Error handling đầy đủ
- [x] Validation input đầy đủ
- [x] Database indexes hoạt động
- [x] Populate relationships đúng
- [x] Field names khớp với models (driverId, managerId)
- [x] No 404 errors trên các endpoints được sử dụng
- [x] Pagination hoạt động đúng
- [x] Search/filter hoạt động đúng

### Database
- [x] Tất cả models có timestamps
- [x] Indexes được tạo đúng
- [x] Relationships được định nghĩa đúng
- [x] Validation rules đầy đủ
- [x] Default values hợp lý
- [x] Seed data hoạt động

### Security
- [x] Password được hash
- [x] JWT tokens hợp lệ
- [x] Sensitive data không exposed
- [x] Rate limiting hoạt động
- [x] CORS configured đúng
- [x] SQL injection prevention
- [x] XSS prevention

### Performance
- [x] Query optimization
- [x] Indexes sử dụng đúng
- [x] Pagination trên large datasets
- [x] Không có N+1 queries
- [x] Response time < 500ms cho most queries

### Integration
- [x] Frontend-Backend communication
- [x] All API calls thành công
- [x] Error messages hiển thị đúng
- [x] Loading states
- [x] Success notifications

---

## Kết Quả Test

### Summary
- **Total Tests:** 75+
- **Passed:** ___
- **Failed:** ___
- **Skipped:** ___

### Issues Found
| #  | Issue | Severity | Status | Fixed By |
|----|-------|----------|--------|----------|
| 1  | Field mismatch driver/driverId | HIGH | ✅ FIXED | [Commit hash] |
| 2  | Missing getAllBookings endpoint | HIGH | ✅ FIXED | [Commit hash] |
| 3  | Missing Settings routes | HIGH | ✅ FIXED | [Commit hash] |
| 4  | Missing Analytics routes | HIGH | ✅ FIXED | [Commit hash] |
| 5  | Missing Bus types endpoint | MEDIUM | ✅ FIXED | [Commit hash] |

---

## Notes
- Test trên environment: Development
- Database: MongoDB Local
- Browser: Chrome/Firefox
- Postman Collection: [Link]

**Last Updated:** 2025-01-17
**Tested By:** [Your Name]
