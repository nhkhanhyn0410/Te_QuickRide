# UI PAGES ROADMAP - QuickRide

> Lộ trình phát triển giao diện người dùng chia theo 4 phases

## 🎯 Tổng quan

Hệ thống QuickRide có **3 loại người dùng chính**:
1. **Customer** (Khách hàng) - Đặt vé, quản lý booking
2. **Bus Operator** (Nhà xe) - Quản lý xe, tuyến, chuyến đi
3. **Admin** (Quản trị viên) - Quản lý toàn hệ thống

---

## 📊 Phase Development Strategy

| Phase | Timeline | Focus | Pages Count |
|-------|----------|-------|-------------|
| **Phase 1** | Tuần 1-4 | MVP - Core Booking Flow | 15 pages |
| **Phase 2** | Tuần 5-8 | Enhanced UX & Operator Features | 12 pages |
| **Phase 3** | Tuần 9-12 | Advanced Features & Analytics | 10 pages |
| **Phase 4** | Tuần 13-16 | Premium Features & Optimization | 8 pages |

**Tổng cộng**: **45 pages**

---

# PHASE 1: MVP - CORE FEATURES (Tuần 1-4)

> **Mục tiêu**: Khách hàng có thể tìm, đặt và thanh toán vé. Nhà xe có thể tạo chuyến đi. Admin có thể quản lý cơ bản.

## 🌐 Public Pages (5 pages)

### 1.1 Landing Page / Homepage ⭐⭐⭐
**Route**: `/`

**Mục đích**: Trang chủ giới thiệu dịch vụ và form tìm kiếm vé

**Components**:
- Hero section với search form nổi bật
- Form tìm kiếm:
  - Điểm đi (Autocomplete)
  - Điểm đến (Autocomplete)
  - Ngày khởi hành (Date picker)
  - Số lượng vé (Dropdown)
  - Button "Tìm chuyến"
- Featured routes (Top 6 tuyến phổ biến)
- Why choose us (4 USPs)
- Popular bus operators (Logo carousel)
- Customer testimonials (3-4 reviews)
- Download app section
- Footer

**Priority**: 🔴 Critical

---

### 1.2 Search Results Page ⭐⭐⭐
**Route**: `/search?from={city}&to={city}&date={date}`

**Mục đích**: Hiển thị danh sách chuyến xe phù hợp

**Components**:
- Search form (sticky header - có thể modify search)
- Filters sidebar:
  - Giá (Range slider)
  - Giờ khởi hành (Time range)
  - Loại xe (Checkboxes: Limousine, Sleeper, etc.)
  - Nhà xe (Checkboxes)
  - Tiện ích (Checkboxes: WiFi, AC, etc.)
  - Đánh giá (Star rating)
- Trip list (Main content):
  - Trip card với:
    - Thông tin nhà xe (Logo, tên, rating)
    - Thời gian đi/đến
    - Loại xe & tiện ích icons
    - Giá vé
    - Số ghế còn trống
    - Button "Chọn chuyến"
- Sort options (Giá, Giờ đi, Đánh giá)
- Pagination hoặc Infinite scroll

**Priority**: 🔴 Critical

---

### 1.3 Trip Detail & Seat Selection Page ⭐⭐⭐
**Route**: `/trips/{tripId}/seats`

**Mục đích**: Xem chi tiết chuyến và chọn ghế

**Components**:
- Trip summary card (sticky):
  - Route, thời gian, giá
  - Nhà xe info
- Seat map visualization:
  - Interactive seat layout (click to select)
  - Seat legend (Available, Selected, Occupied, Locked)
  - Floor selector (nếu xe 2 tầng)
- Pickup & Dropoff point selectors:
  - Dropdown/Radio buttons
  - Map preview (optional)
- Pricing breakdown:
  - Giá vé x Số ghế
  - Phí dịch vụ
  - Tổng cộng
- Button "Tiếp tục" → Passenger info

**Priority**: 🔴 Critical

---

### 1.4 About Us Page
**Route**: `/about`

