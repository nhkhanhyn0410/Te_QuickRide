/**
 * SEED DATA FOR MONGODB - QuickRide
 *
 * Script này tạo dữ liệu mẫu đầy đủ tất cả fields cho MongoDB
 * để hiển thị trong MongoDB Compass
 *
 * Cách chạy:
 * node backend/src/seeders/seedData.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import User from '../models/User.js';
import BusOperator from '../models/BusOperator.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import Payment from '../models/Payment.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickride';

// Hash password helper
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Sample data với ĐẦY ĐỦ tất cả fields
const sampleData = {
  users: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000001'),
      email: 'admin@quickride.com',
      phone: '0901234567',
      password: 'Admin@123', // Will be hashed
      fullName: 'Nguyễn Văn Admin',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'male',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'admin',
      googleId: 'google_admin_123456',
      facebookId: 'facebook_admin_123456',
      isEmailVerified: true,
      isPhoneVerified: true,
      emailVerificationToken: 'email_verify_token_admin',
      phoneVerificationOTP: '123456',
      otpExpires: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetToken: 'reset_token_admin',
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
      lastLogin: new Date(),
      savedPassengers: [
        {
          fullName: 'Trần Thị B',
          phone: '0909876543',
          idCard: '079088001234'
        },
        {
          fullName: 'Lê Văn C',
          phone: '0912345678',
          idCard: '079088005678'
        }
      ],
      loyaltyTier: 'platinum',
      totalPoints: 5000,
      isActive: true,
      isBlocked: false
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000002'),
      email: 'customer1@gmail.com',
      phone: '0987654321',
      password: 'Customer@123', // Will be hashed
      fullName: 'Phạm Thị Lan',
      dateOfBirth: new Date('1995-05-20'),
      gender: 'female',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'customer',
      googleId: 'google_customer1_789012',
      facebookId: null,
      isEmailVerified: true,
      isPhoneVerified: true,
      emailVerificationToken: null,
      phoneVerificationOTP: null,
      otpExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLogin: new Date(),
      savedPassengers: [
        {
          fullName: 'Nguyễn Văn D',
          phone: '0923456789',
          idCard: '079088009012'
        }
      ],
      loyaltyTier: 'gold',
      totalPoints: 1500,
      isActive: true,
      isBlocked: false
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000003'),
      email: 'customer2@gmail.com',
      phone: '0976543210',
      password: 'Customer@123', // Will be hashed
      fullName: 'Hoàng Minh Tuấn',
      dateOfBirth: new Date('1988-12-10'),
      gender: 'male',
      avatar: 'https://i.pravatar.cc/150?img=8',
      role: 'customer',
      googleId: null,
      facebookId: 'facebook_customer2_345678',
      isEmailVerified: true,
      isPhoneVerified: false,
      emailVerificationToken: null,
      phoneVerificationOTP: '654321',
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      savedPassengers: [],
      loyaltyTier: 'silver',
      totalPoints: 800,
      isActive: true,
      isBlocked: false
    }
  ],

  busOperators: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000101'),
      companyName: 'Phương Trang FUTA Bus Lines',
      email: 'contact@futabus.vn',
      phone: '02838386852',
      password: 'Operator@123', // Will be hashed
      businessLicense: 'GPKD-0123456789',
      taxCode: '0301204659',
      logo: 'https://futabus.vn/images/logo.png',
      description: 'Công ty vận tải hành khách hàng đầu Việt Nam với hơn 20 năm kinh nghiệm. Chuyên cung cấp dịch vụ xe khách cao cấp, an toàn và chất lượng.',
      website: 'https://futabus.vn',
      address: {
        street: '272 Đường 3/2',
        ward: 'Phường 12',
        district: 'Quận 10',
        city: 'Thành phố Hồ Chí Minh',
        country: 'Vietnam'
      },
      bankAccount: {
        bankName: 'Vietcombank',
        accountNumber: '0071000123456',
        accountHolder: 'CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG'
      },
      verificationStatus: 'approved',
      verifiedAt: new Date('2024-01-10'),
      verifiedBy: new mongoose.Types.ObjectId('650000000000000000000001'),
      rejectionReason: null,
      averageRating: 4.8,
      totalReviews: 2456,
      totalTrips: 15678,
      totalRevenue: 125000000000,
      commissionRate: 5,
      isActive: true,
      isSuspended: false,
      suspensionReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000102'),
      companyName: 'Xe Khách Thành Bưởi',
      email: 'info@thanhbuoi.vn',
      phone: '02838295525',
      password: 'Operator@123', // Will be hashed
      businessLicense: 'GPKD-9876543210',
      taxCode: '0301234567',
      logo: 'https://thanhbuoi.vn/images/logo.png',
      description: 'Nhà xe uy tín chuyên tuyến Sài Gòn - Đà Lạt với đội xe limousine cao cấp',
      website: 'https://thanhbuoi.vn',
      address: {
        street: '395 Điện Biên Phủ',
        ward: 'Phường 15',
        district: 'Quận Bình Thạnh',
        city: 'Thành phố Hồ Chí Minh',
        country: 'Vietnam'
      },
      bankAccount: {
        bankName: 'Techcombank',
        accountNumber: '19036666888999',
        accountHolder: 'CÔNG TY TNHH VẬN TẢI THÀNH BƯỞI'
      },
      verificationStatus: 'pending',
      verifiedAt: null,
      verifiedBy: null,
      rejectionReason: null,
      averageRating: 4.5,
      totalReviews: 890,
      totalTrips: 5432,
      totalRevenue: 45000000000,
      commissionRate: 6,
      isActive: true,
      isSuspended: false,
      suspensionReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000103'),
      companyName: 'Xe Mai Linh Express',
      email: 'support@mailinexpress.vn',
      phone: '1900545400',
      password: 'Operator@123', // Will be hashed
      businessLicense: 'GPKD-1122334455',
      taxCode: '0301998877',
      logo: 'https://mailinh.vn/logo.png',
      description: 'Hệ thống xe khách liên tỉnh chất lượng cao',
      website: 'https://mailinh.vn',
      address: {
        street: '123 Nguyễn Thị Minh Khai',
        ward: 'Phường Võ Thị Sáu',
        district: 'Quận 3',
        city: 'Thành phố Hồ Chí Minh',
        country: 'Vietnam'
      },
      bankAccount: {
        bankName: 'BIDV',
        accountNumber: '12345678901',
        accountHolder: 'CÔNG TY CỔ PHẦN MAI LINH'
      },
      verificationStatus: 'rejected',
      verifiedAt: new Date('2024-12-20'),
      verifiedBy: new mongoose.Types.ObjectId('650000000000000000000001'),
      rejectionReason: 'Giấy phép kinh doanh đã hết hạn. Vui lòng cập nhật giấy phép mới.',
      averageRating: 4.2,
      totalReviews: 456,
      totalTrips: 2100,
      totalRevenue: 18000000000,
      commissionRate: 7,
      isActive: false,
      isSuspended: true,
      suspensionReason: 'Giấy phép chưa được gia hạn'
    }
  ],

  buses: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000201'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      busNumber: '51B-12345',
      busType: 'limousine',
      totalSeats: 24,
      seatLayout: {
        floors: 1,
        rows: 6,
        columns: 4,
        layout: [
          ['A1', 'A2', 'X', 'A3'],
          ['B1', 'B2', 'X', 'B3'],
          ['C1', 'C2', 'X', 'C3'],
          ['D1', 'D2', 'X', 'D3'],
          ['E1', 'E2', 'X', 'E3'],
          ['F1', 'F2', 'X', 'F3']
        ]
      },
      amenities: ['wifi', 'ac', 'toilet', 'water', 'blanket', 'usb_charger', 'reading_light'],
      images: [
        'https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Exterior',
        'https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Interior',
        'https://via.placeholder.com/800x600/0066cc/ffffff?text=FUTA+Limousine+Seats'
      ],
      isActive: true,
      maintenanceStatus: 'good'
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000202'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      busNumber: '51B-67890',
      busType: 'sleeper',
      totalSeats: 40,
      seatLayout: {
        floors: 2,
        rows: 10,
        columns: 4,
        layout: [
          // Floor 1
          ['1A', '1B', 'X', '1C'],
          ['2A', '2B', 'X', '2C'],
          ['3A', '3B', 'X', '3C'],
          ['4A', '4B', 'X', '4C'],
          ['5A', '5B', 'X', '5C'],
          // Floor 2
          ['6A', '6B', 'X', '6C'],
          ['7A', '7B', 'X', '7C'],
          ['8A', '8B', 'X', '8C'],
          ['9A', '9B', 'X', '9C'],
          ['10A', '10B', 'X', '10C']
        ]
      },
      amenities: ['wifi', 'ac', 'water', 'blanket', 'tv', 'usb_charger'],
      images: [
        'https://via.placeholder.com/800x600/009933/ffffff?text=FUTA+Sleeper+Bus'
      ],
      isActive: true,
      maintenanceStatus: 'maintenance'
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000203'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000102'),
      busNumber: '50A-11111',
      busType: 'seater',
      totalSeats: 45,
      seatLayout: {
        floors: 1,
        rows: 12,
        columns: 4,
        layout: [
          ['1', '2', 'X', '3'],
          ['4', '5', 'X', '6'],
          ['7', '8', 'X', '9'],
          ['10', '11', 'X', '12'],
          ['13', '14', 'X', '15'],
          ['16', '17', 'X', '18'],
          ['19', '20', 'X', '21'],
          ['22', '23', 'X', '24'],
          ['25', '26', 'X', '27'],
          ['28', '29', 'X', '30'],
          ['31', '32', 'X', '33'],
          ['34', '35', '36', '37']
        ]
      },
      amenities: ['ac', 'water', 'usb_charger'],
      images: [],
      isActive: true,
      maintenanceStatus: 'good'
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000204'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000102'),
      busNumber: '50A-22222',
      busType: 'double_decker',
      totalSeats: 50,
      seatLayout: {
        floors: 2,
        rows: 13,
        columns: 4,
        layout: [
          // Lower deck
          ['L1', 'L2', 'X', 'L3'],
          ['L4', 'L5', 'X', 'L6'],
          ['L7', 'L8', 'X', 'L9'],
          ['L10', 'L11', 'X', 'L12'],
          ['L13', 'L14', 'X', 'L15'],
          ['L16', 'L17', 'X', 'L18'],
          // Upper deck
          ['U1', 'U2', 'X', 'U3'],
          ['U4', 'U5', 'X', 'U6'],
          ['U7', 'U8', 'X', 'U9'],
          ['U10', 'U11', 'X', 'U12'],
          ['U13', 'U14', 'X', 'U15'],
          ['U16', 'U17', 'X', 'U18'],
          ['U19', 'U20', 'U21', 'U22']
        ]
      },
      amenities: ['wifi', 'ac', 'toilet', 'water', 'tv'],
      images: [
        'https://via.placeholder.com/800x600/cc0000/ffffff?text=Double+Decker+Bus'
      ],
      isActive: false,
      maintenanceStatus: 'repair'
    }
  ],

  routes: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000301'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      routeName: 'Sài Gòn - Đà Lạt',
      routeCode: 'SGN-DL-001',
      origin: {
        city: 'Thành phố Hồ Chí Minh',
        province: 'Hồ Chí Minh',
        station: 'Bến xe Miền Đông',
        address: '292 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh',
        coordinates: {
          lat: 10.8142,
          lng: 106.7106
        }
      },
      destination: {
        city: 'Đà Lạt',
        province: 'Lâm Đồng',
        station: 'Bến xe Đà Lạt',
        address: '1 Tô Hiến Thành, Phường 3, TP. Đà Lạt',
        coordinates: {
          lat: 11.9404,
          lng: 108.4583
        }
      },
      pickupPoints: [
        {
          name: 'Văn phòng Quận 1',
          address: '272 Đường 3/2, Phường 12, Quận 10',
          coordinates: {
            lat: 10.7718,
            lng: 106.6659
          }
        },
        {
          name: 'Điểm đón Bình Tân',
          address: '123 Lê Văn Quới, Bình Tân',
          coordinates: {
            lat: 10.7539,
            lng: 106.6046
          }
        }
      ],
      dropoffPoints: [
        {
          name: 'Trung tâm Đà Lạt',
          address: 'Nguyễn Thị Minh Khai, Phường 1',
          coordinates: {
            lat: 11.9415,
            lng: 108.4419
          }
        },
        {
          name: 'Hồ Xuân Hương',
          address: 'Trần Quốc Toản, Phường 9',
          coordinates: {
            lat: 11.9337,
            lng: 108.4380
          }
        }
      ],
      distance: 308,
      estimatedDuration: 360,
      isActive: true
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000302'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      routeName: 'Sài Gòn - Nha Trang',
      routeCode: 'SGN-NT-001',
      origin: {
        city: 'Thành phố Hồ Chí Minh',
        province: 'Hồ Chí Minh',
        station: 'Bến xe Miền Đông',
        address: '292 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh',
        coordinates: {
          lat: 10.8142,
          lng: 106.7106
        }
      },
      destination: {
        city: 'Nha Trang',
        province: 'Khánh Hòa',
        station: 'Bến xe Nha Trang',
        address: '23 Tháng 10, Phường Phước Long, TP. Nha Trang',
        coordinates: {
          lat: 12.2585,
          lng: 109.1898
        }
      },
      pickupPoints: [
        {
          name: 'VP Phương Trang Q1',
          address: '272 Đường 3/2, Phường 12, Quận 10',
          coordinates: {
            lat: 10.7718,
            lng: 106.6659
          }
        }
      ],
      dropoffPoints: [
        {
          name: 'Trung tâm Nha Trang',
          address: 'Trần Phú, Nha Trang',
          coordinates: {
            lat: 12.2388,
            lng: 109.1967
          }
        }
      ],
      distance: 450,
      estimatedDuration: 480,
      isActive: true
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000303'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000102'),
      routeName: 'Hà Nội - Hải Phòng',
      routeCode: 'HN-HP-001',
      origin: {
        city: 'Hà Nội',
        province: 'Hà Nội',
        station: 'Bến xe Giáp Bát',
        address: 'Giải Phóng, Giáp Bát, Hoàng Mai',
        coordinates: {
          lat: 20.9953,
          lng: 105.8243
        }
      },
      destination: {
        city: 'Hải Phòng',
        province: 'Hải Phòng',
        station: 'Bến xe Niệm Nghĩa',
        address: 'Lê Thánh Tông, Máy Chai, Ngô Quyền',
        coordinates: {
          lat: 20.8449,
          lng: 106.6881
        }
      },
      pickupPoints: [],
      dropoffPoints: [],
      distance: 120,
      estimatedDuration: 150,
      isActive: false
    }
  ],

  trips: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000401'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      routeId: new mongoose.Types.ObjectId('650000000000000000000301'),
      busId: new mongoose.Types.ObjectId('650000000000000000000201'),
      tripCode: 'TRIP20250120001',
      departureTime: new Date('2025-01-20T08:00:00Z'),
      arrivalTime: new Date('2025-01-20T14:00:00Z'),
      basePrice: 250000,
      availableSeats: 18,
      occupiedSeats: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      lockedSeats: [
        {
          seatNumber: 'D1',
          lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
          sessionId: 'session_abc123xyz'
        },
        {
          seatNumber: 'D2',
          lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
          sessionId: 'session_abc123xyz'
        }
      ],
      driver: null,
      tripManager: null,
      status: 'scheduled',
      cancellationReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000402'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      routeId: new mongoose.Types.ObjectId('650000000000000000000301'),
      busId: new mongoose.Types.ObjectId('650000000000000000000201'),
      tripCode: 'TRIP20250120002',
      departureTime: new Date('2025-01-20T20:00:00Z'),
      arrivalTime: new Date('2025-01-21T02:00:00Z'),
      basePrice: 280000,
      availableSeats: 24,
      occupiedSeats: [],
      lockedSeats: [],
      driver: null,
      tripManager: null,
      status: 'scheduled',
      cancellationReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000403'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      routeId: new mongoose.Types.ObjectId('650000000000000000000302'),
      busId: new mongoose.Types.ObjectId('650000000000000000000202'),
      tripCode: 'TRIP20250118001',
      departureTime: new Date('2025-01-18T06:00:00Z'),
      arrivalTime: new Date('2025-01-18T14:00:00Z'),
      basePrice: 320000,
      availableSeats: 0,
      occupiedSeats: ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C'],
      lockedSeats: [],
      driver: null,
      tripManager: null,
      status: 'completed',
      cancellationReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000404'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000102'),
      routeId: new mongoose.Types.ObjectId('650000000000000000000303'),
      busId: new mongoose.Types.ObjectId('650000000000000000000203'),
      tripCode: 'TRIP20250119001',
      departureTime: new Date('2025-01-19T10:00:00Z'),
      arrivalTime: new Date('2025-01-19T12:30:00Z'),
      basePrice: 150000,
      availableSeats: 45,
      occupiedSeats: [],
      lockedSeats: [],
      driver: null,
      tripManager: null,
      status: 'cancelled',
      cancellationReason: 'Xe gặp sự cố kỹ thuật, hủy chuyến và hoàn tiền 100% cho khách hàng'
    }
  ],

  bookings: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000501'),
      bookingCode: 'BK20250115001',
      customerId: new mongoose.Types.ObjectId('650000000000000000000002'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000401'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      seats: [
        {
          seatNumber: 'A1',
          passenger: {
            fullName: 'Phạm Thị Lan',
            phone: '0987654321',
            idCard: '079095001234'
          }
        },
        {
          seatNumber: 'A2',
          passenger: {
            fullName: 'Nguyễn Văn D',
            phone: '0923456789',
            idCard: '079088009012'
          }
        }
      ],
      pickupPoint: {
        name: 'Văn phòng Quận 1',
        address: '272 Đường 3/2, Phường 12, Quận 10',
        coordinates: {
          lat: 10.7718,
          lng: 106.6659
        }
      },
      dropoffPoint: {
        name: 'Trung tâm Đà Lạt',
        address: 'Nguyễn Thị Minh Khai, Phường 1',
        coordinates: {
          lat: 11.9415,
          lng: 108.4419
        }
      },
      subtotal: 500000,
      discount: 50000,
      totalAmount: 450000,
      voucherId: null,
      voucherCode: 'NEWYEAR2025',
      contactEmail: 'customer1@gmail.com',
      contactPhone: '0987654321',
      notes: 'Vui lòng gọi điện trước 30 phút khi đến điểm đón',
      status: 'confirmed',
      cancellationReason: null,
      cancelledAt: null,
      refundAmount: 0,
      refundStatus: null,
      checkedInSeats: ['A1', 'A2'],
      checkedInAt: new Date('2025-01-20T07:30:00Z'),
      checkedInBy: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000502'),
      bookingCode: 'BK20250115002',
      customerId: new mongoose.Types.ObjectId('650000000000000000000003'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000401'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      seats: [
        {
          seatNumber: 'B1',
          passenger: {
            fullName: 'Hoàng Minh Tuấn',
            phone: '0976543210',
            idCard: '079095005678'
          }
        },
        {
          seatNumber: 'B2',
          passenger: {
            fullName: 'Trần Thị Hương',
            phone: '0934567890',
            idCard: '079095009999'
          }
        }
      ],
      pickupPoint: {
        name: 'Điểm đón Bình Tân',
        address: '123 Lê Văn Quới, Bình Tân',
        coordinates: {
          lat: 10.7539,
          lng: 106.6046
        }
      },
      dropoffPoint: {
        name: 'Hồ Xuân Hương',
        address: 'Trần Quốc Toản, Phường 9',
        coordinates: {
          lat: 11.9337,
          lng: 108.4380
        }
      },
      subtotal: 500000,
      discount: 0,
      totalAmount: 500000,
      voucherId: null,
      voucherCode: null,
      contactEmail: 'customer2@gmail.com',
      contactPhone: '0976543210',
      notes: null,
      status: 'confirmed',
      cancellationReason: null,
      cancelledAt: null,
      refundAmount: 0,
      refundStatus: null,
      checkedInSeats: [],
      checkedInAt: null,
      checkedInBy: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000503'),
      bookingCode: 'BK20250114001',
      customerId: new mongoose.Types.ObjectId('650000000000000000000002'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000404'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000102'),
      seats: [
        {
          seatNumber: '1',
          passenger: {
            fullName: 'Phạm Thị Lan',
            phone: '0987654321',
            idCard: '079095001234'
          }
        }
      ],
      pickupPoint: {
        name: 'Bến xe Giáp Bát',
        address: 'Giải Phóng, Giáp Bát, Hoàng Mai',
        coordinates: {
          lat: 20.9953,
          lng: 105.8243
        }
      },
      dropoffPoint: {
        name: 'Bến xe Niệm Nghĩa',
        address: 'Lê Thánh Tông, Máy Chai, Ngô Quyền',
        coordinates: {
          lat: 20.8449,
          lng: 106.6881
        }
      },
      subtotal: 150000,
      discount: 0,
      totalAmount: 150000,
      voucherId: null,
      voucherCode: null,
      contactEmail: 'customer1@gmail.com',
      contactPhone: '0987654321',
      notes: null,
      status: 'cancelled',
      cancellationReason: 'Chuyến đi bị hủy do xe gặp sự cố',
      cancelledAt: new Date('2025-01-19T08:00:00Z'),
      refundAmount: 150000,
      refundStatus: 'processed',
      checkedInSeats: [],
      checkedInAt: null,
      checkedInBy: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000504'),
      bookingCode: 'BK20250116001',
      customerId: new mongoose.Types.ObjectId('650000000000000000000003'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000402'),
      operatorId: new mongoose.Types.ObjectId('650000000000000000000101'),
      seats: [
        {
          seatNumber: 'C1',
          passenger: {
            fullName: 'Hoàng Minh Tuấn',
            phone: '0976543210',
            idCard: '079095005678'
          }
        },
        {
          seatNumber: 'C2',
          passenger: {
            fullName: 'Lê Văn Nam',
            phone: '0945678901',
            idCard: '079095011111'
          }
        }
      ],
      pickupPoint: {
        name: 'Văn phòng Quận 1',
        address: '272 Đường 3/2, Phường 12, Quận 10',
        coordinates: {
          lat: 10.7718,
          lng: 106.6659
        }
      },
      dropoffPoint: {
        name: 'Trung tâm Đà Lạt',
        address: 'Nguyễn Thị Minh Khai, Phường 1',
        coordinates: {
          lat: 11.9415,
          lng: 108.4419
        }
      },
      subtotal: 560000,
      discount: 0,
      totalAmount: 560000,
      voucherId: null,
      voucherCode: null,
      contactEmail: 'customer2@gmail.com',
      contactPhone: '0976543210',
      notes: null,
      status: 'pending',
      cancellationReason: null,
      cancelledAt: null,
      refundAmount: 0,
      refundStatus: null,
      checkedInSeats: [],
      checkedInAt: null,
      checkedInBy: null
    }
  ],

  tickets: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000601'),
      ticketCode: 'TK20250115001',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000501'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000002'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000401'),
      seatNumber: 'A1',
      passenger: {
        fullName: 'Phạm Thị Lan',
        phone: '0987654321',
        idCard: '079095001234'
      },
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250115001',
      qrData: JSON.stringify({
        ticketCode: 'TK20250115001',
        bookingCode: 'BK20250115001',
        seatNumber: 'A1',
        passengerName: 'Phạm Thị Lan',
        departureTime: '2025-01-20T08:00:00Z'
      }),
      ticketPDF: 'https://quickride.vn/tickets/TK20250115001.pdf',
      isValid: true,
      isUsed: true,
      usedAt: new Date('2025-01-20T07:30:00Z'),
      validatedBy: null,
      tripDetails: {
        routeName: 'Sài Gòn - Đà Lạt',
        origin: 'Thành phố Hồ Chí Minh',
        destination: 'Đà Lạt',
        departureTime: new Date('2025-01-20T08:00:00Z'),
        busNumber: '51B-12345',
        operatorName: 'Phương Trang FUTA Bus Lines'
      }
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000602'),
      ticketCode: 'TK20250115002',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000501'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000002'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000401'),
      seatNumber: 'A2',
      passenger: {
        fullName: 'Nguyễn Văn D',
        phone: '0923456789',
        idCard: '079088009012'
      },
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250115002',
      qrData: JSON.stringify({
        ticketCode: 'TK20250115002',
        bookingCode: 'BK20250115001',
        seatNumber: 'A2',
        passengerName: 'Nguyễn Văn D',
        departureTime: '2025-01-20T08:00:00Z'
      }),
      ticketPDF: 'https://quickride.vn/tickets/TK20250115002.pdf',
      isValid: true,
      isUsed: true,
      usedAt: new Date('2025-01-20T07:30:00Z'),
      validatedBy: null,
      tripDetails: {
        routeName: 'Sài Gòn - Đà Lạt',
        origin: 'Thành phố Hồ Chí Minh',
        destination: 'Đà Lạt',
        departureTime: new Date('2025-01-20T08:00:00Z'),
        busNumber: '51B-12345',
        operatorName: 'Phương Trang FUTA Bus Lines'
      }
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000603'),
      ticketCode: 'TK20250115003',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000502'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000003'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000401'),
      seatNumber: 'B1',
      passenger: {
        fullName: 'Hoàng Minh Tuấn',
        phone: '0976543210',
        idCard: '079095005678'
      },
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250115003',
      qrData: JSON.stringify({
        ticketCode: 'TK20250115003',
        bookingCode: 'BK20250115002',
        seatNumber: 'B1',
        passengerName: 'Hoàng Minh Tuấn',
        departureTime: '2025-01-20T08:00:00Z'
      }),
      ticketPDF: 'https://quickride.vn/tickets/TK20250115003.pdf',
      isValid: true,
      isUsed: false,
      usedAt: null,
      validatedBy: null,
      tripDetails: {
        routeName: 'Sài Gòn - Đà Lạt',
        origin: 'Thành phố Hồ Chí Minh',
        destination: 'Đà Lạt',
        departureTime: new Date('2025-01-20T08:00:00Z'),
        busNumber: '51B-12345',
        operatorName: 'Phương Trang FUTA Bus Lines'
      }
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000604'),
      ticketCode: 'TK20250115004',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000502'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000003'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000401'),
      seatNumber: 'B2',
      passenger: {
        fullName: 'Trần Thị Hương',
        phone: '0934567890',
        idCard: '079095009999'
      },
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250115004',
      qrData: JSON.stringify({
        ticketCode: 'TK20250115004',
        bookingCode: 'BK20250115002',
        seatNumber: 'B2',
        passengerName: 'Trần Thị Hương',
        departureTime: '2025-01-20T08:00:00Z'
      }),
      ticketPDF: null,
      isValid: true,
      isUsed: false,
      usedAt: null,
      validatedBy: null,
      tripDetails: {
        routeName: 'Sài Gòn - Đà Lạt',
        origin: 'Thành phố Hồ Chí Minh',
        destination: 'Đà Lạt',
        departureTime: new Date('2025-01-20T08:00:00Z'),
        busNumber: '51B-12345',
        operatorName: 'Phương Trang FUTA Bus Lines'
      }
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000605'),
      ticketCode: 'TK20250114001',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000503'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000002'),
      tripId: new mongoose.Types.ObjectId('650000000000000000000404'),
      seatNumber: '1',
      passenger: {
        fullName: 'Phạm Thị Lan',
        phone: '0987654321',
        idCard: '079095001234'
      },
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TK20250114001',
      qrData: JSON.stringify({
        ticketCode: 'TK20250114001',
        bookingCode: 'BK20250114001',
        seatNumber: '1',
        passengerName: 'Phạm Thị Lan',
        departureTime: '2025-01-19T10:00:00Z'
      }),
      ticketPDF: 'https://quickride.vn/tickets/TK20250114001.pdf',
      isValid: false,
      isUsed: false,
      usedAt: null,
      validatedBy: null,
      tripDetails: {
        routeName: 'Hà Nội - Hải Phòng',
        origin: 'Hà Nội',
        destination: 'Hải Phòng',
        departureTime: new Date('2025-01-19T10:00:00Z'),
        busNumber: '50A-11111',
        operatorName: 'Xe Khách Thành Bưởi'
      }
    }
  ],

  payments: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000701'),
      transactionId: 'TXN1705320000ABCD',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000501'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000002'),
      amount: 450000,
      currency: 'VND',
      paymentMethod: 'momo',
      gatewayTransactionId: 'MOMO_2025011512345678',
      gatewayResponse: {
        partnerCode: 'MOMO',
        orderId: 'BK20250115001',
        requestId: '1705320000001',
        amount: 450000,
        orderInfo: 'Thanh toán vé xe QuickRide - BK20250115001',
        orderType: 'momo_wallet',
        transId: 2755988607,
        resultCode: 0,
        message: 'Successful.',
        payType: 'qr',
        responseTime: 1705320123456,
        extraData: '',
        signature: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
      },
      status: 'success',
      refundAmount: 0,
      refundedAt: null,
      refundReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000702'),
      transactionId: 'TXN1705321000EFGH',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000502'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000003'),
      amount: 500000,
      currency: 'VND',
      paymentMethod: 'vnpay',
      gatewayTransactionId: 'VNPAY_20250115234567',
      gatewayResponse: {
        vnp_Amount: 50000000,
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: 'VNP01234567',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Thanh toan ve xe QuickRide - BK20250115002',
        vnp_PayDate: '20250115150000',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'QUICKRIDE',
        vnp_TransactionNo: '14121551',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: 'BK20250115002',
        vnp_SecureHash: 'z1y2x3w4v5u6t7s8r9q0p1o2n3m4l5k6'
      },
      status: 'success',
      refundAmount: 0,
      refundedAt: null,
      refundReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000703'),
      transactionId: 'TXN1705280000IJKL',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000503'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000002'),
      amount: 150000,
      currency: 'VND',
      paymentMethod: 'zalopay',
      gatewayTransactionId: 'ZALOPAY_250114123456',
      gatewayResponse: {
        app_id: 2553,
        app_trans_id: '250114_BK20250114001',
        app_time: 1705219200000,
        app_user: 'customer1@gmail.com',
        amount: 150000,
        item: '[{"itemid":"ticket","itemname":"Vé xe Hà Nội - Hải Phòng","itemprice":150000,"itemquantity":1}]',
        embed_data: '{}',
        bank_code: 'zalopayapp',
        return_code: 1,
        return_message: 'Giao dịch thành công',
        sub_return_code: 1,
        sub_return_message: '',
        zp_trans_id: '250114000000123',
        server_time: 1705219300000,
        mac: 'p1o2i3u4y5t6r7e8w9q0a1s2d3f4g5h6'
      },
      status: 'refunded',
      refundAmount: 150000,
      refundedAt: new Date('2025-01-19T09:00:00Z'),
      refundReason: 'Chuyến đi bị hủy do xe gặp sự cố kỹ thuật'
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000704'),
      transactionId: 'TXN1705392000MNOP',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000504'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000003'),
      amount: 560000,
      currency: 'VND',
      paymentMethod: 'visa',
      gatewayTransactionId: null,
      gatewayResponse: null,
      status: 'pending',
      refundAmount: 0,
      refundedAt: null,
      refundReason: null
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000705'),
      transactionId: 'TXN1705300000QRST',
      bookingId: new mongoose.Types.ObjectId('650000000000000000000502'),
      customerId: new mongoose.Types.ObjectId('650000000000000000000003'),
      amount: 100000,
      currency: 'VND',
      paymentMethod: 'shopeepay',
      gatewayTransactionId: 'SPP_20250115111111',
      gatewayResponse: {
        reference_id: 'BK20250115002_RETRY',
        amount: 100000,
        currency: 'VND',
        status: 'FAILED',
        errcode: 'INSUFFICIENT_BALANCE',
        errmsg: 'Insufficient balance in ShopeePay wallet',
        create_time: 1705321500
      },
      status: 'failed',
      refundAmount: 0,
      refundedAt: null,
      refundReason: null
    }
  ]
};

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await BusOperator.deleteMany({});
    await Bus.deleteMany({});
    await Route.deleteMany({});
    await Trip.deleteMany({});
    await Booking.deleteMany({});
    await Ticket.deleteMany({});
    await Payment.deleteMany({});
    console.log('✅ Cleared all collections');

    // Hash passwords
    console.log('\n🔐 Hashing passwords...');
    for (let user of sampleData.users) {
      user.password = await hashPassword(user.password);
    }
    for (let operator of sampleData.busOperators) {
      operator.password = await hashPassword(operator.password);
    }
    console.log('✅ Passwords hashed');

    // Insert data
    console.log('\n📝 Inserting sample data...');

    console.log('   → Inserting Users...');
    await User.insertMany(sampleData.users);
    console.log(`   ✅ Inserted ${sampleData.users.length} users`);

    console.log('   → Inserting BusOperators...');
    await BusOperator.insertMany(sampleData.busOperators);
    console.log(`   ✅ Inserted ${sampleData.busOperators.length} bus operators`);

    console.log('   → Inserting Buses...');
    await Bus.insertMany(sampleData.buses);
    console.log(`   ✅ Inserted ${sampleData.buses.length} buses`);

    console.log('   → Inserting Routes...');
    await Route.insertMany(sampleData.routes);
    console.log(`   ✅ Inserted ${sampleData.routes.length} routes`);

    console.log('   → Inserting Trips...');
    await Trip.insertMany(sampleData.trips);
    console.log(`   ✅ Inserted ${sampleData.trips.length} trips`);

    console.log('   → Inserting Bookings...');
    await Booking.insertMany(sampleData.bookings);
    console.log(`   ✅ Inserted ${sampleData.bookings.length} bookings`);

    console.log('   → Inserting Tickets...');
    await Ticket.insertMany(sampleData.tickets);
    console.log(`   ✅ Inserted ${sampleData.tickets.length} tickets`);

    console.log('   → Inserting Payments...');
    await Payment.insertMany(sampleData.payments);
    console.log(`   ✅ Inserted ${sampleData.payments.length} payments`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   • Users:        ${sampleData.users.length}`);
    console.log(`   • BusOperators: ${sampleData.busOperators.length}`);
    console.log(`   • Buses:        ${sampleData.buses.length}`);
    console.log(`   • Routes:       ${sampleData.routes.length}`);
    console.log(`   • Trips:        ${sampleData.trips.length}`);
    console.log(`   • Bookings:     ${sampleData.bookings.length}`);
    console.log(`   • Tickets:      ${sampleData.tickets.length}`);
    console.log(`   • Payments:     ${sampleData.payments.length}`);
    console.log('\n📌 Test Accounts:');
    console.log('   Admin:');
    console.log('     Email: admin@quickride.com');
    console.log('     Password: Admin@123');
    console.log('   Customer 1:');
    console.log('     Email: customer1@gmail.com');
    console.log('     Password: Customer@123');
    console.log('   Customer 2:');
    console.log('     Email: customer2@gmail.com');
    console.log('     Password: Customer@123');
    console.log('   Bus Operator:');
    console.log('     Email: contact@futabus.vn');
    console.log('     Password: Operator@123');
    console.log('\n✅ You can now open MongoDB Compass to view all fields!\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeder
seedDatabase();

export { seedDatabase, sampleData };
