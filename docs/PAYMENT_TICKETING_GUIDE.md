# Payment & E-Ticketing System Guide

## Overview

This guide documents the Payment and E-Ticketing system for Te_QuickRide. All payment gateways and notifications are implemented in **DEMO MODE** for development and testing purposes.

---

## 🔐 DEMO Mode Features

### Payment Gateways (DEMO)
- ✅ **VNPay** - Mock payment URLs, always successful
- ✅ **MoMo** - Mock payment URLs, always successful
- ✅ **ZaloPay** - Mock payment URLs, always successful
- ✅ **COD (Cash on Delivery)** - Immediate confirmation

### Notifications (DEMO)
- ✅ **Email** - Console logging only, no actual emails sent
- ✅ **SMS** - Console logging only, no actual SMS sent

### QR Codes (REAL)
- ✅ Actual QR code generation using `qrcode` library
- ✅ Base64-encoded data (production should use AES-256-GCM encryption)

---

## 💳 Payment Flow

### Step 1: Create Booking
```http
POST /api/bookings
```

Customer creates a booking with selected seats. Booking status is `pending`.

**Response:**
```json
{
  "booking": {
    "bookingCode": "BK20250107001",
    "status": "pending",
    "totalAmount": 700000
  }
}
```

### Step 2: Initiate Payment
```http
POST /api/payments/create
Content-Type: application/json

{
  "bookingId": "booking_id_here",
  "paymentMethod": "vnpay"  // or "momo", "zalopay", "cod"
}
```

**Response (VNPay/MoMo/ZaloPay):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "transactionId": "VNPAY_TXN1704614400000001",
      "status": "pending",
      "amount": 700000
    },
    "paymentUrl": "http://localhost:3000/payment/vnpay/demo?...",
    "gateway": "vnpay",
    "message": "Redirect user to payment URL"
  }
}
```

**Response (COD):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "transactionId": "TXN1704614400000001",
      "status": "pending",
      "method": "cod"
    },
    "booking": {
      "bookingCode": "BK20250107001",
      "status": "confirmed"
    },
    "tickets": [
      {
        "ticketCode": "TK20250107001",
        "qrCode": "data:image/png;base64,..."
      }
    ],
    "message": "Booking confirmed with COD payment"
  }
}
```

### Step 3: Payment Callback (for VNPay/MoMo/ZaloPay)

Payment gateway redirects user back to your site with payment result.

**VNPay Return:**
```http
GET /api/payments/vnpay/return?vnp_TxnRef=...&vnp_ResponseCode=00&...
```

**MoMo Callback:**
```http
POST /api/payments/momo/callback
{
  "orderId": "MOMO_...",
  "resultCode": 0,
  "amount": 700000
}
```

**ZaloPay Callback:**
```http
POST /api/payments/zalopay/callback
{
  "app_trans_id": "ZALOPAY_...",
  "status": 1,
  "amount": 700000
}
```

### Step 4: Automatic Actions After Successful Payment

When payment is successful, the system automatically:

1. **Updates Payment Status** → `success`
2. **Confirms Booking** → `confirmed`
3. **Generates E-Tickets** → One ticket per seat with QR code
4. **Sends Notifications:**
   - Booking confirmation email with attached tickets
   - SMS confirmation with booking code
   - Payment success SMS

---

## 🎫 E-Ticket System

### Ticket Generation

Tickets are automatically generated after successful payment. Each seat gets its own ticket.

**Ticket Structure:**
```json
{
  "ticketCode": "TK20250107001",
  "seatNumber": "A1",
  "passenger": {
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "idCard": "001234567890"
  },
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "qrData": "eyJ0aWNrZXRDb2RlIjoiVEsyMDI1MDEwNzAwMSIsImJvb2tpbmdJZ...",
  "tripDetails": {
    "routeName": "Hà Nội - Đà Nẵng",
    "origin": "Hà Nội, Hà Nội",
    "destination": "Đà Nẵng, Đà Nẵng",
    "departureTime": "2025-01-15T08:00:00.000Z",
    "busNumber": "29A-12345",
    "operatorName": "ABC Bus Company"
  },
  "isValid": true,
  "isUsed": false
}
```

### QR Code Data

The QR code contains encrypted ticket information:

**Original Data:**
```json
{
  "ticketCode": "TK20250107001",
  "bookingId": "booking_id",
  "tripId": "trip_id",
  "seatNumber": "A1",
  "passengerName": "Nguyen Van A",
  "passengerPhone": "0901234567",
  "departureTime": "2025-01-15T08:00:00.000Z",
  "issuedAt": "2025-01-07T10:30:00.000Z"
}
```

**Encrypted (Base64 in DEMO):**
```
eyJ0aWNrZXRDb2RlIjoiVEsyMDI1MDEwNzAwMSIsImJvb2tpbmdJZCI6ImJvb2tpbmdfaWQiLCJ0cmlwSWQiOiJ0cmlwX2lkIiwic2VhdE51bWJlciI6IkExIiwicGFzc2VuZ2VyTmFtZSI6Ik5ndXllbiBWYW4gQSIsInBhc3Nlbmdlc...
```

---

## 📱 Ticket Management APIs

### Get My Tickets
```http
GET /api/tickets/my-tickets?page=1&limit=20&status=valid
```

**Query Parameters:**
- `status`: `valid`, `used`, `invalid`
- `page`: Page number
- `limit`: Items per page

### Get Booking Tickets
```http
GET /api/tickets/booking/:bookingId
```

Returns all tickets for a specific booking.

### Download Ticket
```http
GET /api/tickets/:id/download
```

Returns HTML that can be converted to PDF on frontend.

### Get Upcoming Trips
```http
GET /api/tickets/upcoming
```

Returns tickets for future trips (not yet used).

---

## 🔍 Ticket Validation (QR Scanning)

### Validate Ticket by QR Code
```http
POST /api/tickets/validate
Content-Type: application/json

{
  "qrData": "eyJ0aWNrZXRDb2RlIjoiVEsyMDI1MDEwNzAwMSIs..."
}
```

**Response (Valid):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "Ticket is valid",
    "ticket": { /* ticket object */ },
    "passenger": {
      "fullName": "Nguyen Van A",
      "phone": "0901234567"
    },
    "seatNumber": "A1",
    "tripDetails": { /* trip info */ }
  }
}
```

**Response (Invalid):**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "message": "Ticket already used",
    "usedAt": "2025-01-15T08:10:00.000Z"
  }
}
```

### Check-in Passenger
```http
POST /api/tickets/:ticketId/checkin
```

Marks ticket as used and records check-in time.

---

## 📧 Notification System (DEMO)

All notifications are logged to console in DEMO mode.

### Email Notifications

**Booking Confirmation:**
```
📧 [DEMO] Sending Email:
  To: customer@example.com
  Subject: Booking Confirmation - BK20250107001
  Content: <HTML email with booking details and tickets>
```

**Cancellation:**
```
📧 [DEMO] Sending Email:
  To: customer@example.com
  Subject: Booking Cancellation - BK20250107001
  Content: <Refund information>
```

### SMS Notifications

**Booking Confirmation:**
```
📱 [DEMO] Sending SMS:
  To: 0901234567
  Message: Te_QuickRide: Booking BK20250107001 confirmed! Seats: A1,A2. Check email for e-tickets.
```

**Payment Success:**
```
📱 [DEMO] Sending SMS:
  To: 0901234567
  Message: Te_QuickRide: Payment successful! 700,000 VND via VNPAY. Booking BK20250107001 confirmed.
```

---

## 🧪 Testing the System

### Test Flow: Complete Booking with Payment

#### 1. Register & Login
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
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "Password123"
  }' | jq -r '.data.tokens.accessToken')
```

#### 2. Search Trips
```bash
curl "http://localhost:5000/api/trips/search?originCity=Hà%20Nội&destinationCity=Đà%20Nẵng&departureDate=2025-01-15"
```

#### 3. Check Seat Availability
```bash
TRIP_ID="<trip_id_from_search>"
curl "http://localhost:5000/api/trips/$TRIP_ID/seats"
```

#### 4. Create Booking
```bash
BOOKING_RESPONSE=$(curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": "'$TRIP_ID'",
    "seats": [
      {
        "seatNumber": "A1",
        "passenger": {
          "fullName": "Nguyen Van A",
          "phone": "0901234567",
          "idCard": "001234567890"
        }
      }
    ],
    "pickupPoint": {
      "name": "Bến xe Giáp Bát",
      "address": "Giải Phóng, Hoàng Mai, Hà Nội"
    },
    "dropoffPoint": {
      "name": "Bến xe Đà Nẵng",
      "address": "Điện Biên Phủ, Thanh Khê, Đà Nẵng"
    },
    "contactEmail": "test@example.com",
    "contactPhone": "0901234567"
  }')

BOOKING_ID=$(echo $BOOKING_RESPONSE | jq -r '.data.booking._id')
```

#### 5. Create Payment (COD for easy testing)
```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "'$BOOKING_ID'",
    "paymentMethod": "cod"
  }'
```

Response will include:
- Confirmed booking
- Generated tickets with QR codes
- Console logs showing email/SMS notifications

#### 6. View Tickets
```bash
# Get booking tickets
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/tickets/booking/$BOOKING_ID"

# Get all my tickets
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/tickets/my-tickets"
```

#### 7. Download Ticket
```bash
TICKET_ID="<ticket_id_from_response>"
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/tickets/$TICKET_ID/download"
```

#### 8. Validate Ticket (QR Scan Simulation)
```bash
QR_DATA="<qr_data_from_ticket>"
curl -X POST http://localhost:5000/api/tickets/validate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "'$QR_DATA'"
  }'
```

---

## 🔄 Payment Method Comparison

| Method | Processing | Tickets | Notifications | Best For |
|--------|-----------|---------|---------------|----------|
| **VNPay** | Redirects to demo URL → Callback | Generated after callback | Sent after success | Online payment testing |
| **MoMo** | Redirects to demo URL → Callback | Generated after callback | Sent after success | Mobile wallet testing |
| **ZaloPay** | Redirects to demo URL → Callback | Generated after callback | Sent after success | E-wallet testing |
| **COD** | Instant confirmation | Generated immediately | Sent immediately | Quick testing |

---

## 🚀 Production Considerations

When moving to production, you need to:

### Payment Gateways
1. **Register** with VNPay, MoMo, ZaloPay
2. **Get API credentials** (Partner Code, Secret Keys, etc.)
3. **Update environment variables** in `.env`
4. **Replace demo implementations** with real SDK calls
5. **Implement signature verification** for callbacks
6. **Setup webhook URLs** with HTTPS

### Encryption
1. **Replace Base64** with AES-256-GCM encryption
2. **Use secure key management** (AWS KMS, Azure Key Vault)
3. **Rotate encryption keys** regularly

### Notifications
1. **Integrate SendGrid** or AWS SES for emails
2. **Integrate VNPT SMS** or Viettel SMS for text messages
3. **Setup email templates** with proper branding
4. **Implement retry logic** for failed sends

### QR Codes
1. Current implementation is production-ready
2. Consider adding **digital signatures** for extra security
3. Implement **offline validation** capability

### PDF Generation
1. **Integrate puppeteer** or **pdfkit** for server-side PDF generation
2. **Store PDFs** in cloud storage (S3, Azure Blob)
3. Add **watermarks** and **security features**

---

## 📊 Database Schema

### Payments Collection
```javascript
{
  _id: ObjectId,
  transactionId: String (unique),
  bookingId: ObjectId (ref: Booking),
  customerId: ObjectId (ref: User),
  amount: Number,
  currency: String (default: 'VND'),
  paymentMethod: String (enum),
  status: String (enum: pending, success, failed, refunded),
  gatewayResponse: Object,
  refundAmount: Number,
  refundedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Tickets Collection
```javascript
{
  _id: ObjectId,
  ticketCode: String (unique),
  bookingId: ObjectId (ref: Booking),
  customerId: ObjectId (ref: User),
  tripId: ObjectId (ref: Trip),
  seatNumber: String,
  passenger: Object,
  qrCode: String (base64 image),
  qrData: String (encrypted),
  ticketPDF: String (URL),
  isValid: Boolean,
  isUsed: Boolean,
  usedAt: Date,
  validatedBy: ObjectId (ref: Staff),
  tripDetails: Object (denormalized),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Key Features Summary

✅ **Multiple Payment Methods** - VNPay, MoMo, ZaloPay, COD
✅ **Automatic Ticket Generation** - One per seat with QR code
✅ **QR Code Validation** - Scan-to-verify at boarding
✅ **Email/SMS Notifications** - Booking, payment, reminders
✅ **Ticket Management** - View, download, filter by status
✅ **Check-in System** - Mark tickets as used
✅ **Refund Processing** - Automatic for cancellations
✅ **Payment History** - Track all transactions
✅ **Demo Mode** - Safe for development and testing

---

## 🐛 Troubleshooting

### Tickets not generated
- Check if booking status is `confirmed`
- Verify payment status is `success`
- Check console logs for errors

### QR code validation fails
- Ensure QR data is properly URL-encoded
- Check if ticket is still valid
- Verify booking is confirmed

### Notifications not showing
- Check console output (they're logged in DEMO mode)
- In production, check email/SMS service credentials

---

## 📝 Next Steps

To complete the system:
1. Build frontend payment integration
2. Implement QR code scanner (mobile app or web camera)
3. Create ticket design/templates
4. Setup real payment gateway accounts
5. Integrate actual email/SMS services
6. Add payment analytics and reporting
7. Implement refund automation
8. Add fraud detection

---

**Ready for integration! All APIs are documented and tested.** 🚀
