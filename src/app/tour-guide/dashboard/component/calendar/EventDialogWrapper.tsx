"use client"

import EventDetailDialog from "./event-detail-dialog"

interface EventDialogWrapperProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	item?: any
}

export default function EventDialogWrapper({ open, onOpenChange, item }: EventDialogWrapperProps) {
	// EventDetailDialog already handles BookingDetailDialog internally
	return (
		<EventDetailDialog
			open={open}
			onOpenChange={onOpenChange}
			item={item}
		/>
	)
}
