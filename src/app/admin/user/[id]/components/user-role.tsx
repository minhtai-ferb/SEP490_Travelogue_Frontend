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
  const { assignRoleToUser, getAllRoles } = useUserManager();
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
      
      // Tìm những role mới chưa có
      const newRoles = selectedRoles.filter(selectedRole => 
        !currentRoleObjects.some(currentRole => currentRole.id === selectedRole.id)
      );
      
      console.log("currentRoleObjects: ", currentRoleObjects);
      console.log("newRoles to assign: ", newRoles);
      
      if (newRoles.length === 0) {
        addToast({
          title: "Không có thay đổi",
          description: "Không có vai trò mới nào được thêm.",
          color: "warning",
        });
        setOpen(false);
        return;
      }

      // Chỉ gán những role mới
      await Promise.all(
        newRoles.map((role) => assignRoleToUser(userId, role.id))
      );
      
      addToast({
        title: "Cập nhật vai trò thành công",
        description: `Đã thêm ${newRoles.length} vai trò mới cho người dùng.`,
        color: "success",
      });
      onRolesUpdated?.(selectedRoles);
      setOpen(false);
    } catch (err) {
      addToast({
        title: "Cập nhật vai trò thất bại",
        description: "Đã xảy ra lỗi khi cập nhật vai trò cho người dùng.",
        color: "danger",
      });
      console.error("Lỗi khi gán vai trò:", err);
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
