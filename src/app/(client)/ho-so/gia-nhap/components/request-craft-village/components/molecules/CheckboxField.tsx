"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "../atoms/FieldLabel"
import type { ReactNode } from "react"

interface CheckboxFieldProps {
	id: string
	label: ReactNode
	checked: boolean
	onChange: (checked: boolean) => void
}

export function CheckboxField({ id, label, checked, onChange }: CheckboxFieldProps) {
	return (
		<div className="flex items-center space-x-3">
			<Checkbox id={id} checked={checked} onCheckedChange={(val) => onChange(Boolean(val))} />
			<FieldLabel htmlFor={id} className="cursor-pointer">
				{label}
			</FieldLabel>
		</div>
	)
}


