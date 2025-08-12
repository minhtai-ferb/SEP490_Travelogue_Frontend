import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookingStatsItem } from "@/services/use-dashbroad";
import { useRouter } from "next/navigation";

interface BookingStatsCardsProps {
  data: BookingStatsItem[];
}

export function BookingStatsCards({ data }: BookingStatsCardsProps) {
  const router = useRouter();

  const totalSchedule = data.reduce(
    (sum, item) => sum + item.bookingSchedule,
    0
  );

  const totalTourGuide = data.reduce(
    (sum, item) => sum + item.bookingTourGuide,
    0
  );

  const totalWorkshop = data.reduce(
    (sum, item) => sum + item.bookingWorkshop,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2 space-y-4">
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Chuyến tham quan</CardTitle>
            <CardTitle
              className="text-2xl"
              style={{ color: "hsl(var(--chart-1))" }}
            >
              {totalSchedule.toLocaleString()}
            </CardTitle>
          </div>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-black hover:bg-gray-800"
                onClick={() =>
                  router.push("/admin/booking/tour-schedule/table")
                }
              >
                Xem Tất Cả
              </Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2 space-y-4">
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Hướng dẫn viên</CardTitle>
            <CardTitle
              className="text-2xl"
              style={{ color: "hsl(var(--chart-1))" }}
            >
              {totalTourGuide.toLocaleString()}
            </CardTitle>
          </div>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-black hover:bg-gray-800"
                onClick={() => router.push("/admin/booking/tour-guide/table")}
              >
                Xem Tất Cả
              </Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2 space-y-4">
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Trải nghiệm làng nghề</CardTitle>
            <CardTitle
              className="text-2xl"
              style={{ color: "hsl(var(--chart-1))" }}
            >
              {totalWorkshop.toLocaleString()}
            </CardTitle>
          </div>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-black hover:bg-gray-800"
                onClick={() => router.push("/admin/booking/workshop/table")}
              >
                Xem Tất Cả
              </Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
