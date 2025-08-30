"use client";

import { NewsCard } from "./components/news-card-props";
import { Calendar, MapPin, Newspaper } from "lucide-react";

function DashboardNews({ href }: { href: string }) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Bảng Điều Khiển Quản Lý Nội Dung
        </h1>
        <p className="text-muted-foreground">
          Quản lý sự kiện, tin tức và trải nghiệm của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NewsCard
          title="Sự Kiện"
          description="Quản lý các sự kiện và lễ hội"
          hrefList={`${href}/event`}
          hrefCreate={`${href}/event/create`}
          Icon={Calendar}
        />

        <NewsCard
          title="Tin Tức"
          description="Quản lý các tin tức và thông báo"
          hrefList={`${href}/new`}
          hrefCreate={`${href}/new/create`}
          Icon={Newspaper}
        />

        <NewsCard
          title="Trải Nghiệm"
          description="Quản lý các trải nghiệm du lịch"
          hrefList={`${href}/experience`}
          hrefCreate={`${href}/experience/create`}
          Icon={MapPin}
        />
      </div>
    </div>
  );
}

export default DashboardNews;
