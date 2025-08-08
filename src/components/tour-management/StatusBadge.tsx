"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

const statusColorMap: Record<string, string> = {
	Draft: "bg-yellow-100 text-yellow-800",
	Confirmed: "bg-green-100 text-green-800",
	Cancel: "bg-red-100 text-red-800",
}

type StatusBadgeProps = {
	statusText: string
}

export function StatusBadge({ statusText }: StatusBadgeProps) {
	const color = statusColorMap[statusText] || "bg-gray-100 text-gray-800"
	return <Badge className={`${color} text-xs`}>{statusText}</Badge>
}


