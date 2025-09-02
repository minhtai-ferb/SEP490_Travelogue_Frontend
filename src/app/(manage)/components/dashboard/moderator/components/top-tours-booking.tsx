"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, Skeleton, Empty, Space } from "antd";
import { TrendingUp, MapPin, Calendar, Users } from "lucide-react";
import { useBookingStats } from "@/services/use-dashbroad";
import type { TopTour } from "@/services/use-dashbroad";

const { Option } = Select;

// Tạo danh sách tháng
const months = [
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
];

// Tạo danh sách năm (từ 2020 đến hiện tại + 5 năm)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2020 + 6 }, (_, i) => ({
  value: 2020 + i,
  label: `Năm ${2020 + i}`,
}));

export default function TopToursBooking() {
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { getTourStatistics, loading } = useBookingStats();

  const fetchTopTours = async (month: number, year: number) => {
    try {
      const data = await getTourStatistics(month, year, 5);
      if (data && data.topTours) {
        setTopTours(data.topTours);
      } else {
        setTopTours([]);
      }
    } catch (error) {
      console.error("Error fetching top tours:", error);
      setTopTours([]);
    }
  };

  useEffect(() => {
    fetchTopTours(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // Tạo danh sách 5 items (thực tế + placeholder)
  const displayItems = Array.from({ length: 5 }, (_, index) => {
    if (index < topTours.length) {
      return { type: 'real' as const, data: topTours[index], index };
    }
    return { type: 'placeholder' as const, index };
  });

  if (loading) {
    return (
      <Card 
        className="h-full"
        title={
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Top 5 Tours Được Booking Nhiều Nhất</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">Thống kê tours có lượt booking cao nhất</span>
            </div>
            <Space>
              <Select
                value={selectedMonth}
                style={{ width: 120 }}
                onChange={handleMonthChange}
                disabled={loading}
              >
                {months.map((month) => (
                  <Option key={month.value} value={month.value}>
                    {month.label}
                  </Option>
                ))}
              </Select>
              <Select
                value={selectedYear}
                style={{ width: 100 }}
                onChange={handleYearChange}
                disabled={loading}
              >
                {years.map((year) => (
                  <Option key={year.value} value={year.value}>
                    {year.value}
                  </Option>
                ))}
              </Select>
            </Space>
          </div>
        }
        bodyStyle={{ height: 'calc(100% - 70px)', padding: '16px', display: 'flex', flexDirection: 'column' }}
      >
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton.Avatar size="small" />
                <div>
                  <Skeleton.Input style={{ width: 180, height: 16 }} active />
                  <div className="mt-1">
                    <Skeleton.Input style={{ width: 120, height: 12 }} active />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Skeleton.Input style={{ width: 60, height: 16 }} active />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="h-full"
      title={
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Top 5 Tours Được Booking Nhiều Nhất</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Thống kê tours có lượt booking cao nhất</span>
          </div>
          <Space>
            <Select
              value={selectedMonth}
              style={{ width: 120 }}
              onChange={handleMonthChange}
              disabled={loading}
            >
              {months.map((month) => (
                <Option key={month.value} value={month.value}>
                  {month.label}
                </Option>
              ))}
            </Select>
            <Select
              value={selectedYear}
              style={{ width: 100 }}
              onChange={handleYearChange}
              disabled={loading}
            >
              {years.map((year) => (
                <Option key={year.value} value={year.value}>
                  {year.value}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
      }
      bodyStyle={{ height: 'calc(100% - 70px)', padding: '16px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {displayItems.map((item) => {
            if (item.type === 'real') {
              const tour = item.data;
              return (
                <div 
                  key={tour.tourId} 
                  className="flex items-center justify-between p-2 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      #{item.index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1 line-clamp-1 text-sm">
                        {tour.tourName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>ID: {tour.tourId.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                      <Users className="h-4 w-4" />
                      <span>{tour.bookingCount}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {tour.bookingCount === 1 ? "booking" : "bookings"}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Placeholder item
              return (
                <div 
                  key={`placeholder-${item.index}`} 
                  className="flex items-center justify-between p-2 border border-dashed border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-400 font-semibold text-sm">
                      #{item.index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-400 mb-1 text-sm">
                        Chưa có dữ liệu
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-semibold text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>0</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      booking
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>
              Thống kê cho tháng {selectedMonth}/{selectedYear}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
