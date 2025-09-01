"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Image as ImageIcon,
} from "lucide-react";

import { SidebarInset } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TripPlan } from "@/types/TripPlan";
import { useTripPlan } from "@/services/use-trip-plan";
import LoadingContent from "@/components/common/loading-content";

const getActivityTypeColor = (type: string) => {
  const typeMap: { [key: string]: string } = {
    "Địa điểm lịch sử": "bg-amber-100 text-amber-800 border-amber-200",
    "Làng nghề": "bg-green-100 text-green-800 border-green-200",
    "Danh lam thắng cảnh": "bg-blue-100 text-blue-800 border-blue-200",
    "Ẩm thực": "bg-orange-100 text-orange-800 border-orange-200",
  };

  return typeMap[type] || "bg-gray-100 text-gray-800 border-gray-200";
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  } catch {
    return "—";
  }
};

const formatDateTime = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return "—";
  }
};

const getStatusLabel = (status: number, statusText: string) => {
  const statusMap = {
    0: "Nháp",
    1: "Phác thảo",
    2: "Đã đặt",
    3: "Đã hủy",
  };

  return statusMap[status as keyof typeof statusMap] || statusText;
};

export default function TripPlanViewDetail({ href }: { href: string }) {
  const params = useParams();
  const router = useRouter();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getTripPlanById } = useTripPlan();
  const tripPlanId = params.id as string;

  useEffect(() => {
    const fetchTripPlan = async () => {
      if (!tripPlanId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getTripPlanById(tripPlanId);
        setTripPlan(response);
      } catch (err) {
        console.error("Error fetching trip plan:", err);
        setError("Không thể tải thông tin kế hoạch du lịch");
      } finally {
        setLoading(false);
      }
    };

    fetchTripPlan();
  }, [tripPlanId, getTripPlanById]);

  if (error || !tripPlan || loading) {
    return (
      <SidebarInset>
        <LoadingContent />
      </SidebarInset>
    );
  }

  const totalActivities = tripPlan.days.reduce(
    (total, day) => total + day.activities.length,
    0
  );

  console.log(tripPlan.imageUrl);
  

  return (
    <div className="container mx-auto p-6 space-y-6">

      {/* Trip Plan Image */}
      <Card>
        <CardContent className="p-0">
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
            {tripPlan.imageUrl != null ? (
              <img
                src={tripPlan.imageUrl}
                alt={tripPlan.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default_image.png';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chưa có hình ảnh</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl font-bold mb-1">{tripPlan.name}</h2>
              <p className="text-sm opacity-90">
                {formatDate(tripPlan.startDate)} - {formatDate(tripPlan.endDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Tên kế hoạch
              </label>
              <p className="text-gray-900 font-medium">{tripPlan.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Người tạo
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{tripPlan.ownerName}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Ngày bắt đầu
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">
                  {formatDate(tripPlan.startDate)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Ngày kết thúc
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">
                  {formatDate(tripPlan.endDate)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Tổng số ngày
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">
                  {tripPlan.totalDays} ngày
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Trạng thái
              </label>
              <div>
                <Badge
                  variant="outline"
                  className={
                    tripPlan.status === 0
                      ? "bg-gray-100 text-gray-800"
                      : tripPlan.status === 1
                      ? "bg-blue-100 text-blue-800"
                      : tripPlan.status === 2
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {getStatusLabel(tripPlan.status, tripPlan.statusText)}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Mô tả</label>
            <p className="text-gray-700 mt-1">{tripPlan.description}</p>
          </div>

          {tripPlan.pickupAddress && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Địa chỉ đón
              </label>
              <p className="text-gray-700 mt-1">{tripPlan.pickupAddress}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {tripPlan.totalDays}
              </p>
              <p className="text-sm text-gray-600">Số ngày</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {totalActivities}
              </p>
              <p className="text-sm text-gray-600">Địa điểm</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {tripPlan.days.length}
              </p>
              <p className="text-sm text-gray-600">Ngày có lịch trình</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lịch trình chi tiết</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tripPlan.days.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {day.dayNumber}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Ngày {day.dayNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{day.dateFormatted}</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {day.activities.length} địa điểm
                </Badge>
              </div>

              {day.activities.length === 0 ? (
                <div className="ml-11 p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                  Chưa có địa điểm nào được lên kế hoạch
                </div>
              ) : (
                <div className="ml-11 space-y-3">
                  {day.activities.map((activity, activityIndex) => (
                    <Card
                      key={activity.tripPlanLocationId}
                      className="shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Activity Image */}
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            {activity.imageUrl ? (
                              <img
                                src={activity.imageUrl}
                                alt={activity.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          {/* Activity Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {activity.name}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getActivityTypeColor(
                                    activity.type
                                  )}`}
                                >
                                  {activity.type}
                                </Badge>
                              </div>
                              <div className="text-right text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Clock className="w-3 h-3" />
                                  {activity.startTimeFormatted} -{" "}
                                  {activity.endTimeFormatted}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {activity.duration}
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2">
                              {activity.description}
                            </p>

                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {activity.address}
                            </div>

                            {activity.notes && activity.notes !== "string" && (
                              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                <strong>Ghi chú:</strong> {activity.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {dayIndex < tripPlan.days.length - 1 && (
                <Separator className="ml-11" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
