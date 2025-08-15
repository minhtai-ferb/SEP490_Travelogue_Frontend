"use client";

import {
	SquareTerminal,
	UserCog,
	Send,
	LifeBuoy,
	Building2,
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
			title: "Quản lý hướng dẫn viên",
			url: "/moderator/tourguide",
			icon: UserCog,
			items: [
				{
					title: "Yêu cầu đăng ký",
					url: "/moderator/tourguide/requests",
				},
			],
		},
		{
			title: "Quản lý làng nghề",
			url: "/moderator/craft-village",
			icon: Building2,
			items: [
				{
					title: "Danh sách làng nghề",
					url: "/moderator/craft-village/table",
				},
				{
					title: "Danh sách workshop",
					url: "/moderator/craft-village/workshop/table",
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
			title: "Moderator",
			url: "/moderator",
			icon: SquareTerminal,
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

export function ModeratorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
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
									<span className="truncate font-semibold">{user?.name}</span>
									<span className="truncate text-xs">{user?.email}</span>
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
						isActive: pathname.includes(item.url),
					}))}
					titleMain="Nền tảng"
				/>
				<NavMain
					items={data.navMain.map((item) => ({
						...item,
						isActive: pathname.includes(item.url),
					}))}
					titleMain="Quản lý"
				/>
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}


