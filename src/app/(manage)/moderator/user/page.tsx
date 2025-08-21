"use client";

import ManageUserTable from "@/app/(manage)/components/user/manage";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ReportTable from "../../components/user/report";
import { Card, Tabs } from "antd";
import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";

const crumbs: Crumb[] = [{ label: "Quản lý tài khoản", href: "/moderator/user" }];

function ManageUser() {
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Quản lý người dùng
        </span>
      ),
      children: <ManageUserTable href="/moderator/user" />,
    },
    {
      key: '2',
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
    <SidebarInset >
      <BreadcrumbHeader items={crumbs} />
      <div>
        <Card className="shadow-lg">
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            size="large"
            className="px-4"
            tabBarStyle={{
              borderBottom: '2px solid #f0f0f0',
              marginBottom: '24px'
            }}
          />
        </Card>
      </div>
    </SidebarInset>
  );
}

export default ManageUser;
