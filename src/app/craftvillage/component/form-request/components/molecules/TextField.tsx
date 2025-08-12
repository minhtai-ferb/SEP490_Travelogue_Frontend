"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldError } from "../atoms/FieldError"
import { FieldLabel } from "../atoms/FieldLabel"

type Variant = "input" | "textarea"

interface TextFieldProps {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	required?: boolean
	error?: string
	type?: string
	rows?: number
	variant?: Variant
	className?: string
}

export function TextField({
	id,
	label,
	value,
	onChange,
	placeholder,
	required,
	error,
	type,
	rows = 3,
	variant = "input",
	className,
}: TextFieldProps) {
	return (
		<div className="space-y-2">
			<FieldLabel htmlFor={id} required={required}>
				{label}
			</FieldLabel>
			{variant === "textarea" ? (
				<Textarea
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					rows={rows}
					className={`${error ? "border-red-500" : ""} ${className || ""}`}
				/>
			) : (
				<Input
					id={id}
					type={type}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className={`${error ? "border-red-500" : ""} ${className || ""}`}
					aria-describedby={error ? `${id}-error` : undefined}
				/>
			)}
			<FieldError id={`${id}-error`} message={error} />
		</div>
	)
}


