# Te_QuickRide API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT Bearer token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

---

## 📋 Table of Contents
1. [Authentication](#authentication-endpoints)
2. [Users](#user-endpoints)
3. [Bus Operators](#bus-operator-endpoints)
4. [Trips](#trip-endpoints)
5. [Bookings](#booking-endpoints)

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Create a new customer account.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "phone": "0901234567",
  "password": "Password123",
  "fullName": "Nguyen Van A",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "email": "customer@example.com",
      "phone": "0901234567",
      "fullName": "Nguyen Van A",
      "role": "customer"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

---

### Login User
**POST** `/api/auth/login`

Login with email/phone and password.

**Request Body:**
```json
{
  "emailOrPhone": "customer@example.com",
  "password": "Password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "customer@example.com",
      "phone": "0901234567",
      "fullName": "Nguyen Van A",
      "role": "customer",
      "isEmailVerified": false,
      "isPhoneVerified": false,
      "loyaltyTier": "bronze",
      "totalPoints": 0
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

---

### Login Bus Operator
**POST** `/api/auth/operator/login`

Login for bus operators.

**Request Body:**
```json
{
  "email": "operator@buscompany.com",
  "password": "Password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "operator": {
      "id": "...",
      "companyName": "ABC Bus Company",
      "email": "operator@buscompany.com",
      "phone": "0901234567",
      "verificationStatus": "approved",
      "averageRating": 4.5
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

---

### Refresh Token
**POST** `/api/auth/refresh-token`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

---

### Get Current User
**GET** `/api/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": { /* user object */ },
    "userType": "user" // or "operator"
  }
}
```

---

### Logout
**POST** `/api/auth/logout`

Logout current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`

---

### Forgot Password
**POST** `/api/auth/forgot-password`

Request password reset token.

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Response:** `200 OK`

---

### Reset Password
**POST** `/api/auth/reset-password`

Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response:** `200 OK`

---

## User Endpoints

### Get User Profile
**GET** `/api/users/profile`

Get user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`

---

### Update Profile
**PUT** `/api/users/profile`

Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "Nguyen Van B",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK`

---

### Change Password
**PUT** `/api/users/change-password`

Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response:** `200 OK`

---

## Bus Operator Endpoints

### Register Bus Operator
**POST** `/api/operators/register`

Register a new bus operator (requires admin approval).

**Request Body:**
```json
{
  "companyName": "ABC Bus Company",
  "email": "info@abcbus.com",
  "phone": "0901234567",
  "password": "Password123",
  "businessLicense": "0123456789",
  "taxCode": "0123456789",
  "address": {
    "street": "123 Main Street",
    "ward": "Ward 1",
    "district": "District 1",
    "city": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "bankAccount": {
    "bankName": "Vietcombank",
    "accountNumber": "0123456789",
    "accountHolder": "ABC Bus Company"
  }
}
```

**Response:** `201 Created`

---

### Get Operator Profile
**GET** `/api/operators/profile`

Get operator's profile.

**Headers:**
```
Authorization: Bearer <operator_token>
```

**Response:** `200 OK`

---

### Get All Operators (Admin)
**GET** `/api/operators`

Get list of all operators (admin only).

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `verificationStatus` (optional: pending, approved, rejected)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`

---

### Verify Operator (Admin)
**PUT** `/api/operators/:id/verify`

Approve or reject operator registration.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "approved", // or "rejected"
  "rejectionReason": "Required if status is rejected"
}
```

**Response:** `200 OK`

---

## Trip Endpoints

### Search Trips
**GET** `/api/trips/search`

Search for available trips.

**Query Parameters:**
- `originCity` (required): "Hà Nội"
- `destinationCity` (required): "Đà Nẵng"
- `departureDate` (required): "2025-01-15"
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Example:**
```
GET /api/trips/search?originCity=Hà%20Nội&destinationCity=Đà%20Nẵng&departureDate=2025-01-15
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Found 10 trips",
  "data": [
    {
      "id": "...",
      "tripCode": "HN-DN-20250115-001",
      "route": {
        "id": "...",
        "name": "Hà Nội - Đà Nẵng",
        "origin": { /* location details */ },
        "destination": { /* location details */ },
        "distance": 750,
        "estimatedDuration": 720,
        "pickupPoints": [],
        "dropoffPoints": []
      },
      "bus": {
        "type": "limousine",
        "totalSeats": 24,
        "amenities": ["wifi", "ac", "water"],
        "images": []
      },
      "operator": {
        "id": "...",
        "name": "ABC Bus Company",
        "logo": "...",
        "rating": 4.5,
        "reviews": 120
      },
      "departureTime": "2025-01-15T08:00:00Z",
      "arrivalTime": "2025-01-15T20:00:00Z",
      "basePrice": 350000,
      "availableSeats": 18,
      "status": "scheduled"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

---

### Get Trip Details
**GET** `/api/trips/:id`

Get detailed information about a specific trip.

**Response:** `200 OK`

---

### Get Available Seats
**GET** `/api/trips/:id/seats`

Get seat layout and availability for a trip.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Seat information retrieved",
  "data": {
    "tripId": "...",
    "busType": "limousine",
    "totalSeats": 24,
    "availableSeats": 18,
    "seatLayout": {
      "floors": 1,
      "rows": 6,
      "columns": 4,
      "layout": [
        ["A1", "A2", "", "A3"],
        ["B1", "B2", "", "B3"],
        ...
      ]
    },
    "seats": [
      {
        "seatNumber": "A1",
        "row": 0,
        "col": 0,
        "status": "available" // or "occupied" or "locked"
      },
      ...
    ]
  }
}
```

---

### Lock Seats
**POST** `/api/trips/:id/lock-seats`

Temporarily lock seats for 15 minutes during booking process.

**Request Body:**
```json
{
  "seatNumbers": ["A1", "A2"],
  "sessionId": "unique-session-id"
}
```

**Response:** `200 OK`

---

### Release Seats
**POST** `/api/trips/:id/release-seats`

Release locked seats.

**Request Body:**
```json
{
  "sessionId": "unique-session-id"
}
```

**Response:** `200 OK`

---

### Create Trip (Operator)
**POST** `/api/trips`

Create a new trip.

**Headers:**
```
Authorization: Bearer <operator_token>
```

**Request Body:**
```json
{
  "routeId": "...",
  "busId": "...",
  "departureTime": "2025-01-15T08:00:00Z",
  "arrivalTime": "2025-01-15T20:00:00Z",
  "basePrice": 350000,
  "driverId": "...",
  "tripManagerId": "..."
}
```

**Response:** `201 Created`

---

### Get My Trips (Operator)
**GET** `/api/trips/my/trips`

Get operator's trips.

**Headers:**
```
Authorization: Bearer <operator_token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: scheduled, boarding, in_progress, completed, cancelled)

**Response:** `200 OK`

---

### Update Trip (Operator)
**PUT** `/api/trips/:id`

Update trip details.

**Headers:**
```
Authorization: Bearer <operator_token>
```

**Request Body:**
```json
{
  "basePrice": 380000,
  "status": "boarding"
}
```

**Response:** `200 OK`

---

### Cancel Trip (Operator)
**DELETE** `/api/trips/:id`

Cancel a trip.

**Headers:**
```
Authorization: Bearer <operator_token>
```

**Request Body:**
```json
{
  "cancellationReason": "Bus maintenance required"
}
```

**Response:** `200 OK`

---

## Booking Endpoints

### Create Booking
**POST** `/api/bookings`

Create a new booking.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "tripId": "...",
  "seats": [
    {
      "seatNumber": "A1",
      "passenger": {
        "fullName": "Nguyen Van A",
        "phone": "0901234567",
        "idCard": "001234567890"
      }
    },
    {
      "seatNumber": "A2",
      "passenger": {
        "fullName": "Tran Thi B",
        "phone": "0907654321",
        "idCard": "001234567891"
      }
    }
  ],
  "pickupPoint": {
    "name": "Bến xe Giáp Bát",
    "address": "Đường Giải Phóng, Hoàng Mai, Hà Nội",
    "coordinates": {
      "lat": 20.9833,
      "lng": 105.8333
    }
  },
  "dropoffPoint": {
    "name": "Bến xe Đà Nẵng",
    "address": "Điện Biên Phủ, Thanh Khê, Đà Nẵng",
    "coordinates": {
      "lat": 16.0544,
      "lng": 108.2022
    }
  },
  "contactEmail": "customer@example.com",
  "contactPhone": "0901234567",
  "voucherCode": "SUMMER2025",
  "notes": "Please call before pickup"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Booking created",
  "data": {
    "booking": { /* booking details */ },
    "message": "Booking created successfully. Please proceed to payment."
  }
}
```

---

### Get Booking Details
**GET** `/api/bookings/:id`

Get booking details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`

---

### Get My Bookings
**GET** `/api/bookings/my-bookings`

Get user's bookings.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: pending, confirmed, cancelled, completed)

**Response:** `200 OK`

---

### Get Operator Bookings
**GET** `/api/bookings/operator-bookings`

Get bookings for operator's trips.

**Headers:**
```
Authorization: Bearer <operator_token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional)
- `tripId` (optional)

**Response:** `200 OK`

---

### Cancel Booking
**PUT** `/api/bookings/:id/cancel`

Cancel a booking.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "cancellationReason": "Change of plans"
}
```

**Response:** `200 OK`

---

### Confirm Booking (After Payment)
**PUT** `/api/bookings/:id/confirm`

Confirm booking after successful payment.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "paymentId": "payment_id_from_gateway"
}
```

**Response:** `200 OK`

---

### Check-in Passengers
**PUT** `/api/bookings/:id/checkin`

Check-in passengers (Trip Manager).

**Headers:**
```
Authorization: Bearer <staff_token>
```

**Request Body:**
```json
{
  "seatNumbers": ["A1", "A2"]
}
```

**Response:** `200 OK`

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* optional array of detailed errors */ ]
}
```

### Common Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Testing with cURL

### Example: Register and Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "0901234567",
    "password": "Password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "Password123"
  }'

# Save the token from response
TOKEN="your_access_token_here"

# Search trips
curl -X GET "http://localhost:5000/api/trips/search?originCity=Hà%20Nội&destinationCity=Đà%20Nẵng&departureDate=2025-01-15"

# Get profile
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Next Steps

Phase 3 will implement:
- Payment gateway integration (VNPay, MoMo, ZaloPay)
- E-ticket generation with QR codes
- Email/SMS notifications
- Review and rating system
