import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { 
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { User } from "@/types/Users";

interface UserStatisticsProps {
  users: User[];
}

const UserStatistics: React.FC<UserStatisticsProps> = ({ users }) => {
  const totalUsers = users.length;
  const verifiedUsers = users.filter((user) => user.isEmailVerified).length;
  const unverifiedUsers = users.filter((user) => !user.isEmailVerified).length;
  const usersWithActiveRoles = users.filter((user) => 
    user.roles?.some(role => role.isActive)
  ).length;

  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Tổng số người dùng"
            value={totalUsers}
            valueStyle={{ color: '#1890ff' }}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Đã xác thực"
            value={verifiedUsers}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Chưa xác thực"
            value={unverifiedUsers}
            valueStyle={{ color: '#faad14' }}
            prefix={<CloseCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Có vai trò hoạt động"
            value={usersWithActiveRoles}
            valueStyle={{ color: '#1890ff' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserStatistics;
