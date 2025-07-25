import { Input, Select } from "antd";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  onChangeDistrict: (value: string) => void;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LocationFilterBar({ options, onChangeDistrict, onSearch }: Props) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-4 gap-4">
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Chọn quận huyện"
        onChange={onChangeDistrict}
        optionFilterProp="label"
        options={options}
      />
      <Input onChange={onSearch} placeholder="Tìm kiếm theo tên địa điểm" />
      <Button
        className="bg-blue-500 text-white"
        onClick={() => router.push("/locations/create")}
      >
        Tạo mới địa điểm
      </Button>
    </div>
  );
}
