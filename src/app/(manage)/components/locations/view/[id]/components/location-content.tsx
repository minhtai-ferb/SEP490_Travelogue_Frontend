"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface LocationContentProps {
  content: string
}

export function LocationContent({ content }: LocationContentProps) {
  if (!content) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Chi tiết về địa điểm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có thông tin chi tiết</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Chi tiết về địa điểm
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </CardContent>
    </Card>
  )
}
