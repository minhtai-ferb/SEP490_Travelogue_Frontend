"use client";

import React, { useState } from "react";
import { 
  Modal, 
  Button, 
  Form, 
  Input, 
  message, 
  Space,
  Typography 
} from "antd";
import { 
  LockOutlined, 
  UnlockOutlined, 
  ExclamationCircleOutlined 
} from "@ant-design/icons";
import { User } from "@/types/Users";

const { TextArea } = Input;
const { Text } = Typography;
const { confirm } = Modal;

interface UserActionsProps {
  user: User;
  onUserUpdated: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ user, onUserUpdated }) => {
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const isLocked = user.lockoutEnd && new Date(user.lockoutEnd) > new Date();

  const handleLockUser = async (values: { reason: string; duration: number }) => {
    setLoading(true);
    try {
      // TODO: Implement lock user API call
      // await lockUser(user.id, values.reason, values.duration);
      message.success('Đã khóa tài khoản thành công');
      setLockModalOpen(false);
      form.resetFields();
      onUserUpdated();
    } catch (error) {
      message.error('Có lỗi xảy ra khi khóa tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockUser = () => {
    confirm({
      title: 'Xác nhận mở khóa tài khoản',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn mở khóa tài khoản của ${user.fullName}?`,
      okText: 'Mở khóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Implement unlock user API call
          // await unlockUser(user.id);
          message.success('Đã mở khóa tài khoản thành công');
          onUserUpdated();
        } catch (error) {
          message.error('Có lỗi xảy ra khi mở khóa tài khoản');
        }
      },
    });
  };

  return (
    <>
      <Space>
        {isLocked ? (
          <Button
            icon={<UnlockOutlined />}
            onClick={handleUnlockUser}
            type="primary"
            ghost
          >
            Mở khóa
          </Button>
        ) : (
          <Button
            icon={<LockOutlined />}
            onClick={() => setLockModalOpen(true)}
            danger
          >
            Khóa tài khoản
          </Button>
        )}
      </Space>

      {/* Lock User Modal */}
      <Modal
        title="Khóa tài khoản người dùng"
        open={lockModalOpen}
        onCancel={() => setLockModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div className="mb-4">
          <Text>
            Bạn đang khóa tài khoản của <Text strong>{user.fullName}</Text> ({user.email})
          </Text>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLockUser}
        >
          <Form.Item
            name="reason"
            label="Lý do khóa tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập lý do khóa tài khoản' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập lý do khóa tài khoản..."
            />
          </Form.Item>
          
          <Form.Item
            name="duration"
            label="Thời gian khóa (ngày)"
            rules={[
              { required: true, message: 'Vui lòng nhập số ngày khóa' },
              { type: 'number', min: 1, max: 365, message: 'Số ngày phải từ 1 đến 365' }
            ]}
          >
            <Input 
              type="number" 
              placeholder="Nhập số ngày..."
              min={1}
              max={365}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setLockModalOpen(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                danger 
                htmlType="submit"
                loading={loading}
              >
                Khóa tài khoản
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserActions;
