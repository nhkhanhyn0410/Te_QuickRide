import { useState, useEffect } from 'react';
import {
  Card,
  List,
  Rate,
  Tag,
  Button,
  Empty,
  Avatar,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Divider
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CarOutlined,
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Loading, ErrorMessage } from '../../components/common';
import reviewService from '../../services/reviewService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MyReviews = () => {
  const [editModal, setEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewService.getMyReviews();

      if (response.success) {
        setReviews(response.data.reviews || []);
      } else {
        setError(response.message || 'Không thể tải danh sách đánh giá');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment
    });
    setEditModal(true);
  };

  const handleSaveEdit = async (values) => {
    try {
      const response = await reviewService.updateReview(selectedReview._id, {
        rating: values.rating,
        comment: values.comment
      });

      if (response.success) {
        message.success('Đã cập nhật đánh giá');
        setEditModal(false);
        fetchReviews(); // Refresh the list
      } else {
        message.error(response.message || 'Không thể cập nhật đánh giá');
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Đã có lỗi xảy ra');
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const response = await reviewService.deleteReview(reviewId);

      if (response.success) {
        message.success('Đã xóa đánh giá');
        fetchReviews(); // Refresh the list
      } else {
        message.error(response.message || 'Không thể xóa đánh giá');
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Đã có lỗi xảy ra');
    }
  };

  if (loading) {
    return <Loading tip="Đang tải danh sách đánh giá..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2}>Đánh giá của tôi</Title>
          <Text type="secondary">
            Quản lý các đánh giá bạn đã viết về các chuyến đi
          </Text>
        </div>

        {/* Reviews List */}
        {error ? (
          <ErrorMessage
            message="Không thể tải danh sách đánh giá"
            description={error}
            showRetry
            onRetry={fetchReviews}
          />
        ) : reviews.length === 0 ? (
          <Card>
            <Empty
              description="Bạn chưa có đánh giá nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link to="/customer/bookings">
                <Button type="primary">Xem các chuyến đã đi</Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={reviews}
            renderItem={(review) => (
              <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar
                        size={48}
                        icon={<CarOutlined />}
                        className="bg-blue-600"
                      />
                      <div>
                        <Text strong className="block text-lg">
                          {review.operator}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {review.route}
                        </Text>
                      </div>
                    </div>
                    <Space size="middle" className="text-sm text-gray-600">
                      <span>
                        <CalendarOutlined /> {dayjs(review.departureDate).format('DD/MM/YYYY HH:mm')}
                      </span>
                      <span>
                        Mã: <Text code>{review.bookingCode}</Text>
                      </span>
                    </Space>
                  </div>
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(review)}
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xóa đánh giá này?"
                      description="Bạn sẽ không thể khôi phục đánh giá sau khi xóa."
                      onConfirm={() => handleDelete(review._id)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>

                <Divider className="my-3" />

                {/* Rating & Comment */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Rate disabled value={review.rating} />
                    <Text type="secondary" className="text-sm">
                      {dayjs(review.reviewDate).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </div>
                  <Paragraph className="mb-0 text-gray-800">
                    {review.comment}
                  </Paragraph>
                </div>

                {/* Stats */}
                <div className="mb-3">
                  <Text type="secondary" className="text-sm">
                    {review.helpful} người thấy hữu ích
                  </Text>
                </div>

                {/* Operator Response */}
                {review.response && (
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <Avatar size={32} className="bg-blue-600">
                        {review.response.responder[0]}
                      </Avatar>
                      <div className="flex-1">
                        <Text strong className="block mb-1">
                          Phản hồi từ {review.response.responder}
                        </Text>
                        <Text className="block mb-2">
                          {review.response.text}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {dayjs(review.response.date).format('DD/MM/YYYY HH:mm')}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          />
        )}

        {/* Edit Review Modal */}
        <Modal
          title="Chỉnh sửa đánh giá"
          open={editModal}
          onCancel={() => setEditModal(false)}
          onOk={() => form.submit()}
          width={600}
          okText="Lưu"
          cancelText="Hủy"
        >
          {selectedReview && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveEdit}
            >
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <Text strong className="block mb-1">{selectedReview.operator}</Text>
                <Text type="secondary" className="text-sm">
                  {selectedReview.route} - {dayjs(selectedReview.departureDate).format('DD/MM/YYYY')}
                </Text>
              </div>

              <Form.Item
                name="rating"
                label="Đánh giá của bạn"
                rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}
              >
                <Rate />
              </Form.Item>

              <Form.Item
                name="comment"
                label="Nhận xét"
                rules={[
                  { required: true, message: 'Vui lòng nhập nhận xét' },
                  { min: 10, message: 'Nhận xét phải có ít nhất 10 ký tự' }
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MyReviews;
