"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

const statusColorMap: Record<string, string> = {
	"Nháp": "bg-yellow-100 text-yellow-800",
	"Đã xác nhận": "bg-green-100 text-green-800",
	"Đã hủy": "bg-red-100 text-red-800",
}

type StatusBadgeProps = {
	statusText: string
}

export function StatusBadge({ statusText }: StatusBadgeProps) {
	const color = statusColorMap[statusText] || "bg-gray-100 text-gray-800"
	return <Badge className={`${color} text-xs`}>{statusText == "Draft" ? "Nháp" : statusText == "Confirmed" ? "Đã xác nhận" : statusText == "Cancelled" ? "Đã hủy" : statusText}</Badge>
}


