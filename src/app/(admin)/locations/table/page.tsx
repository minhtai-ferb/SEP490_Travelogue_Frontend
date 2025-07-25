"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import type { District } from "@/types/District";
import { useLocationController } from "@/services/location-controller";
import { useDistrictManager } from "@/services/district-manager";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Spin, Modal } from "antd";
import { LocationFilterBar } from "./components/location-filter-bar";
import { DeleteLocationDialog } from "./components/delete-location-dialog";
import { LocationTable } from "@/types/Location";
import { LocationTableComponent } from "./components/location-table";
import { Head } from "react-day-picker";
import HeaderLocationTable from "./components/header";

interface Option {
  value: string;
  label: string;
}

type OnChange = NonNullable<TableProps<Location>["onChange"]>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function ManageLocation() {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const { searchLocation, loading, deleteLocation } = useLocationController();
  const { getAllDistrict } = useDistrictManager();
  const [data, setData] = useState<LocationTable[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] =
    useState<LocationTable | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const districtResponse = await getAllDistrict();
        setOptions([
          { value: "", label: "Tất cả" },
          ...districtResponse.map((district: District) => ({
            value: district.id,
            label: district.name,
          })),
        ]);

        const response = await searchLocation({
          title: "",
          typeId: "",
          districtId: selectedOption,
          heritageRank: undefined,
          pageNumber: currentPage,
          pageSize: pageSize,
        });
        if (!response)
          throw new Error("No data returned from API getAllLocation");
        setData(response?.data as LocationTable[]);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchLocations();
  }, [selectedOption, currentPage, pageSize]);

  //   const handleViewDetails = (record: LocationTable) =>
  //     router.push(`/admin/locations/view/${record.id}`);
  //   const handleEdit = (record: LocationTable) =>
  //     router.push(`/admin/locations/edit/${record.id}`);
  const handleDeleteConfirm = (record: LocationTable) => {
    setLocationToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;
    try {
      await deleteLocation(locationToDelete.id);
      const response = await searchLocation({
        title: "",
        typeId: "",
        districtId: selectedOption,
        heritageRank: undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setData(response?.data as LocationTable[]);
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
    try {
      const response = await searchLocation({
        title: "",
        typeId: "",
        districtId: value,
        heritageRank: undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setData(response?.data as LocationTable[]);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Error fetching data on select change:", error);
    }
  };

  const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      const response = await searchLocation({
        title: value,
        typeId: "",
        districtId: selectedOption,
        heritageRank: undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setData(response?.data as LocationTable[]);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Error fetching data on search:", error);
    }
  };

  return (
    <SidebarInset>
      <HeaderLocationTable />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {loading || data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <LocationFilterBar
              options={options}
              onChangeDistrict={onChangeDistrict}
              onSearch={onSearch}
            />

            <LocationTableComponent
              data={data}
              loading={loading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              onPaginationChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              // onChange={handleChange}
              // onView={handleViewDetails}
              // onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
            />
          </>
        )}
      </div>

      <DeleteLocationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        location={locationToDelete}
      />
    </SidebarInset>
  );
}
