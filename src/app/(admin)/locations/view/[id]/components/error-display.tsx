"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ErrorDisplayProps {
  error: string
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    </div>
  )
}
