"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Space,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb,
  Spin,
  Typography,
  Divider,
} from "antd";
import {
  ExclamationCircleOutlined,
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  getRefundStatusText,
  RefundRequest,
  RefundStatus,
} from "@/types/RequestRefund";
import { useRefundRequests } from "@/services/use-refundrequest";
import RefundRequestStats from "./refund-request-stats";
import BookingInfoCard from "../../components/booking-info-card";

const { Title } = Typography;

export default function RefundRequestDetail() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<RefundRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [form] = Form.useForm<{ note?: string }>();

  const {
    getRefundRequestById,
    approveRefundRequest,
    rejectRefundRequest,
    loading: serviceLoading,
  } = useRefundRequests();

  const requestId = params.id as string;
  const isPending = data?.status === RefundStatus.PENDING;

  const fetchRefundRequest = async (id: string) => {
    try {
      setLoading(true);
      const response = await getRefundRequestById(id);
      setData(response);
    } catch (error) {
      toast.error("Không thể tải thông tin yêu cầu hoàn tiền");
      console.error("Error fetching refund request:", error);
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (id: string) => {
    try {
      await approveRefundRequest(id);
      toast.success("Đã chấp nhận yêu cầu hoàn tiền thành công");
      // Refresh data
      await fetchRefundRequest(id);
    } catch (error) {
      console.error("Error approving refund request:", error);
      throw error;
    }
  };

  const onReject = async (id: string, note?: string) => {
    try {
      await rejectRefundRequest(id, note || "");
      toast.success("Đã từ chối yêu cầu hoàn tiền thành công");
      // Refresh data
      await fetchRefundRequest(id);
    } catch (error) {
      console.error("Error rejecting refund request:", error);
      throw error;
    }
  };

  const onViewTourDetail = (tourId: string) => {
    router.push(`/admin/tour/${tourId}`)
  };

  const onViewTripPlanDetail = (tripPlanId: string) => {
    // TODO: Navigate to trip plan detail page
    console.log("View trip plan detail:", tripPlanId);
  };

  const onViewWorkshopDetail = (workshopId: string) => {
    // TODO: Navigate to workshop detail page
    console.log("View workshop detail:", workshopId);
  };

  useEffect(() => {
    if (requestId) {
      fetchRefundRequest(requestId);
    }
  }, [requestId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  function resetForm() {
    form.resetFields();
    setActionType(null);
  }

  async function handleSubmit() {
    if (!data || !actionType) return;

    try {
      if (actionType === "approve") {
        setApproveLoading(true);
        await onApprove(data.id);
        toast.success("Đã chấp nhận yêu cầu hoàn tiền.");
      } else if (actionType === "reject") {
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
      // Refresh data or navigate back
      router.push("/admin/request-refund");
    } catch (e: any) {
      toast.error(
        e?.message ||
          `Không thể ${
            actionType === "approve" ? "chấp nhận" : "từ chối"
          } yêu cầu. Vui lòng thử lại.`
      );
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  }

  if (loading || serviceLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Không tìm thấy yêu cầu hoàn tiền</p>
          <Button
            type="primary"
            onClick={() => router.push("/admin/request-refund")}
            className="mt-4"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <Title level={2} className="mb-2">
              Chi tiết yêu cầu hoàn tiền
            </Title>
            {/* <p className="text-gray-600">ID: {data.id}</p> */}
          </div>

          {/* Action buttons */}
          {isPending && !actionType && (
            <Space>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => setActionType("reject")}
              >
                Từ chối
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => setActionType("approve")}
              >
                Chấp nhận
              </Button>
            </Space>
          )}
          {actionType && (
            <Space>
              <Button onClick={() => setActionType(null)}>Hủy</Button>
              <Button
                type={actionType === "approve" ? "primary" : "default"}
                danger={actionType === "reject"}
                loading={
                  actionType === "approve" ? approveLoading : rejectLoading
                }
                onClick={handleSubmit}
                icon={
                  actionType === "approve" ? (
                    <CheckOutlined />
                  ) : (
                    <CloseOutlined />
                  )
                }
              >
                {actionType === "approve"
                  ? "Xác nhận chấp nhận"
                  : "Xác nhận từ chối"}
              </Button>
            </Space>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <RefundRequestStats data={data} />

      <div className="space-y-6">
        <Row gutter={[24, 24]}>
          {/* Thông tin yêu cầu hoàn tiền */}
          <Col xs={24} lg={12}>
            <Card title="Thông tin yêu cầu hoàn tiền" className="h-full">
              <Descriptions column={1} size="middle">
                <Descriptions.Item label="Người yêu cầu">
                  <Space direction="vertical" size={0}>
                    <span className="font-medium">{data.userName}</span>
                    {/* <span className="text-sm text-gray-500">ID: {data.userId}</span> */}
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
                    <div className="flex flex-row gap-2 justify-center items-center">
                      <div>{dayjs(data.requestedAt).format("DD/MM/YYYY")}</div>
                      <div className="text-sm text-gray-500">
                        {dayjs(data.requestedAt).format("HH:mm:ss")}
                      </div>
                    </div>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian phản hồi">
                  <Space>
                    <CalendarOutlined />
                    <div className="flex flex-row gap-2 justify-center items-center">
                      {data.respondedAt == null ? (
                        <span className="text-gray-400">Chưa phản hồi</span>
                      ) : (
                        <div className="flex flex-row gap-2 justify-center items-center">
                          <div>
                            {dayjs(data.respondedAt).format("DD/MM/YYYY")}
                          </div>
                          <div className="text-sm text-gray-500">
                            {dayjs(data.respondedAt).format("HH:mm:ss")}
                          </div>
                        </div>
                      )}
                    </div>
                  </Space>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div>
                <h4 className="font-medium mb-3">Lý do hoàn tiền</h4>
                <div className="p-4 bg-gray-50 rounded-lg border min-h-[120px]">
                  <p className="whitespace-pre-wrap">{data.reason}</p>
                </div>
              </div>
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
              <Card title="Thông tin đặt chỗ" className="h-full">
                <div className="text-center text-gray-500 py-8">
                  <ExclamationCircleOutlined className="text-4xl mb-4" />
                  <p>Không có thông tin đặt chỗ</p>
                </div>
              </Card>
            )}
          </Col>
        </Row>

        {/* Action form */}
        {actionType && (
          <Card
            className={`${
              actionType === "approve"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <ExclamationCircleOutlined
                className={`text-xl ${
                  actionType === "approve" ? "text-green-600" : "text-red-600"
                }`}
              />
              <Title
                level={4}
                className={`mb-0 ${
                  actionType === "approve" ? "text-green-800" : "text-red-800"
                }`}
              >
                {actionType === "approve"
                  ? "Chấp nhận yêu cầu hoàn tiền"
                  : "Từ chối yêu cầu hoàn tiền"}
              </Title>
            </div>

            <Form form={form} layout="vertical">
              <Form.Item
                name="note"
                label={
                  actionType === "approve"
                    ? "Ghi chú (tùy chọn)"
                    : "Lý do từ chối"
                }
                rules={
                  actionType === "reject"
                    ? [
                        {
                          required: true,
                          message: "Vui lòng nhập lý do từ chối",
                        },
                      ]
                    : []
                }
              >
                <Input.TextArea
                  rows={4}
                  placeholder={
                    actionType === "approve"
                      ? "Nhập ghi chú cho giao dịch hoàn tiền (nếu có)..."
                      : "Nhập lý do từ chối hoặc ghi chú nội bộ..."
                  }
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
}
