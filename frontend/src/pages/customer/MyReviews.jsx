import { useState } from 'react';
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

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MyReviews = () => {
  const [editModal, setEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [form] = Form.useForm();

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      bookingCode: 'BK2024011401',
      tripId: 'TRP001',
      route: 'TP.HCM → Đà Lạt',
      operator: 'Phương Trang',
      operatorId: 'OPR001',
      departureDate: '2024-01-10 06:00',
      rating: 5,
      comment: 'Chuyến đi rất tuyệt vời! Xe sạch sẽ, tài xế lái xe an toàn, nhân viên phục vụ nhiệt tình. Sẽ tiếp tục sử dụng dịch vụ.',
      reviewDate: '2024-01-11 14:30',
      helpful: 12,
      response: {
        text: 'Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ. Phương Trang rất vui khi mang đến trải nghiệm tốt cho quý khách!',
        date: '2024-01-11 16:00',
        responder: 'Phương Trang'
      }
    },
    {
      id: 2,
      bookingCode: 'BK2024010502',
      tripId: 'TRP002',
      route: 'TP.HCM → Cần Thơ',
      operator: 'Mai Linh',
      operatorId: 'OPR002',
      departureDate: '2024-01-05 08:30',
      rating: 4,
      comment: 'Nhìn chung khá tốt. Xe đúng giờ, ghế ngồi thoải mái. Tuy nhiên điều hòa hơi lạnh.',
      reviewDate: '2024-01-06 10:15',
      helpful: 5,
      response: null
    },
    {
      id: 3,
      bookingCode: 'BK2023122803',
      tripId: 'TRP003',
      route: 'Hà Nội → Hải Phòng',
      operator: 'Kumho Samco',
      operatorId: 'OPR003',
      departureDate: '2023-12-28 14:00',
      rating: 3,
      comment: 'Xe khởi hành trễ 30 phút so với lịch. Chất lượng dịch vụ bình thường.',
      reviewDate: '2023-12-29 09:00',
      helpful: 8,
      response: {
        text: 'Chúng tôi xin lỗi vì sự chậm trễ này. Đây là trường hợp ngoại lệ do tình trạng giao thông. Chúng tôi sẽ cải thiện trong tương lai.',
        date: '2023-12-29 14:30',
        responder: 'Kumho Samco'
      }
    }
  ];

  const handleEdit = (review) => {
    setSelectedReview(review);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment
    });
    setEditModal(true);
  };

  const handleSaveEdit = async (values) => {
    // TODO: Integrate with API
    console.log('Updating review:', values);
    message.success('Đã cập nhật đánh giá');
    setEditModal(false);
  };

  const handleDelete = async (reviewId) => {
    // TODO: Integrate with API
    console.log('Deleting review:', reviewId);
    message.success('Đã xóa đánh giá');
  };

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
        {reviews.length === 0 ? (
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
                      onConfirm={() => handleDelete(review.id)}
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
