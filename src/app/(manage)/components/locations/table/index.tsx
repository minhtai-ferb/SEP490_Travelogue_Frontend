"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import type { District } from "@/types/District";
import { useDistrictManager } from "@/services/district-manager";
import { Modal } from "antd";
import { LocationFilterBar } from "./components/location-filter-bar";
import { DeleteLocationDialog } from "./components/delete-location-dialog";
import { LocationTable } from "@/types/Location";
import { LocationTableComponent } from "./components/location-table";
import { useLocations } from "@/services/use-locations";
import LoadingContent from "@/components/common/loading-content";
import { useDebounce } from "@/hooks/useDebounce";

interface Option {
  value: string;
  label: string;
}

type OnChange = NonNullable<TableProps<LocationTable>["onChange"]>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function LocationsTable({ href }: { href: string }) {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const { getAllDistrict } = useDistrictManager();
  const { searchAllLocations, deleteLocation } = useLocations();
  const [loadingButton, setLoadingButton] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [data, setData] = useState<LocationTable[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] =
    useState<LocationTable | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );

  // Debounce search text to avoid excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Memoized query params used for fetching
  const query = useMemo(
    () => ({
      title: debouncedSearchText,
      type: selectedType ? parseInt(selectedType, 10) : undefined,
      districtId: selectedOption || undefined,
      heritageRank: undefined as number | undefined,
      pageNumber: currentPage,
      pageSize: pageSize,
    }),
    [debouncedSearchText, selectedType, selectedOption, currentPage, pageSize]
  );

  const fetchLocations = useCallback(async () => {
    setTableLoading(true);
    try {
      console.log("Fetching locations with query:", query);

      const response = await searchAllLocations(query);
      if (!response)
        throw new Error("No data returned from API getAllLocation");
      setData(response?.data as LocationTable[]);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setTableLoading(false);
    }
  }, [searchAllLocations, query]);

  // Load districts once
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const districtResponse = await getAllDistrict();
        setOptions([
          { value: "", label: "Tất cả" },
          ...districtResponse.map((district: District) => ({
            value: district.id,
            label: district.name,
          })),
        ]);
      } catch (error) {
        console.error("Error loading districts:", error);
      }
    };
    loadDistricts();
  }, [getAllDistrict]);

  // Debounced effect for fetching data
  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearchText,
    selectedType,
    selectedOption,
    currentPage,
    pageSize,
  ]);

  const handleViewDetails = (record: LocationTable) => {
    setLoadingButton(true);
    router.push(`${href}/view/${record.id}`);
  };
  const handleEdit = (record: LocationTable) => {
    setLoadingButton(true);
    router.push(`${href}/edit/${record.id}`);
  };
  const handleDeleteConfirm = (record: LocationTable) => {
    setLocationToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;
    try {
      await deleteLocation(locationToDelete.id);
      // Refresh the current page data after deletion
      await fetchLocations();
      Modal.success({
        title: "Thành công",
        content: "Đã xóa địa điểm thành công",
      });
    } catch (error) {
      console.error("Error deleting location:", error);
      Modal.error({
        title: "Lỗi",
        content: "Không thể xóa địa điểm. Vui lòng thử lại sau.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    }
  };

  const handleChange: OnChange = (pagination, filters, sorter, extra) => {
    setFilteredInfo(filters);
    setSortedInfo(Array.isArray(sorter) ? sorter[0] || {} : sorter);
  };

  const onChangeDistrict = async (value: string) => {
    setSelectedOption(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const onChangeTypeLocation = async (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const onSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleResetFilters = () => {
    setSelectedOption("");
    setSelectedType(undefined);
    setSearchText("");
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <LocationFilterBar
          href={href}
          options={options}
          onChangeTypeLocation={onChangeTypeLocation}
          onChangeDistrict={onChangeDistrict}
          onSearch={onSearch}
          setLoading={setLoadingButton}
          selectedDistrict={selectedOption}
          selectedType={selectedType}
          searchText={searchText}
          onReset={handleResetFilters}
        />
        <div>
          {loadingButton ? (
            <LoadingContent />
          ) : (
            <LocationTableComponent
              data={data}
              loading={tableLoading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              onPaginationChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              onChange={handleChange}
              onView={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
            />
          )}
        </div>
      </div>

      <DeleteLocationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        location={locationToDelete}
      />
    </>
  );
}
