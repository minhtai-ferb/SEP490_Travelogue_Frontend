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
  totalCount?: number;
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
  totalCount,
}: Props) {
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Quản lý địa điểm du lịch
              </h1>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {totalCount || 0}
            </div>
            <div className="text-sm text-gray-500 font-medium">Địa điểm</div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Đã cập nhật
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced filters section */}
      <div className="flex justify-between items-center gap-4 flex-wrap bg-white p-5 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Quận/Huyện</label>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Chọn quận huyện"
              allowClear
              value={selectedDistrict}
              onChange={onChangeDistrict}
              optionFilterProp="label"
              options={options}
              className="rounded-lg"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Loại địa điểm</label>
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
              className="rounded-lg"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Tìm kiếm</label>
            <Input
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Nhập tên địa điểm..."
              allowClear
              style={{ width: 250 }}
              className="rounded-lg"
              prefix={
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50"
            onClick={() => {
              onSearch("");
              onChangeDistrict("");
              onChangeTypeLocation?.("");
              onReset?.();
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đặt lại
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md flex items-center gap-2"
            onClick={() => {
              router.push(`${href}/create`);
              setLoading(true);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
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
