import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

// Import models
import User from '../models/User.js';
import BusOperator from '../models/BusOperator.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import Voucher from '../models/Voucher.js';
import Review from '../models/Review.js';
import Staff from '../models/Staff.js';
import Notification from '../models/Notification.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Hash password helper
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(12);
      return await bcrypt.hash(password, salt);
    };

    // ==================== USERS ====================
    console.log('Creating users...');

    const adminPassword = await hashPassword('Admin@123');
    const customerPassword = await hashPassword('Customer@123');

    const admin = await User.create({
      email: 'admin@tequickride.com',
      phone: '0901000000',
      password: adminPassword,
      fullName: 'System Administrator',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      loyaltyTier: 'platinum',
      totalPoints: 5000,
      isActive: true,
      isBlocked: false
    });

    const customers = await User.insertMany([
      {
        email: 'customer1@example.com',
        phone: '0901111111',
        password: customerPassword,
        fullName: 'Nguyễn Văn An',
        dateOfBirth: new Date('1995-03-15'),
        gender: 'male',
        role: 'customer',
        isEmailVerified: true,
        isPhoneVerified: true,
        loyaltyTier: 'gold',
        totalPoints: 1200,
        savedPassengers: [
          {
            fullName: 'Trần Thị Bình',
            phone: '0902222222',
            idCard: '001234567890'
          }
        ],
        isActive: true,
        isBlocked: false
      },
      {
        email: 'customer2@example.com',
        phone: '0903333333',
        password: customerPassword,
        fullName: 'Trần Thị Bích',
        dateOfBirth: new Date('1998-07-20'),
        gender: 'female',
        role: 'customer',
        isEmailVerified: true,
        isPhoneVerified: true,
        loyaltyTier: 'silver',
        totalPoints: 500,
        isActive: true,
        isBlocked: false
      },
      {
        email: 'customer3@example.com',
        phone: '0904444444',
        password: customerPassword,
        fullName: 'Lê Minh Cường',
        dateOfBirth: new Date('1992-11-05'),
        gender: 'male',
        role: 'customer',
        isEmailVerified: true,
        isPhoneVerified: false,
        loyaltyTier: 'bronze',
        totalPoints: 100,
        isActive: true,
        isBlocked: false
      }
    ]);

    console.log(`✓ Created ${customers.length + 1} users (1 admin, ${customers.length} customers)\n`);

    // ==================== BUS OPERATORS ====================
    console.log('Creating bus operators...');

    const operatorPassword = await hashPassword('Operator@123');

    const operators = await BusOperator.insertMany([
      {
        companyName: 'Phương Trang FUTA Bus Lines',
        email: 'contact@futa.vn',
        phone: '0281234567',
        password: operatorPassword,
        businessLicense: 'BL-2020-001',
        taxCode: 'TAX-001-FUTA',
        logo: 'https://example.com/logos/futa.png',
        description: 'Nhà xe hàng đầu Việt Nam với mạng lưới rộng khắp',
        website: 'https://futa.vn',
        address: {
          street: '272 Đề Thám',
          ward: 'Phường Cô Giang',
          district: 'Quận 1',
          city: 'Hồ Chí Minh',
          country: 'Vietnam'
        },
        bankAccount: {
          bankName: 'Vietcombank',
          accountNumber: '0123456789',
          accountHolder: 'CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG'
        },
        verificationStatus: 'approved',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        averageRating: 4.5,
        totalReviews: 1250,
        totalTrips: 5000,
        totalRevenue: 50000000000,
        commissionRate: 5,
        isActive: true,
        isSuspended: false
      },
      {
        companyName: 'Xe Khách Mai Linh',
        email: 'info@mailinh.vn',
        phone: '0289876543',
        password: operatorPassword,
        businessLicense: 'BL-2019-002',
        taxCode: 'TAX-002-MAILINH',
        logo: 'https://example.com/logos/mailinh.png',
        description: 'Hệ thống xe khách uy tín, chất lượng cao',
        website: 'https://mailinh.vn',
        address: {
          street: '123 Nguyễn Văn Linh',
          ward: 'Phường Tân Phú',
          district: 'Quận 7',
          city: 'Hồ Chí Minh',
          country: 'Vietnam'
        },
        bankAccount: {
          bankName: 'Techcombank',
          accountNumber: '9876543210',
          accountHolder: 'CÔNG TY CỔ PHẦN XE KHÁCH MAI LINH'
        },
        verificationStatus: 'approved',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        averageRating: 4.3,
        totalReviews: 890,
        totalTrips: 3500,
        totalRevenue: 35000000000,
        commissionRate: 5,
        isActive: true,
        isSuspended: false
      },
      {
        companyName: 'Xe Limousine Hà Linh',
        email: 'contact@halinh.vn',
        phone: '0287654321',
        password: operatorPassword,
        businessLicense: 'BL-2021-003',
        taxCode: 'TAX-003-HALINH',
        description: 'Dịch vụ limousine cao cấp',
        address: {
          street: '456 Lê Văn Việt',
          ward: 'Phường Tăng Nhơn Phú A',
          district: 'Quận 9',
          city: 'Hồ Chí Minh',
          country: 'Vietnam'
        },
        verificationStatus: 'pending',
        averageRating: 0,
        totalReviews: 0,
        totalTrips: 0,
        totalRevenue: 0,
        commissionRate: 5,
        isActive: true,
        isSuspended: false
      }
    ]);

    console.log(`✓ Created ${operators.length} bus operators\n`);

    // ==================== STAFF ====================
    console.log('Creating staff members...');

    const staff = await Staff.insertMany([
      {
        operatorId: operators[0]._id,
        fullName: 'Phạm Văn Tài',
        phone: '0905555555',
        email: 'phamvantai@futa.vn',
        role: 'driver',
        licenseNumber: 'DL-001-2020',
        licenseType: 'D',
        licenseExpiry: new Date('2028-12-31'),
        dateOfBirth: new Date('1985-05-10'),
        gender: 'male',
        address: 'Quận 1, TP.HCM',
        isActive: true
      },
      {
        operatorId: operators[0]._id,
        fullName: 'Lê Thị Mai',
        phone: '0906666666',
        email: 'lethimai@futa.vn',
        role: 'manager',
        dateOfBirth: new Date('1990-08-15'),
        gender: 'female',
        address: 'Quận 3, TP.HCM',
        isActive: true
      },
      {
        operatorId: operators[1]._id,
        fullName: 'Hoàng Minh Tuấn',
        phone: '0907777777',
        email: 'hoangminhtuan@mailinh.vn',
        role: 'driver',
        licenseNumber: 'DL-002-2019',
        licenseType: 'D',
        licenseExpiry: new Date('2027-06-30'),
        dateOfBirth: new Date('1988-03-20'),
        gender: 'male',
        address: 'Quận 7, TP.HCM',
        isActive: true
      }
    ]);

    console.log(`✓ Created ${staff.length} staff members\n`);

    // ==================== BUSES ====================
    console.log('Creating buses...');

    const buses = await Bus.insertMany([
      {
        operatorId: operators[0]._id,
        busNumber: '51A-12345',
        busType: 'limousine',
        totalSeats: 24,
        seatLayout: {
          floors: 1,
          rows: 6,
          columns: 4,
          layout: [
            ['1A', '1B', '', '1C', '1D'],
            ['2A', '2B', '', '2C', '2D'],
            ['3A', '3B', '', '3C', '3D'],
            ['4A', '4B', '', '4C', '4D'],
            ['5A', '5B', '', '5C', '5D'],
            ['6A', '6B', '', '6C', '6D']
          ]
        },
        amenities: ['wifi', 'ac', 'usb_charger', 'reading_light', 'water', 'blanket'],
        images: [
          'https://example.com/buses/51a12345_1.jpg',
          'https://example.com/buses/51a12345_2.jpg'
        ],
        isActive: true,
        maintenanceStatus: 'good'
      },
      {
        operatorId: operators[0]._id,
        busNumber: '51B-67890',
        busType: 'sleeper',
        totalSeats: 40,
        seatLayout: {
          floors: 2,
          rows: 10,
          columns: 4,
          layout: [
            ['L1-1A', 'L1-1B', '', 'L1-1C', 'L1-1D'],
            ['L1-2A', 'L1-2B', '', 'L1-2C', 'L1-2D'],
            ['L1-3A', 'L1-3B', '', 'L1-3C', 'L1-3D'],
            ['L1-4A', 'L1-4B', '', 'L1-4C', 'L1-4D'],
            ['L1-5A', 'L1-5B', '', 'L1-5C', 'L1-5D'],
            ['L2-1A', 'L2-1B', '', 'L2-1C', 'L2-1D'],
            ['L2-2A', 'L2-2B', '', 'L2-2C', 'L2-2D'],
            ['L2-3A', 'L2-3B', '', 'L2-3C', 'L2-3D'],
            ['L2-4A', 'L2-4B', '', 'L2-4C', 'L2-4D'],
            ['L2-5A', 'L2-5B', '', 'L2-5C', 'L2-5D']
          ]
        },
        amenities: ['wifi', 'ac', 'toilet', 'usb_charger', 'reading_light', 'water', 'blanket', 'tv'],
        images: ['https://example.com/buses/51b67890_1.jpg'],
        isActive: true,
        maintenanceStatus: 'good'
      },
      {
        operatorId: operators[1]._id,
        busNumber: '50C-11111',
        busType: 'seater',
        totalSeats: 45,
        seatLayout: {
          floors: 1,
          rows: 11,
          columns: 4,
          layout: [
            ['1A', '1B', '', '1C', '1D'],
            ['2A', '2B', '', '2C', '2D'],
            ['3A', '3B', '', '3C', '3D'],
            ['4A', '4B', '', '4C', '4D'],
            ['5A', '5B', '', '5C', '5D'],
            ['6A', '6B', '', '6C', '6D'],
            ['7A', '7B', '', '7C', '7D'],
            ['8A', '8B', '', '8C', '8D'],
            ['9A', '9B', '', '9C', '9D'],
            ['10A', '10B', '', '10C', '10D'],
            ['11A', '11B', '', '11C', '11D']
          ]
        },
        amenities: ['ac', 'usb_charger', 'reading_light'],
        isActive: true,
        maintenanceStatus: 'good'
      }
    ]);

    console.log(`✓ Created ${buses.length} buses\n`);

    // ==================== ROUTES ====================
    console.log('Creating routes...');

    const routes = await Route.insertMany([
      {
        operatorId: operators[0]._id,
        routeName: 'Hồ Chí Minh - Đà Lạt',
        routeCode: 'HCM-DL-001',
        origin: {
          city: 'Hồ Chí Minh',
          province: 'TP. Hồ Chí Minh',
          station: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, P. 26, Q. Bình Thạnh',
          coordinates: { lat: 10.8142, lng: 106.7109 }
        },
        destination: {
          city: 'Đà Lạt',
          province: 'Lâm Đồng',
          station: 'Bến xe Đà Lạt',
          address: '01 Tô Hiến Thành, P. 3, TP. Đà Lạt',
          coordinates: { lat: 11.9404, lng: 108.4583 }
        },
        pickupPoints: [
          { name: 'Bến xe Miền Đông', address: '292 Đinh Bộ Lĩnh, Q. Bình Thạnh', coordinates: { lat: 10.8142, lng: 106.7109 } },
          { name: 'Văn phòng Quận 1', address: '272 Đề Thám, Q. 1', coordinates: { lat: 10.7661, lng: 106.6906 } }
        ],
        dropoffPoints: [
          { name: 'Bến xe Đà Lạt', address: '01 Tô Hiến Thành, TP. Đà Lạt', coordinates: { lat: 11.9404, lng: 108.4583 } },
          { name: 'Chợ Đà Lạt', address: 'Nguyễn Thị Minh Khai, TP. Đà Lạt', coordinates: { lat: 11.9449, lng: 108.4420 } }
        ],
        distance: 308,
        estimatedDuration: 420,
        isActive: true
      },
      {
        operatorId: operators[0]._id,
        routeName: 'Hồ Chí Minh - Nha Trang',
        routeCode: 'HCM-NT-001',
        origin: {
          city: 'Hồ Chí Minh',
          province: 'TP. Hồ Chí Minh',
          station: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, P. 26, Q. Bình Thạnh',
          coordinates: { lat: 10.8142, lng: 106.7109 }
        },
        destination: {
          city: 'Nha Trang',
          province: 'Khánh Hòa',
          station: 'Bến xe Nha Trang',
          address: '23 Tháng 10, TP. Nha Trang',
          coordinates: { lat: 12.2388, lng: 109.1967 }
        },
        pickupPoints: [
          { name: 'Bến xe Miền Đông', address: '292 Đinh Bộ Lĩnh, Q. Bình Thạnh', coordinates: { lat: 10.8142, lng: 106.7109 } }
        ],
        dropoffPoints: [
          { name: 'Bến xe Nha Trang', address: '23 Tháng 10, TP. Nha Trang', coordinates: { lat: 12.2388, lng: 109.1967 } }
        ],
        distance: 448,
        estimatedDuration: 540,
        isActive: true
      },
      {
        operatorId: operators[1]._id,
        routeName: 'Hồ Chí Minh - Vũng Tàu',
        routeCode: 'HCM-VT-001',
        origin: {
          city: 'Hồ Chí Minh',
          province: 'TP. Hồ Chí Minh',
          station: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, P. 26, Q. Bình Thạnh',
          coordinates: { lat: 10.8142, lng: 106.7109 }
        },
        destination: {
          city: 'Vũng Tàu',
          province: 'Bà Rịa - Vũng Tàu',
          station: 'Bến xe Vũng Tàu',
          address: 'Đường 3 Tháng 2, TP. Vũng Tàu',
          coordinates: { lat: 10.3459, lng: 107.0843 }
        },
        pickupPoints: [
          { name: 'Bến xe Miền Đông', address: '292 Đinh Bộ Lĩnh, Q. Bình Thạnh', coordinates: { lat: 10.8142, lng: 106.7109 } },
          { name: 'Văn phòng Quận 7', address: '123 Nguyễn Văn Linh, Q. 7', coordinates: { lat: 10.7329, lng: 106.7226 } }
        ],
        dropoffPoints: [
          { name: 'Bến xe Vũng Tàu', address: 'Đường 3 Tháng 2, TP. Vũng Tàu', coordinates: { lat: 10.3459, lng: 107.0843 } },
          { name: 'Bãi Trước', address: 'Quang Trung, TP. Vũng Tàu', coordinates: { lat: 10.3387, lng: 107.0846 } }
        ],
        distance: 125,
        estimatedDuration: 150,
        isActive: true
      }
    ]);

    console.log(`✓ Created ${routes.length} routes\n`);

    // ==================== TRIPS ====================
    console.log('Creating trips...');

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const trips = await Trip.insertMany([
      // HCM - Đà Lạt trips
      {
        operatorId: operators[0]._id,
        routeId: routes[0]._id,
        busId: buses[0]._id,
        driverId: staff[0]._id,
        managerId: staff[1]._id,
        tripCode: `TRP${Date.now()}001`,
        departureTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(15, 0, 0, 0)),
        basePrice: 250000,
        availableSeats: 24,
        occupiedSeats: [],
        lockedSeats: [],
        status: 'scheduled'
      },
      {
        operatorId: operators[0]._id,
        routeId: routes[0]._id,
        busId: buses[0]._id,
        driverId: staff[0]._id,
        tripCode: `TRP${Date.now()}002`,
        departureTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(21, 0, 0, 0)),
        basePrice: 250000,
        availableSeats: 22,
        occupiedSeats: ['1A', '1B'],
        lockedSeats: [],
        status: 'scheduled'
      },
      {
        operatorId: operators[0]._id,
        routeId: routes[0]._id,
        busId: buses[1]._id,
        driverId: staff[0]._id,
        tripCode: `TRP${Date.now()}003`,
        departureTime: new Date(tomorrow.setHours(22, 0, 0, 0)),
        arrivalTime: new Date(twoDaysLater.setHours(5, 0, 0, 0)),
        basePrice: 280000,
        availableSeats: 40,
        occupiedSeats: [],
        lockedSeats: [],
        status: 'scheduled'
      },
      // HCM - Nha Trang trips
      {
        operatorId: operators[0]._id,
        routeId: routes[1]._id,
        busId: buses[1]._id,
        driverId: staff[0]._id,
        managerId: staff[1]._id,
        tripCode: `TRP${Date.now()}004`,
        departureTime: new Date(twoDaysLater.setHours(20, 0, 0, 0)),
        arrivalTime: new Date(threeDaysLater.setHours(5, 0, 0, 0)),
        basePrice: 350000,
        availableSeats: 40,
        occupiedSeats: [],
        lockedSeats: [],
        status: 'scheduled'
      },
      // HCM - Vũng Tàu trips
      {
        operatorId: operators[1]._id,
        routeId: routes[2]._id,
        busId: buses[2]._id,
        driverId: staff[2]._id,
        tripCode: `TRP${Date.now()}005`,
        departureTime: new Date(tomorrow.setHours(6, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(8, 30, 0, 0)),
        basePrice: 120000,
        availableSeats: 43,
        occupiedSeats: ['1A', '2A'],
        lockedSeats: [],
        status: 'scheduled'
      },
      {
        operatorId: operators[1]._id,
        routeId: routes[2]._id,
        busId: buses[2]._id,
        driverId: staff[2]._id,
        tripCode: `TRP${Date.now()}006`,
        departureTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(12, 30, 0, 0)),
        basePrice: 120000,
        availableSeats: 45,
        occupiedSeats: [],
        lockedSeats: [],
        status: 'scheduled'
      }
    ]);

    console.log(`✓ Created ${trips.length} trips\n`);

    // ==================== VOUCHERS ====================
    console.log('Creating vouchers...');

    const vouchers = await Voucher.insertMany([
      {
        code: 'SUMMER2024',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscount: 50000,
        minOrderValue: 200000,
        startDate: new Date(),
        endDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        maxUsage: 1000,
        currentUsage: 0,
        maxUsagePerUser: 3,
        applicableTo: 'all',
        targetUsers: 'all',
        name: 'Khuyến mãi mùa hè 2024',
        description: 'Giảm 15% tối đa 50.000đ cho đơn hàng từ 200.000đ',
        isActive: true,
        createdBy: admin._id
      },
      {
        code: 'NEWUSER50',
        discountType: 'fixed',
        discountValue: 50000,
        minOrderValue: 100000,
        startDate: new Date(),
        endDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
        maxUsage: 500,
        currentUsage: 0,
        maxUsagePerUser: 1,
        applicableTo: 'all',
        targetUsers: 'new',
        name: 'Ưu đãi khách hàng mới',
        description: 'Giảm 50.000đ cho khách hàng đặt vé lần đầu',
        isActive: true,
        createdBy: admin._id
      },
      {
        code: 'GOLD20',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 100000,
        minOrderValue: 300000,
        startDate: new Date(),
        endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        maxUsage: 200,
        currentUsage: 0,
        maxUsagePerUser: 5,
        applicableTo: 'all',
        targetUsers: 'loyalty_tier',
        loyaltyTiers: ['gold', 'platinum'],
        name: 'Ưu đãi thành viên Gold',
        description: 'Giảm 20% tối đa 100.000đ dành cho thành viên Gold và Platinum',
        isActive: true,
        createdBy: admin._id
      },
      {
        code: 'EXPIRED2023',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 100000,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        maxUsage: 100,
        currentUsage: 100,
        maxUsagePerUser: 1,
        applicableTo: 'all',
        targetUsers: 'all',
        name: 'Voucher hết hạn',
        description: 'Voucher đã hết hạn sử dụng',
        isActive: false,
        createdBy: admin._id
      }
    ]);

    console.log(`✓ Created ${vouchers.length} vouchers\n`);

    // ==================== BOOKINGS ====================
    console.log('Creating bookings...');

    const bookings = await Booking.insertMany([
      {
        bookingCode: 'BK20240101001',
        customerId: customers[0]._id,
        tripId: trips[1]._id,
        operatorId: operators[0]._id,
        seats: [
          {
            seatNumber: '1A',
            passenger: {
              fullName: 'Nguyễn Văn An',
              phone: '0901111111',
              idCard: '001987654321'
            }
          },
          {
            seatNumber: '1B',
            passenger: {
              fullName: 'Trần Thị Bình',
              phone: '0902222222',
              idCard: '001234567890'
            }
          }
        ],
        pickupPoint: routes[0].pickupPoints[0],
        dropoffPoint: routes[0].dropoffPoints[0],
        subtotal: 500000,
        discount: 0,
        totalAmount: 500000,
        contactEmail: 'customer1@example.com',
        contactPhone: '0901111111',
        notes: 'Vui lòng gọi điện trước khi đón',
        status: 'confirmed'
      },
      {
        bookingCode: 'BK20240101002',
        customerId: customers[1]._id,
        tripId: trips[4]._id,
        operatorId: operators[1]._id,
        seats: [
          {
            seatNumber: '1A',
            passenger: {
              fullName: 'Trần Thị Bích',
              phone: '0903333333'
            }
          }
        ],
        pickupPoint: routes[2].pickupPoints[0],
        dropoffPoint: routes[2].dropoffPoints[0],
        subtotal: 120000,
        discount: 50000,
        totalAmount: 70000,
        voucherId: vouchers[1]._id,
        voucherCode: 'NEWUSER50',
        contactEmail: 'customer2@example.com',
        contactPhone: '0903333333',
        status: 'confirmed'
      }
    ]);

    console.log(`✓ Created ${bookings.length} bookings\n`);

    // ==================== REVIEWS ====================
    console.log('Creating reviews...');

    const reviews = await Review.insertMany([
      {
        customerId: customers[0]._id,
        operatorId: operators[0]._id,
        tripId: trips[1]._id,
        bookingId: bookings[0]._id,
        rating: 5,
        comment: 'Xe rất sạch sẽ, tài xế lái xe an toàn. Chất lượng dịch vụ tuyệt vời!',
        images: ['https://example.com/reviews/review1_1.jpg'],
        isAnonymous: false,
        isVerified: true,
        status: 'approved'
      },
      {
        customerId: customers[1]._id,
        operatorId: operators[1]._id,
        tripId: trips[4]._id,
        bookingId: bookings[1]._id,
        rating: 4,
        comment: 'Xe đúng giờ, nhân viên nhiệt tình. Tuy nhiên nên cải thiện thêm về ghế ngồi.',
        isAnonymous: false,
        isVerified: true,
        status: 'approved'
      }
    ]);

    console.log(`✓ Created ${reviews.length} reviews\n`);

    // ==================== NOTIFICATIONS ====================
    console.log('Creating notifications...');

    const notifications = await Notification.insertMany([
      {
        userId: customers[0]._id,
        title: 'Đặt vé thành công',
        message: 'Bạn đã đặt vé thành công cho chuyến đi HCM - Đà Lạt. Mã đặt vé: BK20240101001',
        type: 'booking',
        relatedId: bookings[0]._id,
        isRead: false
      },
      {
        userId: customers[0]._id,
        title: 'Nhắc nhở chuyến đi',
        message: 'Chuyến đi của bạn sẽ khởi hành vào ngày mai lúc 14:00. Vui lòng có mặt trước 30 phút.',
        type: 'trip_reminder',
        relatedId: trips[1]._id,
        isRead: false
      },
      {
        userId: customers[1]._id,
        title: 'Đặt vé thành công',
        message: 'Bạn đã đặt vé thành công cho chuyến đi HCM - Vũng Tàu. Mã đặt vé: BK20240101002',
        type: 'booking',
        relatedId: bookings[1]._id,
        isRead: true
      }
    ]);

    console.log(`✓ Created ${notifications.length} notifications\n`);

    // ==================== SUMMARY ====================
    console.log('═══════════════════════════════════════');
    console.log('✓ DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log(`Users: ${customers.length + 1} (1 admin, ${customers.length} customers)`);
    console.log(`Bus Operators: ${operators.length} (${operators.filter(o => o.verificationStatus === 'approved').length} approved, ${operators.filter(o => o.verificationStatus === 'pending').length} pending)`);
    console.log(`Staff: ${staff.length}`);
    console.log(`Buses: ${buses.length}`);
    console.log(`Routes: ${routes.length}`);
    console.log(`Trips: ${trips.length}`);
    console.log(`Bookings: ${bookings.length}`);
    console.log(`Vouchers: ${vouchers.length} (${vouchers.filter(v => v.isActive).length} active)`);
    console.log(`Reviews: ${reviews.length}`);
    console.log(`Notifications: ${notifications.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('Default Login Credentials:');
    console.log('-------------------------------------------');
    console.log('Admin:');
    console.log('  Email: admin@tequickride.com');
    console.log('  Password: Admin@123');
    console.log('');
    console.log('Customers:');
    console.log('  Email: customer1@example.com');
    console.log('  Password: Customer@123');
    console.log('  (customer2, customer3 same password)');
    console.log('');
    console.log('Operators:');
    console.log('  Email: contact@futa.vn');
    console.log('  Password: Operator@123');
    console.log('  (All operators same password)');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run the script
seedDatabase();
