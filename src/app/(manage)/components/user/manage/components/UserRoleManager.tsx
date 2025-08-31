"use client";

import React, { useState, useEffect } from "react";
import { 
  Modal, 
  Button, 
  Space, 
  Tag, 
  Switch, 
  List, 
  Card, 
  Typography,
  message,
  Spin,
  Divider,
  Tooltip
} from "antd";
import { 
  UserOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined
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

  // Fetch all available roles
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      setAllRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Không thể tải danh sách vai trò");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (roleId: string, roleName: string, isEnabled: boolean) => {
    if (!user) return;
    
    // Kiểm tra quyền hạn cho từng role
    if (roleName !== 'Moderator') {
      // Đối với các role khác ngoài Moderator, chỉ cho phép enable/disable nếu user đã có role đó
      const userHasRole = user.roles?.some(role => role.name === roleName);
      if (!userHasRole && isEnabled) {
        message.warning(`Chỉ có thể gán vai trò Moderator. Không thể gán vai trò ${roleName}.`);
        return;
      }
    }
    
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
          {/* Role Management Rules */}
          <Card size="small" className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-2">
              <SettingOutlined className="text-blue-500 mt-1" />
              <div>
                <Text strong className="text-blue-700">Quy tắc quản lý vai trò:</Text>
                <ul className="mt-2 space-y-1 text-sm text-blue-600">
                  <li>• <strong>Moderator:</strong> Có thể gán hoặc bỏ gán tự do</li>
                  <li>• <strong>Các vai trò khác:</strong> Chỉ có thể bật/tắt nếu user đã có vai trò đó</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Current User Roles */}
          <Card size="small" title="Vai trò hiện tại">
            <Space wrap>
              {user?.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <Tag
                    key={index}
                    color={role.isActive ? getRoleColor(role.name) : 'default'}
                    icon={role.isActive ? <CheckOutlined /> : <CloseOutlined />}
                  >
                    {role.name}
                    {!role.isActive && ' (Không hoạt động)'}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">Chưa có vai trò nào</Text>
              )}
            </Space>
          </Card>

          <Divider />

          {/* All Available Roles */}
          <div>
            <Title level={5}>Quản lý tất cả vai trò</Title>
            <List
              dataSource={allRoles}
              renderItem={(role) => {
                const isActive = isRoleActive(role.name);
                const isLoading = actionLoading === role.id;
                const userHasRole = user?.roles?.some(userRole => userRole.name === role.name);
                const isModerator = role.name === 'Moderator';
                
                // Disable switch cho các role không phải Moderator mà user chưa có
                const isDisabled = !isModerator && !userHasRole;
                
                return (
                  <List.Item
                    actions={[
                      <Tooltip
                        key="tooltip"
                        title={
                          isDisabled 
                            ? (isModerator 
                                ? "Có thể gán vai trò Moderator cho user này" 
                                : "Chỉ có thể gán vai trò Moderator. Các vai trò khác chỉ enable/disable được nếu user đã có.")
                            : "Bật/tắt vai trò"
                        }
                      >
                        <Switch
                          key="switch"
                          checked={isActive}
                          loading={isLoading}
                          disabled={isDisabled}
                          onChange={(checked) => handleRoleToggle(role.id, role.name, checked)}
                          checkedChildren="Bật"
                          unCheckedChildren="Tắt"
                        />
                      </Tooltip>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Tag color={isActive ? getRoleColor(role.name) : 'default'}>
                          {role.name}
                        </Tag>
                      }
                      title={
                        <div className="flex items-center gap-2">
                          <span>{role.name}</span>
                          {!isModerator && !userHasRole && (
                            <Tag color="gold">Chỉ có thể enable/disable</Tag>
                          )}
                          {isModerator && (
                            <Tag color="blue">Có thể gán/bỏ gán</Tag>
                          )}
                        </div>
                      }
                      description={
                        isActive ? (
                          <Text type="success">Đang hoạt động</Text>
                        ) : isDisabled ? (
                          <Text type="secondary">
                            {isModerator 
                              ? "Có thể gán vai trò này cho user" 
                              : "User chưa có vai trò này - không thể gán"
                            }
                          </Text>
                        ) : (
                          <Text type="secondary">Có thể bật vai trò này</Text>
                        )
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserRoleManager;
