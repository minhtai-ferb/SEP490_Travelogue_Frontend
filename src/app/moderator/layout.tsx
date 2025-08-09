"use client";

import { ModeratorSidebar } from "@/app/moderator/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useLoginCheck } from "@/lib/login-check";
import { useEffect } from "react";

export default function ModeratorLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { isLoggedIn } = useLoginCheck();

	useEffect(() => {
		isLoggedIn().then((loggedIn) => {
			if (!loggedIn) {
				console.log("User is not logged in. Redirecting to login...");
			} else {
				console.log("User is logged in.");
			}
		});
	}, []);

	return (
		<SidebarProvider
			style={{
				"--sidebar-width": "250px",
			} as React.CSSProperties}
		>
			<ModeratorSidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}


