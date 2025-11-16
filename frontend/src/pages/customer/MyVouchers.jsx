import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Tabs,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Space,
  Progress,
  Empty,
  Modal,
  Input,
  message,
  Badge
} from 'antd';
import {
  GiftOutlined,
  PercentageOutlined,
  CalendarOutlined,
  CopyOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const MyVouchers = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [addVoucherModal, setAddVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  // Mock user vouchers
  const vouchers = [
    {
      id: 1,
      code: 'TET2024',
      title: 'Khuyến mãi Tết Nguyên Đán 2024',
      description: 'Giảm 20% cho tất cả các tuyến dịp Tết',
      type: 'percentage',
      discount: 20,
      maxDiscount: 100000,
      minOrder: 200000,
      startDate: '2024-02-10',
      endDate: '2024-02-17',
      status: 'available',
      routes: ['all']
    },
    {
      id: 2,
      code: 'DALAT50K',
      title: 'Giảm 50K tuyến Sài Gòn - Đà Lạt',
      description: 'Giảm ngay 50.000đ cho tuyến TP.HCM - Đà Lạt',
      type: 'fixed',
      discount: 50000,
      minOrder: 200000,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'available',
      routes: ['TP.HCM → Đà Lạt']
    },
    {
      id: 3,
      code: 'NEWUSER30',
      title: 'Ưu đãi khách hàng mới',
      description: 'Giảm 30% cho lần đặt vé đầu tiên',
      type: 'percentage',
      discount: 30,
      maxDiscount: 80000,
      minOrder: 150000,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'used',
      usedDate: '2024-01-12',
      routes: ['all']
    },
    {
      id: 4,
      code: 'WEEKEND15',
      title: 'Giảm giá cuối tuần',
      description: 'Giảm 15% cho các chuyến xe cuối tuần',
      type: 'percentage',
      discount: 15,
      maxDiscount: 50000,
      minOrder: 100000,
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      status: 'expired',
      routes: ['all']
    },
    {
      id: 5,
      code: 'MEKONG100K',
      title: 'Khám phá miền Tây - Giảm 100K',
      description: 'Giảm 100.000đ cho các tuyến đi miền Tây',
      type: 'fixed',
      discount: 100000,
      minOrder: 300000,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      status: 'available',
      routes: ['TP.HCM → Cần Thơ', 'TP.HCM → An Giang']
    }
  ];

  const getTypeTag = (type) => {
    if (type === 'percentage') {
      return <Tag color="blue" icon={<PercentageOutlined />}>Giảm %</Tag>;
    }
    return <Tag color="green" icon={<GiftOutlined />}>Giảm tiền</Tag>;
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      available: { color: 'green', text: 'Có thể sử dụng', icon: <CheckCircleOutlined /> },
      used: { color: 'default', text: 'Đã sử dụng', icon: <CheckCircleOutlined /> },
      expired: { color: 'red', text: 'Hết hạn', icon: <ClockCircleOutlined /> }
    };
    const config = statusConfig[status] || statusConfig.available;
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  const getDiscountText = (voucher) => {
    if (voucher.type === 'percentage') {
      return `Giảm ${voucher.discount}%`;
    }
    return `Giảm ${voucher.discount.toLocaleString('vi-VN')}đ`;
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    message.success(`Đã sao chép mã ${code}`);
  };

  const handleAddVoucher = () => {
    if (!voucherCode.trim()) {
      message.error('Vui lòng nhập mã voucher');
      return;
    }

    // TODO: Integrate with API
    console.log('Adding voucher:', voucherCode);
    message.success('Đã thêm voucher thành công!');
    setVoucherCode('');
    setAddVoucherModal(false);
  };

  const filterVouchers = (status) => {
    return vouchers.filter(v => v.status === status);
  };

  const availableVouchers = filterVouchers('available');
  const usedVouchers = filterVouchers('used');
  const expiredVouchers = filterVouchers('expired');

  const renderVoucherCard = (voucher) => (
    <Col xs={24} md={12} key={voucher.id}>
      <Card
        className={`shadow-md ${voucher.status === 'available' ? 'border-2 border-blue-500' : ''}`}
        hoverable={voucher.status === 'available'}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            {getTypeTag(voucher.type)}
            {getStatusTag(voucher.status)}
          </div>
        </div>

        <Text strong className="block text-lg mb-2">
          {voucher.title}
        </Text>

        <Paragraph className="text-gray-600 mb-3" ellipsis={{ rows: 2 }}>
          {voucher.description}
        </Paragraph>

        {/* Discount Badge */}
        <div
          className={`text-white p-3 rounded-lg mb-3 text-center ${
            voucher.status === 'available'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
              : 'bg-gray-400'
          }`}
        >
          <Text className="text-2xl font-bold text-white block">
            {getDiscountText(voucher)}
          </Text>
          {voucher.maxDiscount && voucher.type === 'percentage' && (
            <Text className="text-xs text-white">
              Tối đa {voucher.maxDiscount.toLocaleString('vi-VN')}đ
            </Text>
          )}
        </div>

        {/* Voucher Code */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <Text code className="flex-1 text-lg font-bold">
            {voucher.code}
          </Text>
          {voucher.status === 'available' && (
            <Button
              type="primary"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyCode(voucher.code)}
            >
              Copy
            </Button>
          )}
        </div>

        {/* Conditions */}
        <Space direction="vertical" size="small" className="w-full text-sm">
          <div>
            <Text type="secondary">Đơn tối thiểu: </Text>
            <Text strong>{voucher.minOrder.toLocaleString('vi-VN')}đ</Text>
          </div>

          <div>
            <Text type="secondary">Tuyến áp dụng: </Text>
            <Text strong>
              {voucher.routes[0] === 'all' ? 'Tất cả tuyến' : voucher.routes.join(', ')}
            </Text>
          </div>

          {voucher.status === 'available' && (
            <div className="flex items-center gap-1">
              <CalendarOutlined className="text-gray-400" />
              <Text type="secondary">
                HSD: {dayjs(voucher.endDate).format('DD/MM/YYYY')}
              </Text>
            </div>
          )}

          {voucher.status === 'used' && voucher.usedDate && (
            <div>
              <Text type="secondary">Đã sử dụng: </Text>
              <Text>{dayjs(voucher.usedDate).format('DD/MM/YYYY')}</Text>
            </div>
          )}

          {voucher.status === 'expired' && (
            <div>
              <Text type="danger">
                Đã hết hạn: {dayjs(voucher.endDate).format('DD/MM/YYYY')}
              </Text>
            </div>
          )}
        </Space>

        {voucher.status === 'available' && (
          <Link to="/search">
            <Button type="primary" block className="mt-3">
              Sử dụng ngay
            </Button>
          </Link>
        )}
      </Card>
    </Col>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-2">
              Voucher của tôi
            </Title>
            <Text type="secondary">
              Quản lý và sử dụng voucher giảm giá cho chuyến đi
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setAddVoucherModal(true)}
          >
            Thêm voucher
          </Button>
        </div>

        {/* Quick Stats */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={8}>
            <Card className="text-center">
              <Text type="secondary" className="block mb-1">
                Có thể dùng
              </Text>
              <Text className="text-2xl font-bold text-green-600">
                {availableVouchers.length}
              </Text>
            </Card>
          </Col>
          <Col xs={8}>
            <Card className="text-center">
              <Text type="secondary" className="block mb-1">
                Đã sử dụng
              </Text>
              <Text className="text-2xl font-bold text-blue-600">
                {usedVouchers.length}
              </Text>
            </Card>
          </Col>
          <Col xs={8}>
            <Card className="text-center">
              <Text type="secondary" className="block mb-1">
                Hết hạn
              </Text>
              <Text className="text-2xl font-bold text-red-600">
                {expiredVouchers.length}
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Vouchers Tabs */}
        <Card className="shadow-lg">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            tabBarExtraContent={
              <Link to="/promotions">
                <Button type="link" icon={<GiftOutlined />}>
                  Xem thêm khuyến mãi
                </Button>
              </Link>
            }
          >
            <TabPane
              tab={
                <Badge count={availableVouchers.length} offset={[10, 0]}>
                  <span>Có thể sử dụng</span>
                </Badge>
              }
              key="available"
            >
              {availableVouchers.length === 0 ? (
                <Empty description="Bạn chưa có voucher nào">
                  <Link to="/promotions">
                    <Button type="primary" icon={<GiftOutlined />}>
                      Khám phá voucher
                    </Button>
                  </Link>
                </Empty>
              ) : (
                <Row gutter={[16, 16]}>
                  {availableVouchers.map(renderVoucherCard)}
                </Row>
              )}
            </TabPane>

            <TabPane tab="Đã sử dụng" key="used">
              {usedVouchers.length === 0 ? (
                <Empty description="Chưa có voucher đã sử dụng" />
              ) : (
                <Row gutter={[16, 16]}>
                  {usedVouchers.map(renderVoucherCard)}
                </Row>
              )}
            </TabPane>

            <TabPane tab="Hết hạn" key="expired">
              {expiredVouchers.length === 0 ? (
                <Empty description="Không có voucher hết hạn" />
              ) : (
                <Row gutter={[16, 16]}>
                  {expiredVouchers.map(renderVoucherCard)}
                </Row>
              )}
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Add Voucher Modal */}
      <Modal
        title="Thêm voucher"
        open={addVoucherModal}
        onOk={handleAddVoucher}
        onCancel={() => setAddVoucherModal(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <div className="py-4">
          <Text className="block mb-3">
            Nhập mã voucher để thêm vào danh sách của bạn:
          </Text>
          <Input
            size="large"
            placeholder="Nhập mã voucher (VD: TET2024)"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            maxLength={20}
          />
          <Text type="secondary" className="block mt-2 text-sm">
            Bạn có thể tìm mã voucher tại trang{' '}
            <Link to="/promotions" className="text-blue-600">
              Khuyến mãi
            </Link>
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default MyVouchers;
