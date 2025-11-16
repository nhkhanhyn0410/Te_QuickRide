import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Statistic,
  Space,
  message,
  Popconfirm,
  Switch,
  Badge,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ShopOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
import { Typography } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ManageVouchers = () => {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Mock statistics
  const stats = {
    total: 25,
    active: 12,
    scheduled: 5,
    expired: 8,
    systemVouchers: 10,
    operatorVouchers: 15,
    totalUsed: 5678,
    totalDiscount: 1250000000
  };

  // Mock vouchers data
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
      quantity: 1000,
      used: 456,
      status: 'scheduled',
      scope: 'system',
      operator: null,
      createdDate: '2024-01-15'
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
      quantity: 500,
      used: 234,
      status: 'active',
      scope: 'operator',
      operator: 'Phương Trang',
      createdDate: '2024-01-10'
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
      quantity: 2000,
      used: 1456,
      status: 'active',
      scope: 'system',
      operator: null,
      createdDate: '2023-12-28'
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
      endDate: '2024-02-29',
      quantity: 1500,
      used: 678,
      status: 'active',
      scope: 'operator',
      operator: 'Mai Linh',
      createdDate: '2024-01-18'
    },
    {
      id: 5,
      code: 'SUMMER50',
      title: 'Hè vui vẻ - Giảm 50K',
      description: 'Khuyến mãi mùa hè',
      type: 'fixed',
      discount: 50000,
      minOrder: 150000,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      quantity: 800,
      used: 544,
      status: 'expired',
      scope: 'system',
      operator: null,
      createdDate: '2023-05-25'
    }
  ];

  const getStatusTag = (status) => {
    const statusConfig = {
      active: { color: 'green', text: 'Đang chạy', icon: <CheckCircleOutlined /> },
      scheduled: { color: 'blue', text: 'Đã lên lịch', icon: <CalendarOutlined /> },
      expired: { color: 'default', text: 'Hết hạn', icon: <CloseCircleOutlined /> },
      inactive: { color: 'red', text: 'Tạm dừng', icon: <CloseCircleOutlined /> }
    };
    const config = statusConfig[status] || statusConfig.active;
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  const getTypeTag = (type) => {
    if (type === 'percentage') {
      return <Tag color="blue" icon={<PercentageOutlined />}>Giảm %</Tag>;
    }
    return <Tag color="green" icon={<GiftOutlined />}>Giảm tiền</Tag>;
  };

  const getScopeTag = (scope, operator) => {
    if (scope === 'system') {
      return <Tag color="purple">Hệ thống</Tag>;
    }
    return (
      <Tag color="orange" icon={<ShopOutlined />}>
        {operator}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      fixed: 'left',
      width: 120,
      render: (text) => <Text code strong className="text-blue-600">{text}</Text>
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Phạm vi',
      key: 'scope',
      width: 150,
      render: (_, record) => getScopeTag(record.scope, record.operator),
      filters: [
        { text: 'Hệ thống', value: 'system' },
        { text: 'Nhà xe', value: 'operator' }
      ],
      onFilter: (value, record) => record.scope === value
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => getTypeTag(type)
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      width: 120,
      render: (_, record) => (
        <div>
          <Text strong className="text-green-600">
            {record.type === 'percentage' ? `${record.discount}%` : `${record.discount.toLocaleString('vi-VN')}đ`}
          </Text>
          {record.maxDiscount && record.type === 'percentage' && (
            <Text type="secondary" className="block text-xs">
              Max: {record.maxDiscount.toLocaleString('vi-VN')}đ
            </Text>
          )}
        </div>
      )
    },
    {
      title: 'Thời gian',
      key: 'period',
      width: 180,
      render: (_, record) => (
        <div>
          <Text className="block text-xs">
            {dayjs(record.startDate).format('DD/MM/YYYY')}
          </Text>
          <Text className="block text-xs">
            {dayjs(record.endDate).format('DD/MM/YYYY')}
          </Text>
        </div>
      )
    },
    {
      title: 'Sử dụng',
      key: 'usage',
      width: 120,
      render: (_, record) => (
        <div>
          <Text>{record.used}/{record.quantity}</Text>
          <div className="text-xs text-gray-500">
            {((record.used / record.quantity) * 100).toFixed(0)}%
          </div>
        </div>
      ),
      sorter: (a, b) => a.used - b.used
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Đang chạy', value: 'active' },
        { text: 'Đã lên lịch', value: 'scheduled' },
        { text: 'Hết hạn', value: 'expired' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa voucher này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleCreate = () => {
    form.resetFields();
    setCreateModal(true);
  };

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    form.setFieldsValue({
      ...voucher,
      period: [dayjs(voucher.startDate), dayjs(voucher.endDate)]
    });
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    // TODO: Integrate with API
    setTimeout(() => {
      message.success('Đã xóa voucher');
      setLoading(false);
    }, 1000);
  };

  const handleSubmitCreate = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    const data = {
      ...values,
      startDate: values.period[0].format('YYYY-MM-DD'),
      endDate: values.period[1].format('YYYY-MM-DD')
    };
    console.log('Creating voucher:', data);

    setTimeout(() => {
      message.success('Đã tạo voucher mới');
      setCreateModal(false);
      setLoading(false);
      form.resetFields();
    }, 1000);
  };

  const handleSubmitEdit = async (values) => {
    setLoading(true);
    // TODO: Integrate with API
    const data = {
      ...values,
      startDate: values.period[0].format('YYYY-MM-DD'),
      endDate: values.period[1].format('YYYY-MM-DD')
    };
    console.log('Updating voucher:', selectedVoucher.id, data);

    setTimeout(() => {
      message.success('Đã cập nhật voucher');
      setEditModal(false);
      setLoading(false);
    }, 1000);
  };

  const filterVouchers = (scope) => {
    if (scope === 'all') return vouchers;
    return vouchers.filter(v => v.scope === scope);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-2">
              Quản lý Voucher
            </Title>
            <Text type="secondary">
              Quản lý tất cả voucher trong hệ thống
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo voucher mới
          </Button>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Tổng voucher"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
                prefix={<GiftOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Badge count={stats.active} offset={[10, 0]}>
                <Statistic
                  title="Đang chạy"
                  value={stats.active}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Badge>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Hệ thống"
                value={stats.systemVouchers}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Nhà xe"
                value={stats.operatorVouchers}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Đã sử dụng"
                value={stats.totalUsed}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Tổng giảm giá"
                value={stats.totalDiscount}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                formatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
            </Card>
          </Col>
        </Row>

        {/* Vouchers Tabs */}
        <Card className="shadow-lg">
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane
              tab={<Badge count={vouchers.length} offset={[10, 0]}><span>Tất cả</span></Badge>}
              key="all"
            >
              <Table
                columns={columns}
                dataSource={filterVouchers('all')}
                scroll={{ x: 1400 }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} voucher`
                }}
                loading={loading}
              />
            </TabPane>

            <TabPane
              tab={<span><GiftOutlined /> Hệ thống</span>}
              key="system"
            >
              <Table
                columns={columns}
                dataSource={filterVouchers('system')}
                scroll={{ x: 1400 }}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Tổng ${total} voucher`
                }}
                loading={loading}
              />
            </TabPane>

            <TabPane
              tab={<span><ShopOutlined /> Nhà xe</span>}
              key="operator"
            >
              <Table
                columns={columns}
                dataSource={filterVouchers('operator')}
                scroll={{ x: 1400 }}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Tổng ${total} voucher`
                }}
                loading={loading}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* Create/Edit Modal - Same form as Operator Promotions but with scope field */}
        <Modal
          title={selectedVoucher ? "Chỉnh sửa voucher" : "Tạo voucher mới"}
          open={createModal || editModal}
          onCancel={() => {
            setCreateModal(false);
            setEditModal(false);
          }}
          onOk={() => form.submit()}
          confirmLoading={loading}
          width={700}
          okText={selectedVoucher ? "Cập nhật" : "Tạo voucher"}
          cancelText="Hủy"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={selectedVoucher ? handleSubmitEdit : handleSubmitCreate}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="Mã voucher"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã' },
                    { pattern: /^[A-Z0-9]+$/, message: 'Chỉ chữ in hoa và số' }
                  ]}
                >
                  <Input placeholder="VD: TET2024" maxLength={20} disabled={!!selectedVoucher} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="scope"
                  label="Phạm vi"
                  rules={[{ required: true, message: 'Vui lòng chọn phạm vi' }]}
                >
                  <Select placeholder="Chọn phạm vi">
                    <Option value="system">Hệ thống</Option>
                    <Option value="operator">Nhà xe cụ thể</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Loại giảm giá"
                  rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                >
                  <Select placeholder="Chọn loại">
                    <Option value="percentage">Giảm theo %</Option>
                    <Option value="fixed">Giảm số tiền cố định</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.scope !== currentValues.scope
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('scope') === 'operator' ? (
                      <Form.Item
                        name="operator"
                        label="Nhà xe"
                        rules={[{ required: true, message: 'Vui lòng chọn nhà xe' }]}
                      >
                        <Select placeholder="Chọn nhà xe">
                          <Option value="Phương Trang">Phương Trang</Option>
                          <Option value="Mai Linh">Mai Linh</Option>
                          <Option value="Kumho Samco">Kumho Samco</Option>
                        </Select>
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Tiêu đề voucher" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <TextArea rows={3} placeholder="Mô tả chi tiết về voucher" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="discount"
                  label="Mức giảm"
                  rules={[{ required: true, message: 'Vui lòng nhập mức giảm' }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: '100%' }}
                    placeholder="VD: 20 hoặc 50000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.type !== currentValues.type
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('type') === 'percentage' ? (
                      <Form.Item name="maxDiscount" label="Giảm tối đa (đ)">
                        <InputNumber
                          min={0}
                          style={{ width: '100%' }}
                          placeholder="VD: 100000"
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="minOrder"
                  label="Đơn tối thiểu (đ)"
                  rules={[{ required: true, message: 'Vui lòng nhập đơn tối thiểu' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="VD: 200000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="quantity"
                  label="Số lượng"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: '100%' }}
                    placeholder="VD: 1000"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="period"
              label="Thời gian áp dụng"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageVouchers;
