import { useState } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { User } from "@/types/Users";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

export const useTableState = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => 
        `${range[0]}-${range[1]} trên ${total} người dùng`,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    setTableParams({
      pagination,
      filters,
      sortField: Array.isArray(sorter) ? undefined : sorter.field?.toString(),
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order || undefined,
    });
  };

  return {
    tableParams,
    handleTableChange
  };
};
