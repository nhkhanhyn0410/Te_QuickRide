import { Typography, Row, Col, Card, Timeline } from 'antd';
import {
  TeamOutlined,
  TrophyOutlined,
  SafetyOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About = () => {
  const values = [
    {
      icon: <SafetyOutlined className="text-4xl text-blue-600" />,
      title: 'An toàn',
      description: 'Cam kết đảm bảo an toàn tuyệt đối cho mọi hành trình của khách hàng'
    },
    {
      icon: <CustomerServiceOutlined className="text-4xl text-blue-600" />,
      title: 'Tận tâm',
      description: 'Phục vụ khách hàng với thái độ nhiệt tình, chu đáo 24/7'
    },
    {
      icon: <TrophyOutlined className="text-4xl text-blue-600" />,
      title: 'Chất lượng',
      description: 'Không ngừng nâng cao chất lượng dịch vụ và trải nghiệm người dùng'
    },
    {
      icon: <TeamOutlined className="text-4xl text-blue-600" />,
      title: 'Đồng hành',
      description: 'Luôn đồng hành cùng khách hàng trên mọi nẻo đường'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Thành lập',
      description: 'Te_QuickRide chính thức ra mắt với sứ mệnh kết nối hành khách và nhà xe'
    },
    {
      year: '2021',
      title: 'Mở rộng',
      description: 'Phủ sóng 20 tỉnh thành với hơn 100 nhà xe đối tác'
    },
    {
      year: '2022',
      title: 'Phát triển',
      description: 'Ra mắt ứng dụng di động và đạt 1 triệu lượt đặt vé'
    },
    {
      year: '2023',
      title: 'Dẫn đầu',
      description: 'Trở thành nền tảng đặt vé xe khách hàng đầu Việt Nam'
    },
    {
      year: '2024',
      title: 'Đổi mới',
      description: 'Tích hợp AI và công nghệ thông minh vào trải nghiệm khách hàng'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title level={1} className="!text-white !mb-4">
            Về Te_QuickRide
          </Title>
          <Paragraph className="text-xl text-blue-100 max-w-3xl mx-auto">
            Nền tảng đặt vé xe khách trực tuyến hàng đầu Việt Nam, kết nối hàng triệu
            hành khách với hơn 500 nhà xe uy tín trên toàn quốc.
          </Paragraph>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <Title level={3} className="text-blue-600 mb-4">
                Sứ mệnh
              </Title>
              <Paragraph className="text-lg text-gray-700">
                Cung cấp giải pháp đặt vé xe khách trực tuyến tiện lợi, nhanh chóng và
                đáng tin cậy, giúp khách hàng dễ dàng lên kế hoạch cho mọi chuyến đi.
                Chúng tôi cam kết mang đến trải nghiệm đặt vé tốt nhất với công nghệ
                hiện đại và dịch vụ khách hàng xuất sắc.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <Title level={3} className="text-blue-600 mb-4">
                Tầm nhìn
              </Title>
              <Paragraph className="text-lg text-gray-700">
                Trở thành nền tảng đặt vé vận tải hành khách số 1 Việt Nam và khu vực
                Đông Nam Á. Chúng tôi hướng tới một tương lai nơi mọi người có thể dễ dàng
                di chuyển đến bất kỳ đâu họ muốn chỉ với vài thao tác đơn giản trên điện thoại.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Core Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Title level={2} className="text-center mb-12">
            Giá trị cốt lõi
          </Title>
          <Row gutter={[32, 32]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  className="text-center h-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  bordered={false}
                >
                  <div className="mb-4">{value.icon}</div>
                  <Title level={4} className="mb-3">{value.title}</Title>
                  <Paragraph className="text-gray-600">
                    {value.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Title level={2} className="text-center mb-12">
          Hành trình phát triển
        </Title>
        <div className="max-w-4xl mx-auto">
          <Timeline mode="alternate">
            {milestones.map((milestone, index) => (
              <Timeline.Item
                key={index}
                label={<span className="text-lg font-bold text-blue-600">{milestone.year}</span>}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <Title level={4} className="mb-2">{milestone.title}</Title>
                  <Paragraph className="text-gray-600 mb-0">
                    {milestone.description}
                  </Paragraph>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[32, 32]} className="text-center">
            <Col xs={12} md={6}>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl text-blue-100">Nhà xe đối tác</div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-5xl font-bold mb-2">5M+</div>
              <div className="text-xl text-blue-100">Lượt đặt vé</div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-5xl font-bold mb-2">63/63</div>
              <div className="text-xl text-blue-100">Tỉnh thành</div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-5xl font-bold mb-2">4.8★</div>
              <div className="text-xl text-blue-100">Đánh giá TB</div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Title level={2} className="mb-4">
          Bạn cần hỗ trợ?
        </Title>
        <Paragraph className="text-lg text-gray-600 mb-8">
          Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
        </Paragraph>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            Liên hệ với chúng tôi
          </a>
          <a
            href="/help"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            Trung tâm trợ giúp
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
