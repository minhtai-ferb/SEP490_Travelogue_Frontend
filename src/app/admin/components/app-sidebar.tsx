"use client";

import {
  Bot,
  LifeBuoy,
  Map,
  MapPin,
  Newspaper,
  Send,
  SquareTerminal,
  Ticket,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/app/admin/components/nav-main";
import { NavSecondary } from "@/app/admin/components/nav-secondary";
import { NavUser } from "@/app/admin/components/nav-user";
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

const data = {
  navMain: [
    {
      title: "Địa điểm",
      url: "/admin/locations",
      icon: MapPin,
      items: [
        {
          title: "Danh sách quận huyện",
          url: "/admin/districs",
        },
        {
          title: "Danh sách địa điểm",
          url: "/admin/locations/table",
        },
      ],
    },
    {
      title: "Tin tức",
      url: "/admin/news",
      icon: Newspaper,
      items: [
        {
          title: "Danh sách sự kiện",
          url: "/admin/news/event/table",
        },
        {
          title: "Danh sách trải nghiệm",
          url: "/admin/news/experience/table",
        },
        {
          title: "Danh sách tin tức",
          url: "/admin/news/new/table",
        },
      ],
    },
    {
      title: "Chuyến tham quan",
      url: "/admin/tour",
      icon: Map,
      items: [
        {
          title: "Danh sách chuyến tham quan",
          url: "/admin/tour",
        },
      ],
    },
  ],
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
  projects: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Quản lý tài khoản",
      url: "/admin/user",
      icon: Bot,
      items: [
        {
          title: "Người dùng",
          url: "/admin/user",
        },
        // {
        //   title: "Kiểm soát viên",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Quản lý các đặt chỗ",
      url: "/admin/booking",
      icon: Ticket,
      items: [
        {
          title: "Đặt chỗ chuyến tham quan",
          url: "/admin/booking",
        },
        {
          title: "Đặt hướng dẫn viên",
          url: "/admin/booking/tour-guide",
        },
      ],
    }
  ],
};

export function getUserFromLocalStorage() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("USER");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  return user;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Get the current URL path
  const user = getUserFromLocalStorage() || {
    name: "Guest",
    email: "guest@example.com",
    avatar: "",
  };

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
                  <span className="truncate font-semibold">Traveloge</span>
                  <span className="truncate text-xs">goyoung.tayninh.vn</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.projects.map((item) => ({
            ...item,
            isActive: pathname.includes(item.url), // Check if pathname includes the item's URL
          }))}
          titleMain="Nền tảng"
        />
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            isActive: pathname.includes(item.url), // Check if pathname includes the item's URL
          }))}
          titleMain="Quản Lý Thông tin"
        />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
