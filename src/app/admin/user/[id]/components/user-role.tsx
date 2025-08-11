"use client";

import React, { useState, useEffect } from "react";
import { Select, Spin, message } from "antd";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUserManager } from "@/services/user-manager";
import { addToast } from "@heroui/react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Role {
  id: string;
  name: string;
}

interface AssignRoleDialogProps {
  userId: string;
  currentRoles: string[];
  onRolesUpdated?: (newRoles: Role[]) => void;
}

export const AssignRoleDialog: React.FC<AssignRoleDialogProps> = ({
  userId,
  currentRoles,
  onRolesUpdated,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const { assignRoleToUser, removeRoleFromUser, getAllRoles } = useUserManager();
  const [loading, setLoading] = useState(false);

  // Khi mở dialog thì fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getAllRoles();
      setRoles(response);
      const matchedRoles = response.filter((role: Role) => 
        currentRoles.includes(role.name)
      );
      setSelectedRoles(matchedRoles);
    } catch (error) {
      message.error("Không thể tải vai trò");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!open) return;
    fetchRoles();
  }, [open]);

  const handleSave = async () => {
    try {
      console.log("selectedRoles: ", selectedRoles);
      
      // Lấy danh sách role hiện tại của user (Role objects)
      const currentRoleObjects = roles.filter(role => 
        currentRoles.includes(role.name)
      );
      
      console.log("currentRoleObjects: ", currentRoleObjects);
      console.log("selectedRoles: ", selectedRoles);
      
      // Tìm những role mới cần thêm
      const rolesToAdd = selectedRoles.filter(selectedRole => 
        !currentRoleObjects.some(currentRole => currentRole.id === selectedRole.id)
      );
      
      // Tìm những role cần xóa
      const rolesToRemove = currentRoleObjects.filter(currentRole => 
        !selectedRoles.some(selectedRole => selectedRole.id === currentRole.id)
      );
      
      console.log("rolesToAdd: ", rolesToAdd);
      console.log("rolesToRemove: ", rolesToRemove);
      
      if (rolesToAdd.length === 0 && rolesToRemove.length === 0) {
        toast.error("Không có thay đổi nào được thực hiện.");
        setOpen(false);
        return;
      }

      // Thêm role mới
      if (rolesToAdd.length > 0) {
        await Promise.all(
          rolesToAdd.map((role) => assignRoleToUser(userId, role.id))
        );
      }
      
      // Xóa role không còn chọn
      if (rolesToRemove.length > 0) {
        await Promise.all(
          rolesToRemove.map((role) => removeRoleFromUser(userId, role.id))
        );
      }
      
      toast.success("Vai trò đã được cập nhật thành công.");
      onRolesUpdated?.(selectedRoles);
      setOpen(false);
    } catch (err) {
      toast.error("Cập nhật vai trò thất bại");   
      console.error("Lỗi khi cập nhật vai trò:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          Gán vai trò
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <DialogTitle>Gán vai trò cho người dùng</DialogTitle>
              <DialogDescription>
                Chọn 1 hoặc nhiều vai trò rồi bấm “Lưu” để cập nhật.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <Spin
            spinning={loading && roles.length === 0}
            tip="Đang tải vai trò..."
          >
            <div className="flex flex-row items-center gap-4">
              <div className="flex-1">
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn vai trò"
                  value={selectedRoles.map(role => role.id)}
                  onChange={(vals) => {
                    const selectedRoleObjects = vals.map(id => 
                      roles.find(role => role.id === id)
                    ).filter(Boolean) as Role[];
                    setSelectedRoles(selectedRoleObjects);
                  }}
                  options={roles.map((r) => ({
                    label: r.name,
                    value: r.id,
                  }))}
                  getPopupContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
              </div>

              <Button
                variant="default"
                disabled={loading}
                onClick={handleSave}
                className="shrink-0"
              >
                {loading ? <Spin size="small" spinning /> : "Lưu"}
              </Button>
            </div>
          </Spin>
        </div>
      </DialogContent>
    </Dialog>
  );
};
