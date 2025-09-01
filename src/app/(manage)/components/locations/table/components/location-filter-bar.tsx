import { Input, Select } from "antd";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Option {
  value: string;
  label: string;
}

interface Props {
  href: string;
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
  href,
}: Props) {
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* First row - Main filters */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap flex-1">
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
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm theo tên địa điểm"
            allowClear
            style={{ width: 250 }}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onSearch("");
              onChangeDistrict("");
              onChangeTypeLocation?.("");
              onReset?.();
            }}
          >
            Đặt lại
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => {
              router.push(`${href}/create`);
              setLoading(true);
            }}
          >
            Tạo mới địa điểm
          </Button>
        </div>
      </div>

      {/* Second row - Price range filter */}
      {/* {onPriceRangeChange && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium min-w-fit">Khoảng giá (VNĐ):</span>
          <div className="flex-1 max-w-md">
            <Slider
              range
              min={0}
              max={100000}
              step={1000}
              value={priceRange || [0, 100000]}
              onChange={(value) => onPriceRangeChange(value as [number, number])}
              marks={{
                0: '0',
                25000: '25K',
                50000: '50K',
                75000: '75K',
                100000: '100K+'
              }}
            />
          </div>
        </div> 
      )}*/}
    </div>
  );
}
