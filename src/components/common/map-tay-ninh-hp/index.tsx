"use client"

import TayNinhMapDynamic from "@/components/common/tay-ninh-map"
import MapCommon from "@/components/map-common"
import type { Region } from "@/interfaces/region"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import "swiper/css"
import "swiper/css/pagination"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useDistrictManager } from "@/services/district-manager"
import { District } from "@/interfaces/district"
import { Button } from "@heroui/react"
import { useRouter } from "next/navigation"

const MapTayNinh = () => {
	const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
	const [isAnimating, setIsAnimating] = useState(false)
	const isMobile = useMediaQuery("(max-width: 768px)")
	const { getDistrictById, getAllDistrict } = useDistrictManager()
	const [regionDetails, setRegionDetails] = useState<District | null>(null)
	const [allDistricts, setAllDistricts] = useState<District[]>([])
	const router = useRouter()

	useEffect(() => {
		const fetchAllDistricts = async () => {
			try {
				const response = await getAllDistrict()
				setAllDistricts(response)
			} catch (error) {
				console.error(error)
			}
		}
		fetchAllDistricts()
	}, [getDistrictById])

	const handleGetDistrict = async (id: string) => {
		try {
			const district = allDistricts.find((district) => district.id === id)
			return district
		} catch (e: any) {
			console.error(e)
		}
	}


	useEffect(() => {
		const handleSetSelectedDistrict = async () => {
			if (selectedRegion) {
				try {
					const response = await handleGetDistrict(selectedRegion.id)
					setRegionDetails(response || null);
				} catch (error) {
					console.error(error)
				}
			} else {
				setRegionDetails(null);
			}
		}
		handleSetSelectedDistrict()
	}, [selectedRegion])

	const handlePathClick = (region: Region) => {
		setIsAnimating(true)
		setSelectedRegion(region)
	}

	const resetMapView = () => {
		setIsAnimating(false)
		setSelectedRegion(null)
		setRegionDetails(null)
	}

	// Conditionally define mapVariants based on isMobile
	const mapVariants = {
		initial: {
			scale: 1,
			x: 10,
			y: 0,
			opacity: 1,
		},
		animate: isMobile
			? {
				scale: 0.15,
				x: "5%",
				y: "0%",
				opacity: 0.8,
				transition: {
					duration: 0.8,
					ease: [0.16, 1, 0.3, 1],
				},
			}
			: {
				scale: 0.6,
				x: "80%",
				y: "-70%",
				opacity: 0.8,
				transition: {
					duration: 0.6,
					ease: [0.2, 0.12, 0.12, 0.1],
				},
			},
		exit: {
			scale: 1.1,
			x: 0,
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.8,
				ease: [0.16, 1, 0.3, 1],
			},
		},
	}

	const detailVariants = {
		hidden: {
			opacity: 5,
			y: 50,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: [0.16, 1, 0.3, 1],
				staggerChildren: 0.1,
			},
		},
		exit: {
			opacity: 0,
			y: 50,
			transition: {
				duration: 0.6,
				ease: [0.16, 1, 0.3, 1],
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.12, ease: [0.16, 1, 0.3, 1] },
		},
	}

	const containerVariants = {
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
		hidden: {
			opacity: 2,
			transition: {
				duration: 0.6,
				staggerChildren: 0.05,
				staggerDirection: -1,
			},
		},
	}

	const titleVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
		},
	}

	return (
		<div className="relative w-full overflow-hidden">
			<AnimatePresence
				mode="wait"
				onExitComplete={() => {
					if (!selectedRegion) setIsAnimating(false)
				}}
			>
				{!selectedRegion || isAnimating ? (
					<motion.div
						className="relative min-h-[87vh] flex flex-col items-center justify-center py-12 px-4"
						style={{
							backgroundImage: "url('/backgroundTayNinh.png')",
							backgroundSize: "cover",
							backgroundPosition: "top",
							backgroundRepeat: "no-repeat",
						}}
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						{/* Overlay for Dark Background */}
						<div className="absolute inset-0 bg-black/60 z-0"></div>

						{/* Gradient Effect */}
						<div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#6DD5FA] via-[#6ffaff3f] to-transparent z-10"></div>

						{/* Content */}
						<motion.h1
							className="relative z-20 text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 px-4"
							variants={titleVariants as any}
						>
							Tây Ninh: Tự hào vùng đất di tích
						</motion.h1>

						<motion.div
							variants={mapVariants as any}
							initial="initial"
							animate={selectedRegion ? "animate" : "initial"}
							exit="exit"
							onAnimationComplete={(definition) => {
								if (definition === "animate" && selectedRegion) {
									setIsAnimating(false)
								}
							}}
							className="relative z-20 w-full max-w-3xl mx-auto my-8"
						>
							<TayNinhMapDynamic onPathClick={handlePathClick} />
						</motion.div>

						<motion.p
							className="relative z-20 text-base md:text-lg text-white text-center max-w-3xl mx-auto mt-8"
							variants={itemVariants as any}
						>
							Tây Ninh là tỉnh nằm ở miền Đông Nam Bộ, có 08 huyện và 01 thành phố thuộc tỉnh. Tây Ninh ngày nay là một
							vùng đất địa linh, có tiềm năng, lợi thế để phát triển kinh tế - xã hội, nhất là tiềm năng về du lịch với
							nhiều điểm tham quan lý tưởng và tỉnh đang đẩy mạnh đầu tư, khai thác.
						</motion.p>
					</motion.div>
				) : (
					<motion.div
						style={{
							backgroundImage: `url(${regionDetails?.medias[0]?.mediaUrl})`,
							backgroundSize: "cover",
							backgroundPosition: "left",
							backgroundRepeat: "no-repeat",
						}}
						className="relative min-h-[87vh] flex flex-col items-center justify-center py-12 px-4"
						variants={detailVariants as any}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						{/* Background overlay */}
						<div className="absolute inset-0 bg-black/70 z-0"></div>

						{/* Gradient header */}
						<div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#6DD5FA] via-[#6ffaff3f] to-transparent z-10"></div>

						{/* Title Section */}
						<motion.h1
							className="relative z-20 text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-7"
							variants={itemVariants as any}
						>
							Tây Ninh: Tự hào vùng đất di tích
						</motion.h1>

						{/* Back button */}
						<motion.div className="absolute z-30 cursor-pointer top-20 right-40 duration-200" variants={itemVariants as any}>
							<div
								className="cursor-pointer flex items-center border-3 z-50 border-white rounded-full px-3 py-3 hover:bg-white/10 duration-300"
								onClick={resetMapView}
							>
								<MapCommon />
							</div>
						</motion.div>

						{/* Region image */}
						<motion.div className="relative z-20 mt-4 mb-8" variants={itemVariants as any}>
							<div className="relative w-60 h-60 mx-auto">
								<Image
									src={selectedRegion.image || "/placeholder.svg"}
									alt={selectedRegion.place}
									fill
									className="object-contain"
								/>
							</div>
						</motion.div>

						{/* Region details */}
						<motion.div className="relative z-20 text-center max-w-3xl mx-auto" variants={itemVariants as any}>
							<h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{regionDetails?.name}</h2>

							<p className="text-base md:text-lg text-white">{regionDetails?.description}</p>
							<Button className="mt-8" onClick={() => router.push("/kham-pha")}>Xem Thêm</Button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default MapTayNinh

