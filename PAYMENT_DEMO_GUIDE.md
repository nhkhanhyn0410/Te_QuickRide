# Hướng Dẫn Demo Thanh Toán - QuickRide

## Tổng Quan

Hệ thống QuickRide đã tích hợp **demo** các cổng thanh toán phổ biến tại Việt Nam:
- ✅ **VNPay** - Cổng thanh toán điện tử
- ✅ **MoMo** - Ví điện tử MoMo
- ✅ **ZaloPay** - Ví điện tử ZaloPay
- ✅ **COD (Cash on Delivery)** - Thanh toán tiền mặt khi lên xe

**⚠️ LƯU Ý**: Tất cả các giao diện thanh toán đều là **DEMO** và không thực hiện giao dịch thực tế.

---

## Luồng Thanh Toán Hoàn Chỉnh

### Bước 1: Tìm Kiếm Chuyến Xe
1. Truy cập trang chủ: `http://localhost:3000`
2. Nhập thông tin tìm kiếm:
   - **Điểm đi**: Hà Nội
   - **Điểm đến**: Đà Nẵng
   - **Ngày đi**: Chọn ngày trong tương lai
3. Click **Tìm kiếm**

### Bước 2: Chọn Chuyến Xe & Ghế Ngồi
1. Xem danh sách chuyến xe (hỗ trợ phân trang - 50 chuyến/trang)
2. Click **Chọn chuyến** trên chuyến xe mong muốn
3. Chọn ghế ngồi trên sơ đồ ghế:
   - 🟢 **Màu xanh**: Ghế trống
   - 🔴 **Màu đỏ**: Ghế đã đặt
   - 🟡 **Màu vàng**: Ghế đang khóa
   - 🔵 **Màu xanh dương**: Ghế bạn đã chọn
4. Click **Tiếp tục** (cần đăng nhập)

### Bước 3: Nhập Thông Tin Hành Khách
1. Nhập thông tin hành khách:
   - Họ và tên
   - Số điện thoại
   - Email
   - Điểm đón/trả (tùy chọn)
2. Kiểm tra lại thông tin
3. Click **Tiếp tục thanh toán**

### Bước 4: Chọn Phương Thức Thanh Toán
Màn hình sẽ hiển thị 4 phương thức:

#### 1. VNPay (Khuyên dùng)
- **Mô tả**: Thanh toán qua VNPay (DEMO)
- **Icon**: 💳 Thẻ tín dụng
- **Hỗ trợ**: QR Code, Thẻ ATM, Thẻ quốc tế

#### 2. MoMo
- **Mô tả**: Thanh toán qua ví MoMo (DEMO)
- **Icon**: 📱 Mobile
- **Hỗ trợ**: QR Code, Ví điện tử

#### 3. ZaloPay
- **Mô tả**: Thanh toán qua ví ZaloPay (DEMO)
- **Icon**: 💰 Wallet
- **Hỗ trợ**: QR Code, Ví điện tử

#### 4. Tiền mặt (COD)
- **Mô tả**: Thanh toán khi lên xe
- **Icon**: 💵 Dollar
- **Đặc điểm**: Không cần thanh toán trước

---

## Chi Tiết Demo Từng Phương Thức

### 🔵 Demo VNPay

**URL**: `/payment/vnpay/demo`

**Giao Diện**:
- Header màu xanh dương với logo VNPay
- Hiển thị thông tin giao dịch:
  - Mã giao dịch (vnp_TxnRef)
  - Mã đơn hàng (Booking Code)
  - Số tiền thanh toán
- 3 phương thức thanh toán con:
  1. **Quét mã QR** - Hiển thị QR code giả lập
  2. **Thẻ ATM/Tài khoản ngân hàng**
  3. **Thẻ tín dụng quốc tế** (Visa, MasterCard, JCB, AMEX)

**Hành Động**:
- **Nút "Thanh toán"** (màu xanh): Mô phỏng thanh toán thành công
- **Nút "Hủy"** (màu đỏ): Mô phỏng thanh toán thất bại

**Sau Khi Click**:
1. Loading 2 giây
2. Gọi API callback: `GET /api/payments/vnpay/return`
3. Backend cập nhật:
   - Payment status → `success` hoặc `failed`
   - Booking status → `confirmed` (nếu thành công)
   - Tạo tickets và gửi email
4. Redirect về `/bookings/:bookingId`

---

### 🟣 Demo MoMo

**URL**: `/payment/momo/demo`

**Giao Diện**:
- Header màu hồng với logo MoMo
- Hiển thị thông tin giao dịch
- QR Code giả lập cho việc quét mã
- Hiển thị số dư ví demo: **10,000,000 VND**

**Hành Động**:
- **Nút "Xác nhận thanh toán"**: Mô phỏng thanh toán thành công
- **Nút "Hủy giao dịch"**: Mô phỏng thanh toán thất bại

