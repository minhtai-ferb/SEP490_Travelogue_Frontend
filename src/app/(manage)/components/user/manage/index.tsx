"use client";

import React, { useState, useEffect } from "react";
import { createColumns } from "./components/columns-user";
import { User, UserTable } from "@/types/Users";
import SearchInput from "./components/search-user";
import { useUserManager } from "@/services/user-manager";
import LoadingContent from "@/components/common/loading-content";
import toast from "react-hot-toast";
import { DataTable } from "@/components/table/data-table-user";
import { Select } from "antd";

type Role = {
  id: string;
  name: string;
};

function ManageUserTable({ href }: { href: string }) {
  const [searchValue, setSearchValue] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const { getListUser, getAllRoles, loading } = useUserManager();



  const fetchUsers = async () => {
    try {
      const response: User[] = await getListUser();
      console.log("User data: ", response);
      if (!response) {
        throw new Error("No data returned from API getListUser");
      }
      const userTableData: User[] = response.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl ?? "/placeholder-user.jpg",
        phoneNumber: user.phoneNumber ?? "Chưa có",
        address: user.address ?? "Chưa có",
        isEmailVerified: user.isEmailVerified,
        createdTime: user.createdTime,
        lockoutEnd: user.lockoutEnd,
        lastUpdatedTime: user.lastUpdatedTime,
        createdBy: user.createdBy,
        createdByName: user.createdByName,
        lastUpdatedBy: user.lastUpdatedBy,
        roles: user.roles,
      }));

      setUsers(userTableData);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data.Message ||
        "Đã xảy ra lỗi khi lấy dữ liệu người dùng";

      // Display error using toast
      toast.error(errorMessage);
    }
  };

  const fetchRoles = async () => {
    try {
      const response: Role[] = await getAllRoles();
      setRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      // Không chặn UI nếu lỗi
      console.warn("Không thể tải danh sách vai trò", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [getListUser, getAllRoles]);

  return (
    <div>
      {loading ? (
        <LoadingContent />
      ) : (
        <div className="flex flex-1 flex-col justify-items-center items-center w-full">
          <div className="flex justify-between items-center w-full px-3">
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Tất cả:</span>
              <span className="text-blue-500">{users.length}</span>
              <span className="font-medium">Xác thực:</span>
              <span className="text-green-500">
                {users.filter((user) => user.isEmailVerified).length}
              </span>
              <span className="font-medium">Chưa xác thực:</span>
              <span className="text-red-500">
                {users.filter((user) => !user.isEmailVerified).length}
              </span>
            </div>
            <div className="flex items-center gap-2 py-4">
              <Select
                mode="multiple"
                allowClear
                style={{ minWidth: 220 }}
                placeholder="Lọc theo vai trò"
                value={selectedRoleIds}
                onChange={(vals) => setSelectedRoleIds(vals)}
                options={roles.map((r) => ({ label: r.name, value: r.id }))}
                getPopupContainer={(triggerNode) =>
                  (triggerNode.parentNode as HTMLElement) ?? document.body
                }
              />
              <SearchInput
                value={searchValue}
                onChange={(value) => setSearchValue(value)}
              />
            </div>
          </div>
          <div className="w-full px-2">
            <DataTable
              columns={createColumns(href)}
              data={users.filter((user) => {
                const matchesName = user.fullName
                  .toLowerCase()
                  .includes(searchValue.toLowerCase());
                if (!matchesName) return false;
                if (selectedRoleIds.length === 0) return true;
                const selectedRoleNames = roles
                  .filter((r) => selectedRoleIds.includes(r.id))
                  .map((r) => r.name);
                const userRoles = user.roles || [];
                return selectedRoleNames.some((r) => userRoles.includes(r));
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUserTable;
