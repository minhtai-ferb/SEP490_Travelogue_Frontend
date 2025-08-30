// components/BookingFilterBar.tsx
"use client";
import { DatePicker, Select, Input } from "antd";
import { Button } from "@/components/ui/button";
import dayjs, { Dayjs } from "dayjs";
const { RangePicker } = DatePicker;

export type BookingFilter = {
  status?: number;
  bookingType?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string; // dùng local
};

type Props = {
  value: BookingFilter;
  onChange: (next: BookingFilter) => void;
  onReset: () => void;
  onApply: () => void;
};

export default function BookingFilterBar({
  value,
  onChange,
  onReset,
  onApply,
}: Props) {
  const onChangeRange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (!dates || !dates[0] || !dates[1]) {
      return onChange({ ...value, startDate: undefined, endDate: undefined });
    }
    onChange({
      ...value,
      startDate: dates[0].startOf("day").toDate().toISOString(),
      endDate: dates[1].endOf("day").toDate().toISOString(),
    });
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="whitespace-nowrap text-sm">Tìm kiếm:</span>
        <Input
          allowClear
          placeholder="Tìm tour / khách hàng"
          style={{ width: 360 }}
          value={value.keyword}
          onChange={(e) => onChange({ ...value, keyword: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 180 }}
          options={[
            { value: 0, label: "Đang chờ thanh toán" },
            { value: 1, label: "Đã thanh toán" },
            { value: 2, label: "Bị hủy chưa thanh toán" },
            { value: 3, label: "Bị hủy đã thanh toán" },
            { value: 4, label: "Bị hủy bởi nhà cung cấp" },
            { value: 5, label: "Đã hoàn thành" },
            { value: 6, label: "Hết hạn" },
          ]}
          value={value.status}
          onChange={(v) =>
            onChange({ ...value, status: v as number | undefined })
          }
        />

        <RangePicker
          onChange={onChangeRange}
          value={
            value.startDate && value.endDate
              ? [dayjs(value.startDate), dayjs(value.endDate)]
              : null
          }
          format="DD/MM/YYYY"
        />

        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={onReset}>
            Xóa lọc
          </Button>
          <Button className="bg-blue-500 text-white" onClick={onApply}>
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
}