**Sau Khi Click**:
1. Loading 2 giây
2. Gọi API callback: `POST /api/payments/momo/callback`
3. Backend cập nhật tương tự VNPay
4. Redirect về `/bookings/:bookingId`

---

### 🔵 Demo ZaloPay

**URL**: `/payment/zalopay/demo`

**Giao Diện**:
- Header màu xanh dương với logo ZaloPay
- Hiển thị thông tin giao dịch
- QR Code giả lập
- Hiển thị số dư ví demo: **15,000,000 VND**
- Banner khuyến mãi: "Giảm 50K cho đơn từ 200K"

**Hành Động**:
- **Nút "Thanh toán ngay"**: Mô phỏng thanh toán thành công
- **Nút "Hủy"**: Mô phỏng thanh toán thất bại

**Sau Khi Click**:
1. Loading 2 giây
2. Gọi API callback: `POST /api/payments/zalopay/callback`
3. Backend cập nhật
4. Redirect về `/bookings/:bookingId`

---

### 💵 Thanh Toán Tiền Mặt (COD)

**Đặc Điểm**:
- Không cần chuyển sang trang thanh toán
- Booking được xác nhận ngay lập tức
- Payment status = `pending`
- Booking status = `confirmed`
- Vé được tạo và gửi email ngay

**Khi Nào Dùng**:
- Khách hàng muốn thanh toán trực tiếp
- Không có phương thức thanh toán online
- Thanh toán khi lên xe tại bến

---

## Kiểm Tra Kết Quả Thanh Toán

### Sau Khi Thanh Toán Thành Công:

**1. Trang Chi Tiết Booking** (`/bookings/:bookingId`):
```
✅ Trạng thái: Đã xác nhận
📧 Email: Đã gửi xác nhận
🎫 Vé điện tử: Đã tạo
💳 Thanh toán: Hoàn tất
```

**2. Email Nhận Được**:
- Xác nhận đặt vé
- Thông tin chuyến xe
- QR Code vé điện tử
- Hướng dẫn check-in

**3. Database**:
```javascript
// Payment Collection
{
  status: "success",
  transactionId: "VNPAY_xxx",
  amount: 350000,
  paymentMethod: "vnpay"
}

// Booking Collection
{
  status: "confirmed",
  paymentStatus: "completed"
}

// Tickets Collection
[{
  ticketCode: "TICKET_xxx",
  qrCode: "base64_qr_code",
  status: "active"
}]
```

---

## API Endpoints

### Frontend → Backend

**1. Tạo Payment**:
```http
POST /api/payments/create
Body: {
  "bookingId": "booking_id",
  "paymentMethod": "vnpay" | "momo" | "zalopay" | "cod"
}
Response: {
  "payment": {...},
  "paymentUrl": "frontend_url/payment/vnpay/demo?..."
}
```

**2. VNPay Callback**:
```http
GET /api/payments/vnpay/return?vnp_TxnRef=xxx&vnp_ResponseCode=00
Response: {
  "success": true,
  "payment": {...}
}
```

**3. MoMo Callback**:
```http
POST /api/payments/momo/callback
Body: {
  "orderId": "MOMO_xxx",
  "resultCode": 0,
  "amount": 350000
}
```

**4. ZaloPay Callback**:
```http
POST /api/payments/zalopay/callback
Body: {
  "app_trans_id": "ZALOPAY_xxx",
  "status": 1,
  "amount": 350000
}
```

---

## Cấu Trúc Files

### Frontend:
```
frontend/src/
├── pages/
│   ├── customer/
│   │   ├── Payment.jsx          # Trang chọn phương thức
│   │   ├── TripDetails.jsx      # Chi tiết chuyến & chọn ghế
│   │   ├── Booking.jsx          # Nhập thông tin hành khách
│   │   └── BookingDetail.jsx    # Xem kết quả
│   └── payment/
│       ├── VNPayDemo.jsx        # Demo VNPay gateway
│       ├── MoMoDemo.jsx         # Demo MoMo gateway
│       └── ZaloPayDemo.jsx      # Demo ZaloPay gateway
├── services/
│   └── paymentService.js        # API calls
└── App.jsx                      # Routing
```

### Backend:
```
backend/src/
├── controllers/
│   └── paymentController.js     # Payment logic
├── services/
│   ├── paymentService.js        # Gateway implementations
│   ├── ticketService.js         # Ticket generation
│   └── notificationService.js   # Email/SMS
├── models/
│   ├── Payment.js               # Payment schema
│   ├── Booking.js               # Booking schema
│   └── Ticket.js                # Ticket schema
└── routes/
    └── payments.js              # API routes
```

---

## Test Cases

