"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Location } from "@/types/Tour"
import { ChevronsUpDown, Check, MapPin, X } from "lucide-react"

interface LocationSelectProps {
	locations: Location[]
	value: string
	onChange: (locationId: string) => void
	placeholder?: string
	disabled?: boolean
	error?: string
	isLoading?: boolean
	recentIds?: string[]
	onRecentChange?: (ids: string[]) => void
}

export function LocationSelect({
	locations,
	value,
	onChange,
	placeholder = "Chọn địa điểm",
	disabled = false,
	error,
	isLoading = false,
	recentIds = [],
	onRecentChange,
}: LocationSelectProps) {
	const [open, setOpen] = useState(false)
	const [activeCategory, setActiveCategory] = useState<string>("all")

	const selected = useMemo(() => locations.find((l) => l.id === value) || null, [locations, value])
	const categories = useMemo(() => {
		const set = new Set<string>()
		locations.forEach((l) => l.category && set.add(l.category))
		return ["all", ...Array.from(set)]
	}, [locations])

	const recentLocations = useMemo(() => {
		if (!recentIds?.length) return []
		const map = new Map(locations.map((l) => [l.id, l]))
		return recentIds.map((id) => map.get(id)).filter(Boolean) as Location[]
	}, [recentIds, locations])

	const filteredByCategory = useMemo(() => {
		if (activeCategory === "all") return locations
		return locations.filter((l) => l.category === activeCategory)
	}, [locations, activeCategory])

	const handleSelect = (loc: Location) => {
		onChange(loc.id)
		setOpen(false)
		if (onRecentChange) {
			const next = [loc.id, ...recentIds.filter((id) => id !== loc.id)].slice(0, 5)
			onRecentChange(next)
		}
	}

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						disabled={disabled}
						className={`w-full justify-between ${error ? "border-red-500" : ""}`}
					>
						{selected ? (
							<div className="flex items-center gap-2 truncate text-left">
								<MapPin className="w-4 h-4 text-blue-500 shrink-0" />
								<div className="flex flex-col truncate">
									<span className="font-medium truncate">{selected.name}</span>
									<span className="text-xs text-gray-500 truncate">{selected.address}</span>
								</div>
							</div>
						) : (
							<span className="text-gray-500">{placeholder}</span>
						)}
						<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0 w-[480px]" align="start">
					<div className="p-2 border-b flex items-center gap-2">
						<Command className="w-full">
							<CommandInput placeholder="Tìm theo tên, địa chỉ hoặc loại..." />
						</Command>
						{value && (
							<Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
								<X className="w-4 h-4" />
							</Button>
						)}
					</div>
					<div className="px-2 py-2 flex gap-2 flex-wrap">
						{categories.map((cat) => (
							<Badge
								key={cat}
								variant={activeCategory === cat ? "default" : "outline"}
								className="cursor-pointer"
								onClick={() => setActiveCategory(cat)}
							>
								{cat === "all" ? "Tất cả" : cat}
							</Badge>
						))}
					</div>
					<Command>
						<CommandList>
							{isLoading ? (
								<div className="p-4 space-y-3">
									{Array.from({ length: 6 }).map((_, i) => (
										<div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
									))}
								</div>
							) : (
								<>
									{recentLocations.length > 0 && activeCategory === "all" && (
										<CommandGroup heading="Gần đây">
											{recentLocations.map((loc) => (
												<CommandItem
													key={`recent-${loc.id}`}
													value={`${loc.name} ${loc.address} ${loc.category}`}
													onSelect={() => handleSelect(loc)}
													className="flex items-start gap-3 py-3"
												>
													<MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between gap-2">
															<span className="font-medium truncate">{loc.name}</span>
															<Badge variant="outline" className="text-xs shrink-0">{loc.category}</Badge>
														</div>
														<p className="text-xs text-gray-500 truncate">{loc.address}</p>
													</div>
													{value === loc.id && <Check className="w-4 h-4 text-green-600" />}
												</CommandItem>
											))}
										</CommandGroup>
									)}
									<CommandEmpty>Không tìm thấy địa điểm</CommandEmpty>
									<ScrollArea className="h-72">
										<CommandGroup heading="Tất cả địa điểm">
											{filteredByCategory.map((loc) => (
												<CommandItem
													key={loc.id}
													value={`${loc.name} ${loc.address} ${loc.category}`}
													onSelect={() => handleSelect(loc)}
													className="flex items-start gap-3 py-3"
												>
													<MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between gap-2">
															<span className="font-medium truncate">{loc.name}</span>
															<Badge variant="outline" className="text-xs shrink-0">{loc.category}</Badge>
														</div>
														<p className="text-xs text-gray-500 truncate">{loc.address}</p>
													</div>
													{value === loc.id && <Check className="w-4 h-4 text-green-600" />}
												</CommandItem>
											))}
										</CommandGroup>
									</ScrollArea>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	)
}


