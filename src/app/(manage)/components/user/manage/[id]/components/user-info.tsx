"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { User as UserIcon, Plus, Minus, Wallet, CreditCard, Star, MapPin, Award, Building2, History, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/Users";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssignRoleDialog } from "./user-role";
import { Divider, Typography, Row, Col, Statistic, Table, Tag } from "antd";

const { Text, Title } = Typography;

interface Role {
  id: string;
  name: string;
}

interface UserInfoDisplayProps {
  user: User | null;
  setUserData?: (data: User | null) => void;
}

export default function UserInfoDisplay({
  user,
  setUserData,
}: UserInfoDisplayProps) {
  const [isOpen, setIsOpen] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Thông Tin Chi Tiết Người Dùng
          </CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="sr-only">{isOpen ? "Thu gọn" : "Mở rộng"}</span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {user ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Cột trái: Avatar và thông tin cơ bản */}
                <div className="xl:col-span-1 space-y-4">
                  <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={user.avatarUrl || "/placeholder_image.jpg"}
                        alt={user.fullName}
                      />
                      <AvatarFallback className="text-2xl">
                        {user.fullName
                          ? user.fullName
                              .split(" ")
                              .slice(-2)
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                          : "NA"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{user.fullName || "Chưa cập nhật"}</h3>
                      <p className="text-gray-600">@{user.userName}</p>
                      <Badge 
                        variant={user.lockoutEnd ? "destructive" : "default"} 
                        className="mt-2"
                      >
                        {user.lockoutEnd ? "Tài khoản bị khóa" : "Tài khoản hoạt động"}
                      </Badge>
                    </div>
                  </div>

                  {/* Ví tiền */}
                  {user.wallet && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Wallet className="h-5 w-5 text-blue-600" />
                          Ví Tiền
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Statistic
                          title="Số dư hiện tại"
                          value={user.wallet.userWalletAmount}
                          formatter={(value) => formatCurrency(Number(value))}
                          valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                        />
                        <div className="mt-3 flex items-center justify-between">
                          <Text type="secondary">
                            Giao dịch: {user.wallet.transactionDtos?.length || 0} lần
                          </Text>
                          {user.wallet.transactionDtos && user.wallet.transactionDtos.length > 0 && (
                            <Text type="secondary" className="text-xs">
                              Gần nhất: {formatDate(user.wallet.transactionDtos[0].transactionDateTime)}
                            </Text>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Cột giữa và phải: Thông tin chi tiết */}
                <div className="xl:col-span-2 space-y-4">
                  {/* Thông tin cá nhân */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông Tin Cá Nhân</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <div>
                            <Text strong className="text-gray-600">Email:</Text>
                            <div className="flex items-center gap-2 mt-1">
                              <Text>{user.email}</Text>
                              {user.emailConfirmed && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Đã xác minh
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div>
                            <Text strong className="text-gray-600">Số điện thoại:</Text>
                            <div className="flex items-center gap-2 mt-1">
                              <Text>{user.phoneNumber || "Chưa cập nhật"}</Text>
                              {user.phoneNumberConfirmed && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Đã xác minh
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div>
                            <Text strong className="text-gray-600">Giới tính:</Text>
                            <p className="mt-1">{user.genderText || "Chưa cập nhật"}</p>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div>
                            <Text strong className="text-gray-600">Địa chỉ:</Text>
                            <p className="mt-1">{user.address || "Chưa cập nhật"}</p>
                          </div>
                        </Col>
                      </Row>
                    </CardContent>
                  </Card>

                  {/* Vai trò */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Vai Trò Hệ Thống</CardTitle>
                      {/* Kiểm tra nếu user có Admin role thì hiển thị thông báo thay vì nút gán Moderator */}
                      {user.roles?.some(r => r.name === 'Admin') ? (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Admin - Quyền cao nhất
                        </Badge>
                      ) : (
                        <AssignRoleDialog
                          userId={user.id}
                          currentRoles={user.roles?.map(r => r.name) ?? []}
                          onRolesUpdated={(newRoles: Role[], action: 'assign' | 'disable', roleName: string) => {
                            if (setUserData && user) {
                              let updatedRoles;
                              
                              if (action === 'assign') {
                                // Gán role mới
                                const existingRoleNames = user.roles?.map(r => r.name) || [];
                                if (!existingRoleNames.includes(roleName)) {
                                  updatedRoles = [
                                    ...(user.roles || []),
                                    {
                                      name: roleName,
                                      createdAt: new Date().toISOString(),
                                      isActive: true
                                    }
                                  ];
                                } else {
                                  updatedRoles = user.roles || [];
                                }
                              } else if (action === 'disable') {
                                // Disable role
                                updatedRoles = user.roles?.map(role => 
                                  role.name === roleName 
                                    ? { ...role, isActive: false }
                                    : role
                                ) || [];
                              } else {
                                updatedRoles = user.roles || [];
                              }
                              
                              setUserData({
                                ...user,
                                roles: updatedRoles,
                              });
                            }
                          }}
                        />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {user?.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-gray-50">
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant={role.isActive ? "default" : "secondary"}
                                  className="mb-2"
                                >
                                  {role.name}
                                </Badge>
                                <Badge variant={role.isActive ? "outline" : "destructive"}>
                                  {role.isActive ? "Hoạt động" : "Không hoạt động"}
                                </Badge>
                              </div>
                              <Text type="secondary" className="text-xs">
                                Được tạo: {formatDate(role.createdAt)}
                              </Text>
                            </div>
                          ))
                        ) : (
                          <Badge variant="outline">Không có vai trò</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Thông tin Tour Guide */}
                  {user.tourGuideInfo && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-green-600" />
                          Thông Tin Hướng Dẫn Viên
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={8}>
                            <Statistic
                              title="Đánh giá"
                              value={user.tourGuideInfo.rating}
                              suffix="/ 5"
                              precision={1}
                              valueStyle={{ color: '#faad14' }}
                              prefix={<Star className="h-4 w-4" />}
                            />
                          </Col>
                          <Col xs={24} md={8}>
                            <Statistic
                              title="Giá dịch vụ"
                              value={user.tourGuideInfo.price}
                              formatter={(value) => formatCurrency(Number(value))}
                              valueStyle={{ color: '#52c41a' }}
                            />
                          </Col>
                          <Col xs={24} md={8}>
                            <Statistic
                              title="Tổng đánh giá"
                              value={user.tourGuideInfo.totalReviews}
                              suffix="lượt"
                              valueStyle={{ color: '#1890ff' }}
                            />
                          </Col>
                          <Col xs={24}>
                            <div>
                              <Text strong className="text-gray-600">Giới thiệu:</Text>
                              <p className="mt-1 text-gray-800">
                                {user.tourGuideInfo.introduction || "Chưa có thông tin giới thiệu"}
                              </p>
                            </div>
                          </Col>
                          <Col xs={24}>
                            <div>
                              <Text strong className="text-gray-600">Chứng chỉ:</Text>
                              <div className="mt-2">
                                {user.tourGuideInfo.certifications?.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {user.tourGuideInfo.certifications.map((cert, index) => {
                                      const isObject = typeof cert === 'object' && cert !== null;
                                      const certName = isObject ? cert.name : cert;
                                      const certUrl = isObject ? cert.certificateUrl : null;
                                      
                                      return (
                                        <Badge 
                                          key={index} 
                                          variant="outline" 
                                          className={`flex items-center gap-1 ${certUrl ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300' : ''}`}
                                          onClick={certUrl ? () => window.open(certUrl, '_blank') : undefined}
                                        >
                                          <Award className="h-3 w-3" />
                                          {certName}
                                          {certUrl && <span className="text-xs text-blue-600 ml-1">📄</span>}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <Text type="secondary">Chưa có chứng chỉ</Text>
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </CardContent>
                    </Card>
                  )}

                  {/* Thông tin Làng nghề */}
                  {user.craftVillagesInfo && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-orange-600" />
                          Thông Tin Làng Nghề
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <div>
                              <Text strong className="text-gray-600">Số điện thoại:</Text>
                              <p className="mt-1">{user.craftVillagesInfo.phoneNumber || "Chưa cập nhật"}</p>
                            </div>
                          </Col>
                          <Col xs={24} md={12}>
                            <div>
                              <Text strong className="text-gray-600">Email liên hệ:</Text>
                              <p className="mt-1">{user.craftVillagesInfo.email || "Chưa cập nhật"}</p>
                            </div>
                          </Col>
                          <Col xs={24} md={12}>
                            <div>
                              <Text strong className="text-gray-600">Website:</Text>
                              <p className="mt-1">
                                {user.craftVillagesInfo.website ? (
                                  <a 
                                    href={user.craftVillagesInfo.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {user.craftVillagesInfo.website}
                                  </a>
                                ) : (
                                  "Chưa cập nhật"
                                )}
                              </p>
                            </div>
                          </Col>
                          <Col xs={24} md={12}>
                            <div>
                              <Text strong className="text-gray-600">Sản phẩm đặc trưng:</Text>
                              <p className="mt-1">{user.craftVillagesInfo.signatureProduct || "Chưa cập nhật"}</p>
                            </div>
                          </Col>
                          <Col xs={24} md={8}>
                            <Statistic
                              title="Năm lịch sử"
                              value={user.craftVillagesInfo.yearsOfHistory}
                              suffix="năm"
                              valueStyle={{ color: '#722ed1' }}
                            />
                          </Col>
                          <Col xs={24} md={8}>
                            <div className="text-center">
                              <Text strong className="text-gray-600">UNESCO công nhận:</Text>
                              <div className="mt-1">
                                <Badge 
                                  variant={user.craftVillagesInfo.isRecognizedByUnesco ? "default" : "secondary"}
                                  className={user.craftVillagesInfo.isRecognizedByUnesco ? "bg-green-600" : ""}
                                >
                                  {user.craftVillagesInfo.isRecognizedByUnesco ? "Có" : "Không"}
                                </Badge>
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} md={8}>
                            <div className="text-center">
                              <Text strong className="text-gray-600">Workshop có sẵn:</Text>
                              <div className="mt-1">
                                <Badge 
                                  variant={user.craftVillagesInfo.workshopsAvailable ? "default" : "secondary"}
                                  className={user.craftVillagesInfo.workshopsAvailable ? "bg-blue-600" : ""}
                                >
                                  {user.craftVillagesInfo.workshopsAvailable ? "Có" : "Không"}
                                </Badge>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tài khoản ngân hàng */}
                  {user.bankAccounts && user.bankAccounts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                          Tài Khoản Ngân Hàng
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {user.bankAccounts.map((account, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-purple-50 space-y-3">
                              <div className="flex items-center justify-between">
                                <Text strong className="text-lg">{account.bankName}</Text>
                                {account.isDefault && (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Mặc định
                                  </Badge>
                                )}
                              </div>
                              <Row gutter={[16, 8]}>
                                <Col xs={24} md={12}>
                                  <div>
                                    <Text strong className="text-gray-600">Số tài khoản:</Text>
                                    <p className="mt-1 font-mono text-lg">{account.bankAccountNumber}</p>
                                  </div>
                                </Col>
                                <Col xs={24} md={12}>
                                  <div>
                                    <Text strong className="text-gray-600">Chủ tài khoản:</Text>
                                    <p className="mt-1">{account.bankOwnerName}</p>
                                  </div>
                                </Col>
                                <Col xs={24}>
                                  <div>
                                    <Text strong className="text-gray-600">Ngày tạo:</Text>
                                    <p className="mt-1">{formatDate(account.createdAt)}</p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Lịch sử giao dịch */}
                  {user.wallet?.transactionDtos && user.wallet.transactionDtos.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <History className="h-5 w-5 text-green-600" />
                          Lịch Sử Giao Dịch
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table
                            dataSource={user.wallet.transactionDtos.map((transaction, index) => ({
                              ...transaction,
                              key: transaction.id || index,
                            }))}
                            pagination={{ pageSize: 10, showSizeChanger: true }}
                            scroll={{ x: 1000 }}
                            columns={[
                              {
                                title: 'Thời gian',
                                dataIndex: 'transactionDateTime',
                                key: 'transactionDateTime',
                                width: 180,
                                render: (date: string) => {
                                  const formattedDate = new Date(date).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    timeZone: 'Asia/Ho_Chi_Minh'
                                  });
                                  return (
                                    <div className="text-sm">
                                      <div className="font-medium">{formattedDate.split(' ')[0]}</div>
                                      <div className="text-gray-500">{formattedDate.split(' ')[1]}</div>
                                    </div>
                                  );
                                },
                                sorter: (a: any, b: any) => new Date(a.transactionDateTime).getTime() - new Date(b.transactionDateTime).getTime(),
                                defaultSortOrder: 'descend',
                              },
                              {
                                title: 'Loại giao dịch',
                                dataIndex: 'typeText',
                                key: 'typeText',
                                width: 120,
                                render: (type: string, record: any) => (
                                  <Tag color={
                                    record.transactionDirection === 0 ? 'green' : 'red'
                                  }>
                                    {type}
                                  </Tag>
                                ),
                              },
                              {
                                title: 'Số tiền',
                                dataIndex: 'paidAmount',
                                key: 'paidAmount',
                                width: 150,
                                render: (amount: number, record: any) => (
                                  <div className={`text-right font-semibold ${
                                    record.transactionDirection === 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {record.transactionDirection === 0 ? '+' : '-'}{formatCurrency(amount)}
                                  </div>
                                ),
                              },
                              {
                                title: 'Trạng thái',
                                dataIndex: 'statusText',
                                key: 'statusText',
                                width: 120,
                                render: (status: string, record: any) => (
                                  <Tag color={
                                    record.status === 2 ? 'green' : 
                                    record.status === 1 ? 'orange' : 'red'
                                  }>
                                    {status}
                                  </Tag>
                                ),
                              },
                              {
                                title: 'Phương thức',
                                dataIndex: 'method',
                                key: 'method',
                                width: 100,
                                render: (method: string) => (
                                  <Tag color="blue">{method}</Tag>
                                ),
                              },
                              {
                                title: 'Kênh thanh toán',
                                dataIndex: 'paymentChannelText',
                                key: 'paymentChannelText',
                                width: 120,
                              },
                              {
                                title: 'Lý do',
                                dataIndex: 'reason',
                                key: 'reason',
                                ellipsis: true,
                                render: (reason: string) => reason || 'Không có',
                              },
                            ]}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-600 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-sm">
                  Không có thông tin người dùng để hiển thị.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
