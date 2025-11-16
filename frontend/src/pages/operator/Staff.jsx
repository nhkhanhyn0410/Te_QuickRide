import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Switch, message, Tag, Space, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/staff/my');
      setStaff(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách nhân viên');
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        licenseExpiry: values.licenseExpiry?.format('YYYY-MM-DD')
      };

      if (editingStaff) {
        delete payload.password; // Don't update password unless explicitly provided
        await axios.put(`/api/staff/${editingStaff._id}`, payload);
        message.success('Cập nhật nhân viên thành công');
      } else {
        await axios.post('/api/staff', payload);
        message.success('Thêm nhân viên mới thành công');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    form.setFieldsValue({
      ...staffMember,
      dateOfBirth: staffMember.dateOfBirth ? dayjs(staffMember.dateOfBirth) : null,
      licenseExpiry: staffMember.licenseExpiry ? dayjs(staffMember.licenseExpiry) : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (staffId) => {
    Modal.confirm({
      title: 'Xác nhận xóa nhân viên',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`/api/staff/${staffId}`);
          message.success('Xóa nhân viên thành công');
          fetchStaff();
        } catch (error) {
          message.error('Không thể xóa nhân viên');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Nhân viên',
      key: 'employee',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div className="font-semibold">{record.fullName}</div>
            <div className="text-gray-500 text-sm">{record.employeeCode}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>{record.phone}</div>
          {record.email && <div className="text-gray-500 text-sm">{record.email}</div>}
        </div>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'driver' ? 'blue' : 'green'}>
          {role === 'driver' ? 'Tài xế' : 'Quản lý chuyến'}
        </Tag>
      )
    },
    {
      title: 'Bằng lái',
      key: 'license',
      render: (_, record) => {
        if (record.role !== 'driver') return '-';
        const isExpired = record.licenseExpiry && new Date(record.licenseExpiry) < new Date();
        return (
          <div>
            <div>{record.licenseNumber}</div>
            <div className={isExpired ? 'text-red-500' : 'text-gray-500'}>
              {isExpired ? 'Hết hạn' : 'Còn hạn'} {new Date(record.licenseExpiry).toLocaleDateString('vi-VN')}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Ngày vào làm',
      dataIndex: 'hireDate',
      key: 'hireDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          active: { text: 'Đang làm việc', color: 'success' },
          inactive: { text: 'Nghỉ việc', color: 'error' },
          on_leave: { text: 'Nghỉ phép', color: 'warning' }
        };
        return (
          <Tag color={statusMap[status]?.color}>
            {statusMap[status]?.text || status}
          </Tag>
        );
      }
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
          title={<h1 className="text-2xl font-bold">Quản lý nhân viên</h1>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingStaff(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              Thêm nhân viên
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={staff}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng cộng ${total} nhân viên`
            }}
          />
        </Card>

        <Modal
          title={editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingStaff(null);
          }}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: 'active',
              role: 'driver'
            }}
          >
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input placeholder="0912345678" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>
            </div>

            {!editingStaff && (
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' }
                ]}
              >
                <Input.Password placeholder="Mật khẩu tối thiểu 8 ký tự" />
              </Form.Item>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="driver">Tài xế</Option>
                  <Option value="trip_manager">Quản lý chuyến</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </div>

            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
              {({ getFieldValue }) =>
                getFieldValue('role') === 'driver' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label="Số bằng lái"
                      name="licenseNumber"
                      rules={[{ required: true, message: 'Vui lòng nhập số bằng lái' }]}
                    >
                      <Input placeholder="Số bằng lái" />
                    </Form.Item>

                    <Form.Item
                      label="Ngày hết hạn bằng lái"
                      name="licenseExpiry"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                    >
                      <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                  </div>
                ) : null
              }
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
            >
              <Select>
                <Option value="active">Đang làm việc</Option>
                <Option value="on_leave">Nghỉ phép</Option>
                <Option value="inactive">Nghỉ việc</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingStaff ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Staff;
