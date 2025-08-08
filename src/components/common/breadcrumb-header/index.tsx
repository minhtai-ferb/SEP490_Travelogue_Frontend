"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export type Crumb = {
  /** Text hiển thị */
  label: string;
  /** Link chuyển hướng. Nếu không truyền -> coi là trang hiện tại */
  href?: string;
  /** Ẩn crumb này trên màn md trở xuống */
  hiddenOnMd?: boolean;
};

export interface AppBreadcrumbHeaderProps {
  /** Danh sách breadcrumb theo thứ tự từ trái sang phải */
  items: Crumb[];
  /** Có hiển thị nút mở Sidebar không */
  showSidebarTrigger?: boolean;
  /** Sticky header ở top */
  sticky?: boolean;
  /** Thêm className tùy biến */
  className?: string;
}

/**
 * Header có Breadcrumb tái sử dụng được cho các trang tạo/sửa/xem.
 * Truyền vào mảng `items` để hiển thị đường dẫn động.
 */
export default function BreadcrumbHeader({
  items,
  showSidebarTrigger = true,
  sticky = true,
  className,
}: AppBreadcrumbHeaderProps) {
  return (
    <header
      className={[
        "flex h-16 shrink-0 items-center gap-2 border-b px-4 z-50 bg-background",
        sticky ? "sticky top-0" : "",
        className ?? "",
      ].join(" ")}
    >
      {showSidebarTrigger ? <SidebarTrigger className="-ml-1" /> : null}
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const hiddenCls = item.hiddenOnMd ? "hidden md:block" : undefined;

            return (
              <React.Fragment key={`${item.label}-${idx}`}>
                <BreadcrumbItem className={hiddenCls}>
                  {isLast || !item.href ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator className={hiddenCls} />
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
