"use client";

import React, { useState } from "react";
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  message,
  Typography,
  Alert 
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import { User } from "@/types/Users";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface LockUserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (userId: string, reason: string, duration: number) => Promise<void>;
}

const LockUserModal: React.FC<LockUserModalProps> = ({
  user,
  open,
  onClose,
  onConfirm,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { reason: string; duration: number }) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await onConfirm(user.id, values.reason, values.duration);
      form.resetFields();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <LockOutlined className="text-red-500" />
          <span>Khóa tài khoản người dùng</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <div className="space-y-4">
        <Alert
          message="Cảnh báo"
          description={
            <div className="space-y-2">
              <p>
                Bạn đang thực hiện khóa tài khoản của <Text strong>{user.fullName}</Text> ({user.email})
              </p>
              <p className="text-sm">
                Người dùng sẽ không thể đăng nhập vào hệ thống trong thời gian bị khóa.
                Họ có thể liên hệ với admin để được hỗ trợ.
              </p>
            </div>
          }
          type="warning"
          showIcon
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            duration: 7,
          }}
        >
          <Form.Item
            name="reason"
            label="Lý do khóa tài khoản"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do khóa tài khoản' },
              { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' },
              { max: 500, message: 'Lý do không được vượt quá 500 ký tự' },
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập lý do cụ thể để khóa tài khoản..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian khóa"
            rules={[
              { required: true, message: 'Vui lòng chọn thời gian khóa' },
            ]}
          >
            <Select placeholder="Chọn thời gian khóa">
              <Option value={1}>1 ngày</Option>
              <Option value={3}>3 ngày</Option>
              <Option value={7}>1 tuần</Option>
              <Option value={14}>2 tuần</Option>
              <Option value={30}>1 tháng</Option>
              <Option value={90}>3 tháng</Option>
              <Option value={365}>1 năm</Option>
              <Option value={-1}>Vĩnh viễn</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                danger 
                htmlType="submit"
                loading={loading}
                icon={<LockOutlined />}
              >
                Khóa tài khoản
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default LockUserModal;
