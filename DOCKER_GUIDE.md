# Hướng dẫn chạy Te_QuickRide với Docker

## Yêu cầu
- Docker Desktop đã được cài đặt và đang chạy
- Port 3000, 5000, 27017, 6379 không bị chiếm bởi ứng dụng khác

## Các bước khởi động

### 1. Dọn dẹp các container cũ (nếu có)
```bash
docker-compose down -v
docker system prune -a --volumes -f
```

### 2. Build và khởi động tất cả services
```bash
docker-compose up --build
```

Hoặc chạy ở chế độ background:
```bash
docker-compose up -d --build
```

### 3. Kiểm tra trạng thái containers
```bash
docker-compose ps
```

Tất cả containers nên có status là "Up":
- te-quickride-mongodb
- te-quickride-redis
- te-quickride-backend
- te-quickride-frontend

### 4. Xem logs của từng service

**Backend logs:**
```bash
docker-compose logs -f backend
```

**Frontend logs:**
```bash
docker-compose logs -f frontend
```

**Tất cả logs:**
```bash
docker-compose logs -f
```

## Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: mongodb://admin:admin123@localhost:27017/te_quickride
- **Redis**: redis://localhost:6379

## Dừng ứng dụng

**Dừng tất cả containers (giữ data):**
```bash
docker-compose stop
```

**Dừng và xóa containers (giữ data):**
```bash
docker-compose down
```

**Dừng và xóa containers + volumes (xóa hết data):**
```bash
docker-compose down -v
```

## Khắc phục sự cố

### 1. Backend không khởi động được

Kiểm tra logs:
```bash
docker-compose logs backend
```

Thử rebuild:
```bash
docker-compose up --build --force-recreate backend
```

### 2. Frontend không build được

Xóa node_modules và rebuild:
```bash
docker-compose down
docker-compose build --no-cache frontend
docker-compose up frontend
```

### 3. Không kết nối được database

Kiểm tra MongoDB container:
```bash
docker-compose logs mongodb
docker exec -it te-quickride-mongodb mongosh -u admin -p admin123
```

### 4. Port đã được sử dụng

Kiểm tra port nào đang bị chiếm:
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :3000
lsof -i :5000
```

Đổi port trong docker-compose.yml nếu cần.

### 5. Xem logs chi tiết

```bash
# Logs của backend
docker-compose logs --tail=100 -f backend

# Logs của frontend
docker-compose logs --tail=100 -f frontend

# Vào trong container để debug
docker exec -it te-quickride-backend sh
docker exec -it te-quickride-frontend sh
```

## Rebuild khi có thay đổi code

**Rebuild một service:**
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

**Rebuild tất cả:**
```bash
docker-compose up --build
```

## Development với hot reload

Code trong `backend/src` và `frontend/src` đã được mount vào container,
nên các thay đổi sẽ tự động reload mà không cần rebuild.

## Lệnh hữu ích

```bash
# Xem tài nguyên đang sử dụng
docker stats

# Vào MongoDB shell
docker exec -it te-quickride-mongodb mongosh -u admin -p admin123 te_quickride

# Vào Redis CLI
docker exec -it te-quickride-redis redis-cli

# Xóa tất cả images không sử dụng
docker image prune -a

# Restart một service
docker-compose restart backend
docker-compose restart frontend
```

## Lưu ý

1. **Lần đầu chạy sẽ lâu** vì cần download images và build
2. **Nếu thay đổi package.json** cần rebuild: `docker-compose up --build`
3. **Data được lưu trong volumes**, dùng `docker-compose down -v` để xóa
4. **Backend chạy ở development mode** với nodemon để hot reload
5. **Frontend chạy với Vite dev server** hỗ trợ HMR (Hot Module Replacement)

## Kiểm tra ứng dụng hoạt động

1. Mở browser vào http://localhost:3000
2. Nếu thấy trang Home của Te_QuickRide => Frontend OK
3. Thử đăng ký tài khoản mới
4. Nếu đăng ký thành công => Backend + Database OK

Nếu có lỗi, xem logs để debug!
