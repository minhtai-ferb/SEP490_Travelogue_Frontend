"use client"

import { TextField } from "./TextField"

interface PhoneEmailFieldsProps {
	phoneNumber: string
	email: string
	onPhoneChange: (value: string) => void
	onEmailChange: (value: string) => void
	phoneError?: string
	emailError?: string
}

export function PhoneEmailFields({
	phoneNumber,
	email,
	onPhoneChange,
	onEmailChange,
	phoneError,
	emailError,
}: PhoneEmailFieldsProps) {
	return (
		<div className="grid md:grid-cols-2 gap-6">
			<TextField id="phoneNumber" label="Số điện thoại" value={phoneNumber} onChange={onPhoneChange} error={phoneError} />
			<TextField id="email" label="Email" value={email} onChange={onEmailChange} error={emailError} type="email" />
		</div>
	)
}


