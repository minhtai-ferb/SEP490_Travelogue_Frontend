import React from "react";
import { Table, Card } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { User } from "@/types/Users";
import {
  UserInfoCell,
  ContactInfoCell,
  RolesCell,
  WalletCell,
  StatusCell,
  DateCell,
} from "./TableCells";
import UserActionsMenu from "./UserActionsMenu";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  tableParams: TableParams;
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => void;
  onViewUserDetails: (user: User) => void;
  onManageUserRoles: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  tableParams,
  onTableChange,
  onViewUserDetails,
  onManageUserRoles,
}) => {
  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      fixed: "left",
      key: "user",
      width: 300,
      render: (_, record) => <UserInfoCell user={record} />,
    },
    {
      title: "Thông tin liên hệ",
      key: "contact",
      width: 280,
      render: (_, record) => <ContactInfoCell user={record} />,
    },
    {
      title: "Vai trò",
      key: "roles",
      width: 220,
      render: (_, record) => <RolesCell roles={record.roles} />,
    },
    {
      title: "Giới tính",
      dataIndex: "genderText",
      key: "gender",
      width: 110,
      align: "center",
    },
    {
      title: "Ví tiền",
      key: "wallet",
      width: 140,
      align: "right",
      render: (_, record) => <WalletCell wallet={record.wallet} />,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 160,
      align: "center",
      render: (_, record) => <StatusCell user={record} />,
    },
    {
      title: "Ngày tạo",
      key: "createdTime",
      width: 140,
      sorter: (a, b) =>
        new Date(a.createdTime ?? 0).getTime() - new Date(b.createdTime ?? 0).getTime(),
      render: (_, record) => <DateCell date={record.createdTime ?? ""} />,
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 120,
      align: "center",
      render: (_, record) => (
        <UserActionsMenu
          user={record}
          onViewDetails={onViewUserDetails}
          onManageRoles={onManageUserRoles}
        />
      ),
    },
  ];

  return (
    <Card>
      <Table<User>
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          ...tableParams.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} người dùng`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={onTableChange}
        loading={loading}
        scroll={{ x: "max-content", y: 600 }}
        size="middle"
        bordered
      />
    </Card>
  );
};

export default UserTable;
