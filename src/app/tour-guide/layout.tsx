"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./dashboard/component/app-sidebar"
import { useRouter } from "next/navigation";

export default function HdvLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