**Mục đích**: Giới thiệu công ty, mission, vision

**Components**:
- Hero section
- Company story
- Our values
- Team members
- Milestones timeline
- Contact information

**Priority**: 🟡 Medium

---

### 1.5 Contact Page
**Route**: `/contact`

**Mục đích**: Liên hệ với support team

**Components**:
- Contact form
- Office locations (Map)
- Phone, Email, Social media
- FAQ section (link)

**Priority**: 🟡 Medium

---

## 🔐 Authentication Pages (3 pages)

### 1.6 Login Page ⭐⭐⭐
**Route**: `/login`

**Components**:
- Login form:
  - Email/Phone input
  - Password input
  - Remember me checkbox
  - Forgot password link
  - Login button
- Social login (Google, Facebook)
- Divider
- "Don't have account?" → Sign up link
- Role selector (Customer / Bus Operator)

**Priority**: 🔴 Critical

---

### 1.7 Register Page ⭐⭐⭐
**Route**: `/register`

**Components**:
- Register form:
  - Full name
  - Email
  - Phone
  - Password
  - Confirm password
  - Terms & conditions checkbox
  - Register button
- Social register (Google, Facebook)
- "Already have account?" → Login link
- Role selector (Customer / Bus Operator)

**Priority**: 🔴 Critical

---

### 1.8 Forgot Password Page
**Route**: `/forgot-password`

**Components**:
- Email/Phone input
- Send reset link button
- Back to login link
- Success message (after submit)

**Priority**: 🟡 Medium

---

## 👤 Customer Pages (5 pages)

### 1.9 Passenger Information Page ⭐⭐⭐
**Route**: `/booking/passengers`

**Mục đích**: Nhập thông tin hành khách cho từng ghế

**Components**:
- Progress indicator (Chọn ghế → Thông tin → Thanh toán)
- Passenger forms (1 form per seat):
  - Họ tên
  - Số điện thoại
  - CMND/CCCD (optional)
  - "Load from saved passengers" button
- Contact information:
  - Email
  - Phone
  - Notes (optional)
- Apply voucher section
- Pricing summary (sticky)
- Button "Tiếp tục thanh toán"

**Priority**: 🔴 Critical

---

### 1.10 Payment Page ⭐⭐⭐
**Route**: `/booking/payment`

**Mục đích**: Chọn phương thức thanh toán

**Components**:
- Progress indicator
- Booking summary:
  - Trip info
  - Passengers list
  - Pricing breakdown
- Payment method selector:
  - MoMo
  - VNPay
  - ZaloPay
  - ShopeePay
  - ATM/Credit card
  - (COD - nếu support)
- Terms checkbox
- Button "Xác nhận thanh toán"

**Priority**: 🔴 Critical

---

### 1.11 Booking Success Page ⭐⭐⭐
**Route**: `/booking/success/{bookingId}`

**Mục đích**: Xác nhận booking thành công

**Components**:
- Success animation/icon
- Booking confirmation:
  - Booking code
  - Trip details
  - Passengers
  - Payment info
- QR codes preview
- Buttons:
  - Download tickets (PDF)
  - View ticket details
  - Send to email
- "Book another trip" button

**Priority**: 🔴 Critical

---

### 1.12 My Bookings Page ⭐⭐⭐
**Route**: `/customer/bookings`

**Mục đích**: Xem danh sách booking của khách hàng

**Components**:
- Tabs:
  - Upcoming trips
  - Completed trips
  - Cancelled trips
- Booking cards:
  - Booking code
  - Trip info
  - Status badge
  - Actions: View details, Download ticket, Cancel
- Filters:
  - Date range
  - Status
- Search by booking code

**Priority**: 🔴 Critical

---

### 1.13 Booking Detail Page
**Route**: `/customer/bookings/{bookingId}`

**Mục đích**: Chi tiết một booking

**Components**:
- Booking summary
- Trip details
- Passengers list with QR codes
- Payment information
- Pickup/Dropoff points
- Timeline (Booked → Paid → Check-in → Completed)
- Actions:
  - Download all tickets
  - Cancel booking (if allowed)
  - Contact support

