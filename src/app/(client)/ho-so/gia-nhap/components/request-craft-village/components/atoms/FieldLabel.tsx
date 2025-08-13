"use client"

import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

interface FieldLabelProps {
	htmlFor?: string
	children: ReactNode
	required?: boolean
	className?: string
}

export function FieldLabel({ htmlFor, children, required, className }: FieldLabelProps) {
	return (
		<Label htmlFor={htmlFor} className={`text-sm font-medium ${className || ""}`}>
			{children} {required ? <span className="text-red-500">*</span> : null}
		</Label>
	)
}


