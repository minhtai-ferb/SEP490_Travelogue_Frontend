"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import ManageProfile from "../../components/profile";

const crumbs: Crumb[] = [{ label: "Thông tin tài khoản", href: "/moderator/profile" }];

function ProfileUser() {


  return (
    <>
      <BreadcrumbHeader items={crumbs} />
      <div>
        <ManageProfile />
      </div>
    </>
  );
}

export default ProfileUser;