**Priority**: 🟡 Medium

---

## 🚌 Bus Operator Pages (Phase 1) (2 pages)

### 1.14 Operator Dashboard ⭐⭐
**Route**: `/operator/dashboard`

**Mục đích**: Tổng quan doanh thu, chuyến đi

**Components**:
- Stats cards:
  - Tổng doanh thu tháng này
  - Số chuyến đã chạy
  - Số vé đã bán
  - Đánh giá trung bình
- Revenue chart (Line chart - 7 ngày gần nhất)
- Recent bookings table (10 bookings mới nhất)
- Upcoming trips list (5 chuyến sắp tới)
- Quick actions:
  - Create new trip
  - View all trips
  - View all bookings

**Priority**: 🟡 Medium

---

### 1.15 Create Trip Page ⭐⭐
**Route**: `/operator/trips/create`

**Mục đích**: Tạo chuyến đi mới

**Components**:
- Form:
  - Route (Dropdown - từ routes đã tạo)
  - Bus (Dropdown - từ buses đã đăng ký)
  - Departure time (DateTime picker)
  - Arrival time (DateTime picker - auto calculated)
  - Base price (Number input)
  - Trip code (Auto-generated)
- Preview section:
  - Route map
  - Bus details
  - Seat availability
- Save button

**Priority**: 🟡 Medium

---

## 👨‍💼 Admin Pages (Phase 1) (Chưa có - để Phase 2)

---

# PHASE 2: ENHANCED UX & OPERATOR FEATURES (Tuần 5-8)

> **Mục tiêu**: Cải thiện trải nghiệm người dùng, bổ sung đầy đủ tính năng cho Bus Operator và Admin cơ bản

## 👤 Customer Pages (4 pages)

### 2.1 My Profile Page ⭐⭐
**Route**: `/customer/profile`

**Components**:
- Tabs:
  - Personal Info:
    - Avatar upload
    - Full name, Email, Phone
    - Date of birth, Gender
    - Edit button
  - Saved Passengers:
    - List saved passengers
    - Add/Edit/Delete
  - Change Password:
    - Old password
    - New password
    - Confirm password
  - Loyalty Points:
    - Current tier (Bronze/Silver/Gold/Platinum)
    - Points balance
    - Points history
    - Tier benefits
- Delete account button (bottom)

**Priority**: 🟡 Medium

---

### 2.2 My Tickets Page ⭐⭐
**Route**: `/customer/tickets`

**Mục đích**: Xem tất cả vé đã mua

**Components**:
- Filter tabs:
  - All tickets
  - Valid tickets
  - Used tickets
- Ticket cards:
  - QR code
  - Ticket code
  - Passenger name
  - Seat number
  - Trip info
  - Status badge
- Actions per ticket:
  - Download PDF
  - Send to email
  - Share QR

**Priority**: 🟡 Medium

---

### 2.3 Ticket Detail Page ⭐⭐
**Route**: `/customer/tickets/{ticketId}`

**Mục đích**: Chi tiết một vé với QR code to check-in

**Components**:
- Large QR code (for scanning)
- Ticket information:
  - Ticket code
  - Passenger details
  - Seat number
  - Trip details (Route, Time, Bus)
  - Booking code
- Trip timeline
- Download/Share buttons
- Check-in status

**Priority**: 🟡 Medium

---

### 2.4 Trip Tracking Page (Realtime)
**Route**: `/customer/track/{bookingId}`

**Mục đích**: Theo dõi vị trí xe real-time (nếu có GPS)

**Components**:
- Map với vị trí hiện tại của xe
- Estimated arrival time
- Distance remaining
- Timeline với pickup/dropoff points
- Driver info (if available)
- Contact driver/support buttons

**Priority**: 🟢 Low (Phase 2 or 3)

---

## 🚌 Bus Operator Pages (6 pages)

### 2.5 Operator Profile Page ⭐⭐
**Route**: `/operator/profile`

