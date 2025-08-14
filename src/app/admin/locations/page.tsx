"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingContent from "@/components/common/loading-content";
import HeaderManageLocation from "./components/header";

function ManageLocation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    router.push("/admin/locations/table");
  }, []);

  if (loading) {
    return <LoadingContent />;
  }

  return <HeaderManageLocation />;
}

export default ManageLocation;
