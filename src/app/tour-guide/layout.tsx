"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./dashboard/component/app-sidebar"
import { ensureRole } from "@/lib/auth";

export default function HdvLayout({ children }: { children: React.ReactNode }) {
	ensureRole("TourGuide");
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