**Components**:
- Tabs:
  - Company Info:
    - Logo upload
    - Company name, Email, Phone
    - Description, Website
    - Business license, Tax code
    - Edit button
  - Address:
    - Street, Ward, District, City
    - Map preview
  - Bank Account:
    - Bank name
    - Account number
    - Account holder
  - Verification Status:
    - Status badge (Pending/Approved/Rejected)
    - Verified date
    - Rejection reason (if any)

**Priority**: 🟡 Medium

---

### 2.6 Manage Buses Page ⭐⭐
**Route**: `/operator/buses`

**Components**:
- "Add New Bus" button
- Bus table:
  - Bus number
  - Bus type
  - Total seats
  - Amenities (icons)
  - Maintenance status
  - Active status
  - Actions: Edit, Delete, View trips
- Filters:
  - Bus type
  - Maintenance status
  - Active status

**Priority**: 🔴 Critical

---

### 2.7 Add/Edit Bus Page ⭐⭐
**Route**: `/operator/buses/create` hoặc `/operator/buses/{busId}/edit`

**Components**:
- Form:
  - Bus number (required)
  - Bus type (Dropdown)
  - Seat layout configuration:
    - Floors (1 or 2)
    - Rows
    - Columns
    - Visual seat layout editor (drag & drop)
  - Total seats (auto-calculated)
  - Amenities (Multi-select checkboxes)
  - Images upload (multiple)
  - Maintenance status
  - Active status
- Preview section (seat layout visualization)
- Save button

**Priority**: 🔴 Critical

---

### 2.8 Manage Routes Page ⭐⭐
**Route**: `/operator/routes`

**Components**:
- "Add New Route" button
- Route table:
  - Route code
  - Route name (Origin → Destination)
  - Distance
  - Duration
  - Active status
  - Actions: Edit, Delete, View trips
- Search by route code/name

**Priority**: 🔴 Critical

---

### 2.9 Add/Edit Route Page ⭐⭐
**Route**: `/operator/routes/create` hoặc `/operator/routes/{routeId}/edit`

**Components**:
- Form:
  - Route name
  - Route code (auto-generated or manual)
  - Origin:
    - City, Province (Autocomplete)
    - Station name
    - Address
    - Coordinates (Map picker)
  - Destination: (same as Origin)
  - Pickup points (Multiple):
    - Add/Remove buttons
    - Name, Address, Coordinates
  - Dropoff points (Multiple): (same)
  - Distance (km)
  - Estimated duration (minutes)
  - Active status
- Map preview (showing full route)
- Save button

**Priority**: 🔴 Critical

---

### 2.10 Manage Trips Page ⭐⭐
**Route**: `/operator/trips`

**Components**:
- "Create New Trip" button
- Filters:
  - Date range
  - Route
  - Status (Scheduled/Boarding/In Progress/Completed/Cancelled)
- Trip table:
  - Trip code
  - Route
  - Bus number
  - Departure time
  - Available seats / Total
  - Status badge
  - Actions: Edit, Cancel, View bookings
- Calendar view toggle (optional)

**Priority**: 🔴 Critical

---

## 👨‍💼 Admin Pages (2 pages)

### 2.11 Admin Dashboard ⭐⭐
**Route**: `/admin/dashboard`

**Components**:
- Global stats cards:
  - Total users
  - Total operators
  - Total bookings (today/this month)
  - Total revenue
- Charts:
  - Revenue over time (Line chart - 30 days)
  - Bookings by status (Pie chart)
  - Top operators (Bar chart)
- Pending approvals:
  - Operator verifications (table)
  - Quick approve/reject buttons
- Recent activities log

**Priority**: 🟡 Medium

---

### 2.12 Manage Operators Page ⭐⭐
**Route**: `/admin/operators`

**Components**:
- Filters:
  - Verification status
  - Suspended status
- Operator table:
  - Company name
  - Email, Phone
  - Verification status badge
  - Total trips, Total revenue
  - Average rating
  - Actions: View details, Approve/Reject, Suspend
