"use client";

import React from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Button,
  Form,
  Input,
  Card,
  Tooltip,
  Row,
  Col,
} from "antd";
import {  ExclamationCircleOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import BookingInfoCard from "./booking-info-card";
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
  onViewTourDetail?: (tourId: string) => void;
  onViewTripPlanDetail?: (tripPlanId: string) => void;
  onViewWorkshopDetail?: (workshopId: string) => void;
};

export default function RequestDetailModal({
  open,
  data,
  onClose,
  onApprove,
  onReject,
  onViewTourDetail,
  onViewTripPlanDetail,
  onViewWorkshopDetail,
}: Props) {
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);
  const [actionType, setActionType] = React.useState<'approve' | 'reject' | null>(null);
  const [form] = Form.useForm<{ note?: string }>();

  const isPending = data?.status === RefundStatus.PENDING;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

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
      width={1000}
    >
      {!data ? null : (
        <div className="space-y-4">
          <Row gutter={[16, 16]}>
            {/* Thông tin yêu cầu hoàn tiền */}
            <Col xs={24} lg={12}>
              <Card title="Thông tin yêu cầu hoàn tiền" size="small">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Người yêu cầu">
                    <Space direction="vertical" size={0}>
                      <span className="font-medium">{data.userName}</span>
                      <span className="text-xs text-gray-500">ID: {data.userId}</span>
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
                  <Descriptions.Item label="Thời gian yêu cầu">
                    <Space>
                      <CalendarOutlined />
                      <div>
                        <div>{dayjs(data.requestedAt).format("DD/MM/YYYY")}</div>
                        <div className="text-xs text-gray-500">
                          {dayjs(data.requestedAt).format("HH:mm:ss")}
                        </div>
                      </div>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian phản hồi">
                    <Space>
                      <CalendarOutlined />
                      <div>
                        {dayjs(data.requestedAt).format("YYYY-MM-DD HH:mm") ===
                        dayjs(data.respondedAt).format("YYYY-MM-DD HH:mm") ? (
                          <span className="text-gray-400">Chưa phản hồi</span>
                        ) : (
                          <>
                            <div>{dayjs(data.respondedAt).format("DD/MM/YYYY")}</div>
                            <div className="text-xs text-gray-500">
                              {dayjs(data.respondedAt).format("HH:mm:ss")}
                            </div>
                          </>
                        )}
                      </div>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Lý do hoàn tiền">
                    <div className="p-3 bg-gray-50 rounded border max-h-32 overflow-y-auto">
                      {data.reason}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Thông tin đặt chỗ */}
            <Col xs={24} lg={12}>
              {data.bookingDataModel ? (
                <BookingInfoCard
                  booking={data.bookingDataModel}
                  onViewTourDetail={onViewTourDetail}
                  onViewTripPlanDetail={onViewTripPlanDetail}
                  onViewWorkshopDetail={onViewWorkshopDetail}
                />
              ) : (
                <Card title="Thông tin đặt chỗ" size="small">
                  <div className="text-center text-gray-500 py-8">
                    Không có thông tin đặt chỗ
                  </div>
                </Card>
              )}
            </Col>
          </Row>

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
