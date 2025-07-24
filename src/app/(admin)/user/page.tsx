"use client";

import { useRouter } from "next/navigation";
import HeaderManageUser from "./components/header";
import { useEffect, useState } from "react";
import LoadingContent from "@/components/common/loading-content";

function ManageUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    router.push("/user/table");
  }, []);

  if (loading) {
    return (
      <LoadingContent />
    );
  }

  return <HeaderManageUser />;
}

export default ManageUser;
