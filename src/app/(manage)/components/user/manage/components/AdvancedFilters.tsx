"use client";

import React from "react";
import { 
  Card, 
  Select, 
  Space, 
  Button, 
  Popover, 
  Checkbox, 
  Divider,
  Typography 
} from "antd";
import { 
  FilterOutlined, 
  ClearOutlined 
} from "@ant-design/icons";
import { User } from "@/types/Users";

const { Text } = Typography;
const { Option } = Select;

type Role = {
  id: string;
  name: string;
};

interface AdvancedFiltersProps {
  users: User[];
  roles: Role[];
  selectedRoleIds: string[];
  onRoleFilterChange: (roleIds: string[]) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  emailVerified?: boolean | null;
  hasActiveRoles?: boolean | null;
  roleStatus?: 'active' | 'inactive' | 'all';
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  users,
  roles,
  selectedRoleIds,
  onRoleFilterChange,
  onFilterChange
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>({
    emailVerified: null,
    hasActiveRoles: null,
    roleStatus: 'all'
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      emailVerified: null,
      hasActiveRoles: null,
      roleStatus: 'all'
    };
    setFilters(clearedFilters);
    onRoleFilterChange([]);
    onFilterChange(clearedFilters);
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.emailVerified !== null) count++;
    if (filters.hasActiveRoles !== null) count++;
    if (filters.roleStatus !== 'all') count++;
    if (selectedRoleIds.length > 0) count++;
    return count;
  };

  const filterContent = (
    <div style={{ width: 300 }} className="space-y-4">
      <div>
        <Text strong>Trạng thái xác thực email</Text>
        <div className="mt-2">
          <Checkbox.Group
            value={filters.emailVerified === null ? [] : [filters.emailVerified]}
            onChange={(values) => {
              handleFilterChange('emailVerified', values.length > 0 ? values[0] : null);
            }}
          >
            <Space direction="vertical">
              <Checkbox value={true}>Đã xác thực</Checkbox>
              <Checkbox value={false}>Chưa xác thực</Checkbox>
            </Space>
          </Checkbox.Group>
        </div>
      </div>

      <Divider />

      <div>
        <Text strong>Trạng thái vai trò</Text>
        <div className="mt-2">
          <Checkbox.Group
            value={filters.hasActiveRoles === null ? [] : [filters.hasActiveRoles]}
            onChange={(values) => {
              handleFilterChange('hasActiveRoles', values.length > 0 ? values[0] : null);
            }}
          >
            <Space direction="vertical">
              <Checkbox value={true}>Có vai trò hoạt động</Checkbox>
              <Checkbox value={false}>Không có vai trò hoạt động</Checkbox>
            </Space>
          </Checkbox.Group>
        </div>
      </div>

      <Divider />

      <div>
        <Text strong>Lọc theo vai trò</Text>
        <div className="mt-2">
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn vai trò..."
            style={{ width: '100%' }}
            value={selectedRoleIds}
            onChange={onRoleFilterChange}
            maxTagCount="responsive"
          >
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Divider />

      <div className="text-right">
        <Button
          size="small"
          icon={<ClearOutlined />}
          onClick={clearFilters}
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={filterContent}
      title="Bộ lọc nâng cao"
      trigger="click"
      placement="bottomLeft"
    >
      <Button 
        icon={<FilterOutlined />}
        type={getFilterCount() > 0 ? "primary" : "default"}
      >
        Bộ lọc {getFilterCount() > 0 && `(${getFilterCount()})`}
      </Button>
    </Popover>
  );
};

export default AdvancedFilters;
