"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import LocationsTable from "../../components/locations/table";

const crumb: Crumb[] = [{ label: "Quản lý địa điểm" }];

export default function ManageLocationPage() {

  return (
    <>
      <BreadcrumbHeader items={crumb} />
      <div>
        <LocationsTable href="/admin/locations"/>
      </div>
    </>
  );
}
