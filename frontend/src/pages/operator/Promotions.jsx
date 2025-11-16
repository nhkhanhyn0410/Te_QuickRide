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
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
import { Typography } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const Promotions = () => {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock statistics
  const stats = {
    total: 12,
    active: 5,
    scheduled: 3,
    expired: 4,
    totalUsed: 1456,
    totalRevenue: 456000000
  };

  // Mock promotions data
  const promotions = [
    {
      id: 1,
      code: 'DALAT50K',
      title: 'Giảm 50K tuyến Sài Gòn - Đà Lạt',
      description: 'Giảm ngay 50.000đ cho tuyến TP.HCM - Đà Lạt',
      type: 'fixed',
      discount: 50000,
      minOrder: 200000,
      maxDiscount: null,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      quantity: 500,
      used: 234,
      status: 'active',
      routes: ['TP.HCM → Đà Lạt'],
      createdDate: '2024-01-10'
    },
    {
      id: 2,
      code: 'WEEKEND15',
      title: 'Giảm giá cuối tuần',
      description: 'Giảm 15% cho các chuyến xe cuối tuần',
      type: 'percentage',
      discount: 15,
      minOrder: 100000,
      maxDiscount: 50000,
      startDate: '2024-01-20',
      endDate: '2024-02-29',
      quantity: 1500,
      used: 678,
      status: 'active',
      routes: ['all'],
      createdDate: '2024-01-18'
    },
    {
      id: 3,
      code: 'TET2024',
      title: 'Khuyến mãi Tết 2024',
      description: 'Giảm 20% cho tất cả các tuyến dịp Tết',
      type: 'percentage',
      discount: 20,
      minOrder: 200000,
      maxDiscount: 100000,
      startDate: '2024-02-10',
      endDate: '2024-02-17',
      quantity: 1000,
      used: 0,
      status: 'scheduled',
      routes: ['all'],
      createdDate: '2024-01-20'
    },
    {
      id: 4,
      code: 'SUMMER50',
      title: 'Hè vui vẻ - Giảm 50K',
      description: 'Khuyến mãi mùa hè, giảm 50.000đ',
      type: 'fixed',
      discount: 50000,
      minOrder: 150000,
      maxDiscount: null,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      quantity: 800,
      used: 544,
      status: 'expired',
      routes: ['all'],
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
      title: 'Đơn tối thiểu',
      dataIndex: 'minOrder',
      key: 'minOrder',
      width: 120,
      render: (value) => `${value.toLocaleString('vi-VN')}đ`
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
            title="Xóa khuyến mãi này?"
            description="Bạn có chắc chắn muốn xóa khuyến mãi này?"
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

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    form.setFieldsValue({
      ...promo,
      period: [dayjs(promo.startDate), dayjs(promo.endDate)]
    });
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    // TODO: Integrate with API
    setTimeout(() => {
      message.success('Đã xóa khuyến mãi');
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
    console.log('Creating promotion:', data);

    setTimeout(() => {
      message.success('Đã tạo khuyến mãi mới');
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
    console.log('Updating promotion:', selectedPromo.id, data);

    setTimeout(() => {
      message.success('Đã cập nhật khuyến mãi');
      setEditModal(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-2">
              Quản lý Khuyến mãi
            </Title>
            <Text type="secondary">
              Tạo và quản lý các chương trình khuyến mãi của nhà xe
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo khuyến mãi
          </Button>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card>
              <Statistic
                title="Tổng số"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
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
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card>
              <Statistic
                title="Đã lên lịch"
                value={stats.scheduled}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card>
              <Statistic
                title="Hết hạn"
                value={stats.expired}
                valueStyle={{ color: '#8c8c8c' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card>
              <Statistic
                title="Đã sử dụng"
                value={stats.totalUsed}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card>
              <Statistic
                title="Tiết kiệm cho KH"
                value={stats.totalRevenue}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                formatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
            </Card>
          </Col>
        </Row>

        {/* Promotions Table */}
        <Card className="shadow-lg">
          <Table
            columns={columns}
            dataSource={promotions}
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} khuyến mãi`
            }}
            loading={loading}
          />
        </Card>

        {/* Create Modal */}
        <Modal
          title="Tạo khuyến mãi mới"
          open={createModal}
          onCancel={() => setCreateModal(false)}
          onOk={() => form.submit()}
          confirmLoading={loading}
          width={700}
          okText="Tạo khuyến mãi"
          cancelText="Hủy"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitCreate}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="Mã khuyến mãi"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã' },
                    { pattern: /^[A-Z0-9]+$/, message: 'Chỉ chữ in hoa và số' }
                  ]}
                >
                  <Input placeholder="VD: TET2024" maxLength={20} />
                </Form.Item>
              </Col>
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
            </Row>

            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Tiêu đề khuyến mãi" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <TextArea rows={3} placeholder="Mô tả chi tiết về khuyến mãi" />
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

            <Form.Item
              name="routes"
              label="Tuyến áp dụng"
              rules={[{ required: true, message: 'Vui lòng chọn tuyến' }]}
            >
              <Select mode="multiple" placeholder="Chọn tuyến đường">
                <Option value="all">Tất cả tuyến</Option>
                <Option value="TP.HCM → Đà Lạt">TP.HCM → Đà Lạt</Option>
                <Option value="TP.HCM → Cần Thơ">TP.HCM → Cần Thơ</Option>
                <Option value="TP.HCM → Vũng Tàu">TP.HCM → Vũng Tàu</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Chỉnh sửa khuyến mãi"
          open={editModal}
          onCancel={() => setEditModal(false)}
          onOk={() => form.submit()}
          confirmLoading={loading}
          width={700}
          okText="Cập nhật"
          cancelText="Hủy"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitEdit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="Mã khuyến mãi"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã' },
                    { pattern: /^[A-Z0-9]+$/, message: 'Chỉ chữ in hoa và số' }
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
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
            </Row>

            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Tiêu đề khuyến mãi" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <TextArea rows={3} placeholder="Mô tả chi tiết về khuyến mãi" />
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

            <Form.Item
              name="routes"
              label="Tuyến áp dụng"
              rules={[{ required: true, message: 'Vui lòng chọn tuyến' }]}
            >
              <Select mode="multiple" placeholder="Chọn tuyến đường">
                <Option value="all">Tất cả tuyến</Option>
                <Option value="TP.HCM → Đà Lạt">TP.HCM → Đà Lạt</Option>
                <Option value="TP.HCM → Cần Thơ">TP.HCM → Cần Thơ</Option>
                <Option value="TP.HCM → Vũng Tàu">TP.HCM → Vũng Tàu</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Promotions;
