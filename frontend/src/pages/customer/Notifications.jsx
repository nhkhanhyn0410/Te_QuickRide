import { useState } from 'react';
import {
  Card,
  List,
  Typography,
  Tag,
  Button,
  Space,
  Tabs,
  Empty,
  Badge,
  Dropdown,
  message
} from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  MoreOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'Đặt vé thành công',
      message: 'Bạn đã đặt vé thành công cho chuyến TP.HCM → Đà Lạt ngày 20/02/2024. Mã booking: BK20240115',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      action: {
        label: 'Xem vé',
        link: '/my-bookings'
      }
    },
    {
      id: 2,
      type: 'payment',
      title: 'Thanh toán thành công',
      message: 'Thanh toán 450,000đ cho booking BK20240115 đã được xác nhận. Vé điện tử đã được gửi đến email của bạn.',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      action: {
        label: 'Tải vé',
        link: '/customer/tickets'
      }
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Nhắc nhở chuyến đi',
      message: 'Chuyến đi của bạn sẽ khởi hành vào lúc 08:00 ngày mai (20/02/2024). Vui lòng có mặt tại điểm đón trước 15 phút.',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      action: {
        label: 'Xem chi tiết',
        link: '/my-bookings'
      }
    },
    {
      id: 4,
      type: 'promotion',
      title: 'Ưu đãi đặc biệt dành cho bạn!',
      message: 'Giảm 20% cho chuyến đi tiếp theo. Mã giảm giá: QUICKRIDE20. Có hiệu lực đến 28/02/2024.',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      action: {
        label: 'Đặt vé ngay',
        link: '/'
      }
    },
    {
      id: 5,
      type: 'points',
      title: 'Bạn đã nhận được 50 điểm thưởng',
      message: 'Chúc mừng! Bạn đã nhận 50 điểm từ chuyến đi gần nhất. Tổng điểm hiện tại: 1,250 điểm.',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      action: {
        label: 'Xem điểm',
        link: '/customer/profile'
      }
    },
    {
      id: 6,
      type: 'system',
      title: 'Cập nhật điều khoản sử dụng',
      message: 'Chúng tôi đã cập nhật điều khoản sử dụng và chính sách bảo mật. Vui lòng xem lại để biết thêm chi tiết.',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      action: {
        label: 'Xem chi tiết',
        link: '/terms'
      }
    }
  ]);

  const getNotificationIcon = (type) => {
    const icons = {
      booking: <CheckCircleOutlined className="text-green-600 text-xl" />,
      payment: <CheckCircleOutlined className="text-blue-600 text-xl" />,
      reminder: <WarningOutlined className="text-orange-600 text-xl" />,
      promotion: <GiftOutlined className="text-purple-600 text-xl" />,
      points: <GiftOutlined className="text-yellow-600 text-xl" />,
      system: <InfoCircleOutlined className="text-gray-600 text-xl" />
    };
    return icons[type] || <BellOutlined className="text-gray-600 text-xl" />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      booking: '#52c41a',
      payment: '#1890ff',
      reminder: '#fa8c16',
      promotion: '#722ed1',
      points: '#faad14',
      system: '#8c8c8c'
    };
    return colors[type] || '#d9d9d9';
  };

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
    message.success('Đã đánh dấu là đã đọc');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, isRead: true }))
    );
    message.success('Đã đánh dấu tất cả là đã đọc');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    message.success('Đã xóa thông báo');
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    message.success('Đã xóa tất cả thông báo');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filterNotifications = (filter) => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filter);
  };

  const menuItems = (notification) => [
    {
      key: 'read',
      label: 'Đánh dấu đã đọc',
      icon: <CheckOutlined />,
      onClick: () => handleMarkAsRead(notification.id),
      disabled: notification.isRead
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      onClick: () => handleDelete(notification.id),
      danger: true
    }
  ];

  const NotificationItem = ({ notification }) => (
    <List.Item
      className={`${
        !notification.isRead ? 'bg-blue-50' : 'bg-white'
      } hover:bg-gray-50 transition-colors px-4`}
      extra={
        <Dropdown menu={{ items: menuItems(notification) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      }
    >
      <List.Item.Meta
        avatar={
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${getNotificationColor(notification.type)}20` }}
          >
            {getNotificationIcon(notification.type)}
          </div>
        }
        title={
          <div className="flex items-start justify-between">
            <Text strong className={!notification.isRead ? 'text-blue-600' : ''}>
              {notification.title}
            </Text>
            {!notification.isRead && (
              <Badge status="processing" className="ml-2" />
            )}
          </div>
        }
        description={
          <div>
            <Paragraph className="mb-2">{notification.message}</Paragraph>
            <Space>
              <Text type="secondary" className="text-xs">
                {dayjs(notification.createdAt).fromNow()}
              </Text>
              {notification.action && (
                <Button
                  type="link"
                  size="small"
                  className="px-0"
                  href={notification.action.link}
                >
                  {notification.action.label} →
                </Button>
              )}
            </Space>
          </div>
        }
      />
    </List.Item>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <Title level={2} className="!mb-2">
                <BellOutlined className="mr-3" />
                Thông báo
              </Title>
              {unreadCount > 0 && (
                <Text type="secondary">
                  Bạn có <Text strong className="text-blue-600">{unreadCount}</Text> thông báo chưa đọc
                </Text>
              )}
            </div>
            {notifications.length > 0 && (
              <Space>
                <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  Đánh dấu tất cả đã đọc
                </Button>
                <Button danger onClick={handleDeleteAll}>
                  Xóa tất cả
                </Button>
              </Space>
            )}
          </div>
        </div>

        {/* Notifications */}
        <Card className="shadow-md">
          <Tabs defaultActiveKey="all" size="large">
            <TabPane
              tab={
                <span>
                  Tất cả
                  {notifications.length > 0 && (
                    <Badge count={notifications.length} showZero className="ml-2" />
                  )}
                </span>
              }
              key="all"
            >
              {filterNotifications('all').length === 0 ? (
                <Empty
                  description="Không có thông báo nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  dataSource={filterNotifications('all')}
                  renderItem={(notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  )}
                  split
                />
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  Chưa đọc
                  {unreadCount > 0 && (
                    <Badge count={unreadCount} className="ml-2" />
                  )}
                </span>
              }
              key="unread"
            >
              {filterNotifications('unread').length === 0 ? (
                <Empty
                  description="Không có thông báo chưa đọc"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  dataSource={filterNotifications('unread')}
                  renderItem={(notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  )}
                  split
                />
              )}
            </TabPane>

            <TabPane tab="Đặt vé" key="booking">
              {filterNotifications('booking').length === 0 ? (
                <Empty
                  description="Không có thông báo đặt vé"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  dataSource={filterNotifications('booking')}
                  renderItem={(notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  )}
                  split
                />
              )}
            </TabPane>

            <TabPane tab="Khuyến mãi" key="promotion">
              {filterNotifications('promotion').length === 0 ? (
                <Empty
                  description="Không có thông báo khuyến mãi"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  dataSource={filterNotifications('promotion')}
                  renderItem={(notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  )}
                  split
                />
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* Settings Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <Title level={5} className="mb-3">Cài đặt thông báo</Title>
          <Paragraph className="mb-0">
            Bạn có thể tùy chỉnh loại thông báo nhận được trong{' '}
            <a href="/customer/profile" className="text-blue-600 hover:text-blue-800">
              Cài đặt tài khoản
            </a>
          </Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
