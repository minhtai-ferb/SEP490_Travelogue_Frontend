"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { User as UserIcon, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/Users";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssignRoleDialog } from "./user-role";

interface UserInfoDisplayProps {
  user: User | null;
  setUserData?: (data: User | null) => void;
}

export default function UserInfoDisplay({
  user,
  setUserData,
}: UserInfoDisplayProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Thông Tin Người Dùng
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
          <CardContent className="space-y-4">
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cột trái: Avatar */}
                <div className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                  <Avatar className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52">
                    <AvatarImage
                      src={user.avatarUrl || "/placeholder_image.jpg"}
                      alt={user.fullName}
                    />
                    <AvatarFallback>
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
                </div>
                <div className="col-span-2 flex flex-col space-y-2">
                  {/* Thông tin cơ bản */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Tên người dùng
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {user.fullName || "Chưa cập nhật"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {user.email || "Chưa cập nhật"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Số điện thoại
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {user.phoneNumber || "Chưa cập nhật"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Địa chỉ
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {user.address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  {/* Vai trò */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Vai trò
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex flex-wrap gap-2">
                        {user?.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <Badge key={index} variant="secondary">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">Không có vai trò</Badge>
                        )}
                      </div>

                      <AssignRoleDialog
                        userId={user.id}
                        currentRoles={user.roles ?? []}
                        onRolesUpdated={(newRoles) => {
                          if (setUserData && user) {
                            setUserData({
                              ...user,
                              roles: newRoles.map((r) => r.name),
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-600 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-sm">
                  Hóa đơn này không có thông tin khách hàng.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
