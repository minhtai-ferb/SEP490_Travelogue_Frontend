"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Calendar,
  Earth,
  MapPin,
  Newspaper,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Quản lý quận huyện",
      url: "/admin/districs",
      icon: MapPin,
    },
    {
      title: "Quản lý địa điểm",
      url: "/admin/locations",
      icon: Map,
      items: [
        {
          title: "Danh sách địa điểm",
          url: "/admin/locations/list",
        },
        {
          title: "Quản lý loại địa điểm",
          url: "/admin/locations/types",
        },
        {
          title: "Kho hình ảnh",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý sự kiện",
      url: "/admin/events",
      icon: Calendar,
      items: [
        {
          title: "Danh sách sự kiện",
          url: "/admin/events/lists",
        },
        {
          title: "Quản lý loại sự kiện",
          url: "/admin/events/types",
        },
        {
          title: "Kho hình ảnh",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý trải nghiệm",
      url: "/admin/experience",
      icon: Earth,
      items: [
        {
          title: "Danh sách trải nghiệm",
          url: "/admin/experience/lists",
        },
        {
          title: "Quản lý loại trải nghiệm",
          url: "/admin/experience/types",
        },
        {
          title: "Kho hình ảnh",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý tin tức",
      url: "/admin/news",
      icon: Newspaper,
      items: [
        {
          title: "Danh sách tin tức",
          url: "/admin/news/lists",
        },
        {
          title: "Quản lý danh mục tin tức",
          url: "/admin/news/types",
        },
        {
          title: "Kho hình ảnh",
          url: "#",
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
        {
          title: "Kiểm soát viên",
          url: "#",
        },
      ],
    },
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
                  <span className="truncate font-semibold">Go Young</span>
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
          titleMain="Thông tin"
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
