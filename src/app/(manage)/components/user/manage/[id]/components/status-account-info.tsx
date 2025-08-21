import {
  CheckCircle2,
  XCircle,
  CalendarDays,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { User } from "@/types/Users";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDate } from "../../../lib/utils";

// Thêm phần này bên trong UserInfoDisplay, sau Collapsible đầu tiên

interface UserInfoDisplayProps {
  user: User | null;
}

export default function UserStatusInfoDisplay({ user }: UserInfoDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-2">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Trạng Thái & Lịch Sử Hệ Thống
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
          <CardContent className="px-10 space-y-4">
            {user ? (
              <>
                {/* Trạng thái tài khoản */}
                <div className="grid gap-4">
                  <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                    Trạng thái tài khoản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      {user.isEmailVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Email đã xác minh
                        </Label>
                        <p className="text-base">
                          {user.isEmailVerified ? "Có" : "Không"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Thời gian khóa tài khoản
                        </Label>
                        <p className="text-base">
                          {user.lockoutEnd
                            ? formatDate(user.lockoutEnd)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lịch sử hệ thống */}
                <div className="grid gap-4">
                  <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                    Lịch sử hệ thống
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Thời gian tạo
                        </Label>
                        <p className="text-base">
                          {formatDate(user.createdTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Thời gian cập nhật cuối
                        </Label>
                        <p className="text-base">
                          {formatDate(user.lastUpdatedTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Được tạo bởi
                      </Label>
                      <p className="text-base">{user.createdBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Tên người tạo
                      </Label>
                      <p className="text-base">{user.createdByName || "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Được cập nhật bởi
                      </Label>
                      <p className="text-base">{user.lastUpdatedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Tên người cập nhật
                      </Label>
                      <p className="text-base">
                        {user.lastUpdatedByName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
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
