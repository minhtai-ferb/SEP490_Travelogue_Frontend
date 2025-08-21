"use client";

import { LucideIcon, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NewsCardProps {
  title: string;
  description: string;
  hrefList: string;
  hrefCreate: string;
  Icon: LucideIcon;
}

export function NewsCard({
  title,
  description,
  hrefList,
  hrefCreate,
  Icon,
}: NewsCardProps) {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button className="flex-1 bg-black hover:bg-gray-800" onClick={() => router.push(hrefList)}>
            Xem Tất Cả
          </Button>
          <Button variant="outline" aria-label={`Tạo mới ${title}`} onClick={() => router.push(hrefCreate)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
