"use client"

import * as React from "react"
import { Plus, User, LayoutDashboard } from "lucide-react"

// import { Calendars } from "./calendar"
import { DatePicker } from "./date-picker"
import { NavUser } from "./nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar"
import { userAtom } from "@/store/auth"
import { useAtomValue } from "jotai"
import Link from "next/link"
import { FaCertificate } from "react-icons/fa"


const data = {
	user: {
		fullName: "Chưa xác định",
		email: "chưa xác định",
		avatar: "/avatars/default.jpg",
	},
	// calendars: [
	// 	{
	// 		name: "Quản lý",
	// 		items: ["Quản lý", "Lịch nghỉ phép", "Lịch nghỉ lễ"],
	// 	},
	// 	{
	// 		name: "Lịch nghỉ phép",
	// 		items: ["Lịch nghỉ phép", "Lịch nghỉ lễ"],
	// 	},
	// 	{
	// 		name: "Lịch nghỉ lễ",
	// 		items: ["Lịch nghỉ lễ"],
	// 	},
	// ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

	const user = useAtomValue(userAtom)
	const dataUser = {
		fullName: user?.fullName || data.user.fullName,
		email: user?.email || data.user.email,
		avatar: user?.avatar || data.user.avatar,
	}

	return (
		<Sidebar {...props}>
			<SidebarHeader className="border-sidebar-border h-16 border-b">
				<NavUser user={dataUser} />
			</SidebarHeader>
			<SidebarContent>
				<DatePicker />
				<SidebarSeparator className="mx-0" />
				<SidebarMenu className="flex flex-col gap-2 justify-center ml-3">
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/tour-guide/dashboard">
								<LayoutDashboard />
								<span>Tổng quan</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/tour-guide/profile">
								<User />
								<span>Hồ sơ cá nhân</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/tour-guide/dashboard/dang-ky-chung-chi">
								<FaCertificate />
								<span>Đăng ký chứng chỉ</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarSeparator className="mx-0" />
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton>
							<Plus />
							<span>New Calendar</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}
