"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Settings,
  Activity,
  Clock
} from "lucide-react";
import VerificationAlert from "./components/verificationAlert";
import SettingsTabs from "./components/settings-tabs";

export default function ManageProfile() {
  const [user] = useAtom(userAtom);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "Chưa có dữ liệu";
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getUserRole = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) {
      return { label: 'Chưa xác định', color: 'bg-gray-100 text-gray-800' };
    }
    
    const primaryRole = roles[0];
    switch (primaryRole) {
      case 'Admin':
        return { label: 'Quản trị viên', color: 'bg-red-100 text-red-800' };
      case 'Moderator':
        return { label: 'Người điều hành', color: 'bg-blue-100 text-blue-800' };
      case 'TourGuide':
        return { label: 'Hướng dẫn viên', color: 'bg-orange-100 text-orange-800' };
      case 'CraftVillageOwner':
        return { label: 'Chủ làng nghề', color: 'bg-purple-100 text-purple-800' };
      case 'User':
        return { label: 'Người dùng', color: 'bg-green-100 text-green-800' };
      default:
        return { label: 'Chưa xác định', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getStatusBadge = () => {
    // Giả định user luôn active nếu đã đăng nhập
    return (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    );
  };

  const roleInfo = getUserRole(user?.roles);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Quản lý hồ sơ
        </h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và cài đặt tài khoản của bạn</p>
      </div>

      {/* Verification Alert */}
      <VerificationAlert />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview - Left Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl font-semibold">
                {user?.fullName || "Chưa cập nhật tên"}
              </CardTitle>
              <div className="flex justify-center mt-2">
                <Badge className={roleInfo.color}>
                  <Shield className="h-3 w-3 mr-1" />
                  {roleInfo.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{user?.email || "Chưa có email"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Chưa có số điện thoại</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Chưa có địa chỉ</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    Tham gia: Chưa có thông tin
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    Cập nhật: Chưa có thông tin
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Trạng thái tài khoản</span>
                  {getStatusBadge()}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email đã xác thực</span>
                  <Badge className={user?.isEmailVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {user?.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Thống kê hoạt động
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <div className="font-semibold text-blue-600">ID</div>
                    <div className="text-gray-600">{user?.id?.slice(0, 8) || "N/A"}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="font-semibold text-green-600">Vai trò</div>
                    <div className="text-gray-600">{user?.roles?.[0] || "USER"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Settings Tabs */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <SettingsTabs />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Admin/Moderator Info */}
      {(user?.roles?.includes('Admin') || user?.roles?.includes('Moderator')) && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                {user?.roles?.includes('Admin') 
                  ? 'Thông tin quản trị viên' 
                  : 'Thông tin điều hành viên'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user?.roles?.includes('Admin') ? (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Quyền truy cập</h4>
                      <p className="text-sm text-blue-700">Toàn quyền quản lý hệ thống</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Bảo mật</h4>
                      <p className="text-sm text-green-700">Tài khoản được bảo vệ cao</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Trách nhiệm</h4>
                      <p className="text-sm text-purple-700">Quản lý người dùng & hệ thống</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Quyền điều hành</h4>
                      <p className="text-sm text-blue-700">Quản lý nội dung và người dùng</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Phạm vi quản lý</h4>
                      <p className="text-sm text-green-700">Kiểm duyệt và hỗ trợ</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Trách nhiệm</h4>
                      <p className="text-sm text-purple-700">Duy trì chất lượng dịch vụ</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
