"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, X, Loader2 } from "lucide-react"
import { SeccretKey } from "@/secret/secret"
import type { VietMapAutocompleteResult, VietMapPlaceResult } from "@/types/Vietmap"

interface AddressSearchInputProps {
	value: string
	latitude: number
	longitude: number
	onChange: (address: string, lat: number, lng: number) => void
	placeholder?: string
}

export function AddressSearchInput({
	value,
	latitude,
	longitude,
	onChange,
	placeholder = "Nhập địa chỉ để tìm kiếm...",
}: AddressSearchInputProps) {
	const [inputValue, setInputValue] = useState(value)
	const [suggestions, setSuggestions] = useState<VietMapAutocompleteResult[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [placeDetails, setPlaceDetails] = useState<VietMapPlaceResult | null>(null)

	const inputRef = useRef<HTMLInputElement>(null)
	const suggestionsRef = useRef<HTMLDivElement>(null)
	const debounceRef = useRef<NodeJS.Timeout>(setTimeout(() => { }, 0))

	// Debounced search function
	const debouncedSearch = useCallback(
		async (searchText: string) => {
			if (searchText.length < 2) {
				setSuggestions([])
				setShowSuggestions(false)
				return
			}

			setIsLoading(true)

			try {
				const apiUrl = `https://maps.vietmap.vn/api/autocomplete/demo?apikey=${SeccretKey.VIET_MAP_KEY}&text=${encodeURIComponent(searchText)}&focus=${latitude},${longitude}&display_type=1`

				const response = await fetch(apiUrl)

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}

				const data = await response.json()

				if (Array.isArray(data)) {
					setSuggestions(data.slice(0, 8)) // Limit to 8 results
					setShowSuggestions(true)
				} else {
					setSuggestions([])
					setShowSuggestions(false)
				}
			} catch (error) {
				console.error("Error fetching autocomplete suggestions:", error)
				setSuggestions([])
				setShowSuggestions(false)
			} finally {
				setIsLoading(false)
			}
		},
		[latitude, longitude],
	)

	// Fetch place details with coordinates
	const fetchAddressDetail = async (ref_id: string) => {
		try {
			setIsLoading(true)
			const url = `https://maps.vietmap.vn/api/place/demo?apikey=${SeccretKey.VIET_MAP_KEY}&refid=${ref_id}`

			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data: VietMapPlaceResult = await response.json()

			setPlaceDetails(data)

			// Update coordinates with the fetched place details
			if (data.lat && data.lng) {
				console.log("Place details fetched:", data)
				onChange(data.display, data.lat, data.lng)
			}
		} catch (error) {
			console.error("Error fetching address details:", error)
		} finally {
			setIsLoading(false)
		}
	}

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		setInputValue(newValue)
		setSelectedIndex(-1)

		// Clear previous debounce
		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}

		// Set new debounce
		debounceRef.current = setTimeout(() => {
			debouncedSearch(newValue)
		}, 300)
	}

	// Handle suggestion selection
	const handleSuggestionSelect = async (suggestion: VietMapAutocompleteResult) => {
		setInputValue(suggestion.display)
		setShowSuggestions(false)
		setSelectedIndex(-1)

		// Fetch detailed place information with coordinates
		await fetchAddressDetail(suggestion.ref_id)

		inputRef.current?.blur()
	}

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showSuggestions || suggestions.length === 0) return

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault()
				setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
				break
			case "ArrowUp":
				e.preventDefault()
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
				break
			case "Enter":
				e.preventDefault()
				if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
					handleSuggestionSelect(suggestions[selectedIndex])
				}
				break
			case "Escape":
				setShowSuggestions(false)
				setSelectedIndex(-1)
				inputRef.current?.blur()
				break
		}
	}

	// Handle clear input
	const handleClear = () => {
		setInputValue("")
		setSuggestions([])
		setShowSuggestions(false)
		setSelectedIndex(-1)
		setPlaceDetails(null)
		inputRef.current?.focus()
	}

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node) &&
				!inputRef.current?.contains(event.target as Node)
			) {
				setShowSuggestions(false)
				setSelectedIndex(-1)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current)
			}
		}
	}, [])

	// Update input value when prop changes
	useEffect(() => {
		setInputValue(value)
	}, [value])

	// Format distance
	const formatDistance = (distance: number) => {
		if (distance < 1) {
			return `${Math.round(distance * 1000)}m`
		}
		return `${distance.toFixed(1)}km`
	}

	return (
		<div className="relative">
			{/* Search Input */}
			<div className="relative">
				<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
					<Search className="h-4 w-4" />
				</div>

				<Input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (suggestions.length > 0) {
							setShowSuggestions(true)
						}
					}}
					placeholder={placeholder}
					className="pl-10 pr-10 border-2 border-gray-200 focus:border-blue-500 transition-colors"
				/>

				{/* Loading or Clear Button */}
				<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
					) : inputValue ? (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleClear}
							className="h-6 w-6 p-0 hover:bg-gray-100"
						>
							<X className="h-3 w-3" />
						</Button>
					) : null}
				</div>
			</div>

			{/* Place Details Display */}
			{/* {placeDetails && (
				<div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
					<div className="flex items-start gap-2">
						<MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<div className="font-medium text-green-800 text-sm">{placeDetails.name}</div>
							<div className="text-sm text-green-700 mt-0.5">{placeDetails.address}</div>
							<div className="text-xs text-green-600 mt-1">
								📍 Tọa độ: {placeDetails.lat.toFixed(6)}, {placeDetails.lng.toFixed(6)}
							</div>
							{placeDetails.compound && (
								<div className="flex flex-wrap gap-1 mt-2">
									<Badge variant="outline" className="text-xs border-green-300 text-green-700">
										{placeDetails.compound.commune}
									</Badge>
									<Badge variant="outline" className="text-xs border-green-300 text-green-700">
										{placeDetails.compound.district}
									</Badge>
									<Badge variant="outline" className="text-xs border-green-300 text-green-700">
										{placeDetails.compound.province}
									</Badge>
								</div>
							)}
						</div>
					</div>
				</div>
			)} */}

			{/* Suggestions Dropdown */}
			{showSuggestions && (
				<Card
					ref={suggestionsRef}
					className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto shadow-lg border-2 border-gray-100"
				>
					{suggestions.length > 0 ? (
						<div className="py-2">
							{/* Header suggestion */}
							{inputValue && (
								<div className="px-4 py-2 text-sm text-blue-600 border-b border-gray-100">
									<Search className="h-4 w-4 inline mr-2" />
									Xem vị trí của "{inputValue}"
								</div>
							)}

							{/* Suggestion list */}
							{suggestions.map((suggestion, index) => (
								<div
									key={suggestion.ref_id}
									onClick={() => handleSuggestionSelect(suggestion)}
									className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${index === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
										}`}
								>
									<div className="flex items-start gap-3">
										<MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />

										<div className="flex-1 min-w-0">
											<div className="font-medium text-gray-900 truncate">{suggestion.name}</div>

											{suggestion.address !== suggestion.name && (
												<div className="text-sm text-gray-600 truncate mt-0.5">{suggestion.address}</div>
											)}

											{/* Boundaries */}
											{suggestion.boundaries.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-2">
													{suggestion.boundaries.slice(0, 2).map((boundary) => (
														<Badge key={boundary.id} variant="secondary" className="text-xs px-2 py-0.5">
															{boundary.full_name}
														</Badge>
													))}
												</div>
											)}
										</div>

										{/* Distance */}
										<div className="text-xs text-gray-500 flex-shrink-0">{formatDistance(suggestion.distance)}</div>
									</div>
								</div>
							))}
						</div>
					) : !isLoading && inputValue.length >= 2 ? (
						<div className="px-4 py-8 text-center text-gray-500">
							<MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
							<p className="text-sm">Không tìm thấy địa chỉ nào</p>
							<p className="text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
						</div>
					) : null}
				</Card>
			)}
		</div>
	)
}