- Search by company name/email

**Priority**: 🟡 Medium

---

# PHASE 3: ADVANCED FEATURES & ANALYTICS (Tuần 9-12)

> **Mục tiêu**: Analytics, Reviews, Notifications, Advanced filters

## 👤 Customer Pages (3 pages)

### 3.1 Reviews & Ratings Page
**Route**: `/customer/reviews`

**Components**:
- "My Reviews" tab
- "Pending Reviews" tab (trips chưa review)
- Review cards:
  - Trip info
  - Rating (stars)
  - Comment
  - Date
  - Operator response (if any)
  - Edit/Delete buttons
- Write review modal

**Priority**: 🟢 Low

---

### 3.2 Write Review Page
**Route**: `/bookings/{bookingId}/review`

**Components**:
- Trip summary
- Rating stars (Overall, Driver, Punctuality, Cleanliness, etc.)
- Comment textarea
- Upload photos (optional)
- Submit button

**Priority**: 🟢 Low

---

### 3.3 Notifications Page ⭐⭐
**Route**: `/notifications`

**Components**:
- Notification list:
  - Booking confirmations
  - Trip reminders
  - Cancellations
  - Promotions
  - Announcements
- Mark as read/unread
- Delete notifications
- Filter by type

**Priority**: 🟡 Medium

---

## 🚌 Bus Operator Pages (4 pages)

### 3.4 Bookings Management Page ⭐⭐
**Route**: `/operator/bookings`

**Components**:
- Filters:
  - Date range
  - Trip
  - Status (Pending/Confirmed/Cancelled/Completed)
- Booking table:
  - Booking code
  - Customer name, phone
  - Trip info
  - Seats count
  - Total amount
  - Status
  - Actions: View details, Check-in, Cancel
- Export to Excel button

**Priority**: 🟡 Medium

---

### 3.5 Revenue & Analytics Page ⭐⭐
**Route**: `/operator/analytics`

**Components**:
- Date range selector
- Revenue metrics:
  - Total revenue
  - Revenue by route
  - Revenue by bus
  - Average ticket price
- Charts:
  - Revenue over time (Line chart)
  - Seat occupancy rate (Bar chart)
  - Popular routes (Pie chart)
  - Peak hours (Heatmap)
- Export reports

**Priority**: 🟡 Medium

---

### 3.6 Customer Reviews Page
**Route**: `/operator/reviews`

**Components**:
- Average rating display
- Filters:
  - Rating (1-5 stars)
  - Date range
  - Trip
- Review cards:
  - Customer name (anonymous option)
  - Rating
  - Comment
  - Photos
  - Date
  - Respond button
- Respond to review modal

**Priority**: 🟢 Low

---

### 3.7 Staff Management Page
**Route**: `/operator/staff`

**Mục đích**: Quản lý tài xế, quản lý chuyến

**Components**:
- "Add New Staff" button
- Staff table:
  - Name, Phone
  - Role (Driver / Trip Manager)
  - License number
  - Status (Active/Inactive)
  - Actions: Edit, Delete, Assign trips
- Assign staff to trip modal

**Priority**: 🟢 Low (Model chưa có)

---

## 👨‍💼 Admin Pages (3 pages)

### 3.8 Manage Users Page ⭐⭐
**Route**: `/admin/users`

**Components**:
- Filters:
  - Role (Customer/Admin)
  - Loyalty tier
  - Active/Blocked status
- User table:
  - Full name
  - Email, Phone
  - Role
  - Loyalty tier
  - Total bookings
  - Total spent
  - Actions: View details, Block/Unblock, Delete
- Search by email/phone

**Priority**: 🟡 Medium

---

### 3.9 Manage Bookings (Admin) Page
**Route**: `/admin/bookings`

**Components**:
- Filters:
  - Date range
  - Customer
  - Operator
  - Status
- Booking table (similar to operator bookings)
- Actions:
  - View details
  - Cancel (with refund)
  - Process refund
- Export to Excel

**Priority**: 🟡 Medium

