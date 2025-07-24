"use client";

import { AppSidebar } from "@/app/(admin)/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLoginCheck } from "@/lib/login-check";
import { useEffect, useState } from "react";
import LoadingPage from "./loading";

export default function Page({
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
      style={
        {
          "--sidebar-width": "250px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
