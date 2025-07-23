"use client"

import { useState, useEffect, useRef } from "react"
import { useVietmap } from "@/hooks/use-vietmap"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface DynamicVietmapProps {
	apiKey: string
	center?: [number, number]
	zoom?: number
	width?: string | number
	height?: string | number
	onMapLoaded?: (map: any) => void
}

export default function DynamicVietmap({
	apiKey,
	center = [106.69531282536502, 10.776983649766555],
	zoom = 14,
	width = "100%",
	height = "100%",
	onMapLoaded,
}: DynamicVietmapProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)
	const { isLoaded, loadScripts, vietmapgl, error } = useVietmap({
		apiKey,
		autoLoad: false,
	})
	const [isMapInitialized, setIsMapInitialized] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	// Function to initialize the map
	const initializeMap = async () => {
		if (!mapContainerRef.current || !vietmapgl) return

		// Clean up previous map instance if it exists
		if (mapInstanceRef.current) {
			mapInstanceRef.current.remove()
			mapInstanceRef.current = null
		}

		// Initialize map
		const map = new vietmapgl.Map({
			container: mapContainerRef.current,
			style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${apiKey}`,
			center: center,
			zoom: zoom,
		})

		// Save map instance
		mapInstanceRef.current = map

		// Add a default marker at the center
		map.on("load", () => {
			// Add a marker at the center
			new vietmapgl.Marker().setLngLat(center).addTo(map)

			setIsMapInitialized(true)

			// Call onMapLoaded callback if provided
			if (onMapLoaded) {
				onMapLoaded(map)
			}
		})
	}

	// Initialize map when vietmapgl is loaded
	useEffect(() => {
		if (isLoaded && vietmapgl) {
			initializeMap()
		}
	}, [isLoaded, vietmapgl])

	// Handle load map button click
	const handleLoadMap = async () => {
		setIsLoading(true)
		try {
			await loadScripts()
		} catch (err) {
			console.error("Failed to load Vietmap:", err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-4">
			{!isLoaded && (
				<Button onClick={handleLoadMap} disabled={isLoading} className="w-full">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading Vietmap...
						</>
					) : (
						"Load Vietmap"
					)}
				</Button>
			)}

			<div
				ref={mapContainerRef}
				id="map"
				style={{
					width: typeof width === "number" ? `${width}px` : width,
					height: typeof height === "number" ? `${height}px` : height,
					display: isLoaded ? "block" : "none",
					border: "1px solid #ccc",
					borderRadius: "0.375rem",
				}}
			/>

			{error && <div className="text-red-500 text-sm">Error loading Vietmap: {error.message}</div>}
		</div>
	)
}

