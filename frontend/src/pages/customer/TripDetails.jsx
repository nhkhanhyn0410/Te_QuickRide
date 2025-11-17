import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Row, Col, Descriptions, Tag, Divider, message } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  StarFilled,
  PhoneOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { SeatMap } from '../../components/customer';
import { Loading, ErrorMessage } from '../../components/common';
import tripService from '../../services/tripService';
import { setSelectedTrip, setSelectedSeats } from '../../redux/slices/tripSlice';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { selectedSeats } = useSelector((state) => state.trip);

  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [sessionId] = useState(uuidv4());

  useEffect(() => {
    fetchTripDetails();

    // Cleanup: release seats when leaving page
    return () => {
      if (selectedSeats.length > 0) {
        tripService.releaseSeats(tripId, sessionId).catch(() => {});
      }
    };
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tripService.getTripDetails(tripId);

      if (response.success) {
        setTrip(response.data.trip);
        dispatch(setSelectedTrip(response.data.trip));
      } else {
        setError(response.message || 'Không tìm thấy thông tin chuyến xe');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = async (seats) => {
    try {
      // Release old seats if any
      if (selectedSeats.length > 0) {
        await tripService.releaseSeats(tripId, sessionId);
      }

      // Lock new seats
      if (seats.length > 0) {
        const response = await tripService.lockSeats(tripId, seats, sessionId);

        if (response.success) {
          dispatch(setSelectedSeats(seats));
          message.success(`Đã chọn ${seats.length} ghế`);
        } else {
          message.error(response.message || 'Không thể chọn ghế');
        }
      } else {
        dispatch(setSelectedSeats([]));
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Đã có lỗi xảy ra');
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      message.warning('Vui lòng chọn ghế!');
      return;
    }

    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để tiếp tục!');
      navigate('/login', { state: { from: `/trips/${tripId}` } });
      return;
    }

    navigate('/booking');
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

  if (loading) {
    return <Loading tip="Đang tải thông tin chuyến xe..." fullScreen />;
  }

  if (error || !trip) {
    return (
      <ErrorMessage
        message="Không tìm thấy chuyến xe"
        description={error}
        showRetry
        onRetry={fetchTripDetails}
        showHome
        fullScreen
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trip Info Header */}
        <Card className="mb-6 shadow-md">
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <CarOutlined className="text-3xl text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {trip.operator?.companyName || 'Nhà xe'}
                  </h2>
                  <div className="flex items-center">
                    <StarFilled className="text-yellow-400 mr-1" />
                    <span className="text-gray-600">
                      {trip.operator?.rating?.toFixed(1) || '5.0'} ({trip.operator?.totalReviews || 0} đánh giá)
                    </span>
                  </div>
                </div>
              </div>

              <Descriptions column={2} size="small">
                <Descriptions.Item label="Tuyến đường" span={2}>
                  <div className="flex items-center text-lg font-medium">
                    <EnvironmentOutlined className="text-green-600 mr-2" />
                    {trip.route?.origin?.city} → {trip.route?.destination?.city}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Giờ khởi hành">
                  <ClockCircleOutlined className="mr-2" />
                  {formatTime(trip.departureTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ đến dự kiến">
                  <ClockCircleOutlined className="mr-2" />
                  {formatTime(trip.arrivalTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                  {Math.floor(trip.duration / 60)}h {trip.duration % 60}m
                </Descriptions.Item>
                <Descriptions.Item label="Quãng đường">
                  {trip.route?.distance || 0} km
                </Descriptions.Item>
                <Descriptions.Item label="Loại xe">
                  <Tag color="blue">{trip.bus?.busType || 'Giường nằm'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Biển số">
                  <Tag>{trip.bus?.licensePlate}</Tag>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div>
                <h4 className="font-semibold mb-2">Điểm đón:</h4>
                <p className="text-gray-700">{trip.route?.origin?.address}</p>
              </div>

              <div className="mt-3">
                <h4 className="font-semibold mb-2">Điểm trả:</h4>
                <p className="text-gray-700">{trip.route?.destination?.address}</p>
              </div>

              {trip.amenities && trip.amenities.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <h4 className="font-semibold mb-2">Tiện ích:</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.amenities.map((amenity, index) => (
                        <Tag key={index} color="green">
                          {amenity}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {trip.policies && (
                <>
                  <Divider />
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <SafetyOutlined className="mr-2 text-blue-600" />
                      Chính sách:
                    </h4>
                    <ul className="text-gray-700 text-sm list-disc pl-5">
                      <li>Hủy vé miễn phí trước 24 giờ khởi hành</li>
                      <li>Hủy vé trước 12 giờ: hoàn 70% giá vé</li>
                      <li>Hủy vé trước 6 giờ: hoàn 50% giá vé</li>
                      <li>Vui lòng có mặt trước 15 phút</li>
                    </ul>
                  </div>
                </>
              )}
            </Col>

            <Col xs={24} md={8}>
              <Card className="bg-blue-50 border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-gray-600 mb-1">Giá vé</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(trip.basePrice || trip.baseFare || 0)}
                  </div>
                  <div className="text-sm text-gray-600">/ người</div>
                </div>

                <Divider />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Còn lại:</span>
                    <span className="font-semibold text-green-600">
                      {trip.availableSeats} ghế
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã chọn:</span>
                    <span className="font-semibold text-blue-600">
                      {selectedSeats.length} ghế
                    </span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <>
                    <Divider />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-semibold">
                          {formatPrice(selectedSeats.length * (trip.basePrice || trip.baseFare || 0))}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <Divider />

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
                >
                  Tiếp tục
                </Button>

                <div className="mt-4 text-center">
                  <PhoneOutlined className="text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    Hotline: {trip.operator?.phoneNumber || '1900 xxxx'}
                  </span>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Seat Selection */}
        <SeatMap
          trip={trip}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
          maxSeats={5}
        />
      </div>
    </div>
  );
};

export default TripDetails;
