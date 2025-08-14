"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
	dateRange?: DateRange
	onSelect?: (range: DateRange | undefined) => void
	placeholder?: string
	disabled?: boolean
	className?: string
	clearable?: boolean
	presets?: Array<{
		label: string
		range: DateRange
	}>
}

const defaultPresets = [
	{
		label: "Hôm nay",
		range: {
			from: new Date(),
			to: new Date(),
		},
	},
	{
		label: "7 ngày qua",
		range: {
			from: addDays(new Date(), -7),
			to: new Date(),
		},
	},
	{
		label: "30 ngày qua",
		range: {
			from: addDays(new Date(), -30),
			to: new Date(),
		},
	},
	{
		label: "90 ngày qua",
		range: {
			from: addDays(new Date(), -90),
			to: new Date(),
		},
	},
]

export function DateRangePicker({
	dateRange,
	onSelect,
	placeholder = "Chọn khoảng thời gian",
	disabled = false,
	className,
	clearable = true,
	presets = defaultPresets,
}: DateRangePickerProps) {
	const [open, setOpen] = React.useState(false)

	const handleSelect = (range: DateRange | undefined) => {
		onSelect?.(range)
		if (range?.from && range?.to) {
			setOpen(false)
		}
	}

	const handlePresetSelect = (preset: DateRange) => {
		onSelect?.(preset)
		setOpen(false)
	}

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation()
		onSelect?.(undefined)
	}

	const formatDateRange = (range: DateRange) => {
		if (!range.from) return placeholder
		if (!range.to) return format(range.from, "dd/MM/yyyy", { locale: vi })
		if (range.from.getTime() === range.to.getTime()) {
			return format(range.from, "dd/MM/yyyy", { locale: vi })
		}
		return `${format(range.from, "dd/MM/yyyy", { locale: vi })} - ${format(range.to, "dd/MM/yyyy", { locale: vi })}`
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"h-9 w-full justify-start text-left font-normal",
						!dateRange?.from && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
				>
					<CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
					<span className="flex-1 truncate">{dateRange ? formatDateRange(dateRange) : placeholder}</span>
					{clearable && dateRange?.from && (
						<X
							className="ml-2 h-4 w-4 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
							onClick={handleClear}
						/>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<div className="flex">
					{/* Presets */}
					{/* <div className="border-r p-3 space-y-1 min-w-[140px]">
						<div className="text-sm font-medium text-muted-foreground mb-2">Lựa chọn nhanh</div>
						{presets.map((preset, index) => (
							<Button
								key={index}
								variant="ghost"
								size="sm"
								className="w-full justify-start h-8 text-sm"
								onClick={() => handlePresetSelect(preset.range)}
							>
								{preset.label}
							</Button>
						))}
					</div> */}

					{/* Calendar */}
					<div className="p-3">
						<Calendar
							initialFocus
							mode="range"
							defaultMonth={dateRange?.from}
							selected={dateRange}
							onSelect={handleSelect}
							numberOfMonths={2}
							locale={vi}
							formatters={{
								formatCaption: (date) => format(date, "MMMM yyyy", { locale: vi }),
								formatWeekdayName: (date) => format(date, "EEEEEE", { locale: vi }),
							}}
							labels={{
								labelPrevious: () => "Tháng trước",
								labelNext: () => "Tháng sau",
							}}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
