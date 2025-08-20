"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import LoadingContent from "@/components/common/loading-content";
import { useUserManager } from "@/services/user-manager";
import { User } from "@/types/Users";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UserProfileCard from "./components/user-info";
import UserSystemStatusCard from "./components/status-account-info";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumbs: Crumb[] = [
  { label: "Danh sách người dùng", href: "/admin/user/table" },
  { label: "Chi tiết người dùng" }
];

export default function UserDetailView() {
  const { id } = useParams<{ id: string }>();
  const { getUserById, loading } = useUserManager();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await getUserById(id);
        setUserData(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [id, getUserById]);

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <div className="p-6 space-y-6">
        {loading || !userData ? (
          <LoadingContent />
        ) : (
          <div className="flex flex-col space-y-6">
            <UserProfileCard user={userData} setUserData={setUserData} />
            <UserSystemStatusCard user={userData} />
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
