import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Row, Col, Steps, message, Divider, Tag } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { PassengerForm } from '../../components/customer';
import { Loading, ErrorMessage } from '../../components/common';
import bookingService from '../../services/bookingService';
// import { setBookingData } from '../../redux/slices/bookingSlice';
import dayjs from 'dayjs';

const Booking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedTrip, selectedSeats } = useSelector((state) => state.trip);

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if trip and seats are selected
    if (!selectedTrip || !selectedSeats || selectedSeats.length === 0) {
      message.warning('Vui lòng chọn chuyến xe và ghế trước!');
      navigate('/');
    }

    // Pre-fill first passenger with user info
    if (user) {
      setPassengers([{
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
      }]);
    }
  }, []);

  const handlePassengersChange = (newPassengers) => {
    setPassengers(newPassengers);
  };

  const handleCreateBooking = async () => {
    // Validate passengers
    if (passengers.length !== selectedSeats.length) {
      message.error('Vui lòng nhập đầy đủ thông tin hành khách!');
      return;
    }

    // Validate each passenger has required fields
    const hasInvalidPassenger = passengers.some(
      p => !p.fullName || !p.phoneNumber
    );
    if (hasInvalidPassenger) {
      message.error('Vui lòng điền đầy đủ họ tên và số điện thoại!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Map passengers to seats
      const passengersWithSeats = passengers.map((passenger, index) => ({
        ...passenger,
        seatNumber: selectedSeats[index],
      }));

      const bookingData = {
        tripId: selectedTrip._id,
        seatNumbers: selectedSeats,
        passengers: passengersWithSeats,
        contactInfo: {
          fullName: passengers[0].fullName,
          phoneNumber: passengers[0].phoneNumber,
          email: passengers[0].email || user?.email,
        },
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        dispatch(setBookingData(response.data.booking));
        message.success('Đặt vé thành công!');
        navigate(`/payment/${response.data.booking._id}`);
      } else {
        setError(response.message || 'Đặt vé thất bại!');
        message.error(response.message || 'Đặt vé thất bại!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Đã có lỗi xảy ra';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return dayjs(date).format('HH:mm - DD/MM/YYYY');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (!selectedTrip || !selectedSeats || selectedSeats.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <Card className="mb-6 shadow-md">
          <Steps
            current={1}
            items={[
              {
                title: 'Chọn chuyến',
                icon: <CarOutlined />,
              },
              {
                title: 'Thông tin hành khách',
                icon: <UserOutlined />,
              },
              {
                title: 'Thanh toán',
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
        </Card>

        <Row gutter={16}>
          {/* Passenger Form */}
          <Col xs={24} md={16}>
            <PassengerForm
              passengers={passengers}
              onPassengersChange={handlePassengersChange}
              seatCount={selectedSeats.length}
            />

            {error && (
              <Card className="mt-4 border-red-300 bg-red-50">
                <ErrorMessage
                  message="Đặt vé thất bại"
                  description={error}
                  type="error"
                />
              </Card>
            )}
          </Col>

          {/* Booking Summary */}
          <Col xs={24} md={8}>
            <Card
              title="Thông tin đặt vé"
              className="sticky top-24"
            >
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <CarOutlined className="text-blue-600 mr-2 text-lg" />
                  <span className="font-semibold text-lg">
                    {selectedTrip.operator?.companyName}
                  </span>
                </div>
                <Tag color="blue">{selectedTrip.bus?.busType}</Tag>
                <Tag color="green">{selectedTrip.bus?.licensePlate}</Tag>
              </div>

              <Divider />

              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <EnvironmentOutlined className="text-green-600 mr-2 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {selectedTrip.route?.origin?.city}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedTrip.route?.origin?.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
                </div>

                <div className="flex items-start">
                  <EnvironmentOutlined className="text-red-600 mr-2 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {selectedTrip.route?.destination?.city}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedTrip.route?.destination?.address}
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    <ClockCircleOutlined className="mr-1" />
                    Khởi hành:
                  </span>
                  <span className="font-medium">
                    {formatTime(selectedTrip.departureTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ghế đã chọn:</span>
                  <div>
                    {selectedSeats.map(seat => (
                      <Tag key={seat} color="blue">{seat}</Tag>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng:</span>
                  <span className="font-medium">{selectedSeats.length} vé</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá vé:</span>
                  <span className="font-medium">
                    {formatPrice(selectedTrip.baseFare)}
                  </span>
                </div>
              </div>

              <Divider />

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedSeats.length * selectedTrip.baseFare)}
                  </span>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleCreateBooking}
                loading={loading}
                disabled={passengers.length !== selectedSeats.length}
                className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
              >
                Tiếp tục thanh toán
              </Button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Bằng việc tiếp tục, bạn đồng ý với{' '}
                <a href="/terms" className="text-blue-600">Điều khoản sử dụng</a>
                {' '}và{' '}
                <a href="/privacy" className="text-blue-600">Chính sách bảo mật</a>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Booking;
