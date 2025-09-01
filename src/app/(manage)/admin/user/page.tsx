"use client";

import ManageUserTable from "@/app/(manage)/components/user/manage";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ReportTable from "../../components/user/report";
import { Card, Tabs } from "antd";
import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";

const crumbs: Crumb[] = [{ label: "Quản lý tài khoản", href: "/admin/user" }];

function ManageUser() {
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Quản lý người dùng
        </span>
      ),
      children: <ManageUserTable href="/admin" />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <ExclamationCircleOutlined />
          Báo cáo vi phạm
        </span>
      ),
      children: <ReportTable />,
    },
  ];

  return (
    <>
      <BreadcrumbHeader items={crumbs} />
      <div>
        <Card>
          <Tabs defaultActiveKey="1" items={tabItems} size="large" />
        </Card>
      </div>
    </>
  );
}

export default ManageUser;
