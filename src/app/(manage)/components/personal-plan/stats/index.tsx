"use client";

import React from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TripPlan } from "@/types/TripPlan";


interface TripPlanStatsProps {
  tripPlans: TripPlan[];
  loading?: boolean;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

export default function TripPlanStats({ tripPlans, loading = false }: TripPlanStatsProps) {
  // Calculate statistics
  const totalTripPlans = tripPlans.length;
  const totalDays = tripPlans.reduce((sum, plan) => sum + plan.totalDays, 0);
  const totalActivities = tripPlans.reduce((sum, plan) => 
    sum + plan.days.reduce((daySum, day) => daySum + day.activities.length, 0), 0
  );
  const averageDaysPerPlan = totalTripPlans > 0 ? (totalDays / totalTripPlans).toFixed(1) : 0;
  const averageActivitiesPerPlan = totalTripPlans > 0 ? (totalActivities / totalTripPlans).toFixed(1) : 0;

  // Status distribution
  const statusCounts = tripPlans.reduce((acc, plan) => {
    const status = plan.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const draftCount = statusCounts[0] || 0;
  const sketchCount = statusCounts[1] || 0;
  const publishedCount = statusCounts[2] || 0;
  const cancelledCount = statusCounts[3] || 0;

  // Most popular locations
  const locationCounts = tripPlans.reduce((acc, plan) => {
    plan.days.forEach(day => {
      day.activities.forEach(activity => {
        const key = `${activity.name}-${activity.type}`;
        acc[key] = (acc[key] || 0) + 1;
      });
    });
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const stats: StatCard[] = [
    {
      title: "Tổng kế hoạch",
      value: totalTripPlans,
      icon: <MapPin className="w-5 h-5" />,
      description: "Số lượng kế hoạch du lịch",
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Tổng số ngày",
      value: totalDays,
      icon: <Calendar className="w-5 h-5" />,
      description: "Tổng thời gian du lịch",
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Tổng địa điểm",
      value: totalActivities,
      icon: <Activity className="w-5 h-5" />,
      description: "Số lượng địa điểm được lên kế hoạch",
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "TB ngày/kế hoạch",
      value: averageDaysPerPlan,
      icon: <Clock className="w-5 h-5" />,
      description: "Trung bình số ngày mỗi kế hoạch",
      color: "text-orange-600 bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-5 w-5 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-gray-600">
                {stat.description}
              </p>
              {stat.trend && (
                <div className={`flex items-center mt-2 text-xs ${
                  stat.trend.isPositive ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.trend.isPositive ? "+" : ""}{stat.trend.value}%
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Phân bố trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    Nháp
                  </Badge>
                </div>
                <span className="font-medium">{draftCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Phác thảo
                  </Badge>
                </div>
                <span className="font-medium">{sketchCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Đã đặt
                  </Badge>
                </div>
                <span className="font-medium">{publishedCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Đã hủy
                  </Badge>
                </div>
                <span className="font-medium">{cancelledCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              Địa điểm phổ biến
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topLocations.length === 0 ? (
              <p className="text-gray-500 text-sm">Chưa có dữ liệu địa điểm</p>
            ) : (
              <div className="space-y-3">
                {topLocations.map(([locationKey, count], index) => {
                  const [name, type] = locationKey.split('-');
                  return (
                    <div key={locationKey} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 line-clamp-1">
                          {name}
                        </div>
                        <div className="text-xs text-gray-500">{type}</div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {count}x
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Thống kê chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {averageActivitiesPerPlan}
              </div>
              <div className="text-sm text-gray-600">
                TB địa điểm/kế hoạch
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {tripPlans.filter(p => p.days.some(d => d.activities.length > 0)).length}
              </div>
              <div className="text-sm text-gray-600">
                Kế hoạch có địa điểm
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {tripPlans.filter(p => p.imageUrl && p.imageUrl !== "").length}
              </div>
              <div className="text-sm text-gray-600">
                Kế hoạch có hình ảnh
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
