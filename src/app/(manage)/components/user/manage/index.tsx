"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/Users";
import { useUserManager } from "@/services/user-manager";
import LoadingContent from "@/components/common/loading-content";
import toast from "react-hot-toast";
import UserDetailDrawer from "./components/UserDetailDrawer";
import UserRoleManager from "./components/UserRoleManager";
import AdvancedFilters, { FilterOptions } from "./components/AdvancedFilters";
import ExportData from "./components/ExportData";
import { 
  Table, 
  Tag, 
  Avatar, 
  Space, 
  Button, 
  Input, 
  Select, 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Typography,
  Dropdown,
  MenuProps,
  Tooltip,
  Modal,
  message
} from "antd";
import { 
  SearchOutlined, 
  EyeOutlined, 
  EditOutlined, 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UnlockOutlined,
  LockOutlined,
  SettingOutlined
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

type Role = {
  id: string;
  name: string;
};

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

function ManageUserTable({ href }: { href: string }) {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleManagerOpen, setRoleManagerOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({});
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
  
  const { getListUser, getAllRoles, enableUserRole, disableUserRole, loading } = useUserManager();

  const fetchRoles = async () => {
    try {
      const response: Role[] = await getAllRoles();
      setRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      console.warn("Không thể tải danh sách vai trò", error);
    }
  };

  // Filter users based on search and role filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchValue) {
      filtered = filtered.filter((user) =>
        user.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Role filter
    if (selectedRoleIds.length > 0) {
      const selectedRoleNames = roles
        .filter((r) => selectedRoleIds.includes(r.id))
        .map((r) => r.name);
      
      filtered = filtered.filter((user) => {
        const userRoleNames = user.roles?.map(role => role.name) || [];
        return selectedRoleNames.some((roleName) => userRoleNames.includes(roleName));
      });
    }

    // Advanced filters
    if (advancedFilters.emailVerified !== null && advancedFilters.emailVerified !== undefined) {
      filtered = filtered.filter((user) => user.isEmailVerified === advancedFilters.emailVerified);
    }

    if (advancedFilters.hasActiveRoles !== null && advancedFilters.hasActiveRoles !== undefined) {
      filtered = filtered.filter((user) => {
        const hasActive = user.roles?.some(role => role.isActive) || false;
        return hasActive === advancedFilters.hasActiveRoles;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchValue, selectedRoleIds, roles, advancedFilters]);

  // Table columns definition
  const columns: ColumnsType<User> = [
    {
      title: 'Người dùng',
      fixed: 'left',
      key: 'user',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            src={record.avatarUrl} 
            icon={<UserOutlined />}
          >
            {record.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900">{record.fullName}</div>
            <div className="text-sm text-gray-500">{record.userName}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin liên hệ',
      key: 'contact',
      width: 280,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-gray-400" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phoneNumber || 'Chưa có'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      key: 'roles',
      width: 220,
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.roles?.map((role, index) => {
            let color = 'default';
            switch (role.name) {
              case 'Admin': color = 'red'; break;
              case 'Moderator': color = 'orange'; break;
              case 'TourGuide': color = 'blue'; break;
              case 'CraftVillageOwner': color = 'green'; break;
              case 'User': color = 'purple'; break;
            }
            return (
              <Tag key={index} color={color}>
                {role.name}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'genderText',
      key: 'gender',
      width: 110,
      align: 'center',
    },
    {
      title: 'Ví tiền',
      key: 'wallet',
      width: 140,
      align: 'right',
      render: (_, record) => (
        <span className="font-medium text-green-600">
          {record.wallet?.userWalletAmount?.toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 160,
      align: 'center',
      render: (_, record) => {
        const isVerified = record.isEmailVerified;
        const activeRoles = record.roles?.filter(role => role.isActive) || [];
        const inactiveRoles = record.roles?.filter(role => !role.isActive) || [];
        
        return (
          <div className="space-y-1">
            <Tag 
              color={isVerified ? 'success' : 'warning'} 
              icon={isVerified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            >
              {isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
            </Tag>
            {activeRoles.length > 0 && (
              <div className="text-xs text-green-600">
                {activeRoles.length} vai trò hoạt động
              </div>
            )}
            {inactiveRoles.length > 0 && (
              <div className="text-xs text-orange-600">
                {inactiveRoles.length} vai trò tạm dừng
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Ngày tạo',
      key: 'createdTime',
      width: 140,
      sorter: (a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
      render: (_, record) => (
        <div className="flex items-center gap-2 text-sm">
          <CalendarOutlined className="text-gray-400" />
          <span>{new Date(record.createdTime).toLocaleDateString('vi-VN')}</span>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const isLocked = record.lockoutEnd && new Date(record.lockoutEnd) > new Date();
        
        const items: MenuProps['items'] = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
          },
          {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <EditOutlined />,
          },
          {
            type: 'divider',
          },
          {
            key: 'manageRoles',
            label: 'Quản lý vai trò',
            icon: <SettingOutlined />,
          },
        ];

        const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
          if (key === 'view') {
            setSelectedUser(record);
            setDrawerOpen(true);
          } else if (key === 'edit') {
            window.open(`${href}/${record.id}`, '_blank');
          } else if (key === 'manageRoles') {
            setSelectedUser(record);
            setRoleManagerOpen(true);
          }
        };

        return (
          <Dropdown 
            menu={{ items, onClick: handleMenuClick }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              size="small"
            />
          </Dropdown>
        );
      },
    },
  ];

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

  const fetchUsers = async () => {
    try {
      const response: User[] = await getListUser();
      console.log("User data: ", response);
      if (!response) {
        throw new Error("No data returned from API getListUser");
      }
      
      setUsers(response);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data.Message ||
        "Đã xảy ra lỗi khi lấy dữ liệu người dùng";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [getListUser, getAllRoles]);

  // Statistics
  const totalUsers = users.length;
  const verifiedUsers = users.filter((user) => user.isEmailVerified).length;
  const unverifiedUsers = users.filter((user) => !user.isEmailVerified).length;
  const usersWithActiveRoles = users.filter((user) => 
    user.roles?.some(role => role.isActive)
  ).length;
  const adminUsers = users.filter((user) => 
    user.roles?.some(role => role.name === 'Admin' && role.isActive)
  ).length;

  return (
    <div className="w-full min-w-0">
      {loading ? (
        <LoadingContent />
      ) : (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Tổng số người dùng"
                  value={totalUsers}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Đã xác thực"
                  value={verifiedUsers}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Chưa xác thực"
                  value={unverifiedUsers}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Có vai trò hoạt động"
                  value={usersWithActiveRoles}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters and Search */}
          <Card className="min-w-0">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0 w-full lg:w-auto">
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <Search
                    placeholder="Tìm kiếm theo tên, email, username..."
                    allowClear
                    style={{ width: '100%', maxWidth: 300 }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    prefix={<SearchOutlined />}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
                  <AdvancedFilters
                    users={users}
                    roles={roles}
                    selectedRoleIds={selectedRoleIds}
                    onRoleFilterChange={setSelectedRoleIds}
                    onFilterChange={setAdvancedFilters}
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

          {/* Main Table */}
          <Card className="overflow-hidden min-w-0">
            <div className="overflow-x-auto">
              <Table<User>
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                pagination={{
                  ...tableParams.pagination,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} trên ${total} người dùng`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                onChange={handleTableChange}
                loading={loading}
                scroll={{ x: 'max-content', y: 600 }}
                size="middle"
                bordered
              />
            </div>
          </Card>
        </div>
      )}
      
      {/* User Detail Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
        }}
      />
      
      {/* User Role Manager */}
      <UserRoleManager
        user={selectedUser}
        open={roleManagerOpen}
        onClose={() => {
          setRoleManagerOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={() => {
          fetchUsers();
        }}
      />
    </div>
  );
}

export default ManageUserTable;
