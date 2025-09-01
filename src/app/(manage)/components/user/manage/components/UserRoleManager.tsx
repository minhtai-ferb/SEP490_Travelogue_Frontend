"use client";

import React, { useState, useEffect } from "react";
import { 
  Modal, 
  Button, 
  Tag, 
  Switch, 
  List, 
  Typography,
  message,
  Spin
} from "antd";
import { 
  UserOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { User } from "@/types/Users";
import { useUserManager } from "@/services/user-manager";

const { Title, Text } = Typography;

interface UserRoleManagerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

type Role = {
  id: string;
  name: string;
};

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ 
  user, 
  open, 
  onClose, 
  onUserUpdated 
}) => {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const { getAllRoles, enableUserRole, disableUserRole } = useUserManager();

  // Fetch all roles and filter to show only user's current roles
  useEffect(() => {
    if (open) {
      fetchUserRoles();
    }
  }, [open, user]);

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      const allAvailableRoles = Array.isArray(response) ? response : [];
      
      // Filter to show only roles that user currently has
      if (user?.roles) {
        const userRoleNames = user.roles.map(role => role.name);
        const userRolesWithIds = allAvailableRoles.filter(role => 
          userRoleNames.includes(role.name)
        );
        setAllRoles(userRolesWithIds);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Không thể tải danh sách vai trò");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (roleId: string, roleName: string, isEnabled: boolean) => {
    if (!user) return;
    
    setActionLoading(roleId);
    try {
      if (isEnabled) {
        await enableUserRole(user.id, roleId);
        message.success(`Đã bật vai trò ${roleName} cho ${user.fullName}`);
      } else {
        await disableUserRole(user.id, roleId);
        message.success(`Đã tắt vai trò ${roleName} cho ${user.fullName}`);
      }
      onUserUpdated();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra";
      message.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const isRoleActive = (roleName: string) => {
    return user?.roles?.some(role => role.name === roleName && role.isActive) || false;
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin': return 'red';
      case 'Moderator': return 'orange';
      case 'TourGuide': return 'blue';
      case 'CraftVillageOwner': return 'green';
      case 'User': return 'purple';
      default: return 'default';
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <SettingOutlined />
          <div>
            <Title level={5} style={{ margin: 0 }}>Quản lý vai trò</Title>
            <Text type="secondary">{user?.fullName}</Text>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={600}
    >
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-2">Đang tải danh sách vai trò...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current User Roles */}
          {user?.roles && user.roles.length > 0 ? (
            <div>
              <Title level={5}>Vai trò của {user.fullName}</Title>
              <List
                dataSource={allRoles}
                renderItem={(role) => {
                  const isActive = isRoleActive(role.name);
                  const isLoading = actionLoading === role.id;
                  
                  return (
                    <List.Item
                      actions={[
                        <Switch
                          key="switch"
                          checked={isActive}
                          loading={isLoading}
                          onChange={(checked) => handleRoleToggle(role.id, role.name, checked)}
                          checkedChildren="Bật"
                          unCheckedChildren="Tắt"
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Tag color={isActive ? getRoleColor(role.name) : 'default'}>
                            {role.name}
                          </Tag>
                        }
                        title={role.name}
                        description={
                          isActive ? (
                            <Text type="success">Đang hoạt động</Text>
                          ) : (
                            <Text type="secondary">Đã tắt</Text>
                          )
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <UserOutlined className="text-4xl text-gray-400 mb-4" />
              <Text type="secondary">User này chưa có vai trò nào</Text>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default UserRoleManager;
