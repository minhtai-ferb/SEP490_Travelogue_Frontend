"use client"

import { ImageGalleryExplore } from "@/components/common/image-glary/image-explore"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import VietmapGL from "@/components/vietmap-gl"
import { cn } from "@/lib/utils"
import { SeccretKey } from "@/secret/secret"
import { useLocationController } from "@/services/location-controller"
import type { HistoricalSite, Rank } from "@/types/History"
import type { Location } from "@/types/Location"
import {
	Button,
	CardBody,
	Card as CardHero,
	Divider,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image as ImageUI,
	useDisclosure,
} from "@heroui/react"
import { List, MapPin, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import backgroundImage from "../../../public/vongxoay.jpg"
import { FavoriteButton } from "@/components/common/favorites/favorite-button"
import { isFavoriteAtom } from "@/store/favorites"
import { useAtom } from "jotai"

const provinceBounds: [[number, number], [number, number]] = [
	[105.811944, 10.952222],
	[106.38, 11.776667],
]

export default function CustomVietmapDemo() {
	const router = useRouter()
	const [selectedRank, setSelectedRank] = useState<number | undefined>(undefined)
	const [allRanks, setAllRanks] = useState<Rank[]>([])
	const [listHistorical, setListHistorical] = useState<Location[]>([])
	const [selected, setSelected] = useState<string | null>(null)
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { getAllRank, searchLocation } = useLocationController()
	const [isHovered, setIsHovered] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [drawerInfo, setDrawerInfo] = useState<Location>()
	const { getLocationById } = useLocationController()
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)
	const [isFavorite] = useAtom(isFavoriteAtom)

	// Fetch historical sites based on selected rank
	const handleLoadListHistory = async (heritageRank?: number) => {
		setIsLoading(true)
		try {
			const response = await searchLocation({
				title: "",
				typeId: "",
				districtId: "",
				heritageRank,
				pageNumber: 1,
				pageSize: 100000,
			})
			setListHistorical(response?.data)
			setMapZoom(8)
		} catch (error) {
			console.error("Error fetching historical sites:", error)
		} finally {
			setIsLoading(false)
		}
	}

	// Handle rank selection from dropdown
	const handleRankSelection = (key: any) => {
		if (selected) {
			setSelected(null)
		}

		if (key === "all") {
			setSelectedRank(undefined)
			handleLoadListHistory()
		} else {
			// Find the rank object by display name
			const rank = allRanks.find((r) => r.displayName === key)
			if (rank) {
				setSelectedRank(rank.id)
				handleLoadListHistory(rank.id)
			}
		}
	}

	const fetchAllRanks = async () => {
		try {
			const response = await getAllRank()
			setAllRanks(response)
		} catch (error) {
			console.error("Error fetching ranks:", error)
		}
	}

	// Load data on mount
	useEffect(() => {
		const initializeData = async () => {
			await fetchAllRanks()
			await handleLoadListHistory()
		}

		initializeData()
	}, [])

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
										</CardHeader>

										<CardContent className="p-3 sm:p-4 flex-grow">
											<div className="space-y-2">
												<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
													<Image src="/icon/rank.png" alt="Rank Icon" width={20} height={20} />
													<p className="text-xs sm:text-sm text-gray-800 font-medium">
														Xếp hạng: {site.heritageRankName}
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
				{/* Filter dropdown */}
				<div className="absolute top-2 right-2 z-10 w-fit">
					<Dropdown backdrop="blur">
						<DropdownTrigger>
							<Button
								variant="bordered"
								className="bg-blue-500 text-white font-semibold backdrop-blur-sm"
								color="primary"
							>
								Bộ lọc
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label="Filter Options"
							variant="shadow"
							color="primary"
							onAction={(key) => handleRankSelection(key)}
						>
							<>
								{allRanks?.map((rank) => (
									<DropdownItem key={rank.displayName} className="font-semibold">
										{rank.displayName}
									</DropdownItem>
								))}
							</>
							<DropdownItem key="all" className="font-semibold">
								Tất cả
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>

				{/* Selected site info card */}
				{selectedSite && (
					<div className="absolute bottom-2 w-full z-10 px-3">
						<CardHero isBlurred className="border-none bg-background/60 dark:bg-default-100/50 max-w-full" shadow="md">
							<CardBody className="p-3 md:p-4">
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
													{selectedSite?.heritageRankName}
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
												color="primary"
												variant="flat"
												onPress={onOpen}
												className="justify-center w-full text-xs md:text-sm py-1 md:py-2"
												onPressChange={() => setSelected(selectedSite?.id)}
											>
												Xem Thông Tin
											</Button>
										</div>
									</div>

									{/* Right side with image - hidden on very small screens, visible on larger mobile and up */}
									<div className="hidden sm:block md:col-span-6">
										<ImageUI
											alt="Site thumbnail"
											className="object-cover rounded-lg w-full aspect-video"
											shadow="md"
											src={
												selectedSite?.medias?.find((media) => media.isThumbnail)?.mediaUrl ||
												"https://heroui.com/images/album-cover.png" ||
												"/placeholder_image.jpg" ||
												"/placeholder_image.jpg" ||
												"/placeholder_image.jpg" ||
												"/placeholder_image.jpg"
											}
										/>
									</div>
								</div>
							</CardBody>
						</CardHero>
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

			{/* Drawer for detailed view */}
			<Drawer isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton size="full">
				<DrawerContent className="bg-gray-100">
					{(onClose) => (
						<>
							<DrawerHeader className="flex items-center justify-between p-4 border-b">
								<div className="flex items-center gap-2">
									<h2 className="text-xl font-bold">{drawerInfo?.name}</h2>
									{drawerInfo && <FavoriteButton location={drawerInfo} />}
								</div>
								<Button color="danger" variant="light" isIconOnly onPress={onClose} className="rounded-full">
									<X className="h-5 w-5" />
								</Button>
							</DrawerHeader>
							<DrawerBody className="p-0 overflow-y-auto">
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
														Xếp loại: {drawerInfo?.heritageRankName}
													</p>
												</div>
												<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
													<Image src="/icon/place.png" alt="Rank Icon" width={24} height={24} />
													<p className="text-sm sm:text-base text-gray-900 font-bold">{drawerInfo?.districtName}</p>
												</div>
											</div>
											<Divider className="my-4" />
											<div className="space-y-4">
												<div>
													<h4 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h4>
													<p className="text-gray-700 text-sm sm:text-base">{drawerInfo?.description}</p>
												</div>
												<Divider className="my-4" />
												<div>
													<h4 className="text-lg font-semibold text-gray-900 mb-2">Giới thiệu</h4>
													<p className="text-gray-700 text-sm sm:text-base">{drawerInfo?.content}</p>
												</div>
											</div>
										</div>
									</div>
								)}
							</DrawerBody>
							<DrawerFooter className="border-t">
								<div className="flex justify-between w-full lg:hidden">
									<Button
										color="primary"
										onPress={() => {
											onClose()
											// Ensure the map is visible when returning
											setIsSidebarOpen(false)
										}}
									>
										Xem trên bản đồ
									</Button>
								</div>
							</DrawerFooter>
						</>
					)}
				</DrawerContent>
			</Drawer>
		</div>
	)
}
