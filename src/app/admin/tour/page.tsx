"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingContent from "@/components/common/loading-content";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumbs: Crumb[] = [{ label: "Quản lý chuyến tham quan" }];

function ManageLocation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    router.push("/admin/tour");
  }, []);

  if (loading) {
    return <LoadingContent />;
  }

  return <BreadcrumbHeader items={crumbs} />;
}

export default ManageLocation;
