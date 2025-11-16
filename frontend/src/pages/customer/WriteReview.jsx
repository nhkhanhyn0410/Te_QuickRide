import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Rate,
  Input,
  Button,
  Typography,
  message,
  Divider,
  Space,
  Avatar,
  Tag,
  Alert
} from 'antd';
import {
  CarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  StarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const WriteReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  // Mock booking data - would be fetched from API
  const booking = {
    id: bookingId,
    bookingCode: 'BK2024011501',
    operator: 'Phương Trang',
    operatorId: 'OPR001',
    route: 'TP.HCM → Đà Lạt',
    departureDate: '2024-01-15 06:00',
    arrivalDate: '2024-01-15 13:00',
    busType: 'Giường nằm',
    busPlate: '51B-12345',
    pickupPoint: 'Bến xe Miền Đông',
    dropoffPoint: 'Bến xe Đà Lạt',
    seats: ['A1', 'A2'],
    totalAmount: 540000,
    status: 'completed',
    hasReview: false
  };

  const ratingDescriptions = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Xuất sắc'
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    console.log('Review data:', {
      bookingId: booking.id,
      operatorId: booking.operatorId,
      rating: values.rating,
      comment: values.comment
    });

    setTimeout(() => {
      setLoading(false);
      message.success('Đánh giá của bạn đã được gửi thành công!');
      navigate('/customer/reviews');
    }, 1000);
  };

  if (booking.hasReview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert
            message="Đã đánh giá"
            description="Bạn đã đánh giá chuyến đi này rồi."
            type="info"
            showIcon
            action={
              <Button onClick={() => navigate('/customer/reviews')}>
                Xem đánh giá
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (booking.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert
            message="Chuyến đi chưa hoàn thành"
            description="Bạn chỉ có thể đánh giá sau khi chuyến đi hoàn thành."
            type="warning"
            showIcon
            action={
              <Button onClick={() => navigate('/customer/bookings')}>
                Quay lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <StarOutlined className="text-5xl text-yellow-500 mb-3" />
          <Title level={2} className="!mb-2">Đánh giá chuyến đi</Title>
          <Text type="secondary">
            Chia sẻ trải nghiệm của bạn để giúp người khác có lựa chọn tốt hơn
          </Text>
        </div>

        {/* Booking Info Card */}
        <Card className="mb-6 shadow-md">
          <div className="flex items-start gap-4">
            <Avatar
              size={64}
              icon={<CarOutlined />}
              className="bg-blue-600"
            />
            <div className="flex-1">
              <Text strong className="block text-lg mb-1">
                {booking.operator}
              </Text>
              <Text className="block text-base mb-2">
                {booking.route}
              </Text>
              <Space direction="vertical" size="small" className="text-sm text-gray-600">
                <div>
                  <CalendarOutlined /> Khởi hành: {dayjs(booking.departureDate).format('DD/MM/YYYY HH:mm')}
                </div>
                <div>
                  <EnvironmentOutlined /> {booking.pickupPoint} → {booking.dropoffPoint}
                </div>
                <div>
                  <CarOutlined /> {booking.busType} - {booking.busPlate}
                </div>
                <div>
                  Ghế: {booking.seats.map(seat => (
                    <Tag key={seat} color="blue" className="ml-1">{seat}</Tag>
                  ))}
                </div>
              </Space>
            </div>
          </div>
        </Card>

        {/* Review Form */}
        <Card className="shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="rating"
              label={
                <Text strong className="text-base">
                  Đánh giá tổng thể của bạn
                </Text>
              }
              rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá' }]}
            >
              <div className="text-center py-4">
                <Rate
                  style={{ fontSize: 48 }}
                  onChange={setRating}
                />
                {rating > 0 && (
                  <div className="mt-3">
                    <Text className="text-xl text-gray-600">
                      {ratingDescriptions[rating]}
                    </Text>
                  </div>
                )}
              </div>
            </Form.Item>

            <Divider />

            <Form.Item
              name="comment"
              label={
                <Text strong className="text-base">
                  Chia sẻ trải nghiệm của bạn
                </Text>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập nhận xét' },
                { min: 10, message: 'Nhận xét phải có ít nhất 10 ký tự' }
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Hãy chia sẻ chi tiết về trải nghiệm của bạn: chất lượng xe, thái độ phục vụ, tài xế lái xe, độ đúng giờ..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Alert
              message="Lưu ý"
              description="Đánh giá của bạn sẽ được công khai và giúp các khách hàng khác có thêm thông tin khi lựa chọn dịch vụ. Vui lòng đánh giá trung thực và khách quan."
              type="info"
              showIcon
              className="mb-6"
            />

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button
                  size="large"
                  onClick={() => navigate('/customer/bookings')}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<StarOutlined />}
                >
                  Gửi đánh giá
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Rating Guide */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <Title level={5} className="!mb-3">Hướng dẫn đánh giá</Title>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Rate disabled value={5} style={{ fontSize: 14 }} />
              <Text>Xuất sắc - Vượt mong đợi</Text>
            </div>
            <div className="flex items-center gap-2">
              <Rate disabled value={4} style={{ fontSize: 14 }} />
              <Text>Tốt - Hài lòng với dịch vụ</Text>
            </div>
            <div className="flex items-center gap-2">
              <Rate disabled value={3} style={{ fontSize: 14 }} />
              <Text>Bình thường - Đáp ứng được mong đợi cơ bản</Text>
            </div>
            <div className="flex items-center gap-2">
              <Rate disabled value={2} style={{ fontSize: 14 }} />
              <Text>Tệ - Dưới mong đợi</Text>
            </div>
            <div className="flex items-center gap-2">
              <Rate disabled value={1} style={{ fontSize: 14 }} />
              <Text>Rất tệ - Cần cải thiện nhiều</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WriteReview;
