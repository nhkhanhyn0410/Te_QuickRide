# Hướng Dẫn Quản Trị Viên - Te_QuickRide

## Mục Lục
1. [Đăng Nhập Hệ Thống](#đăng-nhập-hệ-thống)
2. [Truy Cập Trang Quản Trị](#truy-cập-trang-quản-trị)
3. [Các Tính Năng Chính](#các-tính-năng-chính)
4. [Hướng Dẫn Chi Tiết](#hướng-dẫn-chi-tiết)
5. [Bảo Mật](#bảo-mật)
6. [FAQ](#faq)

---

## Đăng Nhập Hệ Thống

### Tài Khoản Admin
- **URL đăng nhập**: `http://localhost:5173/login`
- **Tài khoản mặc định**: Liên hệ với quản trị viên hệ thống để được cấp tài khoản admin
- **Quyền truy cập**: Tài khoản phải có role = `admin`

### Các Bước Đăng Nhập
1. Truy cập trang đăng nhập: `http://localhost:5173/login`
2. Nhập email và mật khẩu của tài khoản admin
3. Nhấn "Đăng nhập"
4. Hệ thống sẽ tự động chuyển hướng đến trang Dashboard admin

---

## Truy Cập Trang Quản Trị

### Dashboard Chính
**URL**: `http://localhost:5173/admin/dashboard`

Dashboard hiển thị:
- Tổng quan thống kê hệ thống
- Số lượng người dùng, nhà xe, chuyến đi, đặt vé
- Biểu đồ doanh thu và hoạt động
- Thông tin quan trọng cần xử lý

### Các Trang Quản Trị Khác

| Trang | URL | Mô Tả |
|-------|-----|-------|
| Dashboard | `/admin/dashboard` | Tổng quan hệ thống |
| Quản lý người dùng | `/admin/users` | Quản lý tài khoản khách hàng |
| Quản lý nhà xe | `/admin/operators` | Quản lý nhà xe, duyệt/từ chối đăng ký |
| Thống kê | `/admin/analytics` | Báo cáo và phân tích dữ liệu |
| Quản lý voucher | `/admin/vouchers` | Tạo và quản lý mã giảm giá |
| Quản lý đặt vé | `/admin/bookings` | Xem và quản lý tất cả đặt vé |
| Cài đặt | `/admin/settings` | Cấu hình hệ thống |
| Hướng dẫn | `/admin/guide` | Trang hướng dẫn tương tác |

---

## Các Tính Năng Chính

### 1. 👥 Quản Lý Người Dùng
**Endpoint API**: `/api/users`

**Chức năng**:
- Xem danh sách tất cả người dùng (khách hàng)
- Tìm kiếm và lọc người dùng
- Xem thông tin chi tiết người dùng
- Chặn/bỏ chặn tài khoản
- Xem lịch sử đặt vé của người dùng
- Xem thống kê hoạt động

**Các thao tác**:
```
GET    /api/users              - Lấy danh sách người dùng
GET    /api/users/:id          - Xem chi tiết người dùng
PUT    /api/users/:id          - Cập nhật thông tin
PUT    /api/users/:id/block    - Chặn tài khoản
PUT    /api/users/:id/unblock  - Bỏ chặn tài khoản
GET    /api/users/statistics   - Xem thống kê
```

### 2. 🚌 Quản Lý Nhà Xe
**Endpoint API**: `/api/operators`

**Chức năng**:
- Xem danh sách tất cả nhà xe
- Duyệt/từ chối đơn đăng ký nhà xe mới
- Xem thông tin chi tiết nhà xe
- Cập nhật thông tin nhà xe
- Tạm ngưng/kích hoạt nhà xe
- Xóa nhà xe
- Xem thống kê hoạt động

**Các thao tác**:
```
GET    /api/operators                    - Lấy danh sách nhà xe
GET    /api/operators/:id                - Xem chi tiết nhà xe
POST   /api/operators                    - Tạo nhà xe mới
PUT    /api/operators/:id                - Cập nhật thông tin
DELETE /api/operators/:id                - Xóa nhà xe
PUT    /api/operators/:id/verify         - Duyệt/từ chối đăng ký
PUT    /api/operators/:id/suspend        - Tạm ngưng nhà xe
GET    /api/operators/:id/statistics     - Xem thống kê
```

**Trạng thái xác minh nhà xe**:
- `pending`: Chờ duyệt
- `approved`: Đã duyệt
- `rejected`: Bị từ chối

### 3. 📊 Thống Kê & Phân Tích
**Endpoint API**: `/api/analytics`

**Chức năng**:
- Xem báo cáo tổng quan hệ thống
- Phân tích doanh thu theo thời gian
- Thống kê theo nhà xe
- Thống kê theo tuyến đường phổ biến
- Phân tích hành vi người dùng
- Xuất báo cáo

### 4. 🎟️ Quản Lý Voucher
**Endpoint API**: `/api/vouchers`

**Chức năng**:
- Tạo voucher/mã giảm giá mới
- Xem danh sách tất cả voucher
- Cập nhật thông tin voucher
- Kích hoạt/vô hiệu hóa voucher
- Xóa voucher
- Xem thống kê sử dụng voucher

**Các loại giảm giá**:
- `percentage`: Giảm theo phần trăm
- `fixed`: Giảm số tiền cố định

**Các thao tác**:
```
GET    /api/vouchers                  - Lấy danh sách voucher
GET    /api/vouchers/:code            - Xem chi tiết voucher
POST   /api/vouchers                  - Tạo voucher mới
PUT    /api/vouchers/:id              - Cập nhật voucher
DELETE /api/vouchers/:id              - Xóa voucher
GET    /api/vouchers/:id/statistics   - Xem thống kê
```

### 5. 📋 Quản Lý Đặt Vé
**Endpoint API**: `/api/bookings`

**Chức năng**:
- Xem tất cả đặt vé trong hệ thống
- Tìm kiếm và lọc đặt vé
- Xem chi tiết đặt vé
- Cập nhật trạng thái đặt vé
- Hủy đặt vé (nếu cần)
- Xem lịch sử thanh toán

**Trạng thái đặt vé**:
- `pending`: Chờ xác nhận
- `confirmed`: Đã xác nhận
- `paid`: Đã thanh toán
- `cancelled`: Đã hủy
- `completed`: Hoàn thành

**Các thao tác**:
```
GET    /api/bookings              - Lấy danh sách đặt vé
GET    /api/bookings/:id          - Xem chi tiết đặt vé
PUT    /api/bookings/:id          - Cập nhật đặt vé
PUT    /api/bookings/:id/cancel   - Hủy đặt vé
```

### 6. ⚙️ Cài Đặt Hệ Thống
**Endpoint API**: `/api/settings`

**Chức năng**:
- Cấu hình thông số hệ thống
- Quản lý phí dịch vụ
- Cài đặt thời gian hủy vé
- Cấu hình thanh toán
- Quản lý email template
- Cài đặt bảo mật

---

## Hướng Dẫn Chi Tiết

### Duyệt Nhà Xe Mới Đăng Ký

1. **Truy cập trang quản lý nhà xe**
   - URL: `http://localhost:5173/admin/operators`

2. **Lọc nhà xe chờ duyệt**
   - Chọn filter: Status = "Pending"

3. **Xem thông tin nhà xe**
   - Click vào nhà xe cần duyệt
   - Xem chi tiết: Tên, thông tin liên hệ, giấy phép kinh doanh, v.v.

4. **Duyệt hoặc từ chối**
   - Nếu hợp lệ: Click "Approve" (Duyệt)
   - Nếu không hợp lệ: Click "Reject" (Từ chối) và nhập lý do

5. **API Call**
   ```javascript
   PUT /api/operators/:operatorId/verify
   Body: {
     "status": "approved",  // hoặc "rejected"
     "rejectionReason": "Lý do từ chối (nếu rejected)"
   }
   ```

### Tạo Voucher Mới

1. **Truy cập trang quản lý voucher**
   - URL: `http://localhost:5173/admin/vouchers`

2. **Click "Tạo voucher mới"**

3. **Nhập thông tin voucher**
   - Mã voucher (code): VD: `SUMMER2024`
   - Loại giảm giá: Phần trăm hoặc Số tiền
   - Giá trị giảm: VD: 10% hoặc 50,000đ
   - Số lượng tối đa
   - Ngày bắt đầu và kết thúc
   - Điều kiện áp dụng (giá trị đơn hàng tối thiểu)

4. **Lưu voucher**

5. **API Call**
   ```javascript
   POST /api/vouchers
   Body: {
     "code": "SUMMER2024",
     "discountType": "percentage",
     "discountValue": 10,
     "maxUsage": 100,
     "validFrom": "2024-06-01",
     "validTo": "2024-08-31",
     "minBookingAmount": 100000
   }
   ```

### Chặn Tài Khoản Người Dùng

1. **Truy cập trang quản lý người dùng**
   - URL: `http://localhost:5173/admin/users`

2. **Tìm người dùng cần chặn**
   - Sử dụng search hoặc filter

3. **Xem lý do cần chặn**
   - Kiểm tra lịch sử hoạt động
   - Xem report/khiếu nại (nếu có)

4. **Chặn tài khoản**
   - Click vào người dùng
   - Click "Block User" (Chặn người dùng)
   - Nhập lý do chặn

5. **API Call**
   ```javascript
   PUT /api/users/:userId/block
   Body: {
     "reason": "Vi phạm điều khoản sử dụng"
   }
   ```

### Xem Thống Kê Hệ Thống

1. **Truy cập trang thống kê**
   - URL: `http://localhost:5173/admin/analytics`

2. **Chọn khoảng thời gian**
   - Hôm nay, 7 ngày, 30 ngày, hoặc tùy chỉnh

3. **Xem các chỉ số**
   - Tổng doanh thu
   - Số lượng đặt vé
   - Số người dùng mới
   - Tỷ lệ chuyển đổi
   - Top nhà xe
   - Top tuyến đường

4. **Xuất báo cáo**
   - Click "Export" để tải báo cáo dạng CSV/Excel

---

## Bảo Mật

### Quyền Truy Cập
- ✅ Chỉ tài khoản có role `admin` mới được truy cập trang quản trị
- ✅ Tất cả routes admin đều được bảo vệ bởi `ProtectedRoute` với `requiredRole="admin"`
- ✅ Các API endpoint admin yêu cầu authentication và authorization

### Bảo Mật Tài Khoản
- 🔒 Sử dụng mật khẩu mạnh (ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt)
- 🔒 Không chia sẻ mật khẩu với người khác
- 🔒 Đổi mật khẩu định kỳ (khuyến nghị 3 tháng/lần)
- 🔒 Đăng xuất khi không sử dụng

### Thao Tác Cẩn Trọng
- ⚠️ Kiểm tra kỹ trước khi xóa dữ liệu (không thể hoàn tác)
- ⚠️ Xác minh thông tin trước khi duyệt nhà xe
- ⚠️ Ghi rõ lý do khi chặn/từ chối/tạm ngưng
- ⚠️ Backup dữ liệu định kỳ

### Log và Audit
- 📝 Tất cả thao tác admin đều được ghi log
- 📝 Kiểm tra log định kỳ để phát hiện bất thường
- 📝 Lưu trữ log tối thiểu 90 ngày

---

## FAQ

### Q1: Tôi quên mật khẩu admin, phải làm sao?
**A**: Liên hệ với quản trị viên hệ thống cấp cao hoặc người phát triển để reset mật khẩu. Không có chức năng "Quên mật khẩu" cho tài khoản admin vì lý do bảo mật.

### Q2: Tôi có thể tạo thêm tài khoản admin không?
**A**: Có, nhưng cần có quyền super admin. Tài khoản admin mới chỉ nên được tạo khi thực sự cần thiết và phải được phê duyệt.

### Q3: Làm sao để xem lịch sử thao tác của admin khác?
**A**: Truy cập trang Admin Logs (nếu có) hoặc kiểm tra database trực tiếp. Mọi thao tác admin đều được ghi log với timestamp và user ID.

### Q4: Nhà xe bị từ chối có thể đăng ký lại không?
**A**: Có, nhà xe có thể cập nhật thông tin và gửi lại đơn đăng ký. Admin sẽ xem xét lại.

### Q5: Tôi có thể chỉnh sửa booking của khách hàng không?
**A**: Có, nhưng nên cẩn trọng. Chỉ chỉnh sửa khi có yêu cầu rõ ràng từ khách hàng hoặc nhà xe và ghi rõ lý do.

### Q6: Voucher đã hết hạn có thể gia hạn không?
**A**: Có, admin có thể cập nhật thời gian hiệu lực của voucher. Tuy nhiên, nên tạo voucher mới thay vì gia hạn voucher cũ để dễ tracking.

### Q7: Làm sao để backup dữ liệu?
**A**: Liên hệ với team DevOps hoặc sử dụng công cụ backup được cung cấp. Backup nên được thực hiện:
- Tự động: Hàng ngày
- Thủ công: Trước khi thực hiện thao tác lớn (xóa nhiều dữ liệu, update hàng loạt)

### Q8: Tại sao một số chức năng bị lỗi 404?
**A**: Một số endpoint có thể chưa được implement ở backend. Kiểm tra console để xem endpoint nào bị lỗi và báo cho team dev.

Các endpoint đã được kiểm tra và hoạt động:
- `/api/users/*` ✅
- `/api/operators/*` ✅
- `/api/bookings/*` ✅
- `/api/vouchers/*` ✅

Các endpoint có thể chưa hoàn thiện:
- `/api/analytics/*` ⚠️
- `/api/settings/*` ⚠️

### Q9: Tôi có thể xóa nhà xe đang có chuyến đi hoạt động không?
**A**: Không nên. Thay vào đó, sử dụng chức năng "Suspend" (Tạm ngưng) để ngừng hoạt động của nhà xe mà không mất dữ liệu lịch sử.

### Q10: Làm sao để liên hệ hỗ trợ kỹ thuật?
**A**:
- Email: support@tequickride.com
- Hotline: 1900-xxxx
- Hoặc tạo ticket trong hệ thống quản lý nội bộ

---

## Ghi Chú Kỹ Thuật

### API Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.tequickride.com`

### Authentication
Tất cả API calls đều cần JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

### Error Codes
- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Chưa đăng nhập
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy tài nguyên
- `409`: Conflict - Dữ liệu bị trùng lặp
- `500`: Internal Server Error - Lỗi server

### Middleware Bảo Vệ
```javascript
// Tất cả routes admin đều sử dụng middleware:
protect              // Yêu cầu đăng nhập
restrictTo('admin')  // Yêu cầu role admin
```

---

## Changelog

### Version 1.0.0 (2024-xx-xx)
- ✅ Trang quản lý người dùng
- ✅ Trang quản lý nhà xe
- ✅ Trang quản lý voucher
- ✅ Trang quản lý đặt vé
- ✅ Dashboard tổng quan

### Version 1.1.0 (Planned)
- 🔄 Thêm Analytics module
- 🔄 Thêm Settings module
- 🔄 Thêm Admin audit logs
- 🔄 Thêm Real-time notifications

---

**Lưu ý**: Tài liệu này được cập nhật lần cuối vào ngày 2024. Vui lòng kiểm tra phiên bản mới nhất trên repository hoặc liên hệ team dev để biết thông tin cập nhật.
