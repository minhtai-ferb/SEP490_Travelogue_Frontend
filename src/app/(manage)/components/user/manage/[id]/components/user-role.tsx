"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserManager } from "@/services/user-manager";
import toast from "react-hot-toast";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface Role {
  id: string;
  name: string;
}

interface AssignRoleDialogProps {
  userId: string;
  currentRoles: string[];
  onRolesUpdated?: (newRoles: Role[], action: 'assign' | 'disable', roleName: string) => void;
}

export const AssignRoleDialog: React.FC<AssignRoleDialogProps> = ({
  userId,
  currentRoles,
  onRolesUpdated,
}) => {
  const { assignRoleToUser, enableUserRole, disableUserRole, getAllRoles } = useUserManager();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Kiểm tra user có role Moderator không
  const hasModerator = currentRoles.includes('Moderator');
  // Kiểm tra user có role Admin không
  const hasAdmin = currentRoles.includes('Admin');

  // Nếu user đã có Admin thì không cần hiển thị nút Moderator
  if (hasAdmin) {
    return null;
  }

  const handleModeratorToggle = async () => {
    const action = hasModerator ? 'disable' : 'assign';
    
    try {
      setLoading(true);
      
      if (action === 'assign') {
        // Lấy danh sách roles để tìm Moderator role ID
        const roles = await getAllRoles();
        const moderatorRole = roles.find((role: Role) => role.name === 'Moderator');
        
        if (!moderatorRole) {
          toast.error("Không tìm thấy vai trò Moderator trong hệ thống");
          return;
        }
        
        await assignRoleToUser(userId, moderatorRole.id);
        toast.success("Đã gán vai trò Moderator thành công!");
        
        // Update UI - thêm Moderator vào danh sách roles hiện tại
        if (onRolesUpdated) {
          const currentRoleObjects = currentRoles.map(roleName => ({
            id: roleName === 'Moderator' ? moderatorRole.id : '',
            name: roleName
          }));
          
          // Kiểm tra xem Moderator đã có chưa, nếu chưa thì thêm vào
          const hasModeratorInList = currentRoleObjects.some(role => role.name === 'Moderator');
          if (!hasModeratorInList) {
            currentRoleObjects.push({
              id: moderatorRole.id,
              name: 'Moderator'
            });
          }
          
          onRolesUpdated(currentRoleObjects, 'assign', 'Moderator');
        }
      } else {
        // Disable moderator role thay vì bỏ gán
        const roles = await getAllRoles();
        const moderatorRole = roles.find((role: Role) => role.name === 'Moderator');
        
        if (!moderatorRole) {
          toast.error("Không tìm thấy vai trò Moderator trong hệ thống");
          return;
        }
        
        await disableUserRole(userId, moderatorRole.id);
        toast.success("Đã tắt vai trò Moderator thành công!");
        
        // Update UI - giữ Moderator nhưng đánh dấu là không hoạt động
        if (onRolesUpdated) {
          const updatedRoles = currentRoles.map(roleName => ({
            id: roleName === 'Moderator' ? moderatorRole.id : '',
            name: roleName
          }));
          onRolesUpdated(updatedRoles, 'disable', 'Moderator');
        }
      }
      
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || `Có lỗi xảy ra khi ${hasModerator ? 'tắt' : 'gán'} vai trò`);
      console.error(`Lỗi khi ${hasModerator ? 'tắt' : 'gán'} vai trò:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasModerator ? "destructive" : "default"}
          className="flex items-center gap-2"
          size="sm"
        >
          {hasModerator ? (
            <>
              <UserDeleteOutlined className="h-4 w-4" />
              Tắt Moderator
            </>
          ) : (
            <>
              <UserAddOutlined className="h-4 w-4" />
              Gán Moderator
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasModerator ? (
              <>
                <UserDeleteOutlined className="h-5 w-5 text-red-600" />
                Tắt vai trò Moderator
              </>
            ) : (
              <>
                <UserAddOutlined className="h-5 w-5 text-blue-600" />
                Gán vai trò Moderator
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasModerator 
              ? "Bạn có chắc chắn muốn tắt vai trò Moderator cho người dùng này?"
              : "Bạn có chắc chắn muốn gán vai trò Moderator cho người dùng này?"
            }
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            {hasModerator
              ? "Người dùng sẽ mất quyền kiểm duyệt nội dung và các quyền Moderator khác (role vẫn được giữ nhưng không hoạt động)."
              : "Người dùng sẽ có quyền kiểm duyệt nội dung và các quyền Moderator trong hệ thống."
            }
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant={hasModerator ? "destructive" : "default"}
            onClick={handleModeratorToggle}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : (hasModerator ? "Tắt vai trò" : "Gán vai trò")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
