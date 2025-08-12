"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormRequest } from "./request-craft-village/FormRequest";
import RegisterTourGuideClient from "./request-tour-guide/page";

export default function RequestsTabs() {
  return (
    <Tabs defaultValue="tour-guide" className="w-full">
      <TabsList className="mb-6 border-b w-full justify-start md:text-2xl text-sm rounded-none bg-transparent p-0 h-auto">
        <TabsTrigger
          value="tour-guide"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600"
        >
          Đăng ký hướng dẫn viên
        </TabsTrigger>
        <TabsTrigger
          value="craft-village"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600"
        >
          Đăng ký làng nghề
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tour-guide">
        <RegisterTourGuideClient />
      </TabsContent>
      <TabsContent value="craft-village">
        <FormRequest />
      </TabsContent>
    </Tabs>
  );
}
