"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useState, useEffect } from "react";
import { DataTable } from "./components/data-table-user";
import { columns } from "./components/columns-user";
import { UserTable } from "@/types/Users";
import SearchInput from "./components/search-user";
import { useUserManager } from "@/services/user-manager";
import { addToast } from "@heroui/react";
import { Loader2 } from "lucide-react";

function ManageUser() {
  const [searchValue, setSearchValue] = useState("");

  const [users, setUsers] = useState<UserTable[]>([]);
  const { getCurrentUser, loading } = useUserManager();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response: UserTable[] = await getCurrentUser();
        console.log("User data: ", response);
        if (!response) {
          throw new Error("No data returned from API getCurrentUser");
        }

        setUsers(response);
      } catch (error: any) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        const errorMessage =
          error?.response?.data.Message ||
          "Đã xảy ra lỗi khi lấy dữ liệu người dùng";

        // Display error using toast
        addToast({
          title: "Lỗi khi lấy dữ liệu người dùng",
          description: errorMessage,
          color: "danger",
        });
      }
    };

    fetchStudents();
  }, [getCurrentUser]);

  return (
    <SidebarInset>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Quản lý tài khoản</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Người dùng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        </div>
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
              columns={columns}
              data={users.filter((user) =>
                user.fullName.toLowerCase().includes(searchValue.toLowerCase())
              )}
            />
          </div>
        </div>
      )}
    </SidebarInset>
  );
}

export default ManageUser;
