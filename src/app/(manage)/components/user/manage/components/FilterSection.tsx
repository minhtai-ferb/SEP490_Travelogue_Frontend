import React from "react";
import { Card, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdvancedFilters, { FilterOptions } from "./AdvancedFilters";
import ExportData from "./ExportData";
import { User } from "@/types/Users";

const { Search } = Input;

type Role = {
  id: string;
  name: string;
};

interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  users: User[];
  filteredUsers: User[];
  roles: Role[];
  selectedRoleIds: string[];
  onRoleFilterChange: (roleIds: string[]) => void;
  onFilterChange: (filters: FilterOptions) => void;
  totalUsers: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchValue,
  onSearchChange,
  users,
  filteredUsers,
  roles,
  selectedRoleIds,
  onRoleFilterChange,
  onFilterChange,
  totalUsers
}) => {
  return (
    <Card className="min-w-0">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0 w-full lg:w-auto">
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Search
              placeholder="Tìm kiếm theo tên, email, username..."
              allowClear
              style={{ width: '100%', maxWidth: 300 }}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
            <AdvancedFilters
              users={users}
              roles={roles}
              selectedRoleIds={selectedRoleIds}
              onRoleFilterChange={onRoleFilterChange}
              onFilterChange={onFilterChange}
            />
            <ExportData
              users={users}
              filteredUsers={filteredUsers}
            />
          </div>
        </div>
        <div className="text-sm text-gray-500 flex-shrink-0">
          Hiển thị {filteredUsers.length} / {totalUsers} người dùng
        </div>
      </div>
    </Card>
  );
};

export default FilterSection;
