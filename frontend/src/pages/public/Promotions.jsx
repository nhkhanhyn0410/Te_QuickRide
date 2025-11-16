import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Progress,
  Empty,
  Modal,
  message,
  Spin
} from 'antd';
import {
  GiftOutlined,
  PercentageOutlined,
  CalendarOutlined,
  SearchOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  FireOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import voucherService from '../../services/voucherService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Promotions = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [voucherModal, setVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getAvailableVouchers();

      if (response.success && response.data.vouchers) {
        // Map API vouchers to promotion format
        const formattedPromotions = response.data.vouchers.map(voucher => ({
          id: voucher._id,
          code: voucher.code,
          title: voucher.description || voucher.code,
          description: voucher.description || 'Mã giảm giá đặc biệt',
          type: voucher.discountType,
          discount: voucher.discountValue,
          maxDiscount: voucher.maxDiscount,
          minOrder: voucher.minOrderValue,
          startDate: voucher.validFrom,
          endDate: voucher.validTo,
          quantity: voucher.maxUsage,
          used: voucher.usedCount || 0,
          isHot: voucher.isActive && (voucher.usedCount || 0) / voucher.maxUsage > 0.5,
          routes: voucher.applicableRoutes || ['all'],
          operators: voucher.applicableOperators || ['all'],
          image: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=600'
        }));
        setPromotions(formattedPromotions);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      message.error('Không thể tải danh sách khuyến mãi');
      // Set empty array on error instead of showing mock data
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeTag = (type) => {
    if (type === 'percentage') {
      return <Tag color="blue" icon={<PercentageOutlined />}>Giảm %</Tag>;
    }
    return <Tag color="green" icon={<GiftOutlined />}>Giảm tiền</Tag>;
  };

  const getDiscountText = (promo) => {
    if (promo.type === 'percentage') {
      return `Giảm ${promo.discount}%`;
    }
    return `Giảm ${promo.discount.toLocaleString('vi-VN')}đ`;
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    message.success(`Đã sao chép mã ${code}`);
  };

  const handleViewDetail = (promo) => {
    setSelectedVoucher(promo);
    setVoucherModal(true);
  };

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch =
      promo.title.toLowerCase().includes(searchText.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchText.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = selectedType === 'all' || promo.type === selectedType;

    const isValid = dayjs().isBetween(dayjs(promo.startDate), dayjs(promo.endDate), null, '[]');

    return matchesSearch && matchesType && isValid;
  });

  const hotPromotions = filteredPromotions.filter(p => p.isHot);
  const regularPromotions = filteredPromotions.filter(p => !p.isHot);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GiftOutlined className="text-6xl mb-4" />
          <Title level={1} className="!text-white !mb-4">
            Khuyến mãi & Ưu đãi
          </Title>
          <Text className="text-lg text-orange-100">
            Săn voucher giảm giá cực khủng cho chuyến đi của bạn
          </Text>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Card className="shadow-lg mb-6">
          <div className="flex flex-wrap gap-3">
            <Input
              size="large"
              placeholder="Tìm kiếm khuyến mãi..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ flex: 1, minWidth: 250 }}
              allowClear
            />
            <Select
              size="large"
              value={selectedType}
              onChange={setSelectedType}
              style={{ width: 200 }}
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="percentage">Giảm %</Option>
              <Option value="fixed">Giảm tiền</Option>
            </Select>
          </div>
        </Card>
      </div>

      {/* Promotions Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" tip="Đang tải khuyến mãi..." />
          </div>
        ) : (
          <>
            {/* Hot Promotions */}
            {hotPromotions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FireOutlined className="text-2xl text-red-500" />
              <Title level={3} className="!mb-0">
                Ưu đãi HOT
              </Title>
            </div>
            <Row gutter={[16, 16]}>
              {hotPromotions.map((promo) => (
                <Col xs={24} md={12} lg={8} key={promo.id}>
                  <Card
                    hoverable
                    className="h-full shadow-md border-2 border-red-500"
                    cover={
                      <div className="relative h-40 overflow-hidden">
                        <img
                          alt={promo.title}
                          src={promo.image}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Tag color="red" icon={<FireOutlined />} className="text-sm">
                            HOT
                          </Tag>
                        </div>
                      </div>
                    }
                  >
                    <div className="mb-3">
                      {getTypeTag(promo.type)}
                      <Text strong className="block text-lg mt-2 mb-2">
                        {promo.title}
                      </Text>
                      <Paragraph
                        className="text-gray-600 mb-3"
                        ellipsis={{ rows: 2 }}
                      >
                        {promo.description}
                      </Paragraph>
                    </div>

                    {/* Discount Badge */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg mb-3 text-center">
                      <Text className="text-2xl font-bold text-white block">
                        {getDiscountText(promo)}
                      </Text>
                      {promo.maxDiscount && promo.type === 'percentage' && (
                        <Text className="text-xs text-white">
                          Tối đa {promo.maxDiscount.toLocaleString('vi-VN')}đ
                        </Text>
                      )}
                    </div>

                    {/* Voucher Code */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                      <Text code className="flex-1 text-lg font-bold">
                        {promo.code}
                      </Text>
                      <Button
                        type="primary"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopyCode(promo.code)}
                      >
                        Copy
                      </Button>
                    </div>

                    {/* Usage Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <Text type="secondary">Đã dùng: {promo.used}/{promo.quantity}</Text>
                        <Text type="secondary">
                          {((promo.used / promo.quantity) * 100).toFixed(0)}%
                        </Text>
                      </div>
                      <Progress
                        percent={(promo.used / promo.quantity) * 100}
                        showInfo={false}
                        strokeColor="#ff4d4f"
                      />
                    </div>

                    {/* Expiry & Action */}
                    <div className="flex items-center justify-between">
                      <Space size={4}>
                        <CalendarOutlined className="text-gray-400" />
                        <Text type="secondary" className="text-xs">
                          HSD: {dayjs(promo.endDate).format('DD/MM/YYYY')}
                        </Text>
                      </Space>
                      <Button
                        type="link"
                        onClick={() => handleViewDetail(promo)}
                        className="p-0"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Regular Promotions */}
        {regularPromotions.length > 0 && (
          <div>
            <Title level={3} className="mb-4">
              Ưu đãi khác
            </Title>
            <Row gutter={[16, 16]}>
              {regularPromotions.map((promo) => (
                <Col xs={24} md={12} lg={8} key={promo.id}>
                  <Card
                    hoverable
                    className="h-full shadow-md"
                    cover={
                      <div className="h-40 overflow-hidden">
                        <img
                          alt={promo.title}
                          src={promo.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    }
                  >
                    <div className="mb-3">
                      {getTypeTag(promo.type)}
                      <Text strong className="block text-lg mt-2 mb-2">
                        {promo.title}
                      </Text>
                      <Paragraph
                        className="text-gray-600 mb-3"
                        ellipsis={{ rows: 2 }}
                      >
                        {promo.description}
                      </Paragraph>
                    </div>

                    {/* Discount Badge */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg mb-3 text-center">
                      <Text className="text-2xl font-bold text-white block">
                        {getDiscountText(promo)}
                      </Text>
                      {promo.maxDiscount && promo.type === 'percentage' && (
                        <Text className="text-xs text-white">
                          Tối đa {promo.maxDiscount.toLocaleString('vi-VN')}đ
                        </Text>
                      )}
                    </div>

                    {/* Voucher Code */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                      <Text code className="flex-1 text-lg font-bold">
                        {promo.code}
                      </Text>
                      <Button
                        type="primary"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopyCode(promo.code)}
                      >
                        Copy
                      </Button>
                    </div>

                    {/* Usage Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <Text type="secondary">Đã dùng: {promo.used}/{promo.quantity}</Text>
                        <Text type="secondary">
                          {((promo.used / promo.quantity) * 100).toFixed(0)}%
                        </Text>
                      </div>
                      <Progress
                        percent={(promo.used / promo.quantity) * 100}
                        showInfo={false}
                      />
                    </div>

                    {/* Expiry & Action */}
                    <div className="flex items-center justify-between">
                      <Space size={4}>
                        <CalendarOutlined className="text-gray-400" />
                        <Text type="secondary" className="text-xs">
                          HSD: {dayjs(promo.endDate).format('DD/MM/YYYY')}
                        </Text>
                      </Space>
                      <Button
                        type="link"
                        onClick={() => handleViewDetail(promo)}
                        className="p-0"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

            {filteredPromotions.length === 0 && (
              <Card>
                <Empty description="Không có khuyến mãi nào" />
              </Card>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết khuyến mãi"
        open={voucherModal}
        onCancel={() => setVoucherModal(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setVoucherModal(false)}>
            Đóng
          </Button>,
          <Link to="/search" key="book">
            <Button type="primary">
              Đặt vé ngay
            </Button>
          </Link>
        ]}
      >
        {selectedVoucher && (
          <div>
            <img
              src={selectedVoucher.image}
              alt={selectedVoucher.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <Title level={4}>{selectedVoucher.title}</Title>
            <Paragraph>{selectedVoucher.description}</Paragraph>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <Text strong className="block mb-2">Mã voucher:</Text>
              <div className="flex items-center gap-2">
                <Text code className="text-xl font-bold flex-1">
                  {selectedVoucher.code}
                </Text>
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyCode(selectedVoucher.code)}
                >
                  Sao chép
                </Button>
              </div>
            </div>

            <Space direction="vertical" className="w-full" size="middle">
              <div>
                <Text strong>Giảm giá: </Text>
                <Text className="text-lg text-blue-600 font-bold">
                  {getDiscountText(selectedVoucher)}
                </Text>
                {selectedVoucher.maxDiscount && selectedVoucher.type === 'percentage' && (
                  <Text type="secondary" className="block">
                    (Tối đa {selectedVoucher.maxDiscount.toLocaleString('vi-VN')}đ)
                  </Text>
                )}
              </div>

              <div>
                <Text strong>Đơn tối thiểu: </Text>
                <Text>{selectedVoucher.minOrder.toLocaleString('vi-VN')}đ</Text>
              </div>

              <div>
                <Text strong>Thời gian áp dụng: </Text>
                <Text>
                  {dayjs(selectedVoucher.startDate).format('DD/MM/YYYY')} -{' '}
                  {dayjs(selectedVoucher.endDate).format('DD/MM/YYYY')}
                </Text>
              </div>

              <div>
                <Text strong>Tuyến áp dụng: </Text>
                <Text>
                  {selectedVoucher.routes[0] === 'all' ? 'Tất cả tuyến' : selectedVoucher.routes.join(', ')}
                </Text>
              </div>

              <div>
                <Text strong>Số lượng còn lại: </Text>
                <Text className="text-orange-600 font-semibold">
                  {selectedVoucher.quantity - selectedVoucher.used} voucher
                </Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Promotions;
