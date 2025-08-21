"use client";

import React, { useState, useEffect } from "react";
import { createColumns } from "./components/columns-user";
import { User, UserTable } from "@/types/Users";
import SearchInput from "./components/search-user";
import { useUserManager } from "@/services/user-manager";
import LoadingContent from "@/components/common/loading-content";
import toast from "react-hot-toast";
import { DataTable } from "@/components/table/data-table-user";

function ManageUserTable({href} : {href: string}) {
  const [searchValue, setSearchValue] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const { getListUser, loading } = useUserManager();

  useEffect(() => {
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
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        const errorMessage =
          error?.response?.data.Message ||
          "Đã xảy ra lỗi khi lấy dữ liệu người dùng";

        // Display error using toast
        toast.error(errorMessage);
      }
    };

    fetchUsers();
  }, [getListUser]);

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
            <SearchInput
              value={searchValue}
              onChange={(value) => setSearchValue(value)}
            />
          </div>
          <div className="w-full px-2">
            <DataTable
              columns={createColumns(href)} 
              data={users.filter((user) =>
                user.fullName.toLowerCase().includes(searchValue.toLowerCase())
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUserTable;
