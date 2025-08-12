"use client"

import { TextField } from "./TextField"

interface TimeRangeFieldsProps {
	openTime: string
	closeTime: string
	onOpenChange: (value: string) => void
	onCloseChange: (value: string) => void
	closeTimeError?: string
}

export function TimeRangeFields({ openTime, closeTime, onOpenChange, onCloseChange, closeTimeError }: TimeRangeFieldsProps) {
	return (
		<div className="grid md:grid-cols-2 gap-6">
			<TextField id="openTime" label="Giờ mở cửa" value={openTime} onChange={onOpenChange} type="time" />
			<TextField
				id="closeTime"
				label="Giờ đóng cửa"
				value={closeTime}
				onChange={onCloseChange}
				type="time"
				error={closeTimeError}
			/>
		</div>
	)
}