---

### 3.10 System Analytics Page
**Route**: `/admin/analytics`

**Components**:
- Date range selector
- Global metrics:
  - Total revenue
  - Commission earned
  - Total bookings
  - Total trips
  - Active users
- Charts:
  - Revenue & commission over time
  - Bookings trend
  - Top operators (by revenue)
  - Top routes (by bookings)
  - User growth
- Export reports

**Priority**: 🟡 Medium

---

# PHASE 4: PREMIUM FEATURES & OPTIMIZATION (Tuần 13-16)

> **Mục tiêu**: Tính năng cao cấp, tối ưu hóa, mobile app

## 🌐 Public/Shared Pages (4 pages)

### 4.1 Blog/News Page
**Route**: `/blog`

**Components**:
- Blog post grid
- Categories filter
- Search blog
- Featured posts
- Pagination

**Priority**: 🟢 Low

---

### 4.2 Blog Post Detail Page
**Route**: `/blog/{slug}`

**Components**:
- Post content (Rich text)
- Author info
- Related posts
- Comments section
- Share buttons

**Priority**: 🟢 Low

---

### 4.3 Promotions Page
**Route**: `/promotions`

**Components**:
- Active promotions grid
- Promotion cards:
  - Banner image
  - Title, Description
  - Discount %
  - Valid dates
  - "Get Code" button
- Expired promotions (collapsed)

**Priority**: 🟢 Low

---

### 4.4 Help Center / FAQ Page ⭐⭐
**Route**: `/help`

**Components**:
- Search bar
- Category tabs:
  - Booking
  - Payment
  - Cancellation
  - Account
  - Other
- FAQ accordion
- "Still need help?" → Contact support

**Priority**: 🟡 Medium

---

## 👤 Customer Pages (1 page)

### 4.5 Vouchers & Deals Page
**Route**: `/customer/vouchers`

**Components**:
- Available vouchers:
  - Voucher cards
  - Discount info
  - Valid dates
  - Min purchase
  - "Collect" button
- My vouchers:
  - Collected vouchers
  - Used vouchers
  - Expired vouchers
- Apply voucher (during booking)

**Priority**: 🟢 Low

---

## 🚌 Bus Operator Pages (1 page)

### 4.6 Promotions Management Page
**Route**: `/operator/promotions`

**Components**:
- "Create Promotion" button
- Promotions table:
  - Title
  - Discount %
  - Valid dates
  - Used count
  - Status (Active/Expired)
  - Actions: Edit, Deactivate, Delete
- Create/Edit promotion form:
  - Title, Description
  - Banner image
  - Discount type (%, Fixed amount)
  - Discount value
  - Min purchase
  - Valid from/to dates
  - Max uses
  - Routes (optional)

**Priority**: 🟢 Low

---

## 👨‍💼 Admin Pages (2 pages)

### 4.7 Voucher Management Page
**Route**: `/admin/vouchers`

**Components**:
- "Create Voucher" button
- Voucher table:
  - Code
  - Discount
  - Valid dates
  - Max uses / Used
  - Status
  - Actions: Edit, Deactivate
- Create/Edit voucher form:
  - Code (auto-generated or manual)
  - Type (%, Fixed)
  - Value
  - Min purchase
  - Max uses
  - Valid from/to
  - Applicable to (All/Specific operators/routes)

**Priority**: 🟢 Low

---

### 4.8 System Settings Page
**Route**: `/admin/settings`

**Components**:
- Tabs:
  - General:
    - Site name, Logo
    - Contact info
    - Timezone
  - Payment:
    - Payment gateways config
    - Commission rate
  - Email:
    - SMTP settings
    - Email templates
  - SMS:
    - SMS gateway config
  - Notifications:
    - Enable/disable notification types
  - Security:
    - Session timeout
    - Password policy
- Save button per tab

**Priority**: 🟢 Low

---

# 📊 SUMMARY BY PHASE

## Phase 1: MVP (15 pages)

