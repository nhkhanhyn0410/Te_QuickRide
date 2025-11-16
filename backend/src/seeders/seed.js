import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  User,
  BusOperator,
  Staff,
  Route,
  Bus,
  Trip,
  Booking,
  Ticket,
  Payment,
  Review,
  Voucher,
  LoyaltyPoint,
  Notification,
  SystemLog
} from '../models/index.js';

// Load environment variables
dotenv.config();

// Sample data
const sampleData = {
  users: [],
  operators: [],
  staff: [],
  routes: [],
  buses: [],
  trips: [],
  bookings: [],
  tickets: [],
  payments: [],
  reviews: [],
  vouchers: [],
  loyaltyPoints: [],
  notifications: [],
  systemLogs: []
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tequickride', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Clear all collections
const clearCollections = async () => {
  console.log('🗑️  Clearing existing data...');

  await User.deleteMany({});
  await BusOperator.deleteMany({});
  await Staff.deleteMany({});
  await Route.deleteMany({});
  await Bus.deleteMany({});
  await Trip.deleteMany({});
  await Booking.deleteMany({});
  await Ticket.deleteMany({});
  await Payment.deleteMany({});
  await Review.deleteMany({});
  await Voucher.deleteMany({});
  await LoyaltyPoint.deleteMany({});
  await Notification.deleteMany({});
  await SystemLog.deleteMany({});

  console.log('✅ Collections cleared');
};

// Create sample users
const createUsers = async () => {
  console.log('👤 Creating users...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = [
    {
      email: 'admin@tequickride.com',
      phone: '0901234567',
      password: hashedPassword,
      fullName: 'Admin User',
      role: 'admin',
      gender: 'male',
      dateOfBirth: new Date('1990-01-01'),
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      loyaltyTier: 'platinum',
      totalPoints: 15000
    },
    {
      email: 'customer1@example.com',
      phone: '0912345678',
      password: hashedPassword,
      fullName: 'Nguyễn Văn An',
      role: 'customer',
      gender: 'male',
      dateOfBirth: new Date('1995-05-15'),
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      loyaltyTier: 'gold',
      totalPoints: 5500
    },
    {
      email: 'customer2@example.com',
      phone: '0923456789',
      password: hashedPassword,
      fullName: 'Trần Thị Bình',
      role: 'customer',
      gender: 'female',
      dateOfBirth: new Date('1998-08-20'),
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      loyaltyTier: 'silver',
      totalPoints: 2200
    }
  ];

  sampleData.users = await User.insertMany(users);
  console.log(`✅ Created ${sampleData.users.length} users`);
};

// Create sample bus operators
const createBusOperators = async () => {
  console.log('🚌 Creating bus operators...');

  const hashedPassword = await bcrypt.hash('operator123', 12);

  const operators = [
    {
      companyName: 'Phương Trang - FUTA Bus Lines',
      email: 'contact@futabus.vn',
      phone: '02839386852',
      password: hashedPassword,
      businessLicense: 'DKKD-001-2020',
      taxCode: '0123456789',
      logo: 'https://futabus.vn/images/logo.png',
      description: 'Hệ thống xe khách hàng đầu Việt Nam',
      website: 'https://futabus.vn',
      address: {
        street: '272 Đề Thám',
        ward: 'Phường Cô Giang',
        district: 'Quận 1',
        city: 'Hồ Chí Minh',
        country: 'Việt Nam'
      },
      bankAccount: {
        bankName: 'Vietcombank',
        accountNumber: '0123456789012',
        accountHolder: 'Công ty TNHH Phương Trang'
      },
      verificationStatus: 'approved',
      verifiedAt: new Date(),
      averageRating: 4.5,
      totalReviews: 1250,
      totalTrips: 5000,
      totalRevenue: 15000000000,
      commissionRate: 5,
      isActive: true,
      isSuspended: false
    },
    {
      companyName: 'Hoàng Long Express',
      email: 'info@hoanglongexpress.vn',
      phone: '02438468888',
      password: hashedPassword,
      businessLicense: 'DKKD-002-2020',
      taxCode: '0987654321',
      logo: 'https://hoanglongexpress.vn/logo.png',
      description: 'Xe khách cao cấp Hà Nội - Các tỉnh',
      website: 'https://hoanglongexpress.vn',
      address: {
        street: 'Bến xe Giáp Bát',
        ward: 'Phường Giáp Bát',
        district: 'Quận Hoàng Mai',
        city: 'Hà Nội',
        country: 'Việt Nam'
      },
      bankAccount: {
        bankName: 'Vietinbank',
        accountNumber: '9876543210987',
        accountHolder: 'Công ty CP Hoàng Long'
      },
      verificationStatus: 'approved',
      verifiedAt: new Date(),
      averageRating: 4.3,
      totalReviews: 890,
      totalTrips: 3500,
      totalRevenue: 8000000000,
      commissionRate: 5,
      isActive: true,
      isSuspended: false
    }
  ];

  sampleData.operators = await BusOperator.insertMany(operators);
  console.log(`✅ Created ${sampleData.operators.length} bus operators`);
};

// Create sample staff
const createStaff = async () => {
  console.log('👨‍✈️ Creating staff members...');

  const hashedPassword = await bcrypt.hash('staff123', 12);
  const operator = sampleData.operators[0];

  const staff = [
    {
      operatorId: operator._id,
      employeeCode: 'EMP000001',
      fullName: 'Lê Văn Tài',
      phone: '0934567890',
      email: 'letai@futabus.vn',
      password: hashedPassword,
      role: 'driver',
      licenseNumber: 'B2-123456',
      licenseExpiry: new Date('2026-12-31'),
      dateOfBirth: new Date('1985-03-10'),
      status: 'active'
    },
    {
      operatorId: operator._id,
      employeeCode: 'EMP000002',
      fullName: 'Phạm Thị Hoa',
      phone: '0945678901',
      email: 'phamhoa@futabus.vn',
      password: hashedPassword,
      role: 'trip_manager',
      dateOfBirth: new Date('1992-07-22'),
      status: 'active'
    }
  ];

  sampleData.staff = await Staff.insertMany(staff);
  console.log(`✅ Created ${sampleData.staff.length} staff members`);
};

// Create sample routes
const createRoutes = async () => {
  console.log('🛣️  Creating routes...');

  const operator = sampleData.operators[0];

  const routes = [
    {
      operatorId: operator._id,
      routeName: 'Hà Nội - Đà Nẵng',
      routeCode: 'HN-DN-001',
      origin: {
        city: 'Hà Nội',
        province: 'Hà Nội',
        station: 'Bến xe Giáp Bát',
        address: 'Bến xe Giáp Bát, Hoàng Mai, Hà Nội',
        coordinates: {
          lat: 20.9953,
          lng: 105.8243
        }
      },
      destination: {
        city: 'Đà Nẵng',
        province: 'Đà Nẵng',
        station: 'Bến xe Đà Nẵng',
        address: 'Bến xe Đà Nẵng, Hải Châu, Đà Nẵng',
        coordinates: {
          lat: 16.0544,
          lng: 108.2022
        }
      },
      distance: 763,
      estimatedDuration: 720,
      pickupPoints: [
        {
          name: 'Bến xe Giáp Bát',
          address: 'Giải Phóng, Hoàng Mai, Hà Nội',
          coordinates: { lat: 20.9953, lng: 105.8243 }
        },
        {
          name: 'Ngã tư Sở',
          address: 'Ngã tư Sở, Đống Đa, Hà Nội',
          coordinates: { lat: 21.0101, lng: 105.8270 }
        },
        {
          name: 'Cầu Giấy',
          address: 'Cầu Giấy, Hà Nội',
          coordinates: { lat: 21.0325, lng: 105.7943 }
        }
      ],
      dropoffPoints: [
        {
          name: 'Bến xe Đà Nẵng',
          address: 'Bến xe Đà Nẵng, Hải Châu, Đà Nẵng',
          coordinates: { lat: 16.0544, lng: 108.2022 }
        },
        {
          name: 'Công viên APEC',
          address: 'Công viên APEC, Ngũ Hành Sơn, Đà Nẵng',
          coordinates: { lat: 16.0155, lng: 108.2471 }
        },
        {
          name: 'Ngã ba Huế',
          address: 'Ngã ba Huế, Hải Châu, Đà Nẵng',
          coordinates: { lat: 16.0678, lng: 108.2208 }
        }
      ],
      isActive: true
    },
    {
      operatorId: operator._id,
      routeName: 'Hồ Chí Minh - Nha Trang',
      routeCode: 'HCM-NT-001',
      origin: {
        city: 'Hồ Chí Minh',
        province: 'Hồ Chí Minh',
        station: 'Bến xe Miền Đông',
        address: 'Bến xe Miền Đông, Bình Thạnh, TP.HCM',
        coordinates: {
          lat: 10.8142,
          lng: 106.7106
        }
      },
      destination: {
        city: 'Nha Trang',
        province: 'Khánh Hòa',
        station: 'Bến xe Nha Trang',
        address: 'Bến xe Nha Trang, Khánh Hòa',
        coordinates: {
          lat: 12.2585,
          lng: 109.1898
        }
      },
      distance: 448,
      estimatedDuration: 480,
      pickupPoints: [
        {
          name: 'Bến xe Miền Đông',
          address: 'Bến xe Miền Đông, Bình Thạnh, TP.HCM',
          coordinates: { lat: 10.8142, lng: 106.7106 }
        },
        {
          name: 'Thủ Đức',
          address: 'Quốc lộ 1A, Thủ Đức, TP.HCM',
          coordinates: { lat: 10.8505, lng: 106.7690 }
        },
        {
          name: 'Dĩ An',
          address: 'Quốc lộ 1K, Dĩ An, Bình Dương',
          coordinates: { lat: 10.9033, lng: 106.7651 }
        }
      ],
      dropoffPoints: [
        {
          name: 'Bến xe Nha Trang',
          address: 'Bến xe Nha Trang, Khánh Hòa',
          coordinates: { lat: 12.2585, lng: 109.1898 }
        },
        {
          name: 'Trung tâm TP Nha Trang',
          address: 'Trần Phú, Nha Trang, Khánh Hòa',
          coordinates: { lat: 12.2388, lng: 109.1967 }
        }
      ],
      isActive: true
    },
    {
      operatorId: operator._id,
      routeName: 'Hà Nội - Hải Phòng',
      routeCode: 'HN-HP-001',
      origin: {
        city: 'Hà Nội',
        province: 'Hà Nội',
        station: 'Bến xe Giáp Bát',
        address: 'Bến xe Giáp Bát, Hoàng Mai, Hà Nội',
        coordinates: {
          lat: 20.9953,
          lng: 105.8243
        }
      },
      destination: {
        city: 'Hải Phòng',
        province: 'Hải Phòng',
        station: 'Bến xe Niệm Nghĩa',
        address: 'Bến xe Niệm Nghĩa, Hải Phòng',
        coordinates: {
          lat: 20.8449,
          lng: 106.6881
        }
      },
      distance: 120,
      estimatedDuration: 120,
      pickupPoints: [
        {
          name: 'Bến xe Giáp Bát',
          address: 'Giải Phóng, Hoàng Mai, Hà Nội',
          coordinates: { lat: 20.9953, lng: 105.8243 }
        }
      ],
      dropoffPoints: [
        {
          name: 'Bến xe Niệm Nghĩa',
          address: 'Bến xe Niệm Nghĩa, Hải Phòng',
          coordinates: { lat: 20.8449, lng: 106.6881 }
        }
      ],
      isActive: true
    }
  ];

  sampleData.routes = await Route.insertMany(routes);
  console.log(`✅ Created ${sampleData.routes.length} routes`);
};

// Create sample buses
const createBuses = async () => {
  console.log('🚐 Creating buses...');

  const operator = sampleData.operators[0];

  const buses = [
    {
      operatorId: operator._id,
      busNumber: '51B-12345',
      busType: 'sleeper',
      totalSeats: 40,
      seatLayout: {
        floors: 2,
        rows: 10,
        columns: 4,
        layout: [
          ['1A', '1B', 'X', '1C'],
          ['2A', '2B', 'X', '2C'],
          ['3A', '3B', 'X', '3C'],
          ['4A', '4B', 'X', '4C'],
          ['5A', '5B', 'X', '5C'],
          ['6A', '6B', 'X', '6C'],
          ['7A', '7B', 'X', '7C'],
          ['8A', '8B', 'X', '8C'],
          ['9A', '9B', 'X', '9C'],
          ['10A', '10B', 'X', '10C']
        ]
      },
      amenities: ['wifi', 'ac', 'water', 'toilet', 'tv', 'usb_charger', 'blanket'],
      images: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e'
      ],
      isActive: true
    },
    {
      operatorId: operator._id,
      busNumber: '51B-67890',
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
      amenities: ['wifi', 'ac', 'water', 'toilet', 'usb_charger', 'blanket', 'reading_light'],
      images: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'
      ],
      isActive: true
    },
    {
      operatorId: operator._id,
      busNumber: '51B-11111',
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
      isActive: true
    }
  ];

  sampleData.buses = await Bus.insertMany(buses);
  console.log(`✅ Created ${sampleData.buses.length} buses`);
};

// Create sample trips
const createTrips = async () => {
  console.log('🚌 Creating trips...');

  const operator = sampleData.operators[0];
  const route = sampleData.routes[0];
  const bus = sampleData.buses[1]; // Use limousine bus with A1, A2, A3, B1, B2, B3 seats
  const driver = sampleData.staff.find(s => s.role === 'driver');
  const manager = sampleData.staff.find(s => s.role === 'trip_manager');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const trips = [
    {
      operatorId: operator._id,
      routeId: route._id,
      busId: bus._id,
      driverId: driver._id,
      managerId: manager._id,
      tripCode: 'TRIP' + Date.now(),
      departureTime: tomorrow,
      arrivalTime: new Date(tomorrow.getTime() + 12 * 60 * 60 * 1000),
      basePrice: 350000,
      availableSeats: 24, // Limousine has 24 seats
      occupiedSeats: [],
      lockedSeats: [],
      status: 'scheduled'
    }
  ];

  sampleData.trips = await Trip.insertMany(trips);
  console.log(`✅ Created ${sampleData.trips.length} trips`);
};

// Create sample bookings
const createBookings = async () => {
  console.log('📝 Creating bookings...');

  const customers = sampleData.users.filter(u => u.role === 'customer');
  const trip = sampleData.trips[0];
  const operator = sampleData.operators[0];
  const route = sampleData.routes[0];

  const bookings = [
    {
      bookingCode: 'BK20250116001',
      customerId: customers[0]._id,
      tripId: trip._id,
      operatorId: operator._id,
      seats: [
        {
          seatNumber: 'A1',
          passenger: {
            fullName: customers[0].fullName,
            phone: customers[0].phone,
            idCard: '079095001234'
          }
        },
        {
          seatNumber: 'A2',
          passenger: {
            fullName: 'Nguyễn Văn B',
            phone: '0909876543',
            idCard: '079095005678'
          }
        }
      ],
      pickupPoint: route.pickupPoints[0],
      dropoffPoint: route.dropoffPoints[0],
      subtotal: 700000,
      discount: 50000,
      totalAmount: 650000,
      voucherCode: 'WELCOME2025',
      contactEmail: customers[0].email,
      contactPhone: customers[0].phone,
      notes: 'Vui lòng gọi điện trước 30 phút',
      status: 'confirmed',
      checkedInSeats: [],
      refundAmount: 0
    },
    {
      bookingCode: 'BK20250116002',
      customerId: customers[1]._id,
      tripId: trip._id,
      operatorId: operator._id,
      seats: [
        {
          seatNumber: 'B1',
          passenger: {
            fullName: customers[1].fullName,
            phone: customers[1].phone,
            idCard: '079095009012'
          }
        }
      ],
      pickupPoint: route.pickupPoints[1],
      dropoffPoint: route.dropoffPoints[1],
      subtotal: 350000,
      discount: 0,
      totalAmount: 350000,
      contactEmail: customers[1].email,
      contactPhone: customers[1].phone,
      status: 'confirmed',
      checkedInSeats: ['B1'],
      checkedInAt: new Date(),
      refundAmount: 0
    }
  ];

  sampleData.bookings = await Booking.insertMany(bookings);

  // Update trip occupied seats
  await Trip.findByIdAndUpdate(trip._id, {
    $set: {
      occupiedSeats: ['A1', 'A2', 'B1'],
      availableSeats: trip.availableSeats - 3
    }
  });

  console.log(`✅ Created ${sampleData.bookings.length} bookings`);
};

// Create sample tickets
const createTickets = async () => {
  console.log('🎫 Creating tickets...');

  const tickets = [];

  // Create tickets for each booking
  for (const booking of sampleData.bookings) {
    const trip = await Trip.findById(booking.tripId).populate('routeId');
    const operator = await BusOperator.findById(booking.operatorId);

    for (const seat of booking.seats) {
      const ticketCode = `TK${booking.bookingCode.substring(2)}${seat.seatNumber}`;

      tickets.push({
        ticketCode: ticketCode,
        bookingId: booking._id,
        customerId: booking.customerId,
        tripId: booking.tripId,
        seatNumber: seat.seatNumber,
        passenger: seat.passenger,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticketCode}`,
        qrData: JSON.stringify({
          ticketCode: ticketCode,
          bookingCode: booking.bookingCode,
          seatNumber: seat.seatNumber,
          passengerName: seat.passenger.fullName,
          departureTime: trip.departureTime
        }),
        ticketPDF: `https://tequickride.vn/tickets/${ticketCode}.pdf`,
        isValid: booking.status === 'confirmed' || booking.status === 'completed',
        isUsed: booking.checkedInSeats.includes(seat.seatNumber),
        usedAt: booking.checkedInSeats.includes(seat.seatNumber) ? booking.checkedInAt : null,
        tripDetails: {
          routeName: trip.routeId.routeName,
          origin: trip.routeId.origin.city,
          destination: trip.routeId.destination.city,
          departureTime: trip.departureTime,
          busNumber: (await Bus.findById(trip.busId)).busNumber,
          operatorName: operator.companyName
        }
      });
    }
  }

  sampleData.tickets = await Ticket.insertMany(tickets);
  console.log(`✅ Created ${sampleData.tickets.length} tickets`);
};

