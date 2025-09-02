import React from "react";
import { Avatar, Tag } from "antd";
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { User } from "@/types/Users";

interface UserInfoCellProps {
  user: User;
}

export const UserInfoCell: React.FC<UserInfoCellProps> = ({ user }) => (
  <div className="flex items-center gap-3">
    <Avatar 
      size={40} 
      src={user.avatarUrl} 
      icon={<UserOutlined />}
    >
      {user.fullName?.charAt(0)?.toUpperCase()}
    </Avatar>
    <div>
      <div className="font-semibold text-gray-900">{user.fullName}</div>
      <div className="text-sm text-gray-500">{user.userName}</div>
    </div>
  </div>
);

interface ContactInfoCellProps {
  user: User;
}

export const ContactInfoCell: React.FC<ContactInfoCellProps> = ({ user }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-sm">
      <MailOutlined className="text-gray-400" />
      <span>{user.email}</span>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <PhoneOutlined className="text-gray-400" />
      <span>{user.phoneNumber || 'Chưa có'}</span>
    </div>
  </div>
);

interface RolesCellProps {
  roles?: Array<{ name: string; isActive: boolean }>;
}

export const RolesCell: React.FC<RolesCellProps> = ({ roles }) => {
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
    <div className="flex flex-wrap gap-1">
      {roles?.map((role, index) => (
        <Tag key={index} color={getRoleColor(role.name)}>
          {role.name}
        </Tag>
      ))}
    </div>
  );
};

interface WalletCellProps {
  wallet?: { userWalletAmount?: number };
}

export const WalletCell: React.FC<WalletCellProps> = ({ wallet }) => (
  <span className="font-medium text-green-600">
    {wallet?.userWalletAmount?.toLocaleString('vi-VN')} ₫
  </span>
);

interface StatusCellProps {
  user: User;
}

export const StatusCell: React.FC<StatusCellProps> = ({ user }) => {
  const isVerified = user.isEmailVerified;
  const activeRoles = user.roles?.filter(role => role.isActive) || [];
  const inactiveRoles = user.roles?.filter(role => !role.isActive) || [];
  
  return (
    <div className="space-y-1">
      <Tag 
        color={isVerified ? 'success' : 'warning'} 
        icon={isVerified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      >
        {isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
      </Tag>
      {activeRoles.length > 0 && (
        <div className="text-xs text-green-600">
          {activeRoles.length} vai trò hoạt động
        </div>
      )}
      {inactiveRoles.length > 0 && (
        <div className="text-xs text-orange-600">
          {inactiveRoles.length} vai trò tạm dừng
        </div>
      )}
    </div>
  );
};

interface DateCellProps {
  date: string;
}

export const DateCell: React.FC<DateCellProps> = ({ date }) => (
  <div className="flex items-center gap-2 text-sm">
    <CalendarOutlined className="text-gray-400" />
    <span>{new Date(date).toLocaleDateString('vi-VN')}</span>
  </div>
);
