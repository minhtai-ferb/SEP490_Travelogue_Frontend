"use client";

import {
  Bot,
  LifeBuoy,
  Map,
  MapPin,
  Newspaper,
  Send,
  SquareTerminal,
  Banknote,
  Ticket,
  BanknoteX,
  BanknoteArrowUp,
  MapPinned,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/app/(manage)/admin/components/nav-main";
import { NavSecondary } from "@/app/(manage)/admin/components/nav-secondary";
import { NavUser } from "@/app/(manage)/admin/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";

const data = {
  navSecondary: [
    {
      title: "Hỗ trợ",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Góp ý",
      url: "#",
      icon: Send,
    },
  ],

  navMain: [
    {
      title: "Thống kê hệ thống",
      url: "/moderator/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Quản lý tài khoản",
      url: "/moderator/user",
      icon: Bot,
      items: [
        {
          title: "Hướng dẫn viên",
          url: "/admin/user/tourguide",
        },
        {
          title: "Làng nghề",
          url: "/admin/user/craftvillage",
        },
      ],
    },
    {
      title: "Quản lý quận huyện",
      url: "/moderator/districts",
      icon: MapPinned,
    },
    {
      title: "Quản lý địa điểm du lịch",
      url: "/moderator/locations",
      icon: MapPin,
    },
    {
      title: "Quản lý các đặt chỗ",
      url: "/moderator/booking",
      icon: Ticket,
      items: [
        {
          title: "Đặt chỗ chuyến tham quan",
          url: "/moderator/booking/tour-schedule",
        },
        {
          title: "Đặt hướng dẫn viên",
          url: "/moderator/booking/tour-guide",
        },
        {
          title: "Đặt trải nghiệm làng nghề",
          url: "/moderator/booking/workshop",
        },
        {
          title: "Yêu cầu hủy đặt chỗ",
          url: "/admin/booking/rejection-request",
        },
      ],
    },
    {
      title: "Quản lý chuyến tham quan",
      url: "/moderator/tour",
      icon: Map,
    },
    {
      title: "Quản lý tin tức",
      url: "/moderator/news",
      icon: Newspaper,
      items: [
        {
          title: "Danh sách sự kiện",
          url: "/moderator/news/event",
        },
        {
          title: "Danh sách trải nghiệm",
          url: "/moderator/news/experience",
        },
        {
          title: "Danh sách tin tức",
          url: "/moderator/news/new",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Get the current URL path
  const [user, setUser] = useAtom(userAtom);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src="/Logo.png"
                    alt="Tây Ninh Logo"
                    width={100}
                    height={100}
                    className="object-contain md:w-[100px] md:h-[100px] w-[50px] h-[50px] hover:cursor-pointer"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Travelogue</span>
                  <span className="truncate text-xs">travelogue.onl</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            isActive: pathname.includes(item.url),
          }))}
          titleMain="Kiểm duyệt viên"
        />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            fullName: user?.fullName ?? "Guest",
            email: user?.email ?? "guest@example.com",
            avatar: user?.avatarUrl ?? "/default-avatar.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
