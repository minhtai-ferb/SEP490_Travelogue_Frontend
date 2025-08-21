"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import LoadingContent from "@/components/common/loading-content";
import { SidebarInset } from "@/components/ui/sidebar";
import { useDistrictManager } from "@/services/district-manager";
import { District } from "@/types/District";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MainContent } from "../../components/districs";

const crumb: Crumb[] = [{ label: "Quản lý quận huyện" }];

function DistricsManage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [mounted, setMounted] = useState(false);
  const { getAllDistrict, loading } = useDistrictManager();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchDistricts = async () => {
      try {
        const response: District[] = await getAllDistrict();
        if (!response) {
          throw new Error("No data returned from API getAllDistrict");
        }

        setDistricts(response);
      } catch (error: any) {
        console.error("====================================");
        console.error(error);
        console.error("====================================");
        const errorMessage =
          error?.response?.data?.Message ||
          "Đã xảy ra lỗi khi lấy dữ liệu quận huyện";

        toast.error(errorMessage);
      }
    };

    fetchDistricts();
  }, [getAllDistrict, mounted]);

  if (!mounted) {
    return (
      <SidebarInset>
        <BreadcrumbHeader items={crumb} />
        <LoadingContent />
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      {loading ? <LoadingContent /> : <MainContent districts={districts} href={"/admin/districts"} />}
    </SidebarInset>
  );
}

export default DistricsManage;
