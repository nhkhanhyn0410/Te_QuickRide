# Frontend Development Guide - Te_QuickRide

## Overview

This guide provides the foundation for building the Te_QuickRide frontend with **React 18**, **Tailwind CSS**, **Ant Design**, and **Redux Toolkit**.

**Status:** Foundation Complete (Redux, API Services)
**Next:** Implement UI components and pages

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** React 18 with Vite
- **UI Library:** Tailwind CSS + Ant Design
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Date Handling:** Day.js
- **QR Code:** qrcode.react

### Project Structure

```
frontend/src/
├── redux/
│   ├── store/
│   │   └── index.js              # Redux store configuration
│   └── slices/
│       ├── authSlice.js          # Authentication state
│       ├── tripSlice.js          # Trip search state
│       └── bookingSlice.js       # Booking state
│
├── services/
│   ├── api.js                    # Axios configuration
│   ├── authService.js            # Auth API calls
│   ├── tripService.js            # Trip API calls
│   ├── bookingService.js         # Booking API calls
│   ├── paymentService.js         # Payment API calls
│   └── ticketService.js          # Ticket API calls
│
├── pages/
│   ├── customer/
│   │   ├── Home.jsx              # Homepage with search
│   │   ├── SearchResults.jsx    # Trip search results
│   │   ├── TripDetails.jsx      # Trip details + seat selection
│   │   ├── Booking.jsx           # Booking form
│   │   ├── Payment.jsx           # Payment gateway
│   │   ├── PaymentResult.jsx    # Payment callback handler
│   │   ├── MyBookings.jsx        # Booking history
│   │   ├── BookingDetails.jsx   # Single booking view
│   │   ├── MyTickets.jsx         # E-tickets list
│   │   └── Profile.jsx           # User profile
│   ├── auth/
│   │   ├── Login.jsx             # Login page
│   │   └── Register.jsx          # Registration page
│   ├── operator/
│   │   ├── Dashboard.jsx         # Operator dashboard
│   │   ├── Trips.jsx             # Trip management
│   │   └── Bookings.jsx          # Booking management
│   └── admin/
│       ├── Dashboard.jsx         # Admin dashboard
│       └── Operators.jsx         # Operator approval
│
├── components/
│   ├── common/
│   │   ├── Header.jsx            # Navigation header
│   │   ├── Footer.jsx            # Footer
│   │   ├── Loading.jsx           # Loading spinner
│   │   ├── ErrorMessage.jsx     # Error display
│   │   └── ProtectedRoute.jsx   # Auth guard
│   ├── customer/
│   │   ├── TripCard.jsx          # Trip result card
│   │   ├── SeatMap.jsx           # Interactive seat selection
│   │   ├── PassengerForm.jsx    # Passenger info form
│   │   ├── BookingCard.jsx      # Booking summary card
│   │   └── TicketCard.jsx       # E-ticket display
│   └── search/
│       ├── SearchForm.jsx        # Trip search form
│       └── FilterBar.jsx         # Search filters
│
├── utils/
│   ├── formatters.js             # Date, currency formatters
│   ├── validators.js             # Form validation
│   └── constants.js              # App constants
│
├── App.jsx                       # Main app component
└── main.jsx                      # App entry point
```

---

## 📦 Redux Store

### Setup (Already Done)

```javascript
// redux/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tripReducer from './slices/tripSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trip: tripReducer,
    booking: bookingReducer,
  },
});
```

### Auth Slice

Manages user authentication state:

```javascript
// State
{
  user: null | Object,
  tokens: null | { accessToken, refreshToken },
  isAuthenticated: false,
  loading: false,
  error: null
}

// Actions
- loginStart()
- loginSuccess(payload)
- loginFailure(error)
- logout()
- updateUser(updates)
```

### Trip Slice

Manages trip search and selection:

```javascript
// State
{
  searchResults: [],
  selectedTrip: null,
  seatMap: null,
  loading: false,
  error: null,
  searchParams: { originCity, destinationCity, departureDate }
}

// Actions
- setSearchParams(params)
- searchTripsStart()
- searchTripsSuccess(results)
- searchTripsFailure(error)
- setSelectedTrip(trip)
- setSeatMap(seatMap)
- clearSearch()
```

### Booking Slice

Manages booking process:

