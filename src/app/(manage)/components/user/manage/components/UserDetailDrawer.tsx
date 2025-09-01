"use client";

import React from "react";
import { 
  Drawer, 
  Descriptions, 
  Tag, 
  Avatar, 
  Space, 
  Card, 
  Typography,
  Row,
  Col,
  Statistic,
  Divider
} from "antd";
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  WalletOutlined,
  StarOutlined,
  ShopOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { User } from "@/types/Users";

const { Title, Text } = Typography;

interface UserDetailDrawerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  const renderRoles = () => {
    return user.roles?.map((role, index) => {
      let color = 'default';
      switch (role.name) {
        case 'Admin': color = 'red'; break;
        case 'Moderator': color = 'orange'; break;
        case 'TourGuide': color = 'blue'; break;
        case 'CraftVillageOwner': color = 'green'; break;
        case 'User': color = 'purple'; break;
      }
      return (
        <Tag key={index} color={color}>
          {role.name}
        </Tag>
      );
    });
  };

  const isVerified = user.isEmailVerified;
  const isLocked = user.lockoutEnd && new Date(user.lockoutEnd) > new Date();

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            src={user.avatarUrl} 
            icon={<UserOutlined />}
          >
            {user.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Title level={5} style={{ margin: 0 }}>{user.fullName}</Title>
            <Text type="secondary">{user.userName}</Text>
          </div>
        </div>
      }
      width={600}
      open={open}
      onClose={onClose}
      placement="right"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <Card title="Thông tin cơ bản" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item 
              label={<><MailOutlined className="mr-1" />Email</>}
            >
              {user.email}
              {isVerified && <Tag color="success" className="ml-2">Đã xác thực</Tag>}
            </Descriptions.Item>
            <Descriptions.Item 
              label={<><PhoneOutlined className="mr-1" />Số điện thoại</>}
            >
              {user.phoneNumber || 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={<><EnvironmentOutlined className="mr-1" />Địa chỉ</>}
            >
              {user.address || 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {user.genderText}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Space wrap>{renderRoles()}</Space>
            </Descriptions.Item>
            <Descriptions.Item 
              label={<><CalendarOutlined className="mr-1" />Ngày tạo</>}
            >
              {new Date(user.createdTime).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Account Status */}
        <Card title="Trạng thái tài khoản" size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Trạng thái email"
                value={isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                valueStyle={{ 
                  color: isVerified ? '#52c41a' : '#faad14',
                  fontSize: '14px'
                }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Trạng thái tài khoản"
                value={isLocked ? 'Bị khóa' : 'Hoạt động'}
                valueStyle={{ 
                  color: isLocked ? '#ff4d4f' : '#52c41a',
                  fontSize: '14px'
                }}
              />
            </Col>
          </Row>
        </Card>

        {/* Wallet Information */}
        <Card title={<><WalletOutlined className="mr-2" />Thông tin ví</>} size="small">
          <Statistic
            title="Số dư hiện tại"
            value={user.wallet?.userWalletAmount || 0}
            suffix="₫"
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>

        {/* Tour Guide Info */}
        {user.tourGuideInfo && (
          <Card title={<><StarOutlined className="mr-2" />Thông tin hướng dẫn viên</>} size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Đánh giá"
                  value={user.tourGuideInfo.rating}
                  suffix="★"
                  precision={1}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Giá dịch vụ"
                  value={user.tourGuideInfo.price}
                  suffix="₫"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Số đánh giá"
                  value={user.tourGuideInfo.totalReviews}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
            {user.tourGuideInfo.introduction && (
              <>
                <Divider />
                <div>
                  <Text strong>Giới thiệu:</Text>
                  <div className="mt-2">
                    <Text>{user.tourGuideInfo.introduction}</Text>
                  </div>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Craft Village Info */}
        {user.craftVillagesInfo && (
          <Card title={<><ShopOutlined className="mr-2" />Thông tin làng nghề</>} size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Sản phẩm đặc trưng">
                {user.craftVillagesInfo.signatureProduct}
              </Descriptions.Item>
              <Descriptions.Item label="Số năm lịch sử">
                {user.craftVillagesInfo.yearsOfHistory} năm
              </Descriptions.Item>
              <Descriptions.Item label="UNESCO công nhận">
                <Tag color={user.craftVillagesInfo.isRecognizedByUnesco ? 'success' : 'default'}>
                  {user.craftVillagesInfo.isRecognizedByUnesco ? 'Có' : 'Không'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Workshop có sẵn">
                <Tag color={user.craftVillagesInfo.workshopsAvailable ? 'success' : 'default'}>
                  {user.craftVillagesInfo.workshopsAvailable ? 'Có' : 'Không'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Website">
                {user.craftVillagesInfo.website && (
                  <a href={user.craftVillagesInfo.website} target="_blank" rel="noopener noreferrer">
                    {user.craftVillagesInfo.website}
                  </a>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </div>
    </Drawer>
  );
};

export default UserDetailDrawer;
