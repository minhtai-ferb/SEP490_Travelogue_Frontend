import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { 
  EyeOutlined,
  MoreOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { User } from "@/types/Users";

interface UserActionsMenuProps {
  user: User;
  onViewDetails: (user: User) => void;
  onManageRoles: (user: User) => void;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  user,
  onViewDetails,
  onManageRoles
}) => {
  const items: MenuProps['items'] = [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: <EyeOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'manageRoles',
      label: 'Quản lý vai trò',
      icon: <SettingOutlined />,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'view') {
      onViewDetails(user);
    } else if (key === 'manageRoles') {
      onManageRoles(user);
    }
  };

  return (
    <Dropdown 
      menu={{ items, onClick: handleMenuClick }} 
      placement="bottomRight"
      trigger={['click']}
    >
      <Button 
        type="text" 
        icon={<MoreOutlined />} 
        size="small"
      />
    </Dropdown>
  );
};

export default UserActionsMenu;
