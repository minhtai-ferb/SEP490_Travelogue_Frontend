"use client";

import TourguideRequestsTable from "@/app/(manage)/components/user/requests/tourguide";
import TourGuideUpdatePriceRequests from "@/app/(manage)/components/user/requests/tourguide/update";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs } from "antd";
import { UserAddOutlined, DollarOutlined } from "@ant-design/icons";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/admin/user" },
  { label: "Hướng dẫn viên", href: "/admin/user/tourguide" },
];

export default function TourguideRequestsPage() {
  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <UserAddOutlined />
          Yêu cầu đăng ký hướng dẫn viên
        </span>
      ),
      children: (
        <div className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Duyệt yêu cầu đăng ký</h3>
            <p className="text-sm text-gray-600">
              Xem xét và phê duyệt các yêu cầu đăng ký trở thành hướng dẫn viên
            </p>
          </div>
          <TourguideRequestsTable />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <DollarOutlined />
          Yêu cầu cập nhật giá
        </span>
      ),
      children: (
        <div className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Duyệt yêu cầu cập nhật giá</h3>
            <p className="text-sm text-gray-600">
              Xem xét và phê duyệt các yêu cầu thay đổi giá dịch vụ của hướng dẫn viên
            </p>
          </div>
          <TourGuideUpdatePriceRequests />
        </div>
      ),
    },
  ];

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <div className="w-full mx-auto px-4 space-y-6 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Quản lý hướng dẫn viên
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý yêu cầu đăng ký và cập nhật giá dịch vụ của hướng dẫn viên
            </p>
          </div>
        </div>
        
        <Tabs
          defaultActiveKey="1"
          items={tabItems}
          size="large"
          className="bg-white rounded-lg shadow-sm"
          tabBarStyle={{
            borderBottom: '2px solid #f0f0f0',
            marginBottom: '0px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        />
      </div>
    </SidebarInset>
  );
}