**Public (5)**:
1. Landing Page ⭐⭐⭐
2. Search Results ⭐⭐⭐
3. Trip Detail & Seat Selection ⭐⭐⭐
4. About Us
5. Contact

**Auth (3)**:
6. Login ⭐⭐⭐
7. Register ⭐⭐⭐
8. Forgot Password

**Customer (5)**:
9. Passenger Info ⭐⭐⭐
10. Payment ⭐⭐⭐
11. Booking Success ⭐⭐⭐
12. My Bookings ⭐⭐⭐
13. Booking Detail

**Operator (2)**:
14. Dashboard ⭐⭐
15. Create Trip ⭐⭐

---

## Phase 2: Enhanced (12 pages)

**Customer (4)**:
1. My Profile ⭐⭐
2. My Tickets ⭐⭐
3. Ticket Detail ⭐⭐
4. Trip Tracking

**Operator (6)**:
5. Operator Profile ⭐⭐
6. Manage Buses ⭐⭐
7. Add/Edit Bus ⭐⭐
8. Manage Routes ⭐⭐
9. Add/Edit Route ⭐⭐
10. Manage Trips ⭐⭐

**Admin (2)**:
11. Admin Dashboard ⭐⭐
12. Manage Operators ⭐⭐

---

## Phase 3: Advanced (10 pages)

**Customer (3)**:
1. Reviews & Ratings
2. Write Review
3. Notifications ⭐⭐

**Operator (4)**:
4. Bookings Management ⭐⭐
5. Revenue & Analytics ⭐⭐
6. Customer Reviews
7. Staff Management

**Admin (3)**:
8. Manage Users ⭐⭐
9. Manage Bookings ⭐⭐
10. System Analytics ⭐⭐

---

## Phase 4: Premium (8 pages)

**Public (4)**:
1. Blog
2. Blog Post Detail
3. Promotions
4. Help Center / FAQ ⭐⭐

**Customer (1)**:
5. Vouchers & Deals

**Operator (1)**:
6. Promotions Management

**Admin (2)**:
7. Voucher Management
8. System Settings

---

# 🎨 UI/UX DESIGN GUIDELINES

## Design System