### Test 1: Thanh Toán VNPay Thành Công
**Steps**:
1. Tìm và chọn chuyến xe
2. Chọn 2 ghế
3. Nhập thông tin hành khách
4. Chọn VNPay
5. Click "Thanh toán" (nút xanh)

**Expected**:
- ✅ Chuyển đến trang demo VNPay
- ✅ Hiển thị đúng số tiền
- ✅ Loading 2 giây
- ✅ Message "Thanh toán thành công!"
- ✅ Redirect về booking detail
- ✅ Status = "Đã xác nhận"
- ✅ Nhận email xác nhận

### Test 2: Thanh Toán MoMo Thất Bại
**Steps**:
1-4. Tương tự Test 1, chọn MoMo
5. Click "Hủy giao dịch" (nút đỏ)

**Expected**:
- ✅ Loading 2 giây
- ✅ Message "Thanh toán thất bại!"
- ✅ Payment status = "failed"
- ✅ Booking status vẫn = "pending"
- ✅ Không tạo tickets

### Test 3: Thanh Toán COD
**Steps**:
1-3. Tương tự Test 1
4. Chọn "Tiền mặt"
5. Click "Thanh toán"

**Expected**:
- ✅ Không chuyển trang demo
- ✅ Message "Đặt vé thành công! Vui lòng thanh toán khi lên xe."
- ✅ Booking status = "confirmed"
- ✅ Payment status = "pending"
- ✅ Tạo tickets và gửi email

---

## Troubleshooting

### Lỗi: "Không tìm thấy chuyến xe"
**Nguyên nhân**: Backend trả về `id` nhưng frontend dùng `_id`
**Giải pháp**: Đã sửa trong TripCard.jsx:
```javascript
navigate(`/trips/${trip.id || trip._id}`);
```

### Lỗi: "Giá tiền không hiển thị"
**Nguyên nhân**: Backend trả về `basePrice` nhưng frontend dùng `baseFare`
**Giải pháp**: Đã sửa hỗ trợ cả 2:
```javascript
{formatPrice(trip.basePrice || trip.baseFare || 0)}
```

### Lỗi: "Network Error" khi thanh toán
**Kiểm tra**:
1. Backend server đang chạy: `http://localhost:5000`
2. Env variable `REACT_APP_API_URL` đúng
3. CORS được enable ở backend

### Lỗi: "Cannot read property 'map' of undefined"
**Nguyên nhân**: Response data structure khác
**Kiểm tra**:
```javascript
// Backend response
{
  success: true,
  data: [...],  // Array trực tiếp
  pagination: {...}
}

// Frontend expect
response.data // Not response.data.trips
```

---

## Environment Variables

### Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### Backend (.env):
```env
FRONTEND_URL=http://localhost:3000
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickride
```

---

## Hướng Dẫn Chạy Demo

### 1. Khởi động Backend:
```bash
cd backend
npm install
npm run dev
```

### 2. Khởi động Frontend:
```bash
cd frontend
npm install
npm start
```

### 3. Tạo Dữ Liệu Test:
- Tạo tài khoản operator
- Tạo xe bus
- Tạo tuyến đường
- Tạo chuyến xe

### 4. Test Thanh Toán:
1. Đăng nhập với tài khoản customer
2. Tìm kiếm chuyến xe
3. Chọn chuyến và ghế
4. Test các phương thức thanh toán

---

## Video Demo

Để demo cho người khác, hãy ghi lại video theo luồng:

1. **Intro** (10s): Giới thiệu tính năng
2. **Tìm kiếm** (20s): Tìm chuyến từ Hà Nội → Đà Nẵng
3. **Chọn chuyến** (30s): Xem chi tiết, chọn 2 ghế
4. **Thông tin** (20s): Nhập thông tin hành khách
5. **VNPay Demo** (40s): Chọn VNPay, xem giao diện, thanh toán thành công
6. **MoMo Demo** (30s): Thử MoMo với QR code
7. **Kết quả** (30s): Xem booking detail, vé điện tử, email

**Tổng thời gian**: ~3 phút

---

## Notes Quan Trọng

1. **Đây là DEMO**: Không có giao dịch thật
2. **Production**: Cần tích hợp SDK thật từ VNPay, MoMo, ZaloPay
3. **Security**: Trong production cần:
   - Verify signature từ gateway
   - Implement webhook handlers
   - Handle timeout & retry
   - Log tất cả transactions
   - Encrypt sensitive data

4. **Compliance**: Cần đăng ký merchant account với:
   - VNPay: https://vnpay.vn
   - MoMo: https://business.momo.vn
   - ZaloPay: https://zalopay.vn/business

---

## Contact & Support

- **Developer**: QuickRide Team
- **Email**: support@quickride.vn
- **Documentation**: /docs
- **Issue Tracker**: GitHub Issues

---

**✨ Chúc bạn demo thành công!**
