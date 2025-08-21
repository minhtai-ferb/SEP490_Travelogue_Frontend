"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

type ErrorCardProps = {
  message: string
  onRetry: () => void
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="text-center m-6">
        <Alert className="flex justify-center items-center mb-6">
          <AlertCircle className="h-6 w-6" color="red" />
          <AlertDescription className="ml-2 mt-1 text-xl text-red-600">{message}</AlertDescription>
        </Alert>
        <Button onClick={onRetry}>Thử lại</Button>
      </CardContent>
    </Card>
  )
}


