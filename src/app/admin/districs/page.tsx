"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import CityCard from "./components/card";
import { District } from "@/types/District";
import { useDistrictManager } from "@/services/district-manager";
import { addToast } from "@heroui/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Link from "next/link";

function ManageDistrics() {
  const [districts, setDistricts] = useState<District[]>([]);
  const { getAllDistrict, loading } = useDistrictManager();
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchStudents = async () => {
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
          error?.response?.data.Message ||
          "Đã xảy ra lỗi khi lấy dữ liệu quận huyện";

        // Display error using toast
        addToast({
          title: "Lỗi khi lấy dữ liệu quận huyện",
          description: errorMessage,
          color: "danger",
        });
      }
    };

    fetchStudents();
  }, [getAllDistrict]);

  return (
    <SidebarInset>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Quản lý quận huyện</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4 items-center w-full h-fit">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center w-fit h-fit">
            <Link href="/admin/districs/create" className="w-60 h-50">
              <div
                className="bg-blue-500 text-white flex flex-col items-center justify-center w-full h-40 rounded-lg shadow-lg hover:bg-blue-600 cursor-pointer"
                style={{
                  backgroundImage: "url('/background.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Image
                  src="/icon+.png"
                  alt="Add Icon"
                  width={40}
                  height={40}
                  className="object-cover"
                />
                <span className="mt-2 text-base font-semibold">
                  Tạo quận huyện mới
                </span>
              </div>
            </Link>

            {/* Map districts data into CityCard components */}
            {districts.map((district) => (
              <div
                key={district.id}
                onClick={() => router.push(`/admin/districs/${district.id}`)} // Navigate to district page
                className="cursor-pointer"
              >

                <CityCard
                  cityImage={
                    district.medias && district.medias.length > 0
                      ? district?.medias[0]?.mediaUrl
                      : "/thanh_pho_tay_ninh.jpg"
                  }
                  cityName={district.name}
                />
              </div>
            ))}
          </div>

          <div className="border-b border-gray-300 my-6 w-5/6"></div>

          <div className="p-6 max-w-4xl mx-auto rounded-lg w-full">
            <h2 className="text-2xl font-bold text-black mb-1">
              Tạo quận huyện mới
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Nơi để bạn quản lý thông tin của quận huyện một cách dễ dàng và
              nhanh chóng.
            </p>

            <div className="bg-white flex flex-col justify-start p-6 rounded-lg shadow-lg mb-6 ">
              <div className="flex items-center  mb-4 w-8/12">
                <div className="rounded-full w-1/4 h-20 flex justify-center items-center">
                  <Image
                    src="/mascot.png"
                    alt="Icon"
                    width={120}
                    height={120}
                  />
                </div>
                <div className="ml-4 w-3/4">
                  <p className="text-sm text-black font-medium mb-2">
                    Bạn chưa từng tạo quận huyện mới
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Tạo quận huyện mới để bắt đầu quản lý thông tin của quận
                    huyện.
                  </p>
                  <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
                    Cách Tạo Quận Huyện
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarInset>
  );
}

export default ManageDistrics;
