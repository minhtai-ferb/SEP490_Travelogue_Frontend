import { Button } from "antd";
import CommissionTable from "./CommissionTable";
import { CommissionRate } from "@/types/CommissionSetting";

interface Props {
  title: string;
  type: number;
  data: CommissionRate[];
  loading: boolean;
  onAdd: (type: number) => void;
}

export default function CommissionPanel({
  title,
  type,
  data,
  loading,
  onAdd,
}: Props) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button type="primary" onClick={() => onAdd(type)}>
          + Thay đổi hoa hồng
        </Button>
      </div>
      <CommissionTable data={data} loading={loading} />
    </div>
  );
}