```javascript
// State
{
  currentBooking: null,
  selectedSeats: [],
  passengers: {},
  pickupPoint: null,
  dropoffPoint: null,
  myBookings: [],
  loading: false,
  error: null
}

// Actions
- setSelectedSeats(seats)
- addPassenger({ seatNumber, passenger })
- removePassenger(seatNumber)
- setPickupPoint(point)
- setDropoffPoint(point)
- createBookingStart()
- createBookingSuccess(booking)
- createBookingFailure(error)
- setMyBookings(bookings)
- clearBooking()
```

---

## 🔌 API Services

All API services are configured and ready to use:

### Auth Service
```javascript
import { authService } from '@/services/authService';

// Register
await authService.register(userData);

// Login
const response = await authService.login({ emailOrPhone, password });

// Get current user
const user = await authService.getMe();

// Logout
await authService.logout();
```

### Trip Service
```javascript
import { tripService } from '@/services/tripService';

// Search trips
const results = await tripService.searchTrips({
  originCity: 'Hà Nội',
  destinationCity: 'Đà Nẵng',
  departureDate: '2025-01-15',
  page: 1,
  limit: 20
});

// Get trip details
const trip = await tripService.getTripDetails(tripId);

// Get available seats
const seatMap = await tripService.getAvailableSeats(tripId);

// Lock seats (15 minutes)
await tripService.lockSeats(tripId, ['A1', 'A2'], sessionId);

// Release seats
await tripService.releaseSeats(tripId, sessionId);
```

### Booking Service
```javascript
import { bookingService } from '@/services/bookingService';

// Create booking
const booking = await bookingService.createBooking({
  tripId,
  seats: [{ seatNumber: 'A1', passenger: {...} }],
  pickupPoint,
  dropoffPoint,
  contactEmail,
  contactPhone
});

// Get my bookings
const bookings = await bookingService.getMyBookings({ page: 1 });

// Cancel booking
await bookingService.cancelBooking(bookingId, reason);
```

### Payment Service
```javascript
import { paymentService } from '@/services/paymentService';

// Create payment
const payment = await paymentService.createPayment(bookingId, 'vnpay');
// Redirect to payment.paymentUrl

// Get payment status
const status = await paymentService.getPaymentStatus(paymentId);
```

### Ticket Service
```javascript
import { ticketService } from '@/services/ticketService';

// Get my tickets
const tickets = await ticketService.getMyTickets({ status: 'valid' });

// Get booking tickets
const tickets = await ticketService.getBookingTickets(bookingId);

// Download ticket
const ticketHtml = await ticketService.downloadTicket(ticketId);

// Get upcoming trips
const upcoming = await ticketService.getUpcomingTrips();
```

---

## 🎨 UI Components to Build

### 1. Homepage (src/pages/customer/Home.jsx)

**Features:**
- Hero section with search form
- Popular routes
- Why choose us section
- Testimonials

**Search Form Fields:**
- Origin city (autocomplete)
- Destination city (autocomplete)
- Departure date (date picker)
- Search button

**Example:**
```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select, Button } from 'antd';
import { setSearchParams } from '@/redux/slices/tripSlice';

export default function Home() {
  const [formData, setFormData] = useState({
    originCity: '',
    destinationCity: '',
    departureDate: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    dispatch(setSearchParams(formData));
    navigate('/search-results');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Đặt vé xe khách trực tuyến
          </h1>
          <p className="text-xl mb-8">
            Nhanh chóng - Tiện lợi - An toàn
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                placeholder="Điểm đi"
                size="large"
                value={formData.originCity}
                onChange={(value) => setFormData({ ...formData, originCity: value })}
                options={[
                  { value: 'Hà Nội', label: 'Hà Nội' },
                  { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
                  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                ]}
              />
              {/* ... more fields ... */}
              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
                className="bg-primary-500"
              >
                Tìm chuyến
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

### 2. Search Results (src/pages/customer/SearchResults.jsx)

**Features:**
- Display search parameters
- List of available trips
- Filters (price, time, operator, bus type)
- Sort options
- Pagination

**Trip Card Component:**
```jsx
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Button } from 'antd';
import { ClockCircleOutlined, CarOutlined } from '@ant-design/icons';

