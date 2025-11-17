import { Card, Button, Tag, Divider } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  StarFilled,
  DollarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  const formatTime = (date) => {
    return dayjs(date).format('HH:mm');
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleSelectTrip = () => {
    navigate(`/trips/${trip.id || trip._id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-300 mb-4"
      bodyStyle={{ padding: '20px' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Operator Info */}
        <div className="md:col-span-3">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <CarOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {trip.operator?.companyName || 'Nhà xe'}
              </h3>
              <div className="flex items-center text-sm">
                <StarFilled className="text-yellow-400 mr-1" />
                <span className="text-gray-600">
                  {trip.operator?.rating?.toFixed(1) || '5.0'} ({trip.operator?.totalReviews || 0})
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <Tag color="blue">{trip.bus?.busType || 'Giường nằm'}</Tag>
            <Tag color="green">{trip.bus?.totalSeats || 40} chỗ</Tag>
          </div>
        </div>

        {/* Time & Route */}
        <div className="md:col-span-5">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(trip.departureTime)}
              </div>
              <div className="text-sm text-gray-600">
                {trip.route?.origin?.city || 'Điểm đi'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(trip.departureTime)}
              </div>
            </div>

            <div className="flex-1 mx-4">
              <div className="relative">
                <div className="h-0.5 bg-gray-300 w-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <ClockCircleOutlined className="text-blue-600" />
                  <span className="text-xs text-gray-600 ml-1">
                    {Math.floor(trip.duration / 60)}h {trip.duration % 60}m
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {trip.route?.distance || 0} km
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(trip.arrivalTime)}
              </div>
              <div className="text-sm text-gray-600">
                {trip.route?.destination?.city || 'Điểm đến'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(trip.arrivalTime)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
            <EnvironmentOutlined className="mr-1" />
            <span>{trip.route?.origin?.address || 'Bến xe xuất phát'}</span>
            <span className="mx-2">→</span>
            <span>{trip.route?.destination?.address || 'Bến xe đến'}</span>
          </div>
        </div>

        {/* Price & Availability */}
        <div className="md:col-span-2 text-center">
          <div className="mb-2">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(trip.basePrice || trip.baseFare || 0)}
            </div>
            <div className="text-xs text-gray-500">/ người</div>
          </div>
          <div className="text-sm">
            <UserOutlined className="text-green-600 mr-1" />
            <span className="text-green-600 font-medium">
              Còn {trip.availableSeats} chỗ
            </span>
          </div>
          {trip.amenities && trip.amenities.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1 justify-center">
                {trip.amenities.slice(0, 3).map((amenity, index) => (
                  <Tag key={index} className="text-xs">
                    {amenity}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="md:col-span-2 text-center">
          <Button
            type="primary"
            size="large"
            onClick={handleSelectTrip}
            disabled={trip.availableSeats === 0 || trip.status !== 'scheduled'}
            block
            className="bg-blue-600 hover:bg-blue-700"
          >
            {trip.availableSeats === 0 ? 'Hết chỗ' : 'Chọn chuyến'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;
