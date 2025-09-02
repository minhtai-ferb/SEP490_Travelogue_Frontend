"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import toast from "react-hot-toast";

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
  const searchParams = useSearchParams();
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

  // Load districts once and set initial filter from URL params
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

        // Set initial filters from URL params
        const districtIdFromUrl = searchParams.get('districtId');
        const typeFromUrl = searchParams.get('type');
        const searchFromUrl = searchParams.get('search');
        const pageFromUrl = searchParams.get('page');
        const pageSizeFromUrl = searchParams.get('pageSize');
        
        if (districtIdFromUrl) {
          setSelectedOption(districtIdFromUrl);
        }
        if (typeFromUrl) {
          setSelectedType(typeFromUrl);
        }
        if (searchFromUrl) {
          setSearchText(searchFromUrl);
        }
        if (pageFromUrl) {
          setCurrentPage(parseInt(pageFromUrl, 10));
        }
        if (pageSizeFromUrl) {
          setPageSize(parseInt(pageSizeFromUrl, 10));
        }
      } catch (error) {
        console.error("Error loading districts:", error);
      }
    };
    loadDistricts();
  }, [getAllDistrict, searchParams]);

  // Debounced effect for fetching data
  useEffect(() => {
    // Only fetch if we have loaded districts (options)
    if (options.length > 0) {
      fetchLocations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearchText,
    selectedType,
    selectedOption,
    currentPage,
    pageSize,
    options.length, // Add this to ensure districts are loaded first
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
      const response = await deleteLocation(locationToDelete.id);
      // Refresh the current page data after deletion
      await fetchLocations();
      toast.success("Đã xóa địa điểm thành công");
    } catch (error : any) {
      console.error("Error deleting location:", error);
      toast.error(error?.response?.data?.Message || "Không thể xóa địa điểm. Vui lòng thử lại sau.");
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
    
    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('districtId', value);
    } else {
      params.delete('districtId');
    }
    router.replace(`${href}?${params.toString()}`, { scroll: false });
  };

  const onChangeTypeLocation = async (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to first page when filter changes
    
    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('type', value);
    } else {
      params.delete('type');
    }
    router.replace(`${href}?${params.toString()}`, { scroll: false });
  };

  const onSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when search changes
    
    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace(`${href}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSelectedOption("");
    setSelectedType(undefined);
    setSearchText("");
    setCurrentPage(1);
    
    // Clear URL params
    router.replace(href, { scroll: false });
  };

  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4 absolute w-full ">
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
          totalCount={totalCount}
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
                
                // Update URL params for pagination
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', page.toString());
                params.set('pageSize', size.toString());
                router.replace(`${href}?${params.toString()}`, { scroll: false });
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
    </div>
  );
}
