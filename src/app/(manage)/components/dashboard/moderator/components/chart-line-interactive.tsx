"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { CalendarDays } from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import {
  Card,
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
import {
  useBookingStats,
  RevenueSystemStatistic,
  DailyRevenueSystem,
} from "@/services/use-dashbroad";

const { RangePicker } = DatePicker;

const chartConfig = {
  total: {
    label: "Tổng doanh thu",
    color: "hsl(var(--chart-1))",
  },
  tour: {
    label: "Đặt chuyến du lịch",
    color: "hsl(var(--chart-2))",
  },
  bookingTourGuide: {
    label: "Đặt hướng dẫn viên",
    color: "hsl(var(--chart-3))",
  },
  bookingWorkshop: {
    label: "Đặt trải nghiệm làng nghề",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type RevenueType = "grossRevenue" | "netRevenue";

const revenueTypeOptions = [
  { value: "grossRevenue", label: "Doanh thu gộp" },
  { value: "netRevenue", label: "Doanh thu ròng" },
];

function getDefaultDateRange(): {
  fromDate: string;
  toDate: string;
  days: number;
} {
  const today = new Date();
  const toDate = today.toISOString().split("T")[0];
  
  // Mặc định 30 ngày (±15 từ ngày hiện tại)
  const fromDate = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  
  const futureToDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return { fromDate, toDate: futureToDate, days: 30 };
}

function calculateDays(fromDate: string, toDate: string): number {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function SystemRevenueChart() {
  const [revenueType, setRevenueType] =
    React.useState<RevenueType>("grossRevenue");
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total");
  const [revenueData, setRevenueData] =
    React.useState<RevenueSystemStatistic | null>(null);
  const [dateRange, setDateRange] = React.useState(() => getDefaultDateRange());

  const { getRevenueSystemStatistics, loading } = useBookingStats();

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const fromDate = dates[0].format("YYYY-MM-DD");
      const toDate = dates[1].format("YYYY-MM-DD");
      const days = calculateDays(fromDate, toDate);
      setDateRange({ fromDate, toDate, days });
    }
  };

  const fetchRevenueData = React.useCallback(async () => {
    try {
      const response = await getRevenueSystemStatistics(dateRange.fromDate, dateRange.toDate);
      setRevenueData(response);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  }, [dateRange.fromDate, dateRange.toDate, getRevenueSystemStatistics]);

  React.useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const chartData = React.useMemo(() => {
    if (!revenueData) return [];

    const selectedRevenue = revenueData[revenueType];
    console.log(selectedRevenue);

    return selectedRevenue.dailyStats.map((stat: DailyRevenueSystem) => ({
      date: stat.date,
      total: stat.total,
      tour: stat.tour,
      bookingTourGuide: stat.bookingTourGuide,
      bookingWorkshop: stat.bookingWorkshop,
    }));
  }, [revenueData, revenueType]);

  const totalStats = React.useMemo(() => {
    if (!revenueData) return { total: 0, tour: 0, bookingTourGuide: 0, bookingWorkshop: 0 }

    const selectedRevenue = revenueData[revenueType]
    return {
      total: selectedRevenue.total,
      tour: selectedRevenue.byCategory.tour,
      bookingTourGuide: selectedRevenue.byCategory.bookingTourGuide,
      bookingWorkshop: selectedRevenue.byCategory.bookingWorkshop,
    }
  }, [revenueData, revenueType])

  

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Biểu đồ doanh thu của cả hệ thống
          </CardTitle>
          <CardDescription>
            Theo dõi doanh thu theo thời gian
            {dateRange.days > 0 && (
              <span className="ml-1 text-sm font-medium">
                ({dateRange.days} ngày)
              </span>
            )}
          </CardDescription>
          {dateRange.fromDate && dateRange.toDate && (
            <div className="text-sm text-muted-foreground mt-1">
              Từ {new Date(dateRange.fromDate).toLocaleDateString("vi-VN")} đến{" "}
              {new Date(dateRange.toDate).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex justify-between items-center gap-3 px-6 py-4 sm:py-6 border-t sm:border-t-0 sm:border-l">
          <div className="flex gap-2 justify-between items-center">
            <RangePicker
              value={[
                dateRange.fromDate ? dayjs(dateRange.fromDate) : null,
                dateRange.toDate ? dayjs(dateRange.toDate) : null,
              ]}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              className="w-full"
            />

            <Select
              value={revenueType}
              onValueChange={(value: RevenueType) => setRevenueType(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {revenueTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      {/* Revenue Stats Header */}
      <div className="flex border-b">
        {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(
          (key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left border-r last:border-r-0 hover:bg-muted/30 transition-colors"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-2xl">
                {formatCurrency(totalStats[key])}
              </span>
            </button>
          )
        )}
      </div>

      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-muted-foreground">Đang tải dữ liệu...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-muted-foreground">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDate}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[300px]"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("vi-VN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />

              {/* Multiple lines for all metrics */}
              <Line
                dataKey="total"
                type="monotone"
                stroke="var(--color-total)"
                strokeWidth={activeChart === "total" ? 3 : 1}
                dot={false}
                opacity={activeChart === "total" ? 1 : 0.3}
              />
              <Line
                dataKey="tour"
                type="monotone"
                stroke="var(--color-tour)"
                strokeWidth={activeChart === "tour" ? 3 : 1}
                dot={false}
                opacity={activeChart === "tour" ? 1 : 0.3}
              />
              <Line
                dataKey="bookingTourGuide"
                type="monotone"
                stroke="var(--color-bookingTourGuide)"
                strokeWidth={activeChart === "bookingTourGuide" ? 3 : 1}
                dot={false}
                opacity={activeChart === "bookingTourGuide" ? 1 : 0.3}
              />
              <Line
                dataKey="bookingWorkshop"
                type="monotone"
                stroke="var(--color-bookingWorkshop)"
                strokeWidth={activeChart === "bookingWorkshop" ? 3 : 1}
                dot={false}
                opacity={activeChart === "bookingWorkshop" ? 1 : 0.3}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
