"use client"

interface FieldErrorProps {
	id?: string
	message?: string
}

export function FieldError({ id, message }: FieldErrorProps) {
	if (!message) return null
	return (
		<p id={id} className="text-sm text-red-600">
			{message}
		</p>
	)
}


