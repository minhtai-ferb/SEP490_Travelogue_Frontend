import { Input, Select } from "antd";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  onChangeDistrict: (value: string) => void;
  onChangeTypeLocation?: (value: string) => void;
  onSearch: (value: string) => void;
  setLoading: (loading: boolean) => void;
  selectedDistrict?: string;
  selectedType?: string;
  searchText?: string;
  onReset?: () => void;
}

export function LocationFilterBar({
  options,
  onChangeDistrict,
  onChangeTypeLocation,
  onSearch,
  setLoading,
  selectedDistrict,
  selectedType,
  searchText,
  onReset,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(searchText ?? "");

  // Debounce search input to avoid fetching on every keystroke
  useEffect(() => {
    const id = setTimeout(() => {
      onSearch(search);
    }, 400);
    return () => clearTimeout(id);
  }, [search, onSearch]);

  return (
    <div className="flex justify-between items-center mb-4 gap-4">
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Chọn quận huyện"
        allowClear
        value={selectedDistrict}
        onChange={onChangeDistrict}
        optionFilterProp="label"
        options={options}
      />
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Chọn loại địa điểm"
        allowClear
        value={selectedType}
        onChange={onChangeTypeLocation}
        optionFilterProp="label"
        options={[
          { value: "", label: "Tất cả" },
          { value: "1", label: "Làng nghề truyền thống" },
          { value: "2", label: "Di tích lịch sử" },
          { value: "3", label: "Ẩm thực" },
          { value: "4", label: "Danh lam thắng cảnh" },
        ]}
      />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm theo tên địa điểm"
        allowClear
      />
      <Button
        variant="outline"
        onClick={() => {
          setSearch("");
          onChangeDistrict("");
          onChangeTypeLocation?.("");
          onSearch("");
          onReset?.();
        }}
      >
        Đặt lại
      </Button>
      <Button
        className="bg-blue-500 text-white"
        onClick={() => {
          router.push("/admin/locations/create");
          setLoading(true);
        }}
      >
        Tạo mới địa điểm
      </Button>
    </div>
  );
}
