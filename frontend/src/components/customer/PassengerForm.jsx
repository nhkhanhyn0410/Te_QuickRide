import { Form, Input, Select, Button, Card, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const { Option } = Select;

const PassengerForm = ({ passengers, onPassengersChange, seatCount }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Convert form values to passengers array
    const passengersList = [];
    for (let i = 0; i < seatCount; i++) {
      passengersList.push({
        fullName: values[`fullName_${i}`],
        phoneNumber: values[`phoneNumber_${i}`],
        email: values[`email_${i}`],
        identityCard: values[`identityCard_${i}`],
        seatNumber: values[`seatNumber_${i}`],
      });
    }
    onPassengersChange(passengersList);
  };

  const handleValuesChange = () => {
    // Auto-save on change
    form.validateFields()
      .then((values) => {
        const passengersList = [];
        for (let i = 0; i < seatCount; i++) {
          if (values[`fullName_${i}`]) {
            passengersList.push({
              fullName: values[`fullName_${i}`],
              phoneNumber: values[`phoneNumber_${i}`],
              email: values[`email_${i}`],
              identityCard: values[`identityCard_${i}`],
              seatNumber: values[`seatNumber_${i}`],
            });
          }
        }
        if (passengersList.length > 0) {
          onPassengersChange(passengersList);
        }
      })
      .catch(() => {
        // Validation errors, don't update
      });
  };

  return (
    <Card title="Thông tin hành khách">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        requiredMark={false}
      >
        {[...Array(seatCount)].map((_, index) => (
          <div key={index}>
            <h4 className="font-semibold text-gray-700 mb-3">
              Hành khách {index + 1}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Họ và tên"
                name={`fullName_${index}`}
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nguyễn Văn A"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name={`phoneNumber_${index}`}
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^(0|\+84)[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="0xxx xxx xxx"
                  size="large"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Email"
                name={`email_${index}`}
                rules={[
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="email@example.com (không bắt buộc)"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="CMND/CCCD"
                name={`identityCard_${index}`}
                rules={[
                  { pattern: /^[0-9]{9,12}$/, message: 'CMND/CCCD không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<IdcardOutlined className="text-gray-400" />}
                  placeholder="CMND/CCCD (không bắt buộc)"
                  size="large"
                />
              </Form.Item>
            </div>

            {index < seatCount - 1 && <Divider />}
          </div>
        ))}
      </Form>
    </Card>
  );
};

export default PassengerForm;
