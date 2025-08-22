"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import CommissionSettingsPage from "./components/CommissionSettingsPage";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const crumb: Crumb[] = [{ label: "Cấu hình hoa hồng" }];

function CommissionManagePage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />

      <div className="p-6 space-y-2">
        <Card className="shadow-sm border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Cấu hình hoa hồng
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground leading-relaxed">
              Quản lý và thiết lập mức hoa hồng cho{" "}
              <span className="font-medium text-foreground">
                Hướng dẫn viên
              </span>{" "}
              và <span className="font-medium text-foreground">Làng nghề</span>.
              Mỗi cấu hình bao gồm tỷ lệ phần trăm, ngày hiệu lực, và ngày hết
              hạn (nếu có). Hệ thống sẽ tự động lưu lịch sử thay đổi để đảm bảo
              minh bạch.
            </CardDescription>
          </CardHeader>
        </Card>

        <CommissionSettingsPage />
      </div>
    </SidebarInset>
  );
}

export default CommissionManagePage;
