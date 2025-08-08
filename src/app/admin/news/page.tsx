"use client";

import { useRouter } from "next/navigation";
import HeaderNewsManage from "./components/header";
import { NewsCard } from "./components/news-card-props";
import { Calendar, MapPin, Newspaper } from "lucide-react";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức" },
];

function ManageNews() {

  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bảng Điều Khiển Quản Lý Nội Dung</h1>
        <p className="text-muted-foreground">Quản lý sự kiện, tin tức và trải nghiệm của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NewsCard
          title="Sự Kiện"
          description="Quản lý các sự kiện và lễ hội"
          hrefList="/admin/news/event/table"
          hrefCreate="/admin/news/event/create"
          Icon={Calendar}
        />

        <NewsCard
          title="Tin Tức"
          description="Quản lý các tin tức và thông báo"
          hrefList="/admin/news/new/table"
          hrefCreate="/admin/news/new/create"
          Icon={Newspaper}
        />

        <NewsCard
          title="Trải Nghiệm"
          description="Quản lý các trải nghiệm du lịch"
          hrefList="/admin/news/experience/table"
          hrefCreate="/admin/news/experience/create"
          Icon={MapPin}
        />
      </div>
    </div>
    </div>
  );
}

export default ManageNews;
