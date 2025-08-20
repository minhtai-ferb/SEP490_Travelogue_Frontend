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
  message,
  Typography,
  Alert,
  Divider,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  WithdrawalRequest,
  WithdrawalStatus,
  getWithdrawalStatusText,
} from "@/types/RequestWithdrawal";
import { formatVND, generateQRUrl, PaymentInfo } from "../utils";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

type Props = {
  open: boolean;
  data?: WithdrawalRequest | null;
  onClose: () => void;

  // Hành động gọi API do parent truyền vào (để bạn tự map endpoint backend .NET)
  onApprove: (payload: {
    id: string;
    note?: string;
    files: File[];
  }) => Promise<void>;
  onReject: (payload: { id: string; note?: string }) => Promise<void>;
};

export default function RequestDetailModal({
  open,
  data,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);

  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [approveForm] = Form.useForm<{ note?: string }>();
  const [rejectForm] = Form.useForm<{ note?: string }>();

  const isPending = data?.status === WithdrawalStatus.PENDING;
  const { Text } = Typography;
  function resetChildren() {
    setFileList([]);
    approveForm.resetFields();
    rejectForm.resetFields();
    setApproveOpen(false);
    setRejectOpen(false);
  }

  async function handleApprove() {
    if (!data) return;
    try {
      const files: File[] = fileList
        .map((f) => (f.originFileObj as File) ?? null)
        .filter(Boolean) as File[];

      if (files.length === 0) {
        toast.error("Vui lòng tải hình ảnh xác nhận đã chuyển khoản.");
        return;
      }

      const { note } = approveForm.getFieldsValue();
      setApproveLoading(true);
      await onApprove({ id: data.id, note, files });
      toast.success("Đã chấp nhận yêu cầu rút tiền.");
      resetChildren();
      onClose();
    } catch (e: any) {
      toast.error(
        e?.message || "Không thể chấp nhận yêu cầu. Vui lòng thử lại."
      );
    } finally {
      setApproveLoading(false);
    }
  }

  async function handleReject() {
    if (!data) return;
    try {
      const { note } = rejectForm.getFieldsValue();
      if (!note) {
        toast.error("Vui lòng nhập lý do từ chối.");
        return;
      }
      setRejectLoading(true);
      await onReject({ id: data.id, note });
      toast.success("Đã từ chối yêu cầu rút tiền.");
      resetChildren();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || "Không thể từ chối yêu cầu. Vui lòng thử lại.");
    } finally {
      setRejectLoading(false);
    }
  }
  const paymentInfo: PaymentInfo | null = React.useMemo(() => {
    return {
      amount: Math.max(0, Math.floor(data?.amount || 0)),
      accountNumber: data?.bankAccount?.bankAccountNumber ?? "",
      accountName: data?.bankAccount?.bankOwnerName ?? "",
      bankName: data?.bankAccount?.bankName ?? "",
      transferInfo: `RUT-${data?.id ?? ""}`,
    };
  }, [data]);

  const qrUrl = React.useMemo(() => {
    if (!paymentInfo) return "";
    return generateQRUrl(paymentInfo);
  }, [paymentInfo]);

  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          resetChildren();
          onClose();
        }}
        title="Chi tiết yêu cầu rút tiền"
        footer={
          <Space>
            <Button
              onClick={() => {
                resetChildren();
                onClose();
              }}
            >
              Đóng
            </Button>
            <Button
              danger
              onClick={() => setRejectOpen(true)}
              disabled={!isPending}
            >
              Từ chối
            </Button>
            <Button
              type="primary"
              onClick={() => setApproveOpen(true)}
              disabled={!isPending}
            >
              Chấp nhận
            </Button>
          </Space>
        }
        width={720}
      >
        {!data ? null : (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Người yêu cầu">
              <Space direction="vertical" size={0}>
                <span className="font-medium">{data.userName}</span>
                {/* <span className="text-[12px] text-gray-500">
                  User ID: {data.userId}
                </span> */}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <span className="font-medium">{formatVND(data.amount)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  data.status === WithdrawalStatus.PENDING
                    ? "gold"
                    : data.status === WithdrawalStatus.APPROVED
                      ? "green"
                      : "red"
                }
              >
                {getWithdrawalStatusText(data.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thời điểm yêu cầu">
              {dayjs(data.requestTime).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Tài khoản ngân hàng">
              <div className="leading-tight">
                <div className="font-medium">
                  {data.bankAccount?.bankName ?? "-"}
                </div>
                <div className="text-[12px] text-gray-500">
                  {data.bankAccount?.bankOwnerName ?? "-"} •{" "}
                  {data.bankAccount?.bankAccountNumber ?? "-"}
                </div>
              </div>
            </Descriptions.Item>
            {/* <Descriptions.Item label="Wallet ID">
              {data.walletId}
            </Descriptions.Item> */}
          </Descriptions>
        )}
      </Modal>
      {/* Popup chấp nhận */}{" "}
      <Modal
        width={900}
        open={approveOpen}
        onCancel={() => setApproveOpen(false)}
        title="Chấp nhận yêu cầu rút tiền"
        okText="Xác nhận chấp nhận"
        confirmLoading={approveLoading}
        onOk={handleApprove}
      >
        <div className="flex flex-row justify-between items-start gap-5">
          {" "}
          <div>
            {" "}
            {/* Cảnh báo + QR */}
            {!paymentInfo ? (
              <Alert
                type="warning"
                showIcon
                message="Thiếu thông tin ngân hàng"
                description="Không thể tạo QR vì chưa đủ thông tin (mã ngân hàng, số tài khoản, tên chủ tài khoản)."
                className="mb-3"
              />
            ) : (
              <div className="mb-3">
                <div className="text-sm mb-2">
                  Quét mã để chuyển khoản nhanh cho người dùng. Vui lòng kiểm
                  tra kỹ <b>số tiền</b> và <b>nội dung chuyển khoản</b> trước
                  khi xác nhận.
                </div>

                <div className="flex flex-col md:flex-row items-start justify-center gap-3">
                  <div className="rounded border p-2">
                    {/* Ảnh QR VietQR */}
                    <img
                      src={qrUrl}
                      alt="QR chuyển khoản VietQR"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                </div>

                <Divider className="my-3" />
              </div>
            )}
          </div>
          <div className="flex items-center h-full">
            <Separator
              orientation="vertical"
              className="h-full min-h-[350px]"
            />
          </div>
          {/* Upload ảnh & ghi chú */}
          <Space direction="vertical" className="w-full">
            <Space direction="vertical" className="w-full">
              <div className="flex items-center justify-center gap-2">
                <ExclamationCircleOutlined />
                <div className="text-sm">
                  Khi chấp nhận, vui lòng tải lên{" "}
                  <b>ảnh xác nhận giao dịch/chuyển khoản</b>. Có thể kèm ghi
                  chú.
                </div>
              </div>

              <Upload
                multiple
                beforeUpload={() => false} // không auto-upload; lấy file từ fileList
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>

              <Form
                form={approveForm}
                layout="vertical"
                className="mt-2 w-full"
              >
                <Form.Item name="note" label="Ghi chú (tuỳ chọn)">
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập ghi chú cho giao dịch (nếu có)…"
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>
              </Form>
            </Space>
          </Space>
        </div>
      </Modal>
      {/* Popup từ chối */}
      <Modal
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        title="Từ chối yêu cầu rút tiền"
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
        confirmLoading={rejectLoading}
        onOk={handleReject}
      >
        <Form form={rejectForm} layout="vertical" className="mt-2">
          <Form.Item name="note" label="Lý do">
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do từ chối hoặc ghi chú nội bộ…"
              maxLength={1000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
