"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FieldError } from "../atoms/FieldError"
import { FieldLabel } from "../atoms/FieldLabel"

interface SelectOption {
	label: string
	value: string
}

interface SelectFieldProps {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	options: SelectOption[]
	placeholder?: string
	required?: boolean
	error?: string
}

export function SelectField({ id, label, value, onChange, options, placeholder, required, error }: SelectFieldProps) {
	return (
		<div className="space-y-2">
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className={error ? "border-red-500" : ""}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldError message={error} />
		</div>
	)
}


