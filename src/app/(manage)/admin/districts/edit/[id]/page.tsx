"use client";

import { use } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import LoadingContent from "@/components/common/loading-content";
import { DistrictEditForm } from "@/app/(manage)/components/districs/edit/[id]";
import { useDistrictEdit } from "@/app/(manage)/components/districs/edit/[id]/hooks/useDistrictEdit";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumb: Crumb[] = [
  { label: "Quản lý quận huyện", href: "/admin/districts" },
  { label: "Chỉnh sửa quận huyện" },
];

const EditDistrictPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  
  const {
    formData,
    loading,
    handleChange,
    handleSubmit
  } = useDistrictEdit(id, "/admin/districts");

  return (
    <SidebarInset className="flex flex-col gap-4 p-4">
      <BreadcrumbHeader items={crumb} />
      
      {loading ? (
        <LoadingContent />
      ) : (
        <DistrictEditForm
          formData={formData}
          onFormChange={handleChange}
          onSubmit={handleSubmit}
          districtId={id}
          href="/admin/districts"
        />
      )}
    </SidebarInset>
  );
};

export default EditDistrictPage;