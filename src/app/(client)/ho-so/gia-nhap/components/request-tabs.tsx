"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTourguideAssign } from "@/services/tourguide";
import RegisterTourGuideClient from "./request-tour-guide/page";
import { FormRequest } from "./request-craft-village/FormRequest";
import { Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";

// (tuỳ chọn) type tối thiểu cho dữ liệu trả về
type TourGuideRequestLatest = {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  introduction: string;
  price: number;
  status: number;
  statusText: string; // "Chờ xác nhận" | "Đã xác nhận" | "Từ chối"
  rejectionReason?: string | null;
  certifications?: { name: string; certificateUrl: string }[];
} | null;

export default function RequestsTabs() {
  const [user] = useAtom(userAtom);
  const { getTourGuideRequestLatest } = useTourguideAssign();
  const [latest, setLatest] = useState<TourGuideRequestLatest>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const fetchLatest = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    if (!user?.id) {
      setErrorMsg("Không tìm thấy thông tin người dùng.");
      setLatest(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getTourGuideRequestLatest(user.id);
      // Giả định API trả về null hoặc object
      if (
        res &&
        (res.statusText === "Chờ xác nhận" || res.statusText === "Đã xác nhận")
      ) {
        console.log("TourGuideRequestLatest:", res);
      }
      setLatest(res ?? null);
    } catch (e: any) {
      setErrorMsg(
        e?.message || "Không thể tải trạng thái đăng ký hướng dẫn viên."
      );
      setLatest(null);
    } finally {
      setLoading(false);
    }
  }, [getTourGuideRequestLatest, user?.id]);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

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
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang kiểm tra trạng
            thái đăng ký...
          </div>
        ) : errorMsg ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Không tải được trạng thái
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-destructive">{errorMsg}</p>
              <Button size="sm" variant="outline" onClick={fetchLatest}>
                Thử lại
              </Button>
            </CardContent>
          </Card>
        ) : latest === null ? (
          // Không có yêu cầu gần nhất -> hiển thị form đăng ký
          <RegisterTourGuideClient />
        ) : (
          // Có yêu cầu -> ẩn form, hiển thị trạng thái + nút tải lại
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Trạng thái đăng ký hướng dẫn viên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thông tin cá nhân */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Họ tên
                  </span>
                  <p className="font-medium text-sm">{latest.fullName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Email
                  </span>
                  <p className="font-medium text-sm">{latest.email}</p>
                </div>
              </div>

              {/* Giới thiệu */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Giới thiệu
                </span>
                <p className="font-medium text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                  {latest.introduction}
                </p>
              </div>

              {/* Giá dịch vụ và Trạng thái */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Giá dịch vụ
                  </span>
                  <p className="font-semibold text-lg text-primary">
                    {latest.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
                <div className="space-y-1 flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Trạng thái
                  </span>
                  <span
                    className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-sm font-medium ${
                      latest.statusText === "Đã xác nhận"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {latest.statusText}
                  </span>
                </div>
              </div>

              {/* Chứng chỉ */}
              {latest.certifications && latest.certifications.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Chứng chỉ
                  </span>
                  <div className="grid gap-3">
                    {latest.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <span className="font-medium text-sm text-gray-800">
                          {cert.name}
                        </span>
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Xem chứng chỉ
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lý do từ chối */}
              {latest.statusText === "Từ chối" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Lý do từ chối
                      </h3>
                      <p className="mt-1 text-sm text-red-700">
                        {latest.rejectionReason ||
                          "Không có lý do cụ thể từ hệ thống."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t justify-end">
                <Button size="default" onClick={fetchLatest}>
                  Tải lại
                </Button>
                {latest.statusText !== "Chờ xác nhận" &&
                  latest.statusText !== "Đã xác nhận" && (
                    <Button
                      size="default"
                      variant="outline"
                      onClick={() => setLatest(null)}
                    >
                      Đăng ký lại
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="craft-village">
        <FormRequest />
      </TabsContent>
    </Tabs>
  );
}
