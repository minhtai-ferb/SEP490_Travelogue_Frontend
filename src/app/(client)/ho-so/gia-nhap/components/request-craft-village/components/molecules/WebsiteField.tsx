"use client"

import { TextField } from "./TextField"

interface WebsiteFieldProps {
	value: string
	onChange: (value: string) => void
	error?: string
}

export function WebsiteField({ value, onChange, error }: WebsiteFieldProps) {
	return (
		<TextField
			id="website"
			label="Website (tùy chọn)"
			value={value}
			onChange={onChange}
			placeholder="https://website.com hoặc website.com"
			error={error}
		/>
	)
}


