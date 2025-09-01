import { useState, useEffect } from "react";
import { User } from "@/types/Users";
import { useUserManager } from "@/services/user-manager";
import toast from "react-hot-toast";

type Role = {
  id: string;
  name: string;
};

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const { getListUser, getAllRoles, loading } = useUserManager();

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

  const fetchRoles = async () => {
    try {
      const response: Role[] = await getAllRoles();
      setRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      console.warn("Không thể tải danh sách vai trò", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [getListUser, getAllRoles]);

  return {
    users,
    roles,
    loading,
    refetchUsers: fetchUsers
  };
};
