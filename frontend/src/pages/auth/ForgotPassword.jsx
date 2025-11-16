import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      console.log('Reset password for:', values.email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSentEmail(values.email);
      setEmailSent(true);
      message.success('Email đặt lại mật khẩu đã được gửi!');
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with API
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Email đã được gửi lại!');
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full shadow-xl">
          <Result
            status="success"
            title="Kiểm tra email của bạn!"
            subTitle={
              <div className="text-left">
                <Paragraph>
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email:
                </Paragraph>
                <Text strong className="text-blue-600 text-lg block mb-4">
                  {sentEmail}
                </Text>
                <Paragraph className="text-gray-600">
                  Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
                  Email có thể mất vài phút để đến.
                </Paragraph>
                <Paragraph className="text-gray-600 text-sm">
                  Nếu bạn không thấy email, hãy kiểm tra trong thư mục spam/junk.
                </Paragraph>
              </div>
            }
            extra={[
              <Button
                key="resend"
                onClick={handleResend}
                loading={loading}
                className="mr-2"
              >
                Gửi lại email
              </Button>,
              <Link to="/login" key="login">
                <Button type="primary">
                  Về trang đăng nhập
                </Button>
              </Link>
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            Quên mật khẩu?
          </Title>
          <Paragraph className="text-gray-600">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
          </Paragraph>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              size="large"
              placeholder="example@email.com"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className="h-12 text-base font-semibold"
            >
              Gửi email đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeftOutlined className="mr-2" />
            Quay lại đăng nhập
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Paragraph className="text-sm text-gray-600 text-center mb-2">
            Bạn cần thêm hỗ trợ?
          </Paragraph>
          <div className="text-center">
            <Link to="/contact" className="text-sm text-blue-600 hover:text-blue-800">
              Liên hệ với chúng tôi
            </Link>
            <span className="text-gray-400 mx-2">•</span>
            <Link to="/help" className="text-sm text-blue-600 hover:text-blue-800">
              Trung tâm trợ giúp
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
