import {
  CheckCircle2,
  XCircle,
  CalendarDays,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { User } from "@/types/Users";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Row, Col, Typography } from "antd";

const { Text } = Typography;

interface UserInfoDisplayProps {
  user: User | null;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function UserStatusInfoDisplay({ user }: UserInfoDisplayProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-2">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Trạng Thái Tài Khoản & Lịch Sử Hệ Thống
          </CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">{isOpen ? "Thu gọn" : "Mở rộng"}</span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {user ? (
              <>
                {/* Trạng thái xác minh */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Trạng Thái Xác Minh
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                          {user.emailConfirmed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <Text strong className="text-gray-700">Email</Text>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <Badge 
                                variant={user.emailConfirmed ? "default" : "destructive"}
                                className={user.emailConfirmed ? "bg-green-600" : ""}
                              >
                                {user.emailConfirmed ? "Đã xác minh" : "Chưa xác minh"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                          {user.phoneNumberConfirmed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <Text strong className="text-gray-700">Số điện thoại</Text>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">{user.phoneNumber || "Chưa cập nhật"}</p>
                              {user.phoneNumber && (
                                <Badge 
                                  variant={user.phoneNumberConfirmed ? "default" : "secondary"}
                                  className={user.phoneNumberConfirmed ? "bg-green-600" : ""}
                                >
                                  {user.phoneNumberConfirmed ? "Đã xác minh" : "Chưa xác minh"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardContent>
                </Card>

                {/* Trạng thái khóa tài khoản */}
                {user.lockoutEnd && (
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                        <XCircle className="h-5 w-5" />
                        Tài Khoản Bị Khóa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-red-600" />
                        <div>
                          <Text strong className="text-red-700">Thời gian khóa đến:</Text>
                          <p className="text-red-600 font-medium">{formatDate(user.lockoutEnd)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lịch sử hệ thống */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-gray-600" />
                      Lịch Sử Hệ Thống
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div className="p-3 border rounded-lg bg-blue-50">
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            <Text strong className="text-blue-700">Thời gian tạo</Text>
                          </div>
                          <p className="text-blue-800 font-medium">
                            {formatDate(user.createdTime)}
                          </p>
                          {user.createdByName && (
                            <p className="text-xs text-blue-600 mt-1">
                              Tạo bởi: {user.createdByName}
                            </p>
                          )}
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div className="p-3 border rounded-lg bg-green-50">
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarDays className="h-4 w-4 text-green-600" />
                            <Text strong className="text-green-700">Cập nhật cuối</Text>
                          </div>
                          <p className="text-green-800 font-medium">
                            {formatDate(user.lastUpdatedTime)}
                          </p>
                          {user.lastUpdatedByName && (
                            <p className="text-xs text-green-600 mt-1">
                              Cập nhật bởi: {user.lastUpdatedByName}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </CardContent>
                </Card>

                {/* ID thông tin */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <UserIcon className="h-5 w-5 text-purple-600" />
                      Thông Tin ID Hệ Thống
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-purple-50">
                        <Text strong className="text-purple-700">User ID:</Text>
                        <p className="text-sm text-purple-800 font-mono break-all">{user.id}</p>
                      </div>
                      {user.tourGuideInfo && (
                        <div className="p-3 border rounded-lg bg-green-50">
                          <Text strong className="text-green-700">Tour Guide ID:</Text>
                          <p className="text-sm text-green-800 font-mono break-all">{user.tourGuideInfo.id}</p>
                        </div>
                      )}
                      {user.craftVillagesInfo && (
                        <div className="p-3 border rounded-lg bg-orange-50">
                          <Text strong className="text-orange-700">Craft Village ID:</Text>
                          <p className="text-sm text-orange-800 font-mono break-all">{user.craftVillagesInfo.id}</p>
                          {user.craftVillagesInfo.locationId && (
                            <>
                              <Text strong className="text-orange-700 block mt-2">Location ID:</Text>
                              <p className="text-sm text-orange-800 font-mono break-all">{user.craftVillagesInfo.locationId}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-6 text-gray-600 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-sm">
                  Không có thông tin trạng thái hay lịch sử hệ thống.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
