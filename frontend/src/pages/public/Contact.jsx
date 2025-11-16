import { useState } from 'react';
import {
  Typography,
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  message
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookFilled,
  TwitterCircleFilled,
  InstagramFilled,
  YoutubeFilled
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <PhoneOutlined className="text-2xl text-blue-600" />,
      title: 'Hotline',
      content: '1900 1234',
      subContent: '(8:00 - 22:00, tất cả các ngày)'
    },
    {
      icon: <MailOutlined className="text-2xl text-blue-600" />,
      title: 'Email',
      content: 'support@tequickride.com',
      subContent: 'Phản hồi trong vòng 24h'
    },
    {
      icon: <EnvironmentOutlined className="text-2xl text-blue-600" />,
      title: 'Văn phòng chính',
      content: '123 Nguyễn Huệ, Q.1, TP.HCM',
      subContent: 'Tầng 10, Tòa nhà ABC'
    },
    {
      icon: <ClockCircleOutlined className="text-2xl text-blue-600" />,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6: 8:00 - 18:00',
      subContent: 'Thứ 7: 8:00 - 12:00'
    }
  ];

  const offices = [
    {
      city: 'Hà Nội',
      address: '456 Láng Hạ, Đống Đa',
      phone: '024 1234 5678'
    },
    {
      city: 'Đà Nẵng',
      address: '789 Lê Duẩn, Hải Châu',
      phone: '023 6789 0123'
    },
    {
      city: 'Cần Thơ',
      address: '321 Nguyễn Văn Cừ, Ninh Kiều',
      phone: '029 2345 6789'
    }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      console.log('Form values:', values);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title level={1} className="!text-white !mb-4">
            Liên hệ với chúng tôi
          </Title>
          <Paragraph className="text-xl text-blue-100">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </Paragraph>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Row gutter={[24, 24]}>
          {contactInfo.map((info, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                className="text-center h-full shadow-lg hover:shadow-xl transition-shadow bg-white"
                bordered={false}
              >
                <div className="mb-3">{info.icon}</div>
                <Title level={5} className="mb-2">{info.title}</Title>
                <Text strong className="block mb-1">{info.content}</Text>
                <Text type="secondary" className="text-sm">{info.subContent}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Row gutter={[48, 48]}>
          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card className="shadow-lg">
              <Title level={3} className="mb-6">
                Gửi tin nhắn cho chúng tôi
              </Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="fullName"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ tên' }
                      ]}
                    >
                      <Input size="large" placeholder="Nguyễn Văn A" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input size="large" placeholder="example@email.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                    >
                      <Input size="large" placeholder="0912345678" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="subject"
                      label="Chủ đề"
                      rules={[
                        { required: true, message: 'Vui lòng nhập chủ đề' }
                      ]}
                    >
                      <Input size="large" placeholder="Vấn đề cần hỗ trợ" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="message"
                  label="Nội dung"
                  rules={[
                    { required: true, message: 'Vui lòng nhập nội dung' },
                    { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự' }
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    block
                    className="h-12"
                  >
                    Gửi tin nhắn
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Additional Info */}
          <Col xs={24} lg={10}>
            {/* Other Offices */}
            <Card className="shadow-lg mb-6">
              <Title level={4} className="mb-4">
                Văn phòng đại diện
              </Title>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <Text strong className="block mb-1 text-lg">
                      {office.city}
                    </Text>
                    <Text className="block text-gray-600 mb-1">
                      <EnvironmentOutlined className="mr-2" />
                      {office.address}
                    </Text>
                    <Text className="block text-gray-600">
                      <PhoneOutlined className="mr-2" />
                      {office.phone}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg">
              <Title level={4} className="mb-4">
                Kết nối với chúng tôi
              </Title>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full text-2xl transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookFilled />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white rounded-full text-2xl transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterCircleFilled />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full text-2xl transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramFilled />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full text-2xl transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeFilled />
                </a>
              </div>
              <Paragraph className="mt-4 mb-0 text-gray-600">
                Theo dõi chúng tôi trên các mạng xã hội để cập nhật tin tức
                và ưu đãi mới nhất!
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* FAQ Link Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title level={3} className="mb-4">
            Bạn có thể tự tìm câu trả lời
          </Title>
          <Paragraph className="text-lg text-gray-600 mb-6">
            Nhiều câu hỏi thường gặp đã được giải đáp trong Trung tâm trợ giúp
          </Paragraph>
          <a
            href="/help"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            Xem câu hỏi thường gặp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
