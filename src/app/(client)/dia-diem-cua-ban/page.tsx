"use client"

import { ImageGalleryExplore } from "@/components/common/image-glary/image-explore";
import { favoritesAtom } from "@/store/favorites";
import { Location } from "@/types/LocationCL";
import {
	addToast,
	Button,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
	useDisclosure
} from "@heroui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaInfoCircle, FaMapMarkerAlt, FaSearch, FaTrash } from "react-icons/fa";

interface ListItemProps {
	location: Location
	onDeleteConfirm: (id: string) => void
	onClick: (location: Location) => void
}

const ListItem = ({ location, onDeleteConfirm, onClick }: ListItemProps) => {

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (

		<motion.div
			key={location.id}
			variants={item}
			className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102"
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<div className="relative h-48 overflow-hidden">
				<img
					src={location?.medias?.[0]?.mediaUrl}
					alt={location?.name}
					className="w-full h-full object-cover"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-black bg-opacity-20"></div>
			</div>
			<div className="p-4">
				<h3 className="text-xl font-semibold text-gray-800 truncate">
					{location?.name}
				</h3>
				<p className="text-gray-600 mt-2 line-clamp-2">
					{location?.description}
				</p>
				<p className="text-gray-500 mt-2 text-sm">{location?.districtName}</p>
				<div className="mt-4 flex justify-between items-center">
					<button
						className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
						aria-label="View details"
						onClick={() => onClick(location)}
					>
						<FaInfoCircle />
						<span>Chi tiết</span>
					</button>
					<button
						onClick={() => onDeleteConfirm(location?.id || "")}
						className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
						aria-label="Delete location"
						title="Delete location"
					>
						<FaTrash />
					</button>
				</div>
			</div>
		</motion.div>
	)
}

function FavoritesPlaces() {
	const [locations, setLocations] = useAtom(favoritesAtom)
	const [showModal, setShowModal] = useState(false)
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [sortBy, setSortBy] = useState("name")
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isLoading, setIsLoading] = useState(false)
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};


	const handleConfirmDelete = (id: string) => {
		if (id) {
			setSelectedLocation(locations?.find((loc) => loc?.id === id) as Location || null)
		}
		onOpen()
	}

	const handleDelete = (id: string) => {
		setIsLoading(true)
		try {
			setLocations(locations.filter((loc) => loc.id !== id))
		} catch (error) {
			console.error("Error deleting location:", error)
		} finally {
			setIsLoading(false)
			addToast({
				title: `${selectedLocation?.name} đã được xóa khỏi danh sách yêu thích`,
				color: "success",
			})
			setSelectedLocation(null)
		}
	}

	const handleLocationClick = (location: Location) => {
		setSelectedLocation(location)
		setShowModal(true)
	}

	const sortedAndFilteredLocations = locations
		.filter((loc) => loc.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => {
			if (sortBy === "name") return a.name.localeCompare(b.name)
			return 0
		})

	return (
		<div className="min-h-screen bg-blue-50 p-6">
			<div className="w-3/4 mx-auto">
				<h1 className="text-4xl font-bold text-blue-900 mb-8">Danh sách địa điểm yêu thích của bạn</h1>

				{/* Search and Sort */}
				<div className="flex flex-wrap gap-4 mb-6">
					<div className="flex-1 relative">
						<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search locations..."
							className="pl-10 p-2 w-full border border-blue-200 rounded"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<select
						className="p-2 border border-blue-200 rounded"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
					>
						<option value="name">Sắp xếp theo tên</option>
					</select>
				</div>

				{/* List View */}
				{sortedAndFilteredLocations.length === 0 ? (
					<div className="text-center py-12">
						<FaMapMarkerAlt className="text-6xl text-blue-300 mx-auto mb-4" />
						<p className="text-gray-500">
							Chưa có địa điểm nào được lưu. Hãy thêm{" "}
							<Link href="/kham-pha" className="text-blue-500">
								một địa điểm
							</Link>{" "}
							ưu thích của bạn.
						</p>
					</div>
				) : (
					<motion.div
						variants={container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{sortedAndFilteredLocations.map((location) => (
							<ListItem key={location.id} location={location as Location} onDeleteConfirm={handleConfirmDelete} onClick={handleLocationClick} />
						))}
					</motion.div>
				)}

				{/* Details Modal */}
				{showModal && selectedLocation && (
					<div className="no-scrollbar fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 webkit-scrollbar-none">
						<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
							<div className="p-6">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-2xl font-bold text-blue-900">{selectedLocation.name}</h2>
									<Button color="danger" variant="light" isIconOnly onPress={() => setShowModal(false)} className="rounded-full">
										<X className="h-5 w-5" />
									</Button>
								</div>
								<div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-4">
									<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
										<Image src="/icon/rank.png" alt="Rank Icon" width={24} height={24} />
										<p className="text-sm sm:text-base text-gray-800 font-bold">
											Xếp loại: {selectedLocation?.heritageRankName}
										</p>
									</div>
									<div className="flex items-center bg-[#CEF3FE] rounded-md space-x-2 p-2">
										<Image src="/icon/place.png" alt="Rank Icon" width={24} height={24} />
										<p className="text-sm sm:text-base text-gray-900 font-bold">{selectedLocation?.districtName}</p>
									</div>
								</div>
								{selectedLocation.medias && selectedLocation.medias.length > 0 && (
									<div className="w-full">
										{selectedLocation?.medias && (
											<ImageGalleryExplore
												images={selectedLocation.medias.map((media) => ({
													url: media.mediaUrl,
													alt: media.fileType || "Image description",
													isThumbnail: media.isThumbnail || false,
												}))}
											/>
										)}
									</div>
								)}
								<div className="space-y-4">
									<ScrollShadow className="custom-scrollbar max-h-80">
										{selectedLocation?.content.split('\n').map((paragraph, index) => (
											<p key={index} className="text-gray-700 mb-2">
												{paragraph}
											</p>
										))}
									</ScrollShadow>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-red-600">Bạn có chắc sẽ xóa</ModalHeader>
							<ModalBody>
								<p>
									Xóa <b>{selectedLocation?.name}</b> khỏi danh sách yêu thích của bạn
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={() => { handleDelete(selectedLocation?.id || ""); onClose() }} isLoading={isLoading}>
									Xóa
								</Button>
								<Button color="primary" onPress={onClose}>
									Hủy
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}

export default FavoritesPlaces	