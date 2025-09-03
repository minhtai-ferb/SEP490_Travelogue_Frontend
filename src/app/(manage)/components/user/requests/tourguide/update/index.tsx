import React, { useEffect, useState } from "react";
import { useTourguideAssign } from "@/services/tourguide";
import { Button, Table, Modal, Input, message, Tag } from "antd";
import TourGuideProfileModal from "@/app/(manage)/components/booking/tour-guide/detail/[id]/components/TourGuideProfileModal";
import { Check, Eye, X } from "lucide-react";

export default function TourGuideUpdatePriceRequests() {
  const {
    getAllRequestUpdatePrice,
    approveRequestUpdatePrice,
    rejectRequestUpdatePrice,
    getTourguideProfile,
    loading,
  } = useTourguideAssign();
  const [requests, setRequests] = useState<any[]>([]);
  const [rejectModal, setRejectModal] = useState<{
    visible: boolean;
    id: string | null;
  }>({ visible: false, id: null });
  const [rejectReason, setRejectReason] = useState("");
  const [tourGuideModal, setTourGuideModal] = useState<{
    visible: boolean;
    profile: any;
  }>({ visible: false, profile: null });
  const [tourGuideLoading, setTourGuideLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{
    visible: boolean;
    request: any;
  }>({ visible: false, request: null });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getAllRequestUpdatePrice();
      setRequests(data || []);
    } catch (e: any) {
      message.error("Không thể tải danh sách yêu cầu");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRequestUpdatePrice(id);
      message.success("Đã duyệt yêu cầu thành công");
      fetchRequests();
    } catch (e: any) {
      message.error("Duyệt yêu cầu thất bại");
    }
  };

  const handleReject = async () => {
    if (!rejectModal.id) return;
    try {
      await rejectRequestUpdatePrice(rejectModal.id, rejectReason);
      message.success("Đã từ chối yêu cầu thành công");
      setRejectModal({ visible: false, id: null });
      setRejectReason("");
      fetchRequests();
    } catch (e: any) {
      message.error("Từ chối yêu cầu thất bại");
    }
  };

  const handleViewTourGuide = async (tourGuideId: string) => {
    try {
      setTourGuideLoading(true);
      const profile = await getTourguideProfile(tourGuideId);
      setTourGuideModal({ visible: true, profile });
    } catch (e: any) {
      message.error("Không thể tải thông tin hướng dẫn viên");
    } finally {
      setTourGuideLoading(false);
    }
  };

  const handleViewDetail = (request: any) => {
    setDetailModal({ visible: true, request });
  };

  const columns = [
    {
      title: "Tên hướng dẫn viên",
      dataIndex: "tourGuideName",
      key: "tourGuideName",
      render: (name: string, record: any) => (
        <Button
          type="link"
          onClick={() => handleViewTourGuide(record.tourGuideId)}
          className="p-0 h-auto text-left"
        >
          {name}
        </Button>
      ),
    },
    {
      title: "Giá yêu cầu",
      dataIndex: "requestedPrice",
      key: "requestedPrice",
      render: (price: number) => price.toLocaleString() + " ₫",
    },
    {
      title: "Thời gian yêu cầu",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusText",
      key: "statusText",
      render: (text: string, record: any) => {
        if (record.status === 1) return <Tag color="orange">{text}</Tag>;
        if (record.status === 2) return <Tag color="green">{text}</Tag>;
        if (record.status === 3) return <Tag color="red">{text}</Tag>;
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: "Lý do từ chối",
      dataIndex: "rejectionReason",
      key: "rejectionReason",
      render: (reason: string) => reason || "Không có",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <div className="space-x-2">
          <Button size="small" onClick={() => handleViewDetail(record)}>
            <Eye className="w-4 h-4 mr-1" /> Xem chi tiết
          </Button>
          {record.status === 1 && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => handleApprove(record.id)}
                loading={loading}
              >
                <Check className="w-4 h-4 mr-1" /> Duyệt
              </Button>
              <Button
                danger
                size="small"
                onClick={() => setRejectModal({ visible: true, id: record.id })}
              >
                <X className="w-4 h-4 mr-1" /> Từ chối
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Yêu cầu cập nhật giá hướng dẫn viên
      </h2>
      <Table
        columns={columns}
        dataSource={requests}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Modal
        title="Từ chối yêu cầu cập nhật giá"
        open={rejectModal.visible}
        onOk={handleReject}
        onCancel={() => setRejectModal({ visible: false, id: null })}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
      >
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối"
          rows={4}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết yêu cầu cập nhật giá"
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, request: null })}
        footer={[
          <Button
            key="close"
            onClick={() => setDetailModal({ visible: false, request: null })}
          >
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {detailModal.request && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">
                  Tên hướng dẫn viên:
                </label>
                <p className="mt-1">{detailModal.request.tourGuideName}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  Giá yêu cầu:
                </label>
                <p className="mt-1 text-green-600 font-medium">
                  {detailModal.request.requestedPrice?.toLocaleString()} ₫
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">
                  Thời gian yêu cầu:
                </label>
                <p className="mt-1">
                  {new Date(detailModal.request.createdTime).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  Trạng thái:
                </label>
                <div className="mt-1">
                  {detailModal.request.status === 1 && (
                    <Tag color="orange">{detailModal.request.statusText}</Tag>
                  )}
                  {detailModal.request.status === 2 && (
                    <Tag color="green">{detailModal.request.statusText}</Tag>
                  )}
                  {detailModal.request.status === 3 && (
                    <Tag color="red">{detailModal.request.statusText}</Tag>
                  )}
                </div>
              </div>
            </div>

            {detailModal.request.reviewedAt && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">
                    Thời gian xử lý:
                  </label>
                  <p className="mt-1">
                    {new Date(detailModal.request.reviewedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">
                    Người xử lý:
                  </label>
                  <p className="mt-1">
                    {detailModal.request.reviewedByName || "Chưa xác định"}
                  </p>
                </div>
              </div>
            )}

            {detailModal.request.rejectionReason && (
              <div>
                <label className="font-semibold text-gray-700">
                  Lý do từ chối:
                </label>
                <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800">
                    {detailModal.request.rejectionReason}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                type="link"
                onClick={() =>
                  handleViewTourGuide(detailModal.request.tourGuideId)
                }
                className="p-0"
              >
                Xem thông tin hướng dẫn viên
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Tour Guide Profile Modal */}
      <TourGuideProfileModal
        open={tourGuideModal.visible}
        onClose={() => setTourGuideModal({ visible: false, profile: null })}
        tourGuideProfile={tourGuideModal.profile}
        loading={tourGuideLoading}
      />
    </div>
  );
}
