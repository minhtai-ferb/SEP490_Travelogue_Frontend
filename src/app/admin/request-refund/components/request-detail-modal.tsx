"use client";

import React from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Button,
  Upload,
  Form,
  Input,
  Typography,
} from "antd";
import {  ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import {
  getRefundStatusText,
  RefundRequest,
  RefundStatus,
} from "@/types/RequestRefund";

type Props = {
  open: boolean;
  data?: RefundRequest | null;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, note?: string) => Promise<void>;
};

export default function RequestDetailModal({
  open,
  data,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);
  const [actionType, setActionType] = React.useState<'approve' | 'reject' | null>(null);
  const [form] = Form.useForm<{ note?: string }>();

  const isPending = data?.status === RefundStatus.PENDING;

  function resetForm() {
    form.resetFields();
    setActionType(null);
  }

  async function handleSubmit() {
    if (!data || !actionType) return;
    
    try {
      if (actionType === 'approve') {
        setApproveLoading(true);
        await onApprove(data.id);
        toast.success("Đã chấp nhận yêu cầu hoàn tiền.");
      } else if (actionType === 'reject') {
        const { note } = form.getFieldsValue();
        if (!note) {
          toast.error("Vui lòng nhập lý do từ chối.");
          return;
        }
        setRejectLoading(true);
        await onReject(data.id, note);
        toast.success("Đã từ chối yêu cầu hoàn tiền.");
      }
      
      resetForm();
      onClose();
    } catch (e: any) {
      toast.error(
        e?.message || `Không thể ${actionType === 'approve' ? 'chấp nhận' : 'từ chối'} yêu cầu. Vui lòng thử lại.`
      );
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      title="Chi tiết yêu cầu hoàn tiền"
      footer={
        <Space>
          <Button
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Đóng
          </Button>
          {isPending && !actionType && (
            <>
              <Button
                danger
                onClick={() => setActionType('reject')}
              >
                Từ chối
              </Button>
              <Button
                type="primary"
                onClick={() => setActionType('approve')}
              >
                Chấp nhận
              </Button>
            </>
          )}
          {actionType && (
            <>
              <Button onClick={() => setActionType(null)}>
                Hủy
              </Button>
              <Button
                type={actionType === 'approve' ? 'primary' : 'default'}
                danger={actionType === 'reject'}
                loading={actionType === 'approve' ? approveLoading : rejectLoading}
                onClick={handleSubmit}
              >
                {actionType === 'approve' ? 'Xác nhận chấp nhận' : 'Xác nhận từ chối'}
              </Button>
            </>
          )}
        </Space>
      }
      width={720}
    >
      {!data ? null : (
        <div className="space-y-4">
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Người yêu cầu">
              <Space direction="vertical" size={0}>
                <span className="font-medium">{data.userName}</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  data.status === RefundStatus.PENDING
                    ? "gold"
                    : data.status === RefundStatus.APPROVED
                    ? "green"
                    : "red"
                }
              >
                {getRefundStatusText(data.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thời điểm yêu cầu">
              {dayjs(data.createdTime).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Thời điểm phản hồi">
              {dayjs(data.createdTime).format("YYYY-MM-DD HH:mm") ===
              dayjs(data.lastUpdatedTime).format("YYYY-MM-DD HH:mm")
                ? "-"
                : dayjs(data.lastUpdatedTime).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>

          {actionType && (
            <div className={`p-4 border rounded-lg ${
              actionType === 'approve' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <ExclamationCircleOutlined 
                  className={actionType === 'approve' ? 'text-green-600' : 'text-red-600'} 
                />
                <span className={`font-medium ${
                  actionType === 'approve' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {actionType === 'approve' ? 'Chấp nhận yêu cầu hoàn tiền' : 'Từ chối yêu cầu hoàn tiền'}
                </span>
              </div>
              
              <Form form={form} layout="vertical">
                <Form.Item 
                  name="note" 
                  label={actionType === 'approve' ? 'Ghi chú (tùy chọn)' : 'Lý do từ chối'}
                  rules={actionType === 'reject' ? [{ required: true, message: 'Vui lòng nhập lý do từ chối' }] : []}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder={
                      actionType === 'approve' 
                        ? 'Nhập ghi chú cho giao dịch hoàn tiền (nếu có)...' 
                        : 'Nhập lý do từ chối hoặc ghi chú nội bộ...'
                    }
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