// Create sample payments
const createPayments = async () => {
  console.log('💳 Creating payments...');

  const payments = [];

  // Create payment for each booking
  for (const booking of sampleData.bookings) {
    const paymentMethods = ['momo', 'vnpay', 'zalopay', 'visa'];
    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    let gatewayResponse = null;
    let gatewayTransactionId = null;
    let status = 'success';

    if (booking.status === 'confirmed') {
      status = 'success';

      if (method === 'momo') {
        gatewayTransactionId = `MOMO_${Date.now()}`;
        gatewayResponse = {
          partnerCode: 'MOMO',
          orderId: booking.bookingCode,
          requestId: Date.now().toString(),
          amount: booking.totalAmount,
          orderInfo: `Thanh toán vé xe TeQuickRide - ${booking.bookingCode}`,
          orderType: 'momo_wallet',
          transId: Math.floor(Math.random() * 9999999999),
          resultCode: 0,
          message: 'Successful.',
          payType: 'qr',
          responseTime: Date.now(),
          extraData: '',
          signature: 'a1b2c3d4e5f6g7h8i9j0'
        };
      } else if (method === 'vnpay') {
        gatewayTransactionId = `VNPAY_${Date.now()}`;
        gatewayResponse = {
          vnp_Amount: booking.totalAmount * 100,
          vnp_BankCode: 'NCB',
          vnp_BankTranNo: `VNP${Math.floor(Math.random() * 99999999)}`,
          vnp_CardType: 'ATM',
          vnp_OrderInfo: `Thanh toan ve xe TeQuickRide - ${booking.bookingCode}`,
          vnp_PayDate: new Date().toISOString().replace(/[-:]/g, '').slice(0, 14),
          vnp_ResponseCode: '00',
          vnp_TmnCode: 'TEQUICKRIDE',
          vnp_TransactionNo: Math.floor(Math.random() * 99999999).toString(),
          vnp_TransactionStatus: '00',
          vnp_TxnRef: booking.bookingCode,
          vnp_SecureHash: 'z1y2x3w4v5u6t7s8r9q0'
        };
      }
    }

    payments.push({
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 9999)}`,
      bookingId: booking._id,
      customerId: booking.customerId,
      amount: booking.totalAmount,
      currency: 'VND',
      paymentMethod: method,
      gatewayTransactionId: gatewayTransactionId,
      gatewayResponse: gatewayResponse,
      status: status,
      refundAmount: booking.refundAmount,
      refundedAt: booking.refundAmount > 0 ? new Date() : null,
      refundReason: booking.cancellationReason
    });
  }

  sampleData.payments = await Payment.insertMany(payments);
  console.log(`✅ Created ${sampleData.payments.length} payments`);
};

// Create sample reviews
const createReviews = async () => {
  console.log('⭐ Creating reviews...');

  const reviews = [];

  // Create review for confirmed bookings
  const confirmedBookings = sampleData.bookings.filter(b => b.status === 'confirmed');

  for (let i = 0; i < Math.min(2, confirmedBookings.length); i++) {
    const booking = confirmedBookings[i];
    const trip = await Trip.findById(booking.tripId);

    reviews.push({
      customerId: booking.customerId,
      tripId: booking.tripId,
      operatorId: booking.operatorId,
      bookingId: booking._id,
      rating: 4 + i, // 4 and 5 stars
      title: i === 0 ? 'Chuyến đi tuyệt vời!' : 'Dịch vụ tốt',
      comment: i === 0
        ? 'Xe sạch sẽ, tài xế lái xe an toàn. Nhân viên phục vụ nhiệt tình. Sẽ tiếp tục ủng hộ!'
        : 'Xe đúng giờ, tiện nghi đầy đủ. Giá cả hợp lý.',
      serviceRating: 5,
      driverRating: i === 0 ? 5 : 4,
      vehicleRating: 4,
      punctualityRating: 5,
      images: [],
      isApproved: true,
      isHidden: false,
      helpfulCount: Math.floor(Math.random() * 20)
    });
  }

  sampleData.reviews = await Review.insertMany(reviews);
  console.log(`✅ Created ${sampleData.reviews.length} reviews`);
};

// Create sample vouchers
const createVouchers = async () => {
  console.log('🎫 Creating vouchers...');

  const admin = sampleData.users.find(u => u.role === 'admin');

  const vouchers = [
    {
      code: 'WELCOME2025',
      name: 'Ưu đãi chào mừng 2025',
      description: 'Giảm 15% cho khách hàng mới',
      discountType: 'percentage',
      discountValue: 15,
      maxDiscount: 50000,
      minOrderValue: 200000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      maxUsage: 1000,
      currentUsage: 0,
      maxUsagePerUser: 1,
      applicableTo: 'all',
      targetUsers: 'new',
      isActive: true,
      createdBy: admin._id
    },
    {
      code: 'GOLD50K',
      name: 'Ưu đãi thành viên Vàng',
      description: 'Giảm 50.000đ cho thành viên Gold',
      discountType: 'fixed',
      discountValue: 50000,
      minOrderValue: 300000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      maxUsage: 500,
      currentUsage: 0,
      maxUsagePerUser: 5,
      applicableTo: 'all',
      targetUsers: 'loyalty_tier',
      loyaltyTiers: ['gold', 'platinum'],
      isActive: true,
      createdBy: admin._id
    }
  ];

  sampleData.vouchers = await Voucher.insertMany(vouchers);
  console.log(`✅ Created ${sampleData.vouchers.length} vouchers`);
};

// Create sample loyalty points
const createLoyaltyPoints = async () => {
  console.log('⭐ Creating loyalty points...');

  const customer = sampleData.users.find(u => u.role === 'customer');

  const points = [
    {
      customerId: customer._id,
      type: 'earn',
      points: 500,
      sourceType: 'booking',
      description: 'Tích điểm từ đặt vé chuyến Hà Nội - Đà Nẵng',
      balanceBefore: 5000,
      balanceAfter: 5500,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  sampleData.loyaltyPoints = await LoyaltyPoint.insertMany(points);
  console.log(`✅ Created ${sampleData.loyaltyPoints.length} loyalty point transactions`);
};

// Create sample notifications
const createNotifications = async () => {
  console.log('🔔 Creating notifications...');

  const customers = sampleData.users.filter(u => u.role === 'customer');
  const admin = sampleData.users.find(u => u.role === 'admin');
  const operator = sampleData.operators[0];

  const notifications = [
    {
      recipientId: customers[0]._id,
      recipientType: 'user',
      type: 'promotion',
      title: 'Ưu đãi đặc biệt!',
      message: 'Giảm 15% cho chuyến đi đầu tiên. Sử dụng mã WELCOME2025',
      priority: 'high',
      isRead: false
    },
    {
      recipientId: customers[0]._id,
      recipientType: 'user',
      type: 'booking_confirmed',
      title: 'Đặt vé thành công',
      message: 'Vé của bạn đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!',
      priority: 'normal',
      isRead: false
    },
    {
      recipientId: operator._id,
      recipientType: 'operator',
      type: 'system',
      title: 'Thông báo hệ thống',
      message: 'Hệ thống đã được cập nhật thành công',
      priority: 'normal',
      isRead: true,
      readAt: new Date()
    }
  ];

  sampleData.notifications = await Notification.insertMany(notifications);
  console.log(`✅ Created ${sampleData.notifications.length} notifications`);
};

// Create sample system logs
const createSystemLogs = async () => {
  console.log('📝 Creating system logs...');

  const logs = [
    {
      level: 'info',
      category: 'system',
      action: 'database_seeded',
      message: 'Database seeded with sample data',
      timestamp: new Date()
    }
  ];

  sampleData.systemLogs = await SystemLog.insertMany(logs);
  console.log(`✅ Created ${sampleData.systemLogs.length} system logs`);
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    await connectDB();
    await clearCollections();

    // Seed data in order (respecting relationships)
    await createUsers();
    await createBusOperators();
    await createStaff();
    await createRoutes();
    await createBuses();
    await createTrips();
    await createBookings();
    await createTickets();
    await createPayments();
    await createReviews();
    await createVouchers();
    await createLoyaltyPoints();
    await createNotifications();
    await createSystemLogs();

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${sampleData.users.length} Users`);
    console.log(`   - ${sampleData.operators.length} Bus Operators`);
    console.log(`   - ${sampleData.staff.length} Staff Members`);
    console.log(`   - ${sampleData.routes.length} Routes`);
    console.log(`   - ${sampleData.buses.length} Buses`);
    console.log(`   - ${sampleData.trips.length} Trips`);
    console.log(`   - ${sampleData.bookings.length} Bookings`);
    console.log(`   - ${sampleData.tickets.length} Tickets`);
    console.log(`   - ${sampleData.payments.length} Payments`);
    console.log(`   - ${sampleData.reviews.length} Reviews`);
    console.log(`   - ${sampleData.vouchers.length} Vouchers`);
    console.log(`   - ${sampleData.loyaltyPoints.length} Loyalty Point Transactions`);
    console.log(`   - ${sampleData.notifications.length} Notifications`);
    console.log(`   - ${sampleData.systemLogs.length} System Logs`);
    console.log('\n📝 Login Credentials:');
    console.log('   Admin:    admin@tequickride.com / password123');
    console.log('   Customer: customer1@example.com / password123');
    console.log('   Operator: contact@futabus.vn / operator123');
    console.log('   Staff:    letai@futabus.vn / staff123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
