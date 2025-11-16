import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Switch, message, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/routes/my');
      setRoutes(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách tuyến đường');
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        origin: {
          city: values.originCity,
          address: values.originAddress
        },
        destination: {
          city: values.destinationCity,
          address: values.destinationAddress
        },
        pickupPoints: values.pickupPoints?.split('\n').filter(p => p.trim()) || [],
        dropoffPoints: values.dropoffPoints?.split('\n').filter(p => p.trim()) || []
      };

      if (editingRoute) {
        await axios.put(`/api/routes/${editingRoute._id}`, payload);
        message.success('Cập nhật tuyến đường thành công');
      } else {
        await axios.post('/api/routes', payload);
        message.success('Thêm tuyến đường mới thành công');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingRoute(null);
      fetchRoutes();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    form.setFieldsValue({
      routeName: route.routeName,
      originCity: route.origin.city,
      originAddress: route.origin.address,
      destinationCity: route.destination.city,
      destinationAddress: route.destination.address,
      distance: route.distance,
      estimatedDuration: route.estimatedDuration,
      pickupPoints: route.pickupPoints?.join('\n'),
      dropoffPoints: route.dropoffPoints?.join('\n'),
      isActive: route.isActive
    });
    setModalVisible(true);
  };

  const handleDelete = async (routeId) => {
    Modal.confirm({
      title: 'Xác nhận xóa tuyến đường',
      content: 'Bạn có chắc chắn muốn xóa tuyến đường này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`/api/routes/${routeId}`);
          message.success('Xóa tuyến đường thành công');
          fetchRoutes();
        } catch (error) {
          message.error(error.response?.data?.message || 'Không thể xóa tuyến đường');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Tên tuyến',
      dataIndex: 'routeName',
      key: 'routeName',
      render: (text) => <span className="font-semibold">{text}</span>
    },
    {
      title: 'Điểm đi',
      key: 'origin',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.origin?.city}</div>
          <div className="text-gray-500 text-sm">{record.origin?.address}</div>
        </div>
      )
    },
    {
      title: 'Điểm đến',
      key: 'destination',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.destination?.city}</div>
          <div className="text-gray-500 text-sm">{record.destination?.address}</div>
        </div>
      )
    },
    {
      title: 'Khoảng cách',
      dataIndex: 'distance',
      key: 'distance',
      render: (distance) => `${distance} km`,
      align: 'center'
    },
    {
      title: 'Thời gian',
      dataIndex: 'estimatedDuration',
      key: 'estimatedDuration',
      render: (duration) => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes}m`;
      },
      align: 'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card
          title={<h1 className="text-2xl font-bold">Quản lý tuyến đường</h1>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRoute(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              Thêm tuyến mới
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={routes}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng cộng ${total} tuyến đường`
            }}
          />
        </Card>

        <Modal
          title={editingRoute ? 'Chỉnh sửa tuyến đường' : 'Thêm tuyến mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingRoute(null);
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isActive: true
            }}
          >
            <Form.Item
              label="Tên tuyến"
              name="routeName"
              rules={[{ required: true, message: 'Vui lòng nhập tên tuyến' }]}
            >
              <Input placeholder="Ví dụ: Hà Nội - Đà Nẵng" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Thành phố điểm đi"
                name="originCity"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đi' }]}
              >
                <Input placeholder="Ví dụ: Hà Nội" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ điểm đi"
                name="originAddress"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input placeholder="Bến xe Giáp Bát" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Thành phố điểm đến"
                name="destinationCity"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đến' }]}
              >
                <Input placeholder="Ví dụ: Đà Nẵng" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ điểm đến"
                name="destinationAddress"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input placeholder="Bến xe Đà Nẵng" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Khoảng cách (km)"
                name="distance"
                rules={[{ required: true, message: 'Vui lòng nhập khoảng cách' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Thời gian ước tính (phút)"
                name="estimatedDuration"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <Form.Item
              label="Điểm đón (mỗi điểm 1 dòng)"
              name="pickupPoints"
            >
              <Input.TextArea
                rows={3}
                placeholder="Bến xe Giáp Bát&#10;Ngã tư Sở&#10;Cầu Giấy"
              />
            </Form.Item>

            <Form.Item
              label="Điểm trả (mỗi điểm 1 dòng)"
              name="dropoffPoints"
            >
              <Input.TextArea
                rows={3}
                placeholder="Bến xe Đà Nẵng&#10;Công viên APEC&#10;Ngã ba Huế"
              />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="isActive"
              valuePropName="checked"
            >
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
            </Form.Item>

            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingRoute ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Routes;
