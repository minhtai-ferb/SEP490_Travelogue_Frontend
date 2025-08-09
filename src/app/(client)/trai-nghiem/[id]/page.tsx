'use client'

import { ImageGallery } from '@/components/common/image-glary'
// import { MapView } from '@/components/common/map-view'
import { useLocationController } from '@/services/location-controller'
import { Location } from '@/types/LocationCL'
import { motion } from 'framer-motion'
import { ArrowBigLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaRegImages, FaStar } from 'react-icons/fa'
import dynamic from "next/dynamic";

const MapView = dynamic(
	() => import("@/components/common/map-view").then((mod) => mod.MapView),
	{
		ssr: false,
		loading: () => <p>Loading...</p>,
	}
);

function DetailExperience() {
	const [location, setLocation] = useState<Location | null>(null)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [isLightboxOpen, setIsLightboxOpen] = useState(false)
	const router = useRouter()
	const { getLocationById } = useLocationController()
	const { id } = useParams()

	// Fetch location data using the provided id from the URL
	const fetchLocation = async (id: string) => {
		try {
			const response = await getLocationById(id)
			// Adjust based on your API response structure
			setLocation(response)
		} catch (error) {
			console.error('Error fetching location:', error)
		}
	}

	useEffect(() => {
		if (typeof id === 'string') {
			fetchLocation(id)
		}
	}, [id])

	// Ensure client-side rendering for any window-dependent logic
	if (typeof window === "undefined") {
		return <div className="min-h-screen flex items-center justify-center">Loading...</div>
	}

	// Show a loading state while waiting for data
	if (!location) {
		return <div className="min-h-screen flex items-center justify-center">Loading...</div>
	}

	// Ensure MapView and ImageGallery are only rendered on client-side
	const images = location.medias?.map((media) => ({
		url: media.mediaUrl,
		alt: location.name,
		isThumbnail: media.isThumbnail,
	})) || []  // fallback to empty array

	return (
		<div className="min-h-screen bg-cream">
			{/* Hero Section */}
			<div className="relative h-[60vh] overflow-hidden">
				<div className="absolute top-4 left-4 z-10">
					<button
						onClick={() => router.push("/trai-nghiem")}
						className="flex items-center gap-2 px-2 py-2 rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-700 transition duration-300 shadow-md"
					>
						<ArrowBigLeft className="w-5 h-5" />
					</button>
				</div>
				<img
					src={images[0]?.url || '/default-image.jpg'}
					alt={location.name}
					className="w-full h-full object-cover"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
					<div className="text-center">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-4xl md:text-6xl text-white mb-4"
						>
							{location.name}
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="text-xl text-white font-light"
						>
							{location.heritageRankName}
						</motion.p>
					</div>
				</div>
			</div>

			{/* Location Overview */}
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* Basic Details */}
					<motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-serif text-olive-green mb-4">Địa điểm</h2>
						<div className="flex items-center mb-2">
							<FaMapMarkerAlt className="text-bronze mr-2" />
							<p className="text-balance">{location.districtName}</p>
						</div>
					</motion.div>

					{/* Heritage Ranking */}
					<motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-sans text-olive-green mb-4">Xếp hạng</h2>
						<div className="flex items-center mb-2">
							<FaStar className="text-bronze mr-2" />
							<p className="text-charcoal">{location.heritageRankName}</p>
						</div>
					</motion.div>

					{/* District Information */}
					<motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-medium text-olive-green mb-4">Ở đâu</h2>
						<div className="flex items-center mb-2">
							<FaRegImages className="text-xl mr-2" />
							<p className="text-charcoal">{location.districtName}</p>
						</div>
					</motion.div>
				</div>

				{/* Description Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-12 bg-white p-8 rounded-lg shadow-lg"
				>
					<h2 className="text-3xl font-serif text-olive-green mb-6">Lịch sử</h2>
					<p className="text-charcoal leading-relaxed font-sans">{location.description}</p>
				</motion.div>
				<div className="rounded-lg overflow-hidden shadow-lg">
					<ImageGallery images={images} />
				</div>

				{/* Lightbox */}
				{isLightboxOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
						onClick={() => setIsLightboxOpen(false)}
					>
						<img
							src={selectedImage!}
							alt="Enlarged view"
							className="max-w-[90vw] max-h-[90vh] object-contain"
						/>
					</div>
				)}

				{/* Map Section */}
				<div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-3xl font-serif text-olive-green mb-6">Địa điểm</h2>
					<div className="h-[400px] bg-gray-200 rounded-lg">
						{/* Ensure MapView is rendered only on client-side */}
						{typeof window !== "undefined" && (
							<div className="w-full h-full flex items-center justify-center">
								<MapView latitude={location.latitude} longitude={location.longitude} name={location.name} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default DetailExperience
