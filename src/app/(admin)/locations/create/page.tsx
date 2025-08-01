"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { CreateLocationForm } from "./components/create-location-form";
import HeaderCreateLocation from "./components/header";

export default function CreateLocationPage() {
  return (
    <SidebarInset>
      <HeaderCreateLocation />
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tạo địa điểm mới</h1>
            <p className="text-muted-foreground mt-2">
              Thêm thông tin chi tiết về địa điểm du lịch, làng nghề, ẩm thực
              hoặc di tích lịch sử
            </p>
          </div>
          <CreateLocationForm />
        </div>
      </div>
    </SidebarInset>
  );
}