### Colors
- **Primary**: Blue (#0066CC) - Trust, reliability
- **Secondary**: Orange (#FF6600) - Energy, action
- **Success**: Green (#00CC66)
- **Warning**: Yellow (#FFCC00)
- **Danger**: Red (#CC0000)
- **Neutral**: Gray scale

### Typography
- **Headings**: Inter/Poppins (Bold)
- **Body**: Inter/Roboto (Regular)
- **Monospace**: Roboto Mono (Codes)

### Components
- **Buttons**: Rounded, elevation on hover
- **Cards**: Subtle shadow, border radius 8px
- **Forms**: Clear labels, inline validation
- **Icons**: Consistent icon library (Heroicons/Feather)

---

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile-First Features
- Bottom navigation (Customer app)
- Swipeable cards
- Pull-to-refresh
- Touch-friendly buttons (min 44px)

---

## Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratio > 4.5:1
- Alt text for images

---

# 🛠️ TECHNICAL STACK RECOMMENDATIONS

## Frontend

### Framework
- **React** + **TypeScript** (Current setup)
- **Vite** for build tool

### UI Libraries
- **Tailwind CSS** v4 (Current)
- **Headless UI** or **Radix UI** for components
- **Framer Motion** for animations

### State Management
- **Redux Toolkit** or **Zustand**
- **React Query** for server state

### Forms
- **React Hook Form** + **Zod** validation

### Maps
- **Leaflet** or **Mapbox GL JS**

### Charts
- **Recharts** or **Chart.js**

### Date/Time
- **date-fns** or **Day.js**

---

## Backend

- **Node.js** + **Express** (Current)
- **MongoDB** + **Mongoose** (Current)
- **JWT** authentication
- **Socket.io** (for real-time tracking)

---

# 📱 MOBILE APP CONSIDERATIONS

Nếu phát triển Mobile App (Phase 4+):

## Platform
- **React Native** (code sharing with web)
- Hoặc **Flutter** (performance tốt hơn)

## Additional Screens
- Onboarding slides
- Biometric authentication
- Push notifications settings
- Offline mode
- Download tickets for offline

---

# 🚦 PRIORITY LEGEND

- 🔴 **Critical** (⭐⭐⭐): Phải có trong MVP, core functionality
- 🟡 **Medium** (⭐⭐): Quan trọng, nên có sớm
- 🟢 **Low**: Nice to have, có thể delay

---

# 📋 DEVELOPMENT CHECKLIST

## Phase 1 Checklist (MVP)

### Week 1-2: Public & Auth
- [ ] Landing Page với search form
- [ ] Search Results với filters
- [ ] Trip Detail & Seat Selection
- [ ] Login/Register pages
- [ ] Forgot Password

### Week 3: Customer Booking Flow
- [ ] Passenger Information
- [ ] Payment Page
- [ ] Booking Success
- [ ] My Bookings
- [ ] Booking Detail

### Week 4: Operator Basic
- [ ] Operator Dashboard
- [ ] Create Trip
- [ ] About Us & Contact pages

**Deliverable**: Khách hàng có thể đặt vé, thanh toán. Nhà xe có thể tạo chuyến.

---

## Phase 2 Checklist (Enhanced)

### Week 5: Customer Profile & Tickets
- [ ] My Profile with tabs
- [ ] My Tickets list
- [ ] Ticket Detail with QR
- [ ] Trip Tracking (optional)

### Week 6-7: Operator Management
- [ ] Operator Profile
- [ ] Manage Buses (CRUD)
- [ ] Manage Routes (CRUD)
- [ ] Manage Trips (CRUD)

### Week 8: Admin Panel
- [ ] Admin Dashboard
- [ ] Manage Operators (Approve/Reject)

**Deliverable**: Nhà xe quản lý đầy đủ xe/tuyến/chuyến. Admin kiểm soát nhà xe.

---

## Phase 3 Checklist (Advanced)

### Week 9: Reviews & Notifications
- [ ] Customer Reviews & Ratings
- [ ] Write Review
- [ ] Notifications system

### Week 10: Operator Analytics
- [ ] Bookings Management
- [ ] Revenue & Analytics
- [ ] Customer Reviews response
- [ ] Staff Management (if model ready)

### Week 11-12: Admin Advanced
- [ ] Manage Users
- [ ] Manage Bookings (Admin view)
- [ ] System Analytics

**Deliverable**: Analytics, reviews, notifications. Hệ thống hoàn chỉnh.

---

## Phase 4 Checklist (Premium)

### Week 13-14: Content & Marketing
- [ ] Blog/News
- [ ] Promotions Page
- [ ] Help Center/FAQ
- [ ] Vouchers & Deals

### Week 15: Operator & Admin Premium
- [ ] Promotions Management (Operator)
- [ ] Voucher Management (Admin)
- [ ] System Settings (Admin)

### Week 16: Polish & Optimization
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Mobile responsiveness check
- [ ] Accessibility audit
- [ ] User testing & bug fixes

**Deliverable**: Hệ thống production-ready với tất cả tính năng.

---

# 🎯 SUCCESS METRICS

## Phase 1 Metrics
- [ ] Khách hàng có thể hoàn thành booking trong < 3 phút
- [ ] Search results load < 2 seconds
- [ ] Payment success rate > 95%

## Phase 2 Metrics
- [ ] Nhà xe có thể tạo chuyến mới < 2 phút
- [ ] Admin approve operator < 5 phút
- [ ] Mobile responsive 100%

## Phase 3 Metrics
- [ ] User engagement với reviews > 30%
- [ ] Analytics dashboard load < 3 seconds
- [ ] Notification delivery rate > 98%

## Phase 4 Metrics
- [ ] Voucher redemption rate > 20%
- [ ] Help center deflection rate > 50%
- [ ] Overall performance score > 90

---

**Version**: 1.0
**Last Updated**: 2025-01-16
