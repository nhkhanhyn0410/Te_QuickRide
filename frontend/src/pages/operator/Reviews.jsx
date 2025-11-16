import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reviewService from '../../services/reviewService';
import {
  Card,
  List,
  Rate,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Modal,
  Form,
  message,
  Avatar,
  Divider,
  Empty,
  Row,
  Col,
  Statistic,
  Progress
} from 'antd';
import {
  StarOutlined,
  UserOutlined,
  MessageOutlined,
  FilterOutlined,
  SearchOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Reviews = () => {
  const { user } = useSelector(state => state.auth);
  const [responseModal, setResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0,
    responded: 0,
    pending: 0
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getOperatorReviews(user?.operatorId || user?._id);
      const reviewsData = response.data || [];
      setReviews(reviewsData);

      // Calculate statistics
      const totalReviews = reviewsData.length;
      const avgRating = totalReviews > 0
        ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

      const newStats = {
        totalReviews,
        avgRating,
        fiveStars: reviewsData.filter(r => r.rating === 5).length,
        fourStars: reviewsData.filter(r => r.rating === 4).length,
        threeStars: reviewsData.filter(r => r.rating === 3).length,
        twoStars: reviewsData.filter(r => r.rating === 2).length,
        oneStar: reviewsData.filter(r => r.rating === 1).length,
        responded: reviewsData.filter(r => r.hasResponse || r.response).length,
        pending: reviewsData.filter(r => !r.hasResponse && !r.response).length
      };
      setStats(newStats);
    } catch (error) {
      message.error('Không thể tải danh sách đánh giá');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Backup mock data for development
  const mockReviews = [
    {
      id: 1,
      bookingCode: 'BK2024011401',
      customerName: 'Nguyễn Văn An',
      customerAvatar: null,
      route: 'TP.HCM → Đà Lạt',
      tripDate: '2024-01-10 06:00',
      rating: 5,
      comment: 'Chuyến đi rất tuyệt vời! Xe sạch sẽ, tài xế lái xe an toàn, nhân viên phục vụ nhiệt tình. Sẽ tiếp tục sử dụng dịch vụ.',
      reviewDate: '2024-01-11 14:30',
      helpful: 12,
      hasResponse: true,
      response: {
        text: 'Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ. Phương Trang rất vui khi mang đến trải nghiệm tốt cho quý khách!',
        date: '2024-01-11 16:00'
      }
    },
    {
      id: 2,
      bookingCode: 'BK2024011502',
      customerName: 'Trần Thị Bình',
      customerAvatar: null,
      route: 'TP.HCM → Cần Thơ',
      tripDate: '2024-01-12 08:30',
      rating: 4,
      comment: 'Nhìn chung khá tốt. Xe đúng giờ, ghế ngồi thoải mái. Tuy nhiên điều hòa hơi lạnh, nên có thêm chăn.',
      reviewDate: '2024-01-13 10:15',
      helpful: 5,
      hasResponse: false
    },
    {
      id: 3,
      bookingCode: 'BK2024011503',
      customerName: 'Lê Hoàng Cường',
      customerAvatar: null,
      route: 'TP.HCM → Đà Lạt',
      tripDate: '2024-01-14 14:00',
      rating: 5,
      comment: 'Dịch vụ tuyệt vời, xe limousine rất sang trọng và thoải mái. Tài xế lái xe rất ổn, có wifi và nước uống miễn phí.',
      reviewDate: '2024-01-15 09:00',
      helpful: 8,
      hasResponse: true,
      response: {
        text: 'Cảm ơn anh đã đánh giá cao dịch vụ của chúng tôi. Chúng tôi luôn cố gắng mang đến trải nghiệm tốt nhất!',
        date: '2024-01-15 11:30'
      }
    },
    {
      id: 4,
      bookingCode: 'BK2024011504',
      customerName: 'Phạm Thu Dung',
      customerAvatar: null,
      route: 'TP.HCM → Vũng Tàu',
      tripDate: '2024-01-15 07:00',
      rating: 3,
      comment: 'Xe khởi hành trễ 20 phút. Chất lượng xe bình thường, cần bảo dưỡng kỹ hơn.',
      reviewDate: '2024-01-15 18:00',
      helpful: 3,
      hasResponse: false
    },
    {
      id: 5,
      bookingCode: 'BK2024011505',
      customerName: 'Võ Minh Tuấn',
      customerAvatar: null,
      route: 'TP.HCM → Nha Trang',
      tripDate: '2024-01-16 20:00',
      rating: 5,
      comment: 'Chuyến đi đêm rất tốt, ghế nằm thoải mái, có thể ngủ ngon. Tài xế lái xe êm ái.',
      reviewDate: '2024-01-17 08:30',
      helpful: 15,
      hasResponse: false
    },
    {
      id: 6,
      bookingCode: 'BK2024011506',
      customerName: 'Đặng Thị Em',
      customerAvatar: null,
      route: 'TP.HCM → Cần Thơ',
      tripDate: '2024-01-17 10:00',
      rating: 2,
      comment: 'Xe không sạch lắm, ghế có vết bẩn. Tài xế hơi nói to điện thoại trong khi lái xe, khá khó chịu.',
      reviewDate: '2024-01-17 16:45',
      helpful: 7,
      hasResponse: false
    }
  ];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'green';
    if (rating >= 3.5) return 'blue';
    if (rating >= 2.5) return 'orange';
    return 'red';
  };

  const handleRespond = (review) => {
    setSelectedReview(review);
    if (review.hasResponse) {
      form.setFieldsValue({ response: review.response.text });
    } else {
      form.resetFields();
    }
    setResponseModal(true);
  };

  const handleSubmitResponse = async (values) => {
    setLoading(true);
    try {
      await reviewService.respondToReview(selectedReview._id || selectedReview.id, values.response);
      message.success('Đã gửi phản hồi thành công');
      setResponseModal(false);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể gửi phản hồi');
      console.error('Error submitting response:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      review.route.toLowerCase().includes(searchText.toLowerCase()) ||
      review.bookingCode.toLowerCase().includes(searchText.toLowerCase());

    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'responded' && review.hasResponse) ||
      (filterStatus === 'pending' && !review.hasResponse);

    return matchesSearch && matchesRating && matchesStatus;
  });

  const ratingPercentages = [
    { stars: 5, count: stats.fiveStars, percentage: (stats.fiveStars / stats.totalReviews) * 100 },
    { stars: 4, count: stats.fourStars, percentage: (stats.fourStars / stats.totalReviews) * 100 },
    { stars: 3, count: stats.threeStars, percentage: (stats.threeStars / stats.totalReviews) * 100 },
    { stars: 2, count: stats.twoStars, percentage: (stats.twoStars / stats.totalReviews) * 100 },
    { stars: 1, count: stats.oneStar, percentage: (stats.oneStar / stats.totalReviews) * 100 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>Đánh giá từ khách hàng</Title>
          <Text type="secondary">
            Xem và phản hồi đánh giá từ khách hàng về dịch vụ của bạn
          </Text>
        </div>

        <Row gutter={[16, 16]} className="mb-6">
          {/* Statistics Overview */}
          <Col xs={24} lg={8}>
            <Card className="shadow-md h-full">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {stats.avgRating.toFixed(1)}
                </div>
                <Rate disabled value={stats.avgRating} allowHalf />
                <div className="mt-2">
                  <Text type="secondary">
                    Dựa trên {stats.totalReviews} đánh giá
                  </Text>
                </div>
              </div>

              <Divider />

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {ratingPercentages.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <Rate disabled value={item.stars} style={{ fontSize: 14 }} />
                    <Progress
                      percent={item.percentage}
                      size="small"
                      strokeColor={getRatingColor(item.stars)}
                      showInfo={false}
                      className="flex-1"
                    />
                    <Text className="w-12 text-right text-xs">
                      {item.count}
                    </Text>
                  </div>
                ))}
              </div>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Đã phản hồi"
                    value={stats.responded}
                    valueStyle={{ color: '#52c41a', fontSize: 20 }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Chờ phản hồi"
                    value={stats.pending}
                    valueStyle={{ color: '#faad14', fontSize: 20 }}
                    prefix={<MessageOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Reviews List */}
          <Col xs={24} lg={16}>
            {/* Filters */}
            <Card className="mb-4">
              <div className="flex flex-wrap gap-3">
                <Input
                  placeholder="Tìm theo tên khách, tuyến, mã booking..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />
                <Select
                  value={filterRating}
                  onChange={setFilterRating}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả đánh giá</Option>
                  <Option value="5">5 sao</Option>
                  <Option value="4">4 sao</Option>
                  <Option value="3">3 sao</Option>
                  <Option value="2">2 sao</Option>
                  <Option value="1">1 sao</Option>
                </Select>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="responded">Đã phản hồi</Option>
                  <Option value="pending">Chờ phản hồi</Option>
                </Select>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="shadow-md">
              {filteredReviews.length === 0 ? (
                <Empty description="Không có đánh giá nào" />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={filteredReviews}
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false
                  }}
                  renderItem={(review) => (
                    <List.Item
                      key={review.id}
                      className="border-b last:border-b-0"
                    >
                      {/* Customer Info */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            size={48}
                            icon={<UserOutlined />}
                            src={review.customerAvatar}
                          />
                          <div>
                            <Text strong className="block">
                              {review.customerName}
                            </Text>
                            <Text type="secondary" className="text-sm">
                              {review.route}
                            </Text>
                          </div>
                        </div>
                        <div className="text-right">
                          {review.hasResponse ? (
                            <Tag color="green" icon={<CheckCircleOutlined />}>
                              Đã phản hồi
                            </Tag>
                          ) : (
                            <Tag color="orange">Chưa phản hồi</Tag>
                          )}
                          <div className="mt-1">
                            <Text type="secondary" className="text-xs">
                              {dayjs(review.reviewDate).format('DD/MM/YYYY HH:mm')}
                            </Text>
                          </div>
                        </div>
                      </div>

                      {/* Rating & Comment */}
                      <div className="mb-3">
                        <Rate disabled value={review.rating} className="mb-2" />
                        <Paragraph className="mb-0">
                          {review.comment}
                        </Paragraph>
                      </div>

                      {/* Trip Info */}
                      <div className="mb-3">
                        <Space size="middle" className="text-sm text-gray-600">
                          <span>
                            Mã: <Text code>{review.bookingCode}</Text>
                          </span>
                          <span>
                            Ngày đi: {dayjs(review.tripDate).format('DD/MM/YYYY')}
                          </span>
                          <span>
                            {review.helpful} người thấy hữu ích
                          </span>
                        </Space>
                      </div>

                      {/* Response */}
                      {review.hasResponse && review.response && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <Text strong className="block mb-1">
                            Phản hồi của bạn:
                          </Text>
                          <Text className="block mb-1">
                            {review.response.text}
                          </Text>
                          <Text type="secondary" className="text-xs">
                            {dayjs(review.response.date).format('DD/MM/YYYY HH:mm')}
                          </Text>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        type={review.hasResponse ? 'default' : 'primary'}
                        icon={<MessageOutlined />}
                        onClick={() => handleRespond(review)}
                      >
                        {review.hasResponse ? 'Chỉnh sửa phản hồi' : 'Phản hồi'}
                      </Button>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Response Modal */}
        <Modal
          title={selectedReview?.hasResponse ? 'Chỉnh sửa phản hồi' : 'Phản hồi đánh giá'}
          open={responseModal}
          onCancel={() => setResponseModal(false)}
          onOk={() => form.submit()}
          confirmLoading={loading}
          width={600}
          okText="Gửi phản hồi"
          cancelText="Hủy"
        >
          {selectedReview && (
            <div>
              {/* Review Preview */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <Text strong>{selectedReview.customerName}</Text>
                    <div>
                      <Rate disabled value={selectedReview.rating} style={{ fontSize: 14 }} />
                    </div>
                  </div>
                </div>
                <Text className="text-sm">{selectedReview.comment}</Text>
              </div>

              {/* Response Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitResponse}
              >
                <Form.Item
                  name="response"
                  label="Phản hồi của bạn"
                  rules={[
                    { required: true, message: 'Vui lòng nhập phản hồi' },
                    { min: 10, message: 'Phản hồi phải có ít nhất 10 ký tự' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Cảm ơn quý khách đã đánh giá dịch vụ của chúng tôi..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Form>

              <Text type="secondary" className="text-xs block">
                Lưu ý: Phản hồi của bạn sẽ được hiển thị công khai cho tất cả mọi người.
              </Text>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Reviews;
