"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { BookingStatsItem, useBookingStats } from "@/services/use-dashbroad";
import { BookingStatsCards } from "./booking-stats-cards";

const chartConfig = {
  bookingSchedule: {
    label: "Chuyến tham quan",
    color: "hsl(var(--chart-1))",
  },
  bookingTourGuide: {
    label: "Hướng dẫn viên",
    color: "hsl(var(--chart-2))",
  },
  bookingWorkshop: {
    label: "Trải nghiệm làng nghề",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface Props {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export function BookingStatsChart({ setTimeRange, timeRange }: Props) {
  const isMobile = useIsMobile();
  const { getBookingStats, loading } = useBookingStats();
  const [data, setData] = useState<BookingStatsItem[]>([]);
  const totalBookings = data.reduce(
    (sum, item) =>
      sum + item.bookingSchedule + item.bookingTourGuide + item.bookingWorkshop,
    0
  );
  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const fetchData = async () => {
    try {
      let daysToSubtract = 30;
      if (timeRange === "90d") {
        daysToSubtract = 90;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }

      const endDate = new Date();
      const startDate = subDays(endDate, daysToSubtract);
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      const response = await getBookingStats(startDateStr, endDateStr);
      const formattedData = response.data.map((item) => ({
        ...item,
        date: item.day, // Đổi tên field để match với AreaChart
        displayDay: format(new Date(item.day), "dd/MM", { locale: vi }),
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch booking stats:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]); // Dependency thay đổi thành timeRange

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <BookingStatsCards data={data} />

      <Card className="@container/card">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="space-y-1">
            <CardTitle>Thống kê đăt chỗ</CardTitle>
            <CardDescription>
              <span className="">
                Tổng số {" "}
                {totalBookings}{" "} booking trong{" "}
                {timeRange === "90d"
                  ? "3 tháng"
                  : timeRange === "30d"
                  ? "30 ngày"
                  : "7 ngày"}{" "}
                qua
              </span>
            </CardDescription>
          </div>
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">3 tháng qua</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 ngày qua</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 ngày qua</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                // size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="30 ngày qua" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  3 tháng qua
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  30 ngày qua
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  7 ngày qua
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="fillBookingSchedule"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-bookingSchedule)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-bookingSchedule)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillBookingTourGuide"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-bookingTourGuide)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-bookingTourGuide)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillBookingWorkshop"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-bookingWorkshop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-bookingWorkshop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("vi-VN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="bookingSchedule"
                type="natural"
                fill="url(#fillBookingSchedule)"
                stroke="var(--color-bookingSchedule)"
                stackId="a"
              />
              <Area
                dataKey="bookingTourGuide"
                type="natural"
                fill="url(#fillBookingTourGuide)"
                stroke="var(--color-bookingTourGuide)"
                stackId="a"
              />
              <Area
                dataKey="bookingWorkshop"
                type="natural"
                fill="url(#fillBookingWorkshop)"
                stroke="var(--color-bookingWorkshop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
