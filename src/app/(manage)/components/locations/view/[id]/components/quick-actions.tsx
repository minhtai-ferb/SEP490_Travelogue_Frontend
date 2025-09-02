"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Share2,
  Heart,
  Bookmark,
  Navigation,
  Eye,
  Star,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface QuickActionsProps {
  locationId: string;
  rating: number;
  className?: string;
  locationName: string;
  href: string;
}

export function QuickActions({
  locationId,
  rating,
  className,
  locationName,
  href,
}: QuickActionsProps) {
  const router = useRouter();
  const handleEdit = () => {
    router.push(`${href}/locations/edit/${locationId}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Chia sẻ địa điểm",
        url: 'https://travelogue.onl/kham-pha',
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
      toast.error("Tạo link thất bại")
    }
  };

  const handleDirections = () => {
    // This would need coordinates, but for now just open maps
    window.open(`https://www.google.com/maps/dir//${locationName}`, "_blank");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="w-5 h-5 text-yellow-500" />
          Thao tác nhanh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Display */}
        {/* <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Đánh giá</span>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              {rating}/5
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div> */}

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleEdit}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa địa điểm
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Chia sẻ
            </Button>

            <Button
              onClick={handleDirections}
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Chỉ đường
            </Button>
          </div>
        </div>

        <Separator />

        {/* Statistics */}
        {/* <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Thống kê
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Lượt xem</div>
              <div className="font-semibold text-gray-700">1,234</div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Lượt thích</div>
              <div className="font-semibold text-gray-700">89</div>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
