import { useState } from 'react';
import { Typography, Input, Collapse, Tabs, Card, Row, Col, Button, Space } from 'antd';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const Help = () => {
  const [searchText, setSearchText] = useState('');

  const faqs = {
    booking: [
      {
        question: 'Làm thế nào để đặt vé xe?',
        answer: `Để đặt vé xe trên Te_QuickRide, bạn thực hiện các bước sau:
1. Truy cập trang chủ và nhập thông tin tìm kiếm (điểm đi, điểm đến, ngày khởi hành)
2. Chọn chuyến xe phù hợp từ danh sách kết quả
3. Chọn ghế ngồi trên sơ đồ ghế
4. Điền thông tin hành khách
5. Chọn phương thức thanh toán và hoàn tất đặt vé
6. Nhận vé điện tử qua email hoặc tải xuống từ tài khoản`
      },
      {
        question: 'Tôi có thể đặt vé cho người khác không?',
        answer: 'Có, bạn hoàn toàn có thể đặt vé cho người khác. Khi điền thông tin hành khách, bạn chỉ cần nhập thông tin của người sẽ đi (họ tên, số điện thoại, CMND/CCCD). Vé điện tử sẽ được gửi đến email liên hệ của bạn.'
      },
      {
        question: 'Thời gian đặt vé trước bao lâu?',
        answer: 'Bạn có thể đặt vé trước từ 1 đến 30 ngày. Đối với các tuyến hot, chúng tôi khuyến khích đặt trước ít nhất 3-5 ngày để có nhiều lựa chọn ghế ngồi.'
      },
      {
        question: 'Tôi có thể đổi ghế sau khi đã đặt không?',
        answer: 'Có, bạn có thể đổi ghế miễn phí nếu còn ghế trống và chuyến xe chưa khởi hành trong vòng 24 giờ. Vui lòng liên hệ hotline 1900 1234 hoặc vào mục "Quản lý booking" để thay đổi.'
      }
    ],
    payment: [
      {
        question: 'Có những phương thức thanh toán nào?',
        answer: `Te_QuickRide hỗ trợ nhiều phương thức thanh toán:
- Ví điện tử: MoMo, ZaloPay, ShopeePay
- Cổng thanh toán: VNPay
- Thẻ ngân hàng: ATM, Visa, Mastercard
- Chuyển khoản ngân hàng
Tất cả giao dịch đều được mã hóa và bảo mật tuyệt đối.`
      },
      {
        question: 'Khi nào tôi nhận được vé sau khi thanh toán?',
        answer: 'Ngay sau khi thanh toán thành công, vé điện tử sẽ được gửi đến email của bạn trong vòng 1-2 phút. Bạn cũng có thể tải vé từ mục "Vé của tôi" trong tài khoản.'
      },
      {
        question: 'Thanh toán không thành công, tôi phải làm gì?',
        answer: `Nếu thanh toán không thành công, vui lòng:
1. Kiểm tra lại thông tin thẻ/tài khoản
2. Đảm bảo tài khoản có đủ số dư
3. Thử lại với phương thức thanh toán khác
4. Liên hệ hotline 1900 1234 nếu vấn đề vẫn tiếp diễn
Lưu ý: Nếu tiền đã bị trừ nhưng không nhận được vé, số tiền sẽ được hoàn lại trong 3-5 ngày làm việc.`
      },
      {
        question: 'Có được hoàn tiền nếu hủy vé không?',
        answer: `Chính sách hoàn tiền phụ thuộc vào thời gian hủy:
- Hủy trước 24 giờ: Hoàn 70% giá vé
- Hủy trước 12 giờ: Hoàn 50% giá vé
- Hủy trước 6 giờ: Hoàn 30% giá vé
- Hủy dưới 6 giờ: Không hoàn tiền
Tiền sẽ được hoàn về tài khoản/thẻ gốc trong 5-7 ngày làm việc.`
      }
    ],
    cancellation: [
      {
        question: 'Làm thế nào để hủy vé?',
        answer: `Để hủy vé:
1. Đăng nhập vào tài khoản
2. Vào mục "Quản lý booking"
3. Chọn chuyến cần hủy
4. Nhấn "Hủy vé" và xác nhận
5. Tiền sẽ được hoàn lại theo chính sách hoàn tiền

Lưu ý: Vé chỉ có thể hủy trước giờ khởi hành ít nhất 6 tiếng.`
      },
      {
        question: 'Tôi có thể hủy một phần vé trong booking không?',
        answer: 'Có, bạn có thể hủy từng vé riêng lẻ trong booking nếu đặt nhiều vé. Phí hủy vé áp dụng cho từng vé bị hủy.'
      },
      {
        question: 'Chuyến bị hủy do nhà xe, tôi được xử lý thế nào?',
        answer: 'Nếu chuyến bị hủy do nhà xe, bạn sẽ được hoàn 100% tiền vé hoặc được chuyển sang chuyến khác miễn phí. Chúng tôi sẽ thông báo qua email và SMS ngay khi có sự cố.'
      }
    ],
    account: [
      {
        question: 'Làm thế nào để tạo tài khoản?',
        answer: `Tạo tài khoản rất đơn giản:
1. Nhấn "Đăng ký" ở góc trên bên phải
2. Điền thông tin: Họ tên, Email, Số điện thoại, Mật khẩu
3. Xác nhận email (nếu có)
4. Hoàn tất!

Bạn cũng có thể đăng ký nhanh bằng tài khoản Google hoặc Facebook.`
      },
      {
        question: 'Quên mật khẩu, phải làm sao?',
        answer: `Để lấy lại mật khẩu:
1. Nhấn "Quên mật khẩu?" ở trang đăng nhập
2. Nhập email đã đăng ký
3. Kiểm tra email và nhấn link đặt lại mật khẩu
4. Nhập mật khẩu mới
5. Đăng nhập với mật khẩu mới`
      },
      {
        question: 'Làm thế nào để thay đổi thông tin cá nhân?',
        answer: 'Đăng nhập vào tài khoản, vào mục "Thông tin cá nhân", chỉnh sửa các thông tin cần thay đổi (họ tên, số điện thoại, email) và nhấn "Cập nhật".'
      },
      {
        question: 'Điểm thưởng hoạt động thế nào?',
        answer: `Hệ thống điểm thưởng Te_QuickRide:
- Tích 1 điểm cho mỗi 10,000đ chi tiêu
- Điểm có thể đổi voucher giảm giá
- 4 hạng thành viên: Bronze, Silver, Gold, Platinum
- Quyền lợi tăng dần theo hạng (ưu tiên chọn ghế, giảm giá, quà tặng sinh nhật...)
Xem chi tiết tại mục "Điểm thưởng" trong tài khoản.`
      }
    ],
    other: [
      {
        question: 'Có cần in vé giấy không?',
        answer: 'Không cần thiết. Bạn chỉ cần xuất trình mã QR trên vé điện tử (từ email hoặc app) khi lên xe. Tuy nhiên, bạn vẫn có thể in vé ra giấy nếu muốn.'
      },
      {
        question: 'Tôi đến điểm đón muộn thì sao?',
        answer: 'Vui lòng có mặt tại điểm đón trước giờ khởi hành ít nhất 15 phút. Nếu đến muộn, xe có thể đã khởi hành và bạn sẽ không được hoàn tiền. Trong trường hợp đặc biệt, vui lòng liên hệ hotline nhà xe ngay.'
      },
      {
        question: 'Tôi có thể mang hành lý bao nhiêu kg?',
        answer: 'Mỗi hành khách được phép mang 20kg hành lý miễn phí. Hành lý vượt quá sẽ tính phí theo quy định của nhà xe. Không được mang vật phẩm nguy hiểm, dễ cháy nổ.'
      },
      {
        question: 'Làm thế nào để liên hệ với nhà xe?',
        answer: 'Thông tin liên hệ nhà xe được hiển thị trong chi tiết vé và email xác nhận. Bạn cũng có thể liên hệ hotline Te_QuickRide 1900 1234 để được hỗ trợ kết nối.'
      }
    ]
  };

  const contactOptions = [
    {
      icon: <PhoneOutlined className="text-3xl text-blue-600" />,
      title: 'Hotline',
      content: '1900 1234',
      description: '(8:00 - 22:00, tất cả các ngày)',
      action: <Button type="primary">Gọi ngay</Button>
    },
    {
      icon: <MailOutlined className="text-3xl text-green-600" />,
      title: 'Email',
      content: 'support@tequickride.com',
      description: 'Phản hồi trong 24h',
      action: <Button>Gửi email</Button>
    },
    {
      icon: <MessageOutlined className="text-3xl text-purple-600" />,
      title: 'Live Chat',
      content: 'Chat trực tuyến',
      description: 'Phản hồi ngay lập tức',
      action: <Button>Bắt đầu chat</Button>
    }
  ];

  const filterFAQs = (category) => {
    if (!searchText) return faqs[category];

    return faqs[category].filter(
      faq =>
        faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <QuestionCircleOutlined className="text-6xl mb-4" />
          <Title level={1} className="!text-white !mb-4">
            Chúng tôi có thể giúp gì cho bạn?
          </Title>
          <div className="max-w-2xl mx-auto">
            <Input
              size="large"
              placeholder="Tìm kiếm câu hỏi..."
              prefix={<SearchOutlined />}
              className="text-lg"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <Tabs defaultActiveKey="booking" size="large">
            <TabPane tab="Đặt vé" key="booking">
              <Collapse accordion>
                {filterFAQs('booking').map((faq, index) => (
                  <Panel header={<Text strong>{faq.question}</Text>} key={index}>
                    <Paragraph className="whitespace-pre-line">{faq.answer}</Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </TabPane>

            <TabPane tab="Thanh toán" key="payment">
              <Collapse accordion>
                {filterFAQs('payment').map((faq, index) => (
                  <Panel header={<Text strong>{faq.question}</Text>} key={index}>
                    <Paragraph className="whitespace-pre-line">{faq.answer}</Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </TabPane>

            <TabPane tab="Hủy vé" key="cancellation">
              <Collapse accordion>
                {filterFAQs('cancellation').map((faq, index) => (
                  <Panel header={<Text strong>{faq.question}</Text>} key={index}>
                    <Paragraph className="whitespace-pre-line">{faq.answer}</Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </TabPane>

            <TabPane tab="Tài khoản" key="account">
              <Collapse accordion>
                {filterFAQs('account').map((faq, index) => (
                  <Panel header={<Text strong>{faq.question}</Text>} key={index}>
                    <Paragraph className="whitespace-pre-line">{faq.answer}</Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </TabPane>

            <TabPane tab="Khác" key="other">
              <Collapse accordion>
                {filterFAQs('other').map((faq, index) => (
                  <Panel header={<Text strong>{faq.question}</Text>} key={index}>
                    <Paragraph className="whitespace-pre-line">{faq.answer}</Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </TabPane>
          </Tabs>
        </Card>

        {/* Contact Options */}
        <div className="mt-12">
          <Title level={3} className="text-center mb-8">
            Vẫn cần hỗ trợ thêm?
          </Title>
          <Row gutter={[24, 24]}>
            {contactOptions.map((option, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <div className="mb-4">{option.icon}</div>
                  <Title level={4} className="mb-2">{option.title}</Title>
                  <Text strong className="block mb-1 text-lg">{option.content}</Text>
                  <Text type="secondary" className="block mb-4">{option.description}</Text>
                  {option.action}
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Quick Links */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <Title level={4} className="mb-4">Liên kết hữu ích</Title>
          <Space direction="vertical" size="middle">
            <Link to="/about" className="text-blue-600 hover:text-blue-800">
              → Về chúng tôi
            </Link>
            <Link to="/contact" className="text-blue-600 hover:text-blue-800">
              → Liên hệ
            </Link>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              → Điều khoản sử dụng
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              → Chính sách bảo mật
            </a>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Help;
