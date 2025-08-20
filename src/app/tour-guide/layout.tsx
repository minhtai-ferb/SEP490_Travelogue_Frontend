"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./dashboard/component/app-sidebar";

export default function HdvLayout({ children }: { children: React.ReactNode }) {

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
