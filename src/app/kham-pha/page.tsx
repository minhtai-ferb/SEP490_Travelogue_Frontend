"use client"

import { LocationType } from "@/app/admin/locations/create/types/CreateLocation"
import { FavoriteButton } from "@/components/common/favorites/favorite-button"
import { ImageGalleryExplore } from "@/components/common/image-glary/image-explore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import VietmapGL from "@/components/vietmap-gl"
import { cn } from "@/lib/utils"
import { SeccretKey } from "@/secret/secret"
import { useLocationController } from "@/services/location-controller"
import { isFavoriteAtom } from "@/store/favorites"
import type { Location } from "@/types/Location"
import { useAtom } from "jotai"
import { ChevronDown, List, MapPin, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import backgroundImage from "../../../public/vongxoay.jpg"
import { format } from "date-fns"

const formatTime = (value?: string | Date | number) => {
	if (!value) return ""
	const asDate = value instanceof Date || typeof value === "number" ? new Date(value) : new Date(String(value))
	if (!isNaN(asDate.getTime())) {
		try {
			return format(asDate, "HH:mm")
		} catch {
			// fall through
		}
	}
	const str = String(value).trim()
	const match = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
	if (match) {
		const hh = match[1].padStart(2, "0")
		const mm = match[2]
		return `${hh}:${mm}`
	}
	return str
}

const provinceBounds: [[number, number], [number, number]] = [
	[105.811944, 10.952222],
	[106.38, 11.776667],
]

export default function CustomVietmapDemo() {
	const router = useRouter()
	const [selectedType, setSelectedType] = useState<LocationType>(LocationType.HistoricalSite)
	const [listHistorical, setListHistorical] = useState<Location[]>([])
	const [selected, setSelected] = useState<string | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const { searchLocation } = useLocationController()
	const [isHovered, setIsHovered] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [drawerInfo, setDrawerInfo] = useState<Location>()
	const { getLocationById } = useLocationController()
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)
	const [isFavorite] = useAtom(isFavoriteAtom)

	// Fetch historical sites based on selected rank

	const handleLoadListHistory = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await searchLocation({
				title: "",
				type: selectedType.toString(),
				districtId: "",
				pageNumber: 1,
				pageSize: 100000,
			})
			setListHistorical(response?.data || [])
		} catch (error) {
			console.error("Error fetching locations:", error)
		} finally {
			setIsLoading(false)
		}
	}, [searchLocation, selectedType])


	const typeOptions: { id: LocationType; label: string }[] = [
		{ id: LocationType.HistoricalSite, label: "Địa điểm lịch sử" },
		{ id: LocationType.CraftVillage, label: "Làng nghề" },
		{ id: LocationType.Cuisine, label: "Ẩm thực" },
		{ id: LocationType.ScenicSpot, label: "Danh lam thắng cảnh" },
		{ id: LocationType.Other, label: "Khác" },
	]

	// Load data on mount
	useEffect(() => {
		const initializeData = async () => {
			await handleLoadListHistory()
		}

		initializeData()
	}, [handleLoadListHistory])

	const fetchLocationDetail = async (id: string) => {
		try {
			const response = await getLocationById(id)
			setDrawerInfo(response)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		if (selected) {
			fetchLocationDetail(selected)
			// On mobile, close the sidebar when a location is selected
			if (window.innerWidth < 992) {
				setIsSidebarOpen(false)
			}
		}
	}, [selected])

	// Auto-close sidebar on small screens
	useEffect(() => {
		const handleWindowResize = () => {
			setIsSidebarOpen(window.innerWidth >= 768)
		}
		handleWindowResize()

		window.addEventListener("resize", handleWindowResize)
		return () => window.removeEventListener("resize", handleWindowResize)
	}, [])

	// Get center and zoom based on selected site
	const selectedSite = listHistorical?.find((site) => site.id === selected)
	const mapCenter: [number, number] = selectedSite
		? [selectedSite?.longitude, selectedSite?.latitude]
		: [106.086614811646, 11.314528536009] // Default center

	// Use a higher zoom level on mobile devices
	const [mapZoom, setMapZoom] = useState(selectedSite ? 8 : 10)

	// Update zoom level based on screen size
	useEffect(() => {
		const handleZoomForScreenSize = () => {
			const isMobile = window.innerWidth < 768
			const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

			if (selectedSite) {
				setMapZoom(isMobile ? 12 : isTablet ? 11 : 12)
			} else {
				setMapZoom(isMobile ? 12 : isTablet ? 11 : 10)
			}
		}

		handleZoomForScreenSize()
		window.addEventListener("resize", handleZoomForScreenSize)

		return () => window.removeEventListener("resize", handleZoomForScreenSize)
	}, [selectedSite])

	const markers = (
		selected
			? listHistorical
				?.filter((site) => site.id === selected)
				?.map((site) => {
					const lng = site.longitude
					const lat = site.latitude

					if (isNaN(lng) || isNaN(lat)) {
						console.warn(`Invalid coordinates for site: ${site.name}`, {
							longitude: site.longitude,
							latitude: site.latitude,
						})
						return null
					}

					const popupHTML = `
  <div style="max-width: 25em; font-family: Arial, sans-serif; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
    <div style="position: relative;">
      <img 
        src="${site?.medias?.find((media) => media.isThumbnail)?.mediaUrl || "https://via.placeholder.com/150"}" 
        alt="${site?.name}" 
        style="width: 100%; height: 180px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;"
      />
      ${isFavorite(site.id) ? '<div style="position: absolute; top: 10px; right: 10px; background-color: rgba(255,255,255,0.8); border-radius: 50%; padding: 5px;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>' : ""}
    </div>
    <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #1e40af;">${site.name}</h3>
    <p class="custom-scrollbar" style="margin: 0; font-size: 16px; color: #4b5563; line-height: 1.4; max-height: 10em; overflow-y: auto; overflow-x: hidden; white-space: normal;">${site.description}</p>
  </div>
`

					return {
						lngLat: [lng, lat] as [number, number],
						popupHTML,
						popupOptions: { maxWidth: "400px" },
					}
				})
			: listHistorical?.map((site) => {
				const lng = site.longitude
				const lat = site.latitude

				if (isNaN(lng) || isNaN(lat)) {
					console.warn(`Invalid coordinates for site: ${site.name}`, {
						longitude: site.longitude,
						latitude: site.latitude,
					})
					return null
				}

				const popupHTML = `
							<div style="max-width: 25em; font-family: Arial, sans-serif; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
								<div style="position: relative;">
									<img 
										src="${site?.medias?.find((media) => media.isThumbnail)?.mediaUrl || "https://via.placeholder.com/150"}" 
										alt="${site?.name}" 
										style="width: 100%; height: 180px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;"
									/>
									${isFavorite(site.id) ? '<div style="position: absolute; top: 10px; right: 10px; background-color: rgba(255,255,255,0.8); border-radius: 50%; padding: 5px;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>' : ""}
								</div>
								<h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #1e40af;">${site?.name}</h3>
								<p class="custom-scrollbar" style="margin: 0; font-size: 16px; color: #4b5563; line-height: 1.4; max-height: 10em; overflow-y: auto; overflow-x: hidden; white-space: normal;">${site.description}</p>
							</div>
						`

				return {
					lngLat: [lng, lat] as [number, number],
					popupHTML,
					popupOptions: { maxWidth: "400px" },
				}
			})
	)?.filter(
		(marker): marker is { lngLat: [number, number]; popupHTML: string; popupOptions: { maxWidth: string } } =>
			marker !== null,
	)

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}

	return (
		<div className="relative flex flex-col md:flex-row h-screen w-screen overflow-hidden">
			{/* Toggle Sidebar Button - Only visible on mobile */}
			<button
				onClick={toggleSidebar}
				className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
				aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
			>
				{isSidebarOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
			</button>

			{/* Scrollable List - Sidebar */}
			<div
				className={cn(
					"absolute md:relative z-40 md:z-auto transition-all duration-300 h-full overflow-y-auto custom-scrollbar bg-white",
					isSidebarOpen ? "w-full md:w-1/3 lg:w-5/12 left-0" : "w-0 -left-full md:w-0 md:left-0 overflow-hidden",
				)}
			>
				{selectedSite ? (
					<div
						className="relative w-full h-48 md:h-64 lg:h-80"
						style={{
							backgroundImage: `url(${selectedSite.medias?.find((media) => media.isThumbnail)?.mediaUrl || backgroundImage.src
								})`,
							backgroundPosition: "center",
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
						}}
					>
						<Image
							src="/mascot.png"
							alt="Tây Ninh Logo"
							width={200}
							height={200}
							className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-0 md:w-[100px] md:h-[100px] w-[50px] h-[50px] hover:cursor-pointer mx-auto my-1"
							onClick={() => router.push("/")}
						/>
						<div className="absolute bottom-4 left-4 right-4">
							<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 line-clamp-2">
								{selectedSite?.name}
							</h1>
							<p className="text-xs md:text-sm w-fit font-semibold text-white bg-blue-700 px-3 py-1 rounded-full">
								{selectedSite?.districtName}
							</p>
						</div>
					</div>
				) : (
					<div
						className="relative w-full h-48 md:h-64 lg:h-80"
						style={{
							backgroundImage: `url(${backgroundImage.src})`,
							backgroundPosition: "center",
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
						}}
					>
						<Image
							src="/mascot.png"
							alt="Tây Ninh Logo"
							width={200}
							height={200}
							className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-0 md:w-[100px] md:h-[100px] w-[50px] h-[50px] hover:cursor-pointer mx-auto my-1"
							onClick={() => router.push("/")}
						/>
						<div className="absolute bottom-4 left-4 right-4">
							<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Tỉnh Tây Ninh</h1>
							<p className="text-xs md:text-sm w-fit font-semibold text-white bg-blue-700 px-3 py-1 rounded-full">
								Vòng xoay trung tâm - Thành phố Tây Ninh
							</p>
						</div>
					</div>
				)}
				{/* Filter dropdown */}
				<div className="relative p-2">
					<DropdownMenu >
						<DropdownMenuTrigger asChild>
							<Button className="bg-blue-500 text-white font-semibold py-3 w-fit">
								{typeOptions.find(t => t.id === selectedType)?.label || "Bộ lọc"} <ChevronDown className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="start" className="min-w-0 w-auto p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border">
							<div className="flex flex-row items-center gap-2 overflow-x-auto max-w-[calc(100vw-1rem)] md:max-w py-1 px-1">
								{typeOptions.map((opt) => (
									<DropdownMenuItem
										key={opt.id}
										onSelect={() => {
											setSelectedType(opt.id)
										}}
										className="inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 focus:bg-blue-100 focus:text-blue-800 transition-colors"
									>
										{opt.label}
									</DropdownMenuItem>
								))}
								<DropdownMenuItem
									onSelect={() => {
										setSelectedType("" as unknown as LocationType)
										setSelected(null)
									}}
									className="inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200 transition-colors"
								>
									Tất cả
								</DropdownMenuItem>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : listHistorical.length === 0 ? (
					<div className="flex justify-center items-center h-64">
						<p className="text-gray-500 text-lg">Không tìm thấy địa điểm nào</p>
					</div>
				) : (
					<div className="p-2 md:p-4">
						{listHistorical?.map((site) => (
							<Card
								key={site.id}
								className="mb-4 overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
							>
								<div className="flex flex-col sm:flex-row h-full">
									{/* Image - Full width on mobile, 1/3 on larger screens */}
									<div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
										<Image
											src={site?.medias?.find((media) => media.isThumbnail)?.mediaUrl || "/placeholder_image.jpg"}
											alt={`Image of ${site.name}`}
											className="object-cover h-full w-full"
											fill
										/>
									</div>

									{/* Content - Full width on mobile, 2/3 on larger screens */}
									<div className="w-full sm:w-2/3 flex flex-col">
										<CardHeader className="bg-gray-50 p-3 sm:p-4 flex-grow">
											<div className="flex justify-between items-start">
												<h3
													className="text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer hover:text-sky-500 transition-colors"
													onClick={() => {
														setSelected(site?.id)
														// Close sidebar on mobile when selecting a site
														if (window.innerWidth < 768) {
															setIsSidebarOpen(false)
														}
													}}
												>
													{site.name}
												</h3>
												<FavoriteButton location={site} size={20} />
											</div>
											<p className="text-sm text-gray-600 mt-2 line-clamp-2">{site.description}</p>
											{site.openTime && site.closeTime && (
												<div className="flex items-center gap-2">
													<p className="text-xs sm:text-sm text-gray-800 font-medium">
														Giờ mở cửa: {formatTime(site.openTime)} - {formatTime(site.closeTime)}
													</p>
												</div>
											)}
										</CardHeader>

										<CardContent className="p-3 sm:p-4 flex-grow">
											<div className="space-y-2">
												<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
													<Image src="/icon/rank.png" alt="Rank Icon" width={20} height={20} />
													<p className="text-xs sm:text-sm text-gray-800 font-medium">
														Loại địa điểm: {site.category}
													</p>
												</div>
												<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
													<Image src="/icon/place.png" alt="Location Icon" width={20} height={20} />
													<p className="text-xs sm:text-sm text-gray-800 font-medium">{site.districtName}</p>
												</div>
											</div>
										</CardContent>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Map Section - Takes full width when sidebar is closed */}
			<div
				className={cn(
					"relative h-full rounded-md border overflow-hidden transition-all duration-300",
					isSidebarOpen ? "w-full md:w-2/3 lg:w-7/12" : "w-full",
				)}
			>
				{/* Selected site info card */}
				{selectedSite && (
					<div className="absolute bottom-2 w-full z-10 px-3">
						<div className="rounded-lg border bg-white/90 backdrop-blur-md shadow-md p-3 md:p-4 max-w-full">
							<div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
								{/* Left side with title and info - takes full width on mobile */}
								<div className="flex flex-col md:col-span-6 gap-2 md:gap-4">
									<div className="flex items-center gap-2 justify-between">
										<div className="flex items-center gap-2">
											<MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
											<h1 className="font-bold text-foreground/90 text-base md:text-lg lg:text-xl line-clamp-1">
												{selectedSite?.name}
											</h1>
										</div>
										{selectedSite && <FavoriteButton location={selectedSite} />}
									</div>
									<div className="flex flex-col gap-1">
										<div className="flex items-center bg-[#CEF3FE] space-x-2 p-1">
											<Image
												src="/icon/rank.png"
												alt="Rank Icon"
												width={16}
												height={16}
												className="w-4 h-4 md:w-5 md:h-5"
											/>
											<p className="text-xs md:text-sm text-gray-800 font-bold line-clamp-1">
												{selectedSite?.category}
											</p>
										</div>
										<div className="flex items-center bg-[#CEF3FE] space-x-2 p-1">
											<Image
												src="/icon/place.png"
												alt="Location Icon"
												width={16}
												height={16}
												className="w-4 h-4 md:w-5 md:h-5"
											/>
											<p className="text-xs md:text-sm text-gray-800 font-bold line-clamp-1">
												{selectedSite?.districtName}
											</p>
										</div>
									</div>

									<div className="pt-1 md:pt-2">
										<Button
											className="justify-center w-full text-xs md:text-sm py-1 md:py-2 bg-blue-600 hover:bg-blue-700 text-white"
											onClick={() => {
												setSelected(selectedSite?.id)
												setIsOpen(true)
											}}
										>
											Xem Thông Tin
										</Button>
									</div>
								</div>

								{/* Right side with image - hidden on very small screens, visible on larger mobile and up */}
								<div className="hidden sm:block md:col-span-6">
									<div className="relative w-full aspect-video">
										<Image
											alt="Site thumbnail"
											className="object-cover rounded-lg"
											src={selectedSite?.medias?.find((media) => media.isThumbnail)?.mediaUrl || "/placeholder_image.jpg"}
											fill
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				<VietmapGL
					center={mapCenter}
					zoom={mapZoom}
					apiKey={SeccretKey.VIET_MAP_KEY || ""}
					markers={markers}
					height="100%"
					bounds={provinceBounds}
				/>
			</div>

			{/* Detail Sheet (replacing heroui Drawer) */}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side="bottom" className="bg-gray-100 h-[90vh] overflow-y-auto p-0">
					<SheetHeader className="flex items-center justify-between p-4 border-b">
						<div className="flex items-center gap-2">
							<SheetTitle className="text-xl font-bold">{drawerInfo?.name}</SheetTitle>
							{drawerInfo && <FavoriteButton location={drawerInfo} />}
						</div>
					</SheetHeader>
					{drawerInfo && (
						<div className="flex flex-col">
							<div className="w-full">
								{drawerInfo?.medias && (
									<ImageGalleryExplore
										images={drawerInfo.medias.map((media) => ({
											url: media.mediaUrl,
											alt: media.fileType || "Image description",
											isThumbnail: media.isThumbnail || false,
										}))}
									/>
								)}
							</div>
							<div className="p-4 sm:p-6">
								<h3 className="text-xl sm:text-2xl font-bold text-blue-500 py-4">{drawerInfo?.name}</h3>
								<div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-4">
									<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
										<Image src="/icon/rank.png" alt="Rank Icon" width={24} height={24} />
										<p className="text-sm sm:text-base text-gray-800 font-bold">
											Xếp loại: {drawerInfo?.category}
										</p>
									</div>
									<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
										<Image src="/icon/place.png" alt="Rank Icon" width={24} height={24} />
										<p className="text-sm sm:text-base text-gray-900 font-bold">{drawerInfo?.districtName}</p>
									</div>
								</div>
								<Separator className="my-4" />
								<div className="space-y-4">
									<div>
										<h4 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h4>
										<p className="text-gray-700 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: drawerInfo?.description || "" }} />
									</div>
									<Separator className="my-4" />
									<div>
										<h4 className="text-lg font-semibold text-gray-900 mb-2">Giới thiệu</h4>
										<div className="prose max-w-none text-gray-700 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: drawerInfo?.content || "" }} />
									</div>
								</div>
							</div>
						</div>
					)}
					<SheetFooter className="border-t p-4 lg:hidden">
						<div className="flex justify-between w-full">
							<Button
								onClick={() => {
									setIsOpen(false)
									setIsSidebarOpen(false)
								}}
								className="bg-blue-600 hover:bg-blue-700 text-white"
							>
								Xem trên bản đồ
							</Button>
						</div>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	)
}