export function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-4 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold">
                {new Date(trip.departureTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </h3>
              <p className="text-gray-600">{trip.route.origin.city}</p>
            </div>

            <div className="flex-1 text-center">
              <ClockCircleOutlined className="text-gray-400" />
              <p className="text-sm text-gray-600">
                {Math.floor(trip.route.estimatedDuration / 60)}h{' '}
                {trip.route.estimatedDuration % 60}m
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold">
                {new Date(trip.arrivalTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </h3>
              <p className="text-gray-600">{trip.route.destination.city}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Tag icon={<CarOutlined />}>{trip.bus.type}</Tag>
            {trip.bus.amenities.map(amenity => (
              <Tag key={amenity}>{amenity}</Tag>
            ))}
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Nhà xe: {trip.operator.name} ⭐ {trip.operator.rating}
            </p>
            <p className="text-sm text-green-600">
              Còn {trip.availableSeats} ghế trống
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-primary-500">
            {trip.basePrice.toLocaleString('vi-VN')} ₫
          </p>
          <Button
            type="primary"
            size="large"
            className="mt-4"
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            Chọn chuyến
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

---

### 3. Trip Details & Seat Selection (src/pages/customer/TripDetails.jsx)

**Features:**
- Trip information display
- Interactive seat map
- Real-time seat availability
- Seat locking (15 minutes)
- Pickup/dropoff point selection
- Price calculation

**Seat Map Component:**
```jsx
import { useState, useEffect } from 'react';
import { Button } from 'antd';

export function SeatMap({ tripId, onSeatsSelected }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    // Fetch seat map
    tripService.getAvailableSeats(tripId).then(response => {
      setSeats(response.data.seats);
    });
  }, [tripId]);

  const toggleSeat = (seatNumber) => {
    const seat = seats.find(s => s.seatNumber === seatNumber);

    if (seat.status !== 'available') return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const getSeatClass = (seat) => {
    if (seat.status === 'occupied') return 'bg-gray-300 cursor-not-allowed';
    if (seat.status === 'locked') return 'bg-yellow-300 cursor-not-allowed';
    if (selectedSeats.includes(seat.seatNumber)) return 'bg-green-500 text-white';
    return 'bg-blue-100 hover:bg-blue-200 cursor-pointer';
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {seats.map(seat => (
          <button
            key={seat.seatNumber}
            onClick={() => toggleSeat(seat.seatNumber)}
            className={`p-4 rounded-lg font-semibold ${getSeatClass(seat)}`}
            disabled={seat.status !== 'available'}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded" />
          <span>Còn trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded" />
          <span>Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded" />
          <span>Đã đặt</span>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        disabled={selectedSeats.length === 0}
        onClick={() => onSeatsSelected(selectedSeats)}
      >
        Tiếp tục ({selectedSeats.length} ghế)
      </Button>
    </div>
  );
}
```

---

### 4. Booking Form (src/pages/customer/Booking.jsx)

**Features:**
- Passenger information for each seat
- Pickup/dropoff point selection
- Contact information
- Booking summary
- Terms and conditions

---

### 5. Payment (src/pages/customer/Payment.jsx)

**Features:**
- Payment method selection (VNPay, MoMo, ZaloPay, COD)
- Order summary
- Terms and conditions
- Payment button
- Redirect to payment gateway (DEMO)

**Payment Flow:**
```jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Radio, Button, message } from 'antd';
import { paymentService } from '@/services/paymentService';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await paymentService.createPayment(
        bookingId,
        paymentMethod
      );

      if (response.data.paymentUrl) {
        // Redirect to payment gateway (DEMO)
        window.location.href = response.data.paymentUrl;
      } else {
        // COD payment - immediate confirmation
        message.success('Đặt vé thành công!');
        navigate(`/booking/${bookingId}/success`);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      <Radio.Group
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full"
      >
        <div className="space-y-4">
          <Radio value="vnpay" className="w-full p-4 border rounded">
            <img src="/vnpay-logo.png" alt="VNPay" className="h-8" />
          </Radio>
          <Radio value="momo" className="w-full p-4 border rounded">
            <img src="/momo-logo.png" alt="MoMo" className="h-8" />
          </Radio>
          <Radio value="zalopay" className="w-full p-4 border rounded">
            <img src="/zalopay-logo.png" alt="ZaloPay" className="h-8" />
          </Radio>
          <Radio value="cod" className="w-full p-4 border rounded">
            💵 Thanh toán khi lên xe
          </Radio>
        </div>
      </Radio.Group>

      <Button
        type="primary"
        size="large"
        loading={loading}
        onClick={handlePayment}
        className="w-full mt-6"
      >
        Thanh toán
      </Button>
    </div>
  );
}
```

---

### 6. My Bookings (src/pages/customer/MyBookings.jsx)

**Features:**
- List of all bookings
- Filter by status (confirmed, cancelled, completed)
- Booking details
- Cancel booking
- View tickets

---

### 7. My Tickets (src/pages/customer/MyTickets.jsx)

**Features:**
- List of all tickets
- Filter by status (valid, used, invalid)
- QR code display
- Download ticket
- Upcoming trips

---

## 🎯 User Flow

### Complete Booking Flow

```
1. Homepage
   ↓ [Search trips]

2. Search Results
   ↓ [Select trip]

3. Trip Details
   ↓ [Select seats]

4. Booking Form
   ↓ [Enter passenger info]

5. Booking Summary
   ↓ [Confirm booking]

6. Payment
   ↓ [Choose payment method]

7a. Online Payment (VNPay/MoMo/ZaloPay)
    ↓ [Redirect to gateway - DEMO]
    ↓ [Complete payment]
    ↓ [Callback to /payment-result]

7b. COD Payment
    ↓ [Instant confirmation]

8. Success Page
   - Booking confirmed
   - Tickets generated
   - Email/SMS sent (demo)

9. View Tickets
   - QR codes
   - Download PDF
```

---

## 🛠️ Utility Functions

### Date Formatters
```javascript
// utils/formatters.js
import dayjs from 'dayjs';

export const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatTime = (date) => {
  return dayjs(date).format('HH:mm');
};

export const formatDateTime = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN') + ' ₫';
};
```

### Form Validators
```javascript
// utils/validators.js
export const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^(0|\+84)[0-9]{9,10}$/.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password);
};
```

---

## 📱 Responsive Design

All components should be mobile-responsive using Tailwind's responsive classes:

```jsx
<div className="
  grid
  grid-cols-1        /* Mobile: 1 column */
  md:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-3     /* Desktop: 3 columns */
  gap-4
">
  {/* Content */}
</div>
```

---

## 🎨 Tailwind Configuration

The project uses custom colors defined in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#e6f2ff',
        500: '#268bff',  // Main brand color
        600: '#1f70cc',
      },
      secondary: {
        500: '#ffbc26',
      },
    },
  },
}
```

---

## 🚀 Running the Frontend

```bash
cd frontend
npm run dev
```

The app will be available at: `http://localhost:3000`

