import { useState } from 'react';
import {
  Card,
  Typography,
  Collapse,
  Steps,
  Tag,
  Alert,
  Space,
  Divider,
  List,
  Button
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  ShopOutlined,
  SettingOutlined,
  SafetyOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const AdminGuide = () => {
  const [activeKey, setActiveKey] = useState(['1']);

  const quickStartSteps = [
    {
      title: 'Đăng nhập',
      description: 'Sử dụng tài khoản admin để đăng nhập vào hệ thống',
    },
    {
      title: 'Xem Dashboard',
      description: 'Kiểm tra tổng quan hoạt động của hệ thống',
    },
    {
      title: 'Quản lý Operators',
      description: 'Duyệt các nhà xe đăng ký mới',
    },
    {
      title: 'Giám sát Bookings',
      description: 'Theo dõi và quản lý đặt vé',
    },
  ];

  const features = [
    {
      icon: <DashboardOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      title: 'Dashboard',
      description: 'Xem tổng quan thống kê về người dùng, nhà xe, đặt vé và doanh thu',
      path: '/admin/dashboard'
    },
    {
      icon: <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      title: 'Quản lý Người dùng',
      description: 'Xem danh sách, khóa/mở khóa tài khoản người dùng',
      path: '/admin/users'
    },
    {
      icon: <ShopOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      title: 'Quản lý Nhà xe',
      description: 'Duyệt đăng ký, tạm ngưng hoặc kích hoạt tài khoản nhà xe',
      path: '/admin/operators'
    },
    {
      icon: <BookOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
      title: 'Quản lý Đặt vé',
      description: 'Xem và quản lý tất cả đặt vé trong hệ thống',
      path: '/admin/bookings'
    },
    {
      icon: <SettingOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      title: 'Cài đặt Hệ thống',
      description: 'Cấu hình các thông số và chính sách của hệ thống',
      path: '/admin/settings'
    },
  ];

  const operatorApprovalSteps = [
    {
      step: '1',
      action: 'Vào mục Quản lý Nhà xe',
      detail: 'Click vào menu "Operators" hoặc truy cập /admin/operators'
    },
    {
      step: '2',
      action: 'Lọc nhà xe chờ duyệt',
      detail: 'Chọn filter "Pending" để xem danh sách nhà xe chờ duyệt'
    },
    {
      step: '3',
      action: 'Xem thông tin nhà xe',
      detail: 'Click vào từng nhà xe để xem chi tiết giấy phép, mã số thuế, thông tin liên hệ'
    },
    {
      step: '4',
      action: 'Phê duyệt hoặc từ chối',
      detail: 'Click "Approve" để phê duyệt hoặc "Reject" và nhập lý do từ chối'
    },
  ];

  const securityTips = [
    'Không chia sẻ mật khẩu admin với bất kỳ ai',
    'Thay đổi mật khẩu định kỳ (khuyến nghị 3 tháng/lần)',
    'Kiểm tra log hoạt động thường xuyên',
    'Chỉ duyệt nhà xe có đầy đủ giấy tờ hợp lệ',
    'Backup dữ liệu định kỳ',
    'Giám sát các giao dịch bất thường',
  ];

  const commonIssues = [
    {
      question: 'Làm sao để phê duyệt nhà xe?',
      answer: 'Vào mục Quản lý Nhà xe → Chọn nhà xe cần duyệt → Click "Approve" sau khi kiểm tra thông tin'
    },
    {
      question: 'Làm sao để khóa tài khoản người dùng vi phạm?',
      answer: 'Vào Quản lý Người dùng → Tìm user → Click "Block" và nhập lý do khóa'
    },
    {
      question: 'Làm sao để tạo mã giảm giá?',
      answer: 'Vào mục Vouchers → Click "Create New" → Điền thông tin voucher và điều kiện áp dụng'
    },
    {
      question: 'Làm sao để xem báo cáo doanh thu?',
      answer: 'Vào Analytics → Chọn khoảng thời gian → Xem biểu đồ và export dữ liệu nếu cần'
    },
    {
      question: 'Nhà xe bị tạm ngưng, làm sao kích hoạt lại?',
      answer: 'Vào Quản lý Nhà xe → Tìm nhà xe → Click "Unsuspend" để kích hoạt lại'
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <BookOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={2}>Hướng dẫn Quản trị Hệ thống Te_QuickRide</Title>
            <Paragraph type="secondary">
              Tài liệu hướng dẫn đầy đủ cho Admin quản lý hệ thống đặt vé xe khách
            </Paragraph>
          </div>

          <Divider />

          {/* Quick Start */}
          <Card title="Bắt đầu nhanh" extra={<Tag color="green">Quick Start</Tag>}>
            <Steps
              direction="vertical"
              current={-1}
              items={quickStartSteps}
            />
          </Card>

          {/* Main Features */}
          <Card title="Chức năng chính">
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
              dataSource={features}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => window.location.href = item.path}
                  >
                    <Space direction="vertical" size="small">
                      {item.icon}
                      <Title level={5}>{item.title}</Title>
                      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        {item.description}
                      </Paragraph>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>

          {/* Detailed Guides */}
          <Card title="Hướng dẫn chi tiết">
            <Collapse
              activeKey={activeKey}
              onChange={setActiveKey}
              expandIconPosition="end"
            >
              <Panel header="1. Quản lý và Phê duyệt Nhà xe" key="1">
                <Alert
                  message="Quan trọng"
                  description="Chỉ phê duyệt nhà xe có đầy đủ giấy phép kinh doanh vận tải và giấy tờ hợp lệ"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <List
                  dataSource={operatorApprovalSteps}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Tag color="blue">Bước {item.step}</Tag>}
                        title={item.action}
                        description={item.detail}
                      />
                    </List.Item>
                  )}
                />
              </Panel>

              <Panel header="2. Quản lý Người dùng" key="2">
                <Paragraph>
                  <Title level={5}>Xem danh sách người dùng</Title>
                  <ul>
                    <li>Truy cập <Text code>/admin/users</Text></li>
                    <li>Xem thông tin: tên, email, số điện thoại, trạng thái</li>
                    <li>Lọc theo: trạng thái (active/blocked), ngày đăng ký</li>
                  </ul>
                </Paragraph>
                <Paragraph>
                  <Title level={5}>Khóa/Mở khóa tài khoản</Title>
                  <ul>
                    <li>Click vào user cần khóa</li>
                    <li>Click button "Block User"</li>
                    <li>Nhập lý do khóa tài khoản</li>
                    <li>Để mở khóa: Click "Unblock User"</li>
                  </ul>
                </Paragraph>
              </Panel>

              <Panel header="3. Quản lý Vouchers" key="3">
                <Paragraph>
                  <Title level={5}>Tạo mã giảm giá mới</Title>
                  <ul>
                    <li>Vào <Text code>/admin/vouchers</Text></li>
                    <li>Click "Create New Voucher"</li>
                    <li>Điền thông tin: mã voucher, giá trị giảm giá, điều kiện</li>
                    <li>Chọn thời gian áp dụng và số lượng</li>
                    <li>Click "Create" để tạo</li>
                  </ul>
                </Paragraph>
              </Panel>

              <Panel header="4. Xem Thống kê và Báo cáo" key="4">
                <Paragraph>
                  <Title level={5}>Dashboard</Title>
                  <ul>
                    <li>Tổng số người dùng, nhà xe, đặt vé</li>
                    <li>Doanh thu tổng và theo thời gian</li>
                    <li>Biểu đồ tăng trưởng</li>
                    <li>Top nhà xe có doanh thu cao</li>
                  </ul>
                </Paragraph>
                <Paragraph>
                  <Title level={5}>Analytics</Title>
                  <ul>
                    <li>Báo cáo doanh thu chi tiết theo tháng/quý/năm</li>
                    <li>Thống kê đặt vé theo tuyến đường</li>
                    <li>Phân tích hiệu suất nhà xe</li>
                    <li>Export dữ liệu Excel/PDF</li>
                  </ul>
                </Paragraph>
              </Panel>

              <Panel header="5. Cài đặt Hệ thống" key="5">
                <Paragraph>
                  <ul>
                    <li><Text strong>Chính sách hoàn tiền:</Text> Cấu hình thời gian và % hoàn lại</li>
                    <li><Text strong>Hoa hồng:</Text> Thiết lập % hoa hồng từ nhà xe</li>
                    <li><Text strong>Email templates:</Text> Chỉnh sửa mẫu email gửi khách hàng</li>
                    <li><Text strong>Payment gateways:</Text> Cấu hình VNPay, MoMo, ZaloPay</li>
                    <li><Text strong>Backup:</Text> Lên lịch backup dữ liệu tự động</li>
                  </ul>
                </Paragraph>
              </Panel>
            </Collapse>
          </Card>

          {/* Security Tips */}
          <Card
            title={
              <Space>
                <SafetyOutlined style={{ color: '#f5222d' }} />
                <span>Lưu ý Bảo mật</span>
              </Space>
            }
            extra={<Tag color="red">Quan trọng</Tag>}
          >
            <List
              dataSource={securityTips}
              renderItem={(item) => (
                <List.Item>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  {item}
                </List.Item>
              )}
            />
          </Card>

          {/* FAQ */}
          <Card
            title={
              <Space>
                <QuestionCircleOutlined />
                <span>Câu hỏi thường gặp (FAQ)</span>
              </Space>
            }
          >
            <Collapse expandIconPosition="end">
              {commonIssues.map((issue, index) => (
                <Panel header={issue.question} key={index}>
                  <Paragraph>{issue.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>

          {/* Support */}
          <Alert
            message="Cần hỗ trợ?"
            description={
              <div>
                <Paragraph style={{ marginBottom: 8 }}>
                  Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:
                </Paragraph>
                <Space direction="vertical">
                  <Text><Text strong>Email:</Text> admin@tequickride.com</Text>
                  <Text><Text strong>Hotline:</Text> 1900-xxxx</Text>
                  <Text><Text strong>Giờ làm việc:</Text> 8:00 - 18:00 (T2-T7)</Text>
                </Space>
              </div>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default AdminGuide;
