"use client";

import React from "react";
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import { FilterOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { getWithdrawalStatusText, WithdrawalStatus } from "@/types/RequestWithdrawal";

const { RangePicker } = DatePicker;

export type FilterValues = {
  userId?: string;
  status?: number;
  range?: [Dayjs, Dayjs];
};

export default function Filters({
  loading,
  initialRange,
  onSubmit,
  onReset,
  onSearchName,
}: {
  loading: boolean;
  initialRange?: [Dayjs, Dayjs];
  onSubmit: (values: FilterValues) => void;
  onReset: () => void;
  onSearchName: (kw: string) => void;
}) {
  const [form] = Form.useForm<FilterValues>();

  React.useEffect(() => {
    if (initialRange) {
      form.setFieldsValue({ range: initialRange });
    }
  }, [initialRange, form]);

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={() => onSubmit(form.getFieldsValue())}
      className="flex flex-wrap gap-3"
    >
      <Form.Item name="userId">
        <Input placeholder="User ID" allowClear style={{ width: 220 }} />
      </Form.Item>

      <Form.Item name="status">
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 200 }}
          options={[
            { label: getWithdrawalStatusText(WithdrawalStatus.PENDING), value: WithdrawalStatus.PENDING },
            { label: getWithdrawalStatusText(WithdrawalStatus.APPROVED), value: WithdrawalStatus.APPROVED },
            { label: getWithdrawalStatusText(WithdrawalStatus.REJECTED), value: WithdrawalStatus.REJECTED },
          ]}
        />
      </Form.Item>

      <Form.Item name="range">
        <RangePicker
          showTime
          allowClear
          placeholder={["Từ ngày", "Đến ngày"]}
          format="DD/MM/YYYY HH:mm"
          disabledDate={(d) => d.isAfter(dayjs())}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button htmlType="submit" type="primary" icon={<FilterOutlined />} loading={loading}>
            Lọc
          </Button>
          <Button onClick={onReset} icon={<ReloadOutlined />} disabled={loading}>
            Xóa bộ lọc
          </Button>
        </Space>
      </Form.Item>

      <Form.Item style={{ marginLeft: "auto" }}>
        <Input
          allowClear
          placeholder="Tìm theo tên người dùng..."
          prefix={<SearchOutlined />}
          style={{ width: 260 }}
          onChange={(e) => onSearchName(e.target.value)}
          disabled={loading}
        />
      </Form.Item>
    </Form>
  );
}