---

## ✅ Implementation Checklist

**✅ Completed:**
- [x] Redux store setup
- [x] Auth slice
- [x] Trip slice
- [x] Booking slice
- [x] API service layer
- [x] Axios configuration
- [x] All service modules

**📋 To Do:**
- [ ] Create all page components
- [ ] Create common components (Header, Footer, etc.)
- [ ] Setup React Router
- [ ] Implement authentication flow
- [ ] Implement booking flow
- [ ] Add form validation
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test responsive design
- [ ] Optimize performance

---

## 📚 Key Libraries to Use

**Ant Design Components:**
- `DatePicker` - Date selection
- `Select` - Dropdowns
- `Button` - Buttons
- `Card` - Content containers
- `Modal` - Dialogs
- `Form` - Form handling
- `Input` - Text inputs
- `Radio` - Radio buttons
- `Checkbox` - Checkboxes
- `Tag` - Labels
- `Badge` - Badges
- `Spin` - Loading spinner
- `message` - Toast notifications
- `notification` - Notifications

**React Router Hooks:**
- `useNavigate()` - Navigation
- `useParams()` - URL parameters
- `useLocation()` - Current location
- `useSearchParams()` - Query parameters

**Redux Hooks:**
- `useSelector()` - Read state
- `useDispatch()` - Dispatch actions

---

## 🎯 Next Steps

1. **Create Main Layout:**
   - Header with navigation
   - Footer
   - Protected route wrapper

2. **Implement Auth Pages:**
   - Login page
   - Register page
   - Password reset

3. **Implement Customer Pages:**
   - Homepage with search
   - Search results
   - Trip details with seat map
   - Booking form
   - Payment page
   - My bookings
   - My tickets

4. **Add Polish:**
   - Loading states
   - Error handling
   - Form validation
   - Toast notifications
   - Responsive design

5. **Testing:**
   - Test complete booking flow
   - Test all payment methods
   - Test ticket display
   - Test mobile responsiveness

---

**Foundation is ready! Start building the UI components now.** 🚀
