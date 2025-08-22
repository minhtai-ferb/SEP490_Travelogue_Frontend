import { Table, Tag } from "antd";
import { CommissionRate } from "@/types/CommissionSetting";
import dayjs from "dayjs";
import LoadingContent from "@/components/common/loading-content";

interface Props {
  data: CommissionRate[];
  loading: boolean;
}

export default function CommissionTable({ data, loading }: Props) {
  const now = dayjs();

  const columns = [
    {
      title: "Tỉ lệ (%)",
      dataIndex: "rateValue",
      key: "rateValue",
      render: (val: number) => `${val}%`,
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (val: string | null) =>
        val ? dayjs(val).format("DD/MM/YYYY HH:mm") : "Chưa có",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: CommissionRate) => {
        const eff = dayjs(record.effectiveDate);
        const exp = record.expiryDate ? dayjs(record.expiryDate) : null;

        if (eff.isAfter(now)) {
          return <Tag color="blue">Chưa tới hạn</Tag>;
        }
        if (exp && exp.isBefore(now)) {
          return <Tag color="red">Hết hạn</Tag>;
        }
        return <Tag color="green">Đang hiệu lực</Tag>;
      },
    },
  ];

  if (loading || !data.length) {
    return <LoadingContent />;
  }

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={columns}
      loading={loading}
      pagination={{
        pageSize: 5, // 5 dòng mỗi trang
        showSizeChanger: true, // cho phép đổi số dòng/trang
        pageSizeOptions: [5, 10, 20, 50],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
      }}
    />
  );
}
