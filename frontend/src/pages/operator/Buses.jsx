import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import busService from '../../services/busService';

const { Option } = Select;
const { TextArea } = Input;

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [form] = Form.useForm();

  const busTypes = ['Ghế ngồi', 'Giường nằm', 'Limousine', 'Giường đôi'];
  const amenities = ['WiFi', 'Điều hòa', 'Nước uống', 'Toilet', 'TV', 'Sạc điện', 'Chăn gối'];

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await busService.getAllBuses();
      setBuses(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách xe');
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Convert images from textarea to array
      const processedValues = {
        ...values,
        images: values.images ? values.images.split('\n').filter(img => img.trim()) : []
      };

      if (editingBus) {
        await busService.updateBus(editingBus._id, processedValues);
        message.success('Cập nhật xe thành công');
      } else {
        await busService.createBus(processedValues);
        message.success('Thêm xe mới thành công');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingBus(null);
      fetchBuses();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    // Convert images array to textarea format
    const formattedBus = {
      ...bus,
      images: bus.images?.join('\n') || ''
    };
    form.setFieldsValue(formattedBus);
    setModalVisible(true);
  };

  const handleDelete = async (busId) => {
    Modal.confirm({
      title: 'Xác nhận xóa xe',
      content: 'Bạn có chắc chắn muốn xóa xe này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await busService.deleteBus(busId);
          message.success('Xóa xe thành công');
          fetchBuses();
        } catch (error) {
          message.error('Không thể xóa xe');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Biển số xe',
      dataIndex: 'busNumber',
      key: 'busNumber',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Loại xe',
      dataIndex: 'busType',
      key: 'busType'
    },
    {
      title: 'Số ghế',
      dataIndex: 'totalSeats',
      key: 'totalSeats',
      align: 'center'
    },
    {
      title: 'Tiện ích',
      dataIndex: 'amenities',
      key: 'amenities',
      render: (amenities) => (
        <Space size={[0, 4]} wrap>
          {amenities?.slice(0, 3).map((amenity, index) => (
            <Tag key={index} color="green">{amenity}</Tag>
          ))}
          {amenities?.length > 3 && <Tag>+{amenities.length - 3}</Tag>}
        </Space>
      )
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
          title={<h1 className="text-2xl font-bold">Quản lý xe</h1>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingBus(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              Thêm xe mới
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={buses}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng cộng ${total} xe`
            }}
          />
        </Card>

        <Modal
          title={editingBus ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingBus(null);
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isActive: true,
              totalSeats: 40,
              amenities: []
            }}
          >
            <Form.Item
              label="Biển số xe"
              name="busNumber"
              rules={[{ required: true, message: 'Vui lòng nhập biển số xe' }]}
            >
              <Input placeholder="Ví dụ: 51B-12345" />
            </Form.Item>

            <Form.Item
              label="Loại xe"
              name="busType"
              rules={[{ required: true, message: 'Vui lòng chọn loại xe' }]}
            >
              <Select placeholder="Chọn loại xe">
                {busTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Số ghế"
              name="totalSeats"
              rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Tiện ích"
              name="amenities"
            >
              <Select
                mode="multiple"
                placeholder="Chọn tiện ích"
                allowClear
              >
                {amenities.map((amenity) => (
                  <Option key={amenity} value={amenity}>
                    {amenity}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Link hình ảnh (mỗi link 1 dòng)"
              name="images"
            >
              <TextArea
                rows={4}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
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
                  {editingBus ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Buses;
