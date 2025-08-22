"use client";

import { useEffect, useState } from "react";
import { message } from "antd";
import { CommissionGroup, CommissionRate } from "@/types/CommissionSetting";
import CommissionPanel from "./CommissionPanel";
import CommissionFormModal from "./CommissionFormModal";
import { useCommissionSetting } from "@/services/use-commissionsetting";
import toast from "react-hot-toast";

export default function CommissionSettingsPage() {
  const { getCommissionSettings, createCommissionSetting, loading } =
    useCommissionSetting();

  const [data, setData] = useState<CommissionGroup[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<number>(1);

  // fetch dữ liệu
  useEffect(() => {
    (async () => {
      const res = await getCommissionSettings();
      if (res) setData(res);
    })();
  }, [getCommissionSettings]);

  const getRates = (type: number): CommissionRate[] =>
    data.find((g) => g.type === type)?.rates || [];

  const handleAddClick = (type: number) => {
    setSelectedType(type);
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const newRate: CommissionRate = {
      id: "",
      type: selectedType,
      commissionTypeText:
        selectedType === 1 ? "Hoa hồng hướng dẫn viên" : "Hoa hồng làng nghề",
      rateValue: values.rateValue,
      effectiveDate: values.effectiveDate.format("YYYY-MM-DDTHH:mm:ss"),
      expiryDate: null,
    };

    const res = await createCommissionSetting(newRate);
    if (res) {
      toast.success("Thêm hoa hồng thành công!");
      setModalOpen(false);
      const refreshed = await getCommissionSettings();
      if (refreshed) setData(refreshed);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <CommissionPanel
        title="Hoa hồng Hướng dẫn viên"
        type={1}
        data={getRates(1)}
        loading={loading}
        onAdd={handleAddClick}
      />

      <CommissionPanel
        title="Hoa hồng Làng nghề"
        type={2}
        data={getRates(2)}
        loading={loading}
        onAdd={handleAddClick}
      />

      <CommissionFormModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        type={selectedType}
        loading={loading}
      />
    </div>
  );
}
