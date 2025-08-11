"use client";

import { AppSidebar } from "@/app/admin/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ensureRole } from "@/lib/auth";
import { useLoginCheck } from "@/lib/login-check";
import { useEffect, useState } from "react";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn } = useLoginCheck();

  ensureRole("Admin");

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
