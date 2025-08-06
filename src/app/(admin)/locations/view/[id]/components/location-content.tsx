"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LocationContentProps {
  content: string
}

export function LocationContent({ content }: LocationContentProps) {
  if (!content) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </CardContent>
    </Card>
  )
}
