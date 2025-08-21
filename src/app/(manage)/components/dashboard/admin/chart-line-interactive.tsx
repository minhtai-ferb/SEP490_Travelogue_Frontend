"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { CalendarDays } from "lucide-react";

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
  type RevenueStatisticResponse,
  type DailyStat,
} from "@/services/use-dashbroad";

const chartConfig = {
  total: {
    label: "Tổng doanh thu",
    color: "hsl(var(--chart-1))",
  },
  tour: {
    label: "Doanh thu tour",
    color: "hsl(var(--chart-2))",
  },
  commissionTourGuide: {
    label: "Hoa hồng hướng dẫn viên",
    color: "hsl(var(--chart-3))",
  },
  commissionWorkshop: {
    label: "Hoa hồng workshop",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type TimeFilter = "7d" | "1m" | "3m" | "6m" | "1y";

const timeFilterOptions = [
  { value: "7d", label: "7 ngày qua" },
  { value: "1m", label: "1 tháng qua" },
  { value: "3m", label: "3 tháng qua" },
  { value: "6m", label: "6 tháng qua" },
  { value: "1y", label: "1 năm qua" },
];

type RevenueType = "grossRevenue" | "netRevenue";

const revenueTypeOptions = [
  { value: "grossRevenue", label: "Doanh thu gộp" },
  { value: "netRevenue", label: "Doanh thu ròng" },
];

function getDateRange(filter: TimeFilter): {
  fromDate: string;
  toDate: string;
} {
  const today = new Date();
  const toDate = today.toISOString().split("T")[0];

  let fromDate: string;
  switch (filter) {
    case "7d":
      fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "1m":
      fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "3m":
      fromDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "6m":
      fromDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "1y":
      fromDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    default:
      fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
  }

  return { fromDate, toDate };
}

export function AdminRevenueChart() {
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>("1m");
  const [revenueType, setRevenueType] =
    React.useState<RevenueType>("grossRevenue");
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total");
  const [revenueData, setRevenueData] =
    React.useState<RevenueStatisticResponse | null>(null);

  const { getRevenueAdminStatistics, loading } = useBookingStats();

  const fetchRevenueData = React.useCallback(async () => {
    try {
      const { fromDate, toDate } = getDateRange(timeFilter);
      const response = await getRevenueAdminStatistics(fromDate, toDate);
      setRevenueData(response);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  }, [timeFilter, getRevenueAdminStatistics]);

  React.useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const chartData = React.useMemo(() => {
    if (!revenueData?.data) return [];

    const selectedRevenue = revenueData.data[revenueType];
    console.log(selectedRevenue);

    return selectedRevenue.dailyStats.map((stat: DailyStat) => ({
      date: stat.date,
      total: stat.total,
      tour: stat.tour,
      commissionTourGuide: stat.commissionTourGuide,
      commissionWorkshop: stat.commissionWorkshop,
    }));
  }, [revenueData, revenueType]);

  const totalStats = React.useMemo(() => {
    if (!revenueData?.data) return { total: 0, tour: 0, commissionTourGuide: 0, commissionWorkshop: 0 }

    const selectedRevenue = revenueData.data[revenueType]
    return {
      total: selectedRevenue.total,
      tour: selectedRevenue.byCategory.tour,
      commissionTourGuide: selectedRevenue.byCategory.commissionTourGuide,
      commissionWorkshop: selectedRevenue.byCategory.commissionWorkshop,
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
            Biểu đồ doanh thu Quản trị viên
          </CardTitle>
          <CardDescription>
            Theo dõi doanh thu và hoa hồng theo thời gian
          </CardDescription>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-3 px-6 py-4 sm:py-6 border-t sm:border-t-0 sm:border-l">
          <div className="flex gap-2">
            <Select
              value={timeFilter}
              onValueChange={(value: TimeFilter) => setTimeFilter(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                dataKey="commissionTourGuide"
                type="monotone"
                stroke="var(--color-commissionTourGuide)"
                strokeWidth={activeChart === "commissionTourGuide" ? 3 : 1}
                dot={false}
                opacity={activeChart === "commissionTourGuide" ? 1 : 0.3}
              />
              <Line
                dataKey="commissionWorkshop"
                type="monotone"
                stroke="var(--color-commissionWorkshop)"
                strokeWidth={activeChart === "commissionWorkshop" ? 3 : 1}
                dot={false}
                opacity={activeChart === "commissionWorkshop" ? 1 : 0.3}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
