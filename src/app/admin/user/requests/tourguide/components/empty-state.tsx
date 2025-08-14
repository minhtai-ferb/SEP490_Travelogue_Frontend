"use client"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <Card className="bg-muted/30">
        <CardContent className="py-12 text-center">
          <div className="text-base font-medium text-gray-900">Không có yêu cầu nào</div>
          <div className="text-sm text-gray-500 mt-1">Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</div>
        </CardContent>
      </Card>
    </div>
  )
}