import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, DatePicker, Button, Card, Row, Col, message, Spin } from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  CalendarOutlined,
  SafetyOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import routeService from '../../services/routeService';
import dayjs from 'dayjs';

const Home = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);

  useEffect(() => {
    fetchPopularRoutes();
  }, []);

  const fetchPopularRoutes = async () => {
    try {
      setRoutesLoading(true);
      const response = await routeService.getPopularRoutes(6);

      if (response.success && response.data.routes) {
        // Map routes to display format
        const formattedRoutes = response.data.routes.map((route, index) => {
          const icons = ['🏖️', '🌲', '🏝️', '⛰️', '🏔️', '🚣'];
          return {
            from: route.origin?.city || route.origin?.address || 'N/A',
            to: route.destination?.city || route.destination?.address || 'N/A',
            icon: icons[index % icons.length],
            tripCount: route.tripCount || 0
          };
        });
        setPopularRoutes(formattedRoutes);
      } else {
        // Fallback to default routes if API fails
        setPopularRoutes([
          { from: 'Hồ Chí Minh', to: 'Vũng Tàu', icon: '🏖️' },
          { from: 'Hồ Chí Minh', to: 'Đà Lạt', icon: '🌲' },
          { from: 'Hồ Chí Minh', to: 'Nha Trang', icon: '🏝️' },
          { from: 'Hà Nội', to: 'Hạ Long', icon: '⛰️' },
          { from: 'Hà Nội', to: 'Sapa', icon: '🏔️' },
          { from: 'Hà Nội', to: 'Ninh Bình', icon: '🚣' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      // Fallback to default routes on error
      setPopularRoutes([
        { from: 'Hồ Chí Minh', to: 'Vũng Tàu', icon: '🏖️' },
        { from: 'Hồ Chí Minh', to: 'Đà Lạt', icon: '🌲' },
        { from: 'Hồ Chí Minh', to: 'Nha Trang', icon: '🏝️' },
        { from: 'Hà Nội', to: 'Hạ Long', icon: '⛰️' },
        { from: 'Hà Nội', to: 'Sapa', icon: '🏔️' },
        { from: 'Hà Nội', to: 'Ninh Bình', icon: '🚣' },
      ]);
    } finally {
      setRoutesLoading(false);
    }
  };

  const handleSearch = (values) => {
    setLoading(true);

    // Format search params
    const params = new URLSearchParams({
      from: values.origin,
      to: values.destination,
      date: values.departureDate.format('YYYY-MM-DD'),
    });

    // Navigate to search results page
    navigate(`/search?${params.toString()}`);
    setLoading(false);
  };

  const handleQuickSearch = (origin, destination) => {
    form.setFieldsValue({
      origin,
      destination,
      departureDate: dayjs(),
    });
  };

  const features = [
    {
      icon: <ThunderboltOutlined className="text-4xl text-blue-600" />,
      title: 'Đặt vé nhanh chóng',
      description: 'Tìm và đặt vé chỉ trong vài phút với giao diện đơn giản, dễ sử dụng',
    },
    {
      icon: <SafetyOutlined className="text-4xl text-green-600" />,
      title: 'An toàn & Tin cậy',
      description: 'Hợp tác với các nhà xe uy tín, đảm bảo chất lượng dịch vụ tốt nhất',
    },
    {
      icon: <CreditCardOutlined className="text-4xl text-purple-600" />,
      title: 'Thanh toán đa dạng',
      description: 'Hỗ trợ nhiều phương thức thanh toán: VNPay, MoMo, ZaloPay, COD',
    },
    {
      icon: <CustomerServiceOutlined className="text-4xl text-red-600" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold mb-4">
              Đặt vé xe khách trực tuyến
            </h1>
            <p className="text-xl text-gray-100">
              Nhanh chóng, tiện lợi và an toàn - Khởi hành ngay hôm nay!
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-2xl max-w-4xl mx-auto">
            <Form
              form={form}
              onFinish={handleSearch}
              layout="vertical"
              initialValues={{
                departureDate: dayjs(),
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Điểm đi"
                    name="origin"
                    rules={[{ required: true, message: 'Vui lòng nhập điểm đi!' }]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="Thành phố xuất phát"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Điểm đến"
                    name="destination"
                    rules={[{ required: true, message: 'Vui lòng nhập điểm đến!' }]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="Thành phố đến"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Ngày đi"
                    name="departureDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày đi!' }]}
                  >
                    <DatePicker
                      prefix={<CalendarOutlined />}
                      placeholder="Chọn ngày"
                      size="large"
                      format="DD/MM/YYYY"
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf('day');
                      }}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  size="large"
                  loading={loading}
                  block
                  className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
                >
                  Tìm chuyến xe
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Tuyến xe phổ biến
        </h2>

        {routesLoading ? (
          <div className="text-center py-12">
            <Spin size="large" tip="Đang tải tuyến xe phổ biến..." />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {popularRoutes.map((route, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  hoverable
                  className="text-center cursor-pointer transition-all duration-300 hover:shadow-lg"
                  onClick={() => handleQuickSearch(route.from, route.to)}
                >
                  <div className="text-4xl mb-3">{route.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {route.from} → {route.to}
                  </h3>
                  <Button type="link" icon={<SearchOutlined />}>
                    Tìm chuyến xe
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Tại sao chọn Te_QuickRide?
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Chúng tôi mang đến trải nghiệm đặt vé tốt nhất cho bạn
          </p>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div className="text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bạn là nhà xe muốn hợp tác?
          </h2>
          <p className="text-xl mb-8">
            Tham gia hệ thống của chúng tôi để tiếp cận hàng triệu khách hàng
          </p>
          <Button
            type="default"
            size="large"
            onClick={() => navigate('/operator/register')}
            className="h-12 px-8 text-lg font-semibold"
          >
            Đăng ký ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
