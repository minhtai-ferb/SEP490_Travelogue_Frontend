"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountInfo from "./ho-so-ca-nhan/account-info";
import PasswordSecurity from "./doi-mat-khau/password-security";
import AvatarUpload from "./avatar-upload/avatar-upload";



export default function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="mb-6 border-b w-full justify-start md:text-2xl text-sm rounded-none bg-transparent p-0 h-auto">
        <TabsTrigger
          value="account"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600"
        >
          Thông tin tài khoản
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600"
        >
          Mật khẩu & Bảo mật
        </TabsTrigger>
        <TabsTrigger
          value="avatar"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600"
        >
          Ảnh đại diện
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <AccountInfo />
      </TabsContent>
      <TabsContent value="password">
        <PasswordSecurity />
      </TabsContent>
      <TabsContent value="avatar">
        <AvatarUpload />
      </TabsContent>
    </Tabs>
  );
}