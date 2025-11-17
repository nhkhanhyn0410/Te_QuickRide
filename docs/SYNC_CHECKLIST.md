# SYNC CHECKLIST - Kiểm Tra Đồng Bộ Backend - Frontend - Database

## Mục Lục
- [Phase 1: Database Structure](#phase-1-database-structure)
- [Phase 2: Backend API Endpoints](#phase-2-backend-api-endpoints)
- [Phase 3: Frontend Services](#phase-3-frontend-services)
- [Phase 4: Field Mappings](#phase-4-field-mappings)
- [Phase 5: Authentication Flow](#phase-5-authentication-flow)
- [Phase 6: CRUD Operations](#phase-6-crud-operations)
- [Phase 7: Integration Testing](#phase-7-integration-testing)
- [Phase 8: Final Verification](#phase-8-final-verification)

---

## Phase 1: Database Structure

### 1.1 Verify Database Connection
```bash
# MongoDB shell
mongosh mongodb://localhost:27017/te_quickride

# Expected: Connected successfully
```

**Checklist:**
- [ ] MongoDB server đang chạy
- [ ] Database `te_quickride` tồn tại
- [ ] Connection string trong `.env` đúng

### 1.2 Verify Collections Exist
```javascript
// In MongoDB shell
show collections

// Expected collections:
// - users
// - busoperators
// - routes
// - buses
// - trips
// - bookings
// - payments
// - tickets
// - staff
// - reviews
// - vouchers
// - notifications
// - systemlogs
// - settings
```

**Checklist:**
- [ ] Tất cả 14 collections tồn tại
- [ ] Mỗi collection có ít nhất 1 document (seed data)

### 1.3 Verify Seed Data
```javascript
// Count documents in each collection
db.users.countDocuments()  // Expected: >= 3
db.busoperators.countDocuments()  // Expected: >= 2
db.routes.countDocuments()  // Expected: >= 2
db.buses.countDocuments()  // Expected: >= 2
db.trips.countDocuments()  // Expected: >= 2
db.bookings.countDocuments()  // Expected: >= 1
```

**Checklist:**
- [ ] Users: >= 3 (customers + admin)
- [ ] Bus Operators: >= 2 (approved + pending)
- [ ] Routes: >= 2 (active routes)
- [ ] Buses: >= 2
- [ ] Trips: >= 2
- [ ] Bookings: >= 1

### 1.4 Verify Field Names in Database
```javascript
// Check Trip schema field names
db.trips.findOne({}, { driverId: 1, managerId: 1, driver: 1, tripManager: 1 })

// Expected: driverId and managerId exist, driver and tripManager should NOT exist
```

**Checklist:**
- [ ] Trip model sử dụng `driverId` (NOT `driver`)
- [ ] Trip model sử dụng `managerId` (NOT `tripManager`)
- [ ] Seed data đã được update với correct field names
- [ ] Không có field `driver` hoặc `tripManager` trong trips collection

### 1.5 Verify Active Status
```javascript
// Check active routes
db.routes.find({ isActive: true }).count()  // Expected: >= 2

// Check active buses
db.buses.find({ isActive: true }).count()  // Expected: >= 2

// Check approved operators
db.busoperators.find({ approvalStatus: 'approved' }).count()  // Expected: >= 1
```

**Checklist:**
- [ ] Có ít nhất 2 routes với `isActive: true`
- [ ] Có ít nhất 2 buses với `isActive: true`
- [ ] Có ít nhất 1 operator với `approvalStatus: 'approved'`

---

## Phase 2: Backend API Endpoints

### 2.1 Health Check
```bash
# Test health endpoint
curl http://localhost:5000/health

# OR in PowerShell:
Invoke-WebRequest -Uri "http://localhost:5000/health" | Select-Object -Expand Content
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Te_QuickRide API is running",
  "timestamp": "...",
  "environment": "development"
}
```

**Checklist:**
- [ ] Server running on port 5000
- [ ] Health endpoint returns 200
- [ ] Response includes timestamp

### 2.2 API Root
```bash
curl http://localhost:5000/api
```

**Expected Response:**
```json
{
  "message": "Welcome to Te_QuickRide API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "operators": "/api/operators",
    "trips": "/api/trips",
    "bookings": "/api/bookings",
    "settings": "/api/settings",
    "analytics": "/api/analytics"
  }
}
```

**Checklist:**
- [ ] API root returns list of endpoints
- [ ] All expected endpoints listed
- [ ] Settings and Analytics included

### 2.3 Public Endpoints (No Auth Required)

#### Test Auth Endpoints
```bash
# Register
POST http://localhost:5000/api/auth/register
Body: { "fullName": "Test User", "email": "test@test.com", "phone": "0901234567", "password": "Pass123!", "confirmPassword": "Pass123!" }

# Login
POST http://localhost:5000/api/auth/login
Body: { "email": "customer@example.com", "password": "Password123!" }
```

**Checklist:**
- [ ] POST /api/auth/register → 201
- [ ] POST /api/auth/login → 200 with token
- [ ] POST /api/auth/forgot-password → 200
- [ ] POST /api/auth/reset-password/:token → 200

#### Test Trip Search
```bash
GET http://localhost:5000/api/trips/search?origin=Ho Chi Minh&destination=Da Lat&departureDate=2025-01-25
```

**Checklist:**
- [ ] GET /api/trips/search → 200
- [ ] Returns array of trips
- [ ] Trip có đầy đủ: route, bus, operator info
- [ ] availableSeats > 0

#### Test Routes Public
```bash
GET http://localhost:5000/api/routes/public
GET http://localhost:5000/api/routes/popular
```

**Checklist:**
- [ ] GET /api/routes/public → 200
- [ ] Returns array of active routes
- [ ] GET /api/routes/popular → 200
- [ ] Returns popular routes sorted by trip count

#### Test Bus Types
```bash
GET http://localhost:5000/api/buses/types
```

**Checklist:**
- [ ] GET /api/buses/types → 200
- [ ] Returns 5 bus types
- [ ] Each type has: type, description, seatCapacity

#### Test Settings Public
```bash
GET http://localhost:5000/api/settings/public
```

**Checklist:**
- [ ] GET /api/settings/public → 200
- [ ] No sensitive data (passwords, secrets)
- [ ] Returns siteName, bookingTimeout, etc.

### 2.4 Protected Endpoints (Auth Required)

#### Setup: Get Auth Token
```bash
# Login to get token
POST http://localhost:5000/api/auth/login
Body: { "email": "customer@example.com", "password": "Password123!" }

# Save token from response
TOKEN="eyJhbGciOiJIUzI1..."
```

#### Test Customer Endpoints
```bash
# Get Profile
GET http://localhost:5000/api/users/profile
Headers: { "Authorization": "Bearer $TOKEN" }

# Get My Bookings
GET http://localhost:5000/api/bookings/my-bookings
Headers: { "Authorization": "Bearer $TOKEN" }

# Get My Tickets
GET http://localhost:5000/api/tickets/my-tickets
Headers: { "Authorization": "Bearer $TOKEN" }
```

**Checklist:**
- [ ] GET /api/users/profile → 200
- [ ] GET /api/bookings/my-bookings → 200
- [ ] GET /api/tickets/my-tickets → 200
- [ ] GET /api/tickets/upcoming → 200
- [ ] GET /api/notifications → 200
- [ ] GET /api/notifications/settings → 200

#### Test Operator Endpoints
```bash
# Login as operator
POST http://localhost:5000/api/auth/login
Body: { "email": "futa@buslines.vn", "password": "Password123!" }

# Get token, then:
GET http://localhost:5000/api/operators/profile
GET http://localhost:5000/api/buses/my
GET http://localhost:5000/api/routes/my
GET http://localhost:5000/api/trips/my-trips
```

**Checklist:**
- [ ] GET /api/operators/profile → 200
- [ ] GET /api/buses/my → 200 (operator's buses)
- [ ] GET /api/routes/my → 200 (operator's routes)
- [ ] GET /api/trips/my-trips → 200
- [ ] GET /api/bookings/operator-bookings → 200

#### Test Admin Endpoints
```bash
# Login as admin
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@tequickride.vn", "password": "AdminPassword123!" }

# Get token, then:
GET http://localhost:5000/api/analytics/dashboard
GET http://localhost:5000/api/settings
GET http://localhost:5000/api/bookings
```

**Checklist:**
- [ ] GET /api/analytics/dashboard → 200
- [ ] GET /api/analytics/revenue → 200
- [ ] GET /api/analytics/bookings → 200
- [ ] GET /api/settings → 200
- [ ] GET /api/bookings (all) → 200 (admin only)

### 2.5 Verify Field Names in Responses

#### Test Trip Details
```bash
GET http://localhost:5000/api/trips/:id
```

**Expected Response includes:**
```json
{
  "trip": {
    "driverId": { "fullName": "...", "phone": "..." },
    "managerId": { "fullName": "...", "phone": "..." }
  }
}
```

**NOT:**
```json
{
  "trip": {
    "driver": { ... },  // ❌ WRONG
    "tripManager": { ... }  // ❌ WRONG
  }
}
```

**Checklist:**
- [ ] Response uses `driverId`, NOT `driver`
- [ ] Response uses `managerId`, NOT `tripManager`
- [ ] Populate works correctly
- [ ] No undefined fields

---

## Phase 3: Frontend Services

### 3.1 Verify API Base URL

**File:** `frontend/src/services/api.js`

```javascript
// Should have:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**Checklist:**
- [ ] API_URL points to correct backend
- [ ] Port matches backend (5000)
- [ ] Axios instance configured
- [ ] Interceptors set up for auth token

### 3.2 Check Service Methods Match Backend

#### Trip Service
**File:** `frontend/src/services/tripService.js`

**Checklist:**
- [ ] `searchTrips()` → GET /trips/search ✅
- [ ] `getTripDetails(id)` → GET /trips/:id ✅
- [ ] `getAvailableSeats(id)` → GET /trips/:id/seats ✅
- [ ] `lockSeats()` → POST /trips/:id/lock-seats ✅
- [ ] `releaseSeats()` → POST /trips/:id/release-seats ✅
- [ ] `getMyTrips()` → GET /trips/my-trips ✅
- [ ] ~~`getAllTrips()`~~ → ❌ SHOULD NOT USE (no backend endpoint)

#### Booking Service
**File:** `frontend/src/services/bookingService.js`

**Checklist:**
- [ ] `createBooking()` → POST /bookings ✅
- [ ] `getMyBookings()` → GET /bookings/my-bookings ✅
- [ ] `getBookingDetails(id)` → GET /bookings/:id ✅
- [ ] `cancelBooking(id)` → PUT /bookings/:id/cancel ✅
- [ ] `confirmBooking(id)` → PUT /bookings/:id/confirm ✅
- [ ] `getAllBookings()` → GET /bookings ✅ (admin only)
- [ ] ~~`updateBooking(id, data)`~~ → ⚠️ NO BACKEND ENDPOINT

#### Bus Service
**File:** `frontend/src/services/busService.js`

**Checklist:**
- [ ] `getBusTypes()` → GET /buses/types ✅
- [ ] `getBusAvailability(id)` → GET /buses/:id/availability ✅
- [ ] `getMyBuses()` → GET /buses/my ✅
- [ ] ~~`getAllBuses()`~~ → ⚠️ Should use /buses/my or remove
- [ ] ~~`getBusDetails(id)`~~ → ⚠️ Check if needed

#### Settings Service
**File:** `frontend/src/services/settingsService.js`

**Checklist:**
- [ ] `getSettings()` → GET /settings ✅
- [ ] `updateSettings()` → PUT /settings ✅
- [ ] `testEmail()` → POST /settings/test-email ✅

#### Analytics Service
**File:** `frontend/src/services/analyticsService.js`

**Checklist:**
- [ ] `getDashboardStats()` → GET /analytics/dashboard ✅
- [ ] `getRevenueAnalytics()` → GET /analytics/revenue ✅
- [ ] `getBookingAnalytics()` → GET /analytics/bookings ✅
- [ ] `getUserGrowthAnalytics()` → GET /analytics/user-growth ✅
- [ ] `getOperatorPerformance()` → GET /analytics/operator-performance ✅
- [ ] `getRouteAnalytics()` → GET /analytics/routes ✅
- [ ] `getTopRoutes()` → GET /analytics/top-routes ✅
- [ ] `getCommissionAnalytics()` → GET /analytics/commission ✅
- [ ] `exportAnalytics(type)` → GET /analytics/export/:type ✅

### 3.3 Check Response Parsing

**All services should handle:**
```javascript
// Backend uses both formats:
// 1. successResponse: { success: true, data: {...}, message: "..." }
// 2. paginatedResponse: { success: true, data: [...], pagination: {...} }

// Frontend should parse:
const data = response.data.data || response.data;
```

**Checklist:**
- [ ] All services parse `response.data.data` correctly
- [ ] Pagination data accessed properly
- [ ] Error handling implemented
- [ ] Loading states managed

---

## Phase 4: Field Mappings

### 4.1 Trip Model Field Mapping

**Database Schema:** `backend/src/models/Trip.js`
```javascript
{
  driverId: ObjectId,  // ✅ CORRECT
  managerId: ObjectId  // ✅ CORRECT
}
```

**Backend Controller:** `backend/src/controllers/tripController.js`
```javascript
// createTrip - line 304-305
{
  driverId: driverId,      // ✅ CORRECT
  managerId: tripManagerId // ✅ CORRECT
}

// updateTrip - allowedUpdates - line 339
['driverId', 'managerId']  // ✅ CORRECT

// getTripDetails - populate - line 120-121
.populate('driverId', 'fullName phone')   // ✅ CORRECT
.populate('managerId', 'fullName phone')  // ✅ CORRECT
```

**Seed Data:** `backend/src/seeders/seedData.js`
```javascript
// Lines 547-599
{
  driverId: null,   // ✅ CORRECT
  managerId: null   // ✅ CORRECT
}
```

**Checklist:**
- [ ] Model defines `driverId` and `managerId`
- [ ] Controller creates with `driverId` and `managerId`
- [ ] Controller updates with `driverId` and `managerId`
- [ ] Controller populates with `driverId` and `managerId`
- [ ] Seed data uses `driverId` and `managerId`
- [ ] NO references to `driver` or `tripManager` anywhere

### 4.2 Booking Model Field Mapping

**Database:**
```javascript
{
  customerId: ObjectId,
  tripId: ObjectId,
  operatorId: ObjectId
}
```

**Backend:**
```javascript
// All controllers use correct field names
.populate('customerId', 'fullName email')
.populate('tripId')
.populate('operatorId', 'companyName')
```

**Checklist:**
- [ ] All booking controllers use correct field names
- [ ] Populate works without errors
- [ ] Frontend receives correct structure

### 4.3 User/Operator Field Mapping

**Notification Settings:**
```javascript
// User and BusOperator models should have:
{
  notificationSettings: {
    email: Boolean,
    sms: Boolean,
    push: Boolean,
    bookingUpdates: Boolean,
    promotions: Boolean,
    newsletters: Boolean
  }
}
```

**Checklist:**
- [ ] User model has notificationSettings
- [ ] BusOperator model has notificationSettings
- [ ] GET /notifications/settings returns correct structure
- [ ] PUT /notifications/settings updates correctly

---

## Phase 5: Authentication Flow

### 5.1 JWT Token Generation

**Login Test:**
```bash
POST http://localhost:5000/api/auth/login
Body: { "email": "customer@example.com", "password": "Password123!" }
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "...",
      "email": "customer@example.com",
      "role": "customer"
    }
  }
}
```

**Checklist:**
- [ ] Token is valid JWT
- [ ] Token includes: userId, email, role
- [ ] Token expiry set (7 days default)
- [ ] User data doesn't include password

### 5.2 Protected Route Access

**Test Customer Route:**
```bash
GET http://localhost:5000/api/bookings/my-bookings
Headers: { "Authorization": "Bearer <customer-token>" }
```

**Expected:** 200 with customer's bookings

**Test Operator Route with Customer Token:**
```bash
GET http://localhost:5000/api/trips/my-trips
Headers: { "Authorization": "Bearer <customer-token>" }
```

**Expected:** 403 Forbidden

**Checklist:**
- [ ] Customer can access customer routes
- [ ] Customer CANNOT access operator routes
- [ ] Customer CANNOT access admin routes
- [ ] Operator can access operator routes
- [ ] Operator CANNOT access admin routes
- [ ] Admin can access admin routes
- [ ] Unapproved operator CANNOT create trips

### 5.3 Frontend Auth State

**File:** `frontend/src/redux/slices/authSlice.js`

**Checklist:**
- [ ] Token stored in localStorage
- [ ] User data stored in Redux
- [ ] Login sets token in axios headers
- [ ] Logout clears token and user
- [ ] Protected routes check auth state
- [ ] Redirects work correctly

---

## Phase 6: CRUD Operations

### 6.1 Trip CRUD

**Create:**
```bash
POST http://localhost:5000/api/trips
Headers: { "Authorization": "Bearer <operator-token>" }
Body: {
  "routeId": "650000000000000000000301",
  "busId": "650000000000000000000201",
  "departureTime": "2025-01-30T08:00:00Z",
  "arrivalTime": "2025-01-30T14:00:00Z",
  "basePrice": 300000
}
```

**Expected:** 201 with trip object

**Read:**
```bash
GET http://localhost:5000/api/trips/my-trips
```

**Expected:** 200 with array of trips

**Update:**
```bash
PUT http://localhost:5000/api/trips/:id
Body: { "basePrice": 350000 }
```

**Expected:** 200 with updated trip

**Delete (Cancel):**
```bash
DELETE http://localhost:5000/api/trips/:id
Body: { "cancellationReason": "Weather conditions" }
```

**Expected:** 200

**Checklist:**
- [ ] Create trip works (operator only)
- [ ] Trip created with correct field names
- [ ] Update trip works (operator only)
- [ ] Cancel trip works
- [ ] Get my trips returns operator's trips only
- [ ] Unauthorized users get 403

### 6.2 Booking CRUD

**Create:**
```bash
POST http://localhost:5000/api/bookings
Headers: { "Authorization": "Bearer <customer-token>" }
Body: {
  "tripId": "...",
  "seats": [{ "seatNumber": "1A", "passenger": {...} }],
  "pickupPoint": {...},
  "dropoffPoint": {...}
}
```

**Expected:** 201 with booking

**Checklist:**
- [ ] Create booking works (customer only)
- [ ] Seats locked before booking
- [ ] Seats marked as occupied after booking
- [ ] availableSeats decreased
- [ ] Payment record created
- [ ] Booking code generated
- [ ] Get my bookings returns customer's bookings
- [ ] Cancel booking works
- [ ] Refund processed on cancellation

### 6.3 Settings CRUD (Admin)

**Read:**
```bash
GET http://localhost:5000/api/settings
Headers: { "Authorization": "Bearer <admin-token>" }
```

**Expected:** 200 with settings (sensitive data masked)

**Update:**
```bash
PUT http://localhost:5000/api/settings
Body: { "siteName": "QuickRide Express", "bookingTimeout": 20 }
```

**Expected:** 200 with updated settings

**Checklist:**
- [ ] Only admin can access
- [ ] Sensitive fields masked in response
- [ ] Update doesn't overwrite masked fields
- [ ] Public settings endpoint returns non-sensitive data

---

## Phase 7: Integration Testing

### 7.1 Complete Booking Flow

**Step 1: Search Trips**
```bash
GET /api/trips/search?origin=Ho Chi Minh&destination=Da Lat&departureDate=2025-01-30
```
✅ Returns trips

**Step 2: View Trip Details**
```bash
GET /api/trips/:tripId
```
✅ Returns full trip info

**Step 3: Check Seats**
```bash
GET /api/trips/:tripId/seats
```
✅ Returns seat map

**Step 4: Lock Seats**
```bash
POST /api/trips/:tripId/lock-seats
Body: { "seatNumbers": ["1A"], "sessionId": "abc123" }
```
✅ Seats locked

**Step 5: Create Booking**
```bash
POST /api/bookings
Body: { ... }
```
✅ Booking created

**Step 6: Confirm Payment**
```bash
PUT /api/bookings/:bookingId/confirm
```
✅ Payment confirmed

**Step 7: Get Ticket**
```bash
GET /api/tickets/my-tickets
```
✅ Ticket available

**Checklist:**
- [ ] All steps complete without errors
- [ ] Seats status updated correctly
- [ ] Payment record created
- [ ] Ticket generated with QR code
- [ ] Email notifications sent (if configured)

### 7.2 Operator Trip Management Flow

**Step 1: Create Route**
```bash
POST /api/routes
```
✅ Route created

**Step 2: Create Bus**
```bash
POST /api/buses
```
✅ Bus created

**Step 3: Create Trip**
```bash
POST /api/trips
```
✅ Trip created with correct fields

**Step 4: View My Trips**
```bash
GET /api/trips/my-trips
```
✅ Trip appears in list

**Step 5: Update Trip**
```bash
PUT /api/trips/:id
```
✅ Trip updated

**Step 6: View Bookings**
```bash
GET /api/bookings/operator-bookings
```
✅ Customer bookings visible

**Checklist:**
- [ ] Operator can create all resources
- [ ] Operator can only see their own data
- [ ] Updates work correctly
- [ ] Cannot delete with active bookings

### 7.3 Admin Analytics Flow

**Step 1: Dashboard Stats**
```bash
GET /api/analytics/dashboard
```
✅ Shows overview stats

**Step 2: Revenue Analytics**
```bash
GET /api/analytics/revenue?startDate=2025-01-01&endDate=2025-01-31
```
✅ Returns revenue data

**Step 3: Top Routes**
```bash
GET /api/analytics/top-routes
```
✅ Returns popular routes

**Step 4: Export Data**
```bash
GET /api/analytics/export/bookings
```
✅ Returns exportable data

**Checklist:**
- [ ] All analytics endpoints work
- [ ] Data aggregation correct
- [ ] Filters work (date range, etc.)
- [ ] Export includes correct data

---

## Phase 8: Final Verification

### 8.1 Frontend Pages Load

**Public Pages:**
- [ ] / (Home)
- [ ] /routes
- [ ] /search
- [ ] /trips/:id
- [ ] /about
- [ ] /contact
- [ ] /help

**Customer Pages (Logged In):**
- [ ] /my-bookings
- [ ] /my-tickets
- [ ] /customer/profile
- [ ] /notifications

**Operator Pages (Logged In):**
- [ ] /operator/dashboard
- [ ] /operator/buses
- [ ] /operator/routes
- [ ] /operator/trips
- [ ] /operator/bookings
- [ ] /operator/analytics

**Admin Pages (Logged In):**
- [ ] /admin/dashboard
- [ ] /admin/users
- [ ] /admin/operators
- [ ] /admin/bookings
- [ ] /admin/analytics
- [ ] /admin/settings

### 8.2 No Console Errors

**Open DevTools (F12) on each page:**
- [ ] No 404 errors in Network tab
- [ ] No JavaScript errors in Console
- [ ] No failed API calls
- [ ] No CORS errors
- [ ] Images load (or placeholder shown)

### 8.3 Database Consistency

**After testing, verify:**
```javascript
// Check no orphaned data
db.bookings.find({ tripId: { $exists: false } }).count()  // Should be 0
db.trips.find({ routeId: { $exists: false } }).count()    // Should be 0
db.trips.find({ busId: { $exists: false } }).count()      // Should be 0

// Check field names
db.trips.findOne({}, { driver: 1, tripManager: 1 })  // Both should be undefined
db.trips.findOne({}, { driverId: 1, managerId: 1 })  // These should exist
```

**Checklist:**
- [ ] No orphaned references
- [ ] No incorrect field names
- [ ] Indexes exist and working
- [ ] Data integrity maintained

---

## Common Issues & Fixes

### Issue 1: 404 on API Calls
**Symptoms:** Frontend gets 404 errors
**Check:**
1. Backend running? `http://localhost:5000/health`
2. Route registered in `app.js`?
3. Correct HTTP method?
4. Route ordering correct? (specific before generic)

**Fix:** Check `backend/src/app.js` and `backend/src/routes/*.js`

### Issue 2: Empty Arrays Returned
**Symptoms:** API returns `[]` but database has data
**Check:**
1. Query filters too restrictive?
2. Field names match database?
3. `isActive: true` filtering out data?

**Fix:**
```javascript
// Check query
console.log('Query:', query);
// Check count
const count = await Model.countDocuments(query);
console.log('Count:', count);
```

### Issue 3: Populate Returns null
**Symptoms:** Referenced data is null
**Check:**
1. Field name matches model? (`driverId` not `driver`)
2. Reference exists in database?
3. Model name in ref correct?

**Fix:**
```javascript
// Verify reference exists
const trip = await Trip.findById(id);
console.log('driverId:', trip.driverId);  // Should be ObjectId or null

const driver = await Staff.findById(trip.driverId);
console.log('Driver exists:', !!driver);
```

### Issue 4: 403 Forbidden
**Symptoms:** User can't access protected route
**Check:**
1. Token valid?
2. User has correct role?
3. Operator approved? (`approvalStatus: 'approved'`)

**Fix:**
```javascript
// Check token payload
const decoded = jwt.verify(token, JWT_SECRET);
console.log('User:', decoded);  // Check userId, email, role

// Check user in database
const user = await User.findById(decoded.userId);
console.log('User role:', user.role);
```

### Issue 5: Field Mismatch Errors
**Symptoms:** Cannot read property 'fullName' of undefined
**Check:**
1. Populate using correct field name?
2. Field exists in model schema?
3. Data in database correct?

**Fix:**
```javascript
// Check what fields trip has
console.log('Trip keys:', Object.keys(trip.toObject()));

// Should see: driverId, managerId
// Should NOT see: driver, tripManager
```

---

## Automated Check Script

**Create file:** `backend/check-sync.js`

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkSync() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected');

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log('\n📊 Collections:', collectionNames.length);

    // Check document counts
    const Trip = mongoose.model('Trip', new mongoose.Schema({}, { strict: false }));
    const Route = mongoose.model('Route', new mongoose.Schema({}, { strict: false }));
    const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));

    const tripCount = await Trip.countDocuments();
    const routeCount = await Route.countDocuments({ isActive: true });
    const bookingCount = await Booking.countDocuments();

    console.log(`  Trips: ${tripCount}`);
    console.log(`  Active Routes: ${routeCount}`);
    console.log(`  Bookings: ${bookingCount}`);

    // Check field names
    const sampleTrip = await Trip.findOne();
    if (sampleTrip) {
      const hasDriverId = sampleTrip.driverId !== undefined;
      const hasDriver = sampleTrip.driver !== undefined;

      console.log('\n🔍 Trip Field Check:');
      console.log(`  driverId exists: ${hasDriverId ? '✅' : '❌'}`);
      console.log(`  driver exists: ${hasDriver ? '❌ WRONG!' : '✅'}`);
    }

    console.log('\n✨ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSync();
```

**Run:**
```bash
cd backend
node check-sync.js
```

---

## Summary Checklist

### Database ✓
- [ ] All collections exist
- [ ] Seed data loaded
- [ ] Field names correct (driverId, managerId)
- [ ] Active status set correctly

### Backend API ✓
- [ ] Server running
- [ ] All routes registered
- [ ] Public endpoints work
- [ ] Protected endpoints require auth
- [ ] Role-based access works
- [ ] Field names in controllers match models
- [ ] Populate works correctly

### Frontend ✓
- [ ] API calls use correct endpoints
- [ ] Response parsing handles both formats
- [ ] All pages load without errors
- [ ] No 404s in Network tab
- [ ] Auth flow works
- [ ] CRUD operations work

### Integration ✓
- [ ] Complete booking flow works
- [ ] Operator trip management works
- [ ] Admin analytics works
- [ ] Data consistency maintained
- [ ] No orphaned references

---

**Last Updated:** 2025-01-17
**Status:** Use this checklist to verify full system sync
