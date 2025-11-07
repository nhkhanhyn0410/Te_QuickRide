import { Card, Tag, Button, Divider } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const BookingCard = ({ booking, showActions = true }) => {
  const navigate = useNavigate();

  const formatTime = (date) => {
    return dayjs(date).format('HH:mm - DD/MM/YYYY');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Chờ thanh toán' },
      confirmed: { color: 'green', text: 'Đã xác nhận' },
      cancelled: { color: 'red', text: 'Đã hủy' },
      completed: { color: 'blue', text: 'Hoàn thành' },
      expired: { color: 'default', text: 'Hết hạn' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPaymentStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Chờ thanh toán', icon: <ClockCircleOutlined /> },
      completed: { color: 'green', text: 'Đã thanh toán', icon: <CheckCircleOutlined /> },
      failed: { color: 'red', text: 'Thanh toán thất bại', icon: <CloseCircleOutlined /> },
      refunded: { color: 'blue', text: 'Đã hoàn tiền', icon: <CheckCircleOutlined /> },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const handleViewDetails = () => {
    navigate(`/bookings/${booking._id}`);
  };

  const handleViewTickets = () => {
    navigate(`/tickets/${booking._id}`);
  };

  const handleCancelBooking = () => {
    navigate(`/bookings/${booking._id}/cancel`);
  };

  const canCancel = booking.bookingStatus === 'confirmed' &&
                    dayjs(booking.trip?.departureTime).isAfter(dayjs().add(24, 'hour'));

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Mã đặt vé: {booking.bookingCode}
          </h3>
          <p className="text-sm text-gray-600">
            Đặt lúc: {formatTime(booking.createdAt)}
          </p>
        </div>
        <div className="text-right">
          {getStatusTag(booking.bookingStatus)}
          {getPaymentStatusTag(booking.paymentStatus)}
        </div>
      </div>

      <Divider className="my-4" />

      {/* Trip Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center mb-2">
            <CarOutlined className="text-blue-600 mr-2" />
            <span className="font-medium">
              {booking.operator?.companyName || 'Nhà xe'}
            </span>
          </div>
          <div className="flex items-start mb-2">
            <EnvironmentOutlined className="text-green-600 mr-2 mt-1" />
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {booking.trip?.route?.origin?.city} → {booking.trip?.route?.destination?.city}
              </div>
              <div className="text-gray-600">
                {formatTime(booking.trip?.departureTime)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <UserOutlined className="text-blue-600 mr-2" />
            <span className="font-medium">
              {booking.passengers?.length || 0} hành khách
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div>Ghế: {booking.seatNumbers?.join(', ')}</div>
            <div className="mt-1">Liên hệ: {booking.contactInfo?.phoneNumber}</div>
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      {/* Price & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-600">Tổng tiền</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(booking.totalAmount)}
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <Button
              onClick={handleViewDetails}
              type="default"
            >
              Chi tiết
            </Button>

            {booking.paymentStatus === 'completed' && booking.bookingStatus === 'confirmed' && (
              <Button
                onClick={handleViewTickets}
                type="primary"
                icon={<QrcodeOutlined />}
                className="bg-green-600 hover:bg-green-700"
              >
                Xem vé
              </Button>
            )}

            {canCancel && (
              <Button
                onClick={handleCancelBooking}
                danger
              >
                Hủy vé
              </Button>
            )}

            {booking.paymentStatus === 'pending' && booking.bookingStatus === 'pending' && (
              <Button
                onClick={() => navigate(`/payment/${booking._id}`)}
                type="primary"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thanh toán
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;
