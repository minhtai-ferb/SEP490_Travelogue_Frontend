"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Filter, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LocationComboboxStatic } from "./location-combobox";
import { getTypeExperienceLabel, TypeExperience } from "@/types/News";

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  showDateFilters?: boolean;
  loading?: boolean;
  locationOptions?: { id: string; name: string }[];
}

export interface SearchFilters {
  title?: string;
  locationId?: string;
  isHighlighted?: boolean;
  typeExperience?: number;
  month?: number;
  year?: number;
}

const ALL = "ALL";

export function SearchFilters({
  onSearch,
  showDateFilters = false,
  loading = false,
  locationOptions = [],
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((v) => v !== undefined && v !== ""),
    [filters]
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  const toStr = (v: number | undefined) =>
    v === undefined ? undefined : String(v);
  const boolToStr = (v: boolean | undefined) =>
    v === undefined ? undefined : v ? "true" : "false";

  const handleSearch = () => onSearch(filters);

  const handleClear = () => {
    setFilters({});
    onSearch({});
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const next = { ...filters, [key]: undefined };
    setFilters(next);
    onSearch(next);
  };

  const chips = useMemo(() => {
    const list: Array<{ key: keyof SearchFilters; label: string }> = [];
    if (filters.title)
      list.push({ key: "title", label: `Tiêu đề: ${filters.title}` });
    if (filters.locationId)
      list.push({
        key: "locationId",
        label: `ID địa điểm: ${filters.locationId}`,
      });
    if (filters.isHighlighted !== undefined)
      list.push({
        key: "isHighlighted",
        label: `Trạng thái: ${filters.isHighlighted ? "Nổi bật" : "Thường"}`,
      });
    if (filters.typeExperience !== undefined)
      list.push({
        key: "typeExperience",
        label: `Loại trải nghiệm: ${getTypeExperienceLabel(
          filters.typeExperience
        )}`,
      });
    if (filters.month) {
      const m =
        months.find((x) => x.value === filters.month)?.label ??
        `Tháng ${filters.month}`;
      list.push({ key: "month", label: m });
    }
    if (filters.year) list.push({ key: "year", label: `Năm ${filters.year}` });
    return list;
  }, [filters]);

  // Nếu enum TypeExperience đã import ở file này
  const typeExperienceOptions = useMemo(() => {
    return Object.values(TypeExperience)
      .filter((v): v is number => typeof v === "number")
      .map((value) => ({
        value,
        label: getTypeExperienceLabel(value),
      }));
  }, []);

  return (
    <Card className="border-muted shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Header */}
        <CardHeader className="py-3">
          <div className="flex flex-col gap-3">
            {/* Row 1: Title + Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-base font-semibold">
                  Bộ Lọc Tìm Kiếm
                </CardTitle>
                {hasActiveFilters && (
                  <Badge className="text-xs">Đang lọc</Badge>
                )}
              </div>

              <div className="flex items-center  gap-2">
                {/* Giữ label cho a11y nhưng ẩn thị giác */}
                <Label htmlFor="title" className="sr-only">
                  Tiêu Đề
                </Label>
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                  <Input
                    id="title"
                    placeholder="Tìm theo tiêu đề..."
                    className="pl-8 h-9"
                    value={filters.title ?? ""}
                    onChange={(e) =>
                      setFilters({ ...filters, title: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  className="h-9"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tìm Kiếm
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9"
                    onClick={handleClear}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa tất cả
                  </Button>
                )}
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-9", isOpen && "bg-muted")}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? "Thu gọn" : "Mở bộ lọc"}
                    <ChevronDown
                      className={cn(
                        "ml-2 h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Chips hiển thị filter đang áp dụng */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <Badge
                    key={c.key as string}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {c.label}
                    <button
                      type="button"
                      className="ml-1 rounded hover:bg-muted/70"
                      onClick={() => removeFilter(c.key)}
                      aria-label={`Xóa ${c.label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <Separator />

        {/* Content – chỉ hiển thị khi mở */}
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Mã địa điểm */}
              <div className="space-y-2">
                <Label htmlFor="locationId">Mã Địa Điểm</Label>
                <LocationComboboxStatic
                  options={locationOptions ?? []}
                  value={filters.locationId}
                  onChange={(id) => setFilters({ ...filters, locationId: id })}
                  label="Địa Điểm (từ danh sách)"
                  placeholder="Chọn địa điểm trong trang hiện tại"
                  disabled={loading}
                  showChip
                />
              </div>

              {/* Trạng thái */}
              <div className="space-y-2">
                <Label htmlFor="highlighted">Trạng Thái</Label>
                <Select
                  value={boolToStr(filters.isHighlighted)}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      isHighlighted:
                        value === ALL ? undefined : value === "true",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Tất cả</SelectItem>
                    <SelectItem value="true">Nổi bật</SelectItem>
                    <SelectItem value="false">Thường</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loại trải nghiệm */}
              <div className="space-y-2">
                <Label htmlFor="typeExperience">Loại Trải Nghiệm</Label>
                <Select
                  value={toStr(filters.typeExperience)}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      typeExperience: value === ALL ? undefined : Number(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại trải nghiệm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Tất cả</SelectItem>
                    {typeExperienceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tháng / Năm (tùy chọn) */}
              {showDateFilters && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="month">Tháng</Label>
                    <Select
                      value={toStr(filters.month)}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          month: value === ALL ? undefined : Number(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tháng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>Tất cả</SelectItem>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={String(m.value)}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Năm</Label>
                    <Select
                      value={toStr(filters.year)}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          year: value === ALL ? undefined : Number(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn năm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>Tất cả</SelectItem>
                        {years.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
