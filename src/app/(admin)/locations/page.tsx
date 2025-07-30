"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import LoadingContent from "@/components/common/loading-content";
import HeaderManageLocation from "./components/header";

function ManageLocation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    router.push("/locations/table");
  }, []);

  if (loading) {
    return <LoadingContent />;
  }

  return <HeaderManageLocation />;
}

export default ManageLocation;
