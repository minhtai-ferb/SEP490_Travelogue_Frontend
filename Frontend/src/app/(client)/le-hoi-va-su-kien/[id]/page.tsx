'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/config/axiosInstance'
import { FaShareAlt, FaCalendar, FaClock, FaMapMarkerAlt, FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Event } from '@/types/Event'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ImageGalleryExplore } from '@/components/common/image-glary/image-explore'


function EventDetail() {
	const { id } = useParams()
	const [event, setEvent] = useState<Event | null>(null)
	const [isDarkMode, setIsDarkMode] = useState(false)
	const [isReadMore, setIsReadMore] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isLightboxOpen, setIsLightboxOpen] = useState(false)

	const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
	const toggleReadMore = () => setIsReadMore(!isReadMore)

	const fetchEventDetail = async (id: string) => {
		try {
			const response = await api.get(`/event/${id}`)
			setEvent(response?.data?.data)
		} catch (error) {
			console.error('Error fetching event:', error)
		}
	}

	const timeStringToDate = (timeStr?: string) => {
		if (!timeStr || !timeStr.includes(':')) return new Date()

		const [hours = '0', minutes = '0', seconds = '0'] = timeStr.split(':')
		const now = new Date()
		now.setHours(Number(hours), Number(minutes), Number(seconds))
		return now
	}

	useEffect(() => {
		if (typeof id === 'string') {
			fetchEventDetail(id)
		}
	}, [id])

	if (!event) {
		return <p className="text-center mt-10">Loading...</p>
	}

	return (
		<div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
			{/* Hero Section */}
			<div className="relative h-[60vh] overflow-hidden">
				<img
					src={event?.medias?.[0]?.mediaUrl || '/default.jpg'}
					alt="Event Header"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-4xl md:text-6xl font-bold text-white text-center px-4"
					>
						{event?.name}
					</motion.h1>
				</div>
			</div>

			{/* Breadcrumb */}
			<nav className="bg-gray-100 dark:bg-gray-800 p-4">
				<div className="container mx-auto">
					<div className="flex space-x-2 text-sm">
						<Link href={'/'}>
							<span className="hover:text-blue-600 cursor-pointer">Trang chủ</span>
						</Link>
						<span>/</span>
						<Link href={'/le-hoi-va-su-kien'}>
							<span className="hover:text-blue-600 cursor-pointer">Tin tức và sự kiện</span>
						</Link>
						<span>/</span>
						<span className="text-blue-600">{event?.name}</span>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Image Gallery */}
					<div className="space-y-4">
						<div className="relative overflow-hidden rounded-lg shadow-lg">
							{event?.medias && (
								<ImageGalleryExplore
									images={event?.medias?.map((media) => ({
										url: media?.mediaUrl, // Adjust based on ListMedia properties
										alt: media?.fileName || "Image description",
										isThumbnail: media?.isThumbnail || false,
									}))}
								/>
							)}
						</div>
					</div>

					{/* Event Information */}
					<div className="space-y-6">
						<div className="flex justify-between items-center">
							<h2 className="text-3xl font-bold">{event?.name}</h2>
						</div>

						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<FaCalendar className="text-blue-600" />
								<span>
									{format(timeStringToDate(event?.startTime), 'HH:mm')} - {format(timeStringToDate(event?.endTime), 'HH:mm')}
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<FaClock className="text-blue-600" />
								<span>{format(new Date(event?.startDate), 'dd/MM/yyyy')} - {format(new Date(event?.endDate), 'dd/MM/yyyy')}</span>
							</div>
							<div className="flex items-center space-x-2">
								<FaMapMarkerAlt className="text-blue-600" />
								<span>{event?.districtName}</span>
							</div>
						</div>

						<p className="text-lg">{event?.content}</p>

						<div className="space-y-4">
							<h3 className="text-2xl font-semibold">Lịch sử</h3>
							<blockquote className="border-l-4 border-blue-600 pl-4 italic">
								{event?.description}
							</blockquote>
							<button
								onClick={toggleReadMore}
								className="text-blue-600 hover:underline"
							>
							</button>
						</div>

						{/* <div className="space-y-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
							>
								Book Now
							</motion.button>

							<div className="flex justify-center space-x-4">
								<button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
									<FaShareAlt size={20} />
								</button>
							</div>
						</div> */}
					</div>
				</div>
			</main>
		</div>
	)
}

export default EventDetail
