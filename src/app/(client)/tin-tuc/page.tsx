'use client'

import CategoryNews from "@/components/news/category-news"
import FeaturedStory from "@/components/news/featured-story"
import TodaysPicks from "@/components/news/todays-picks"
import { headerConfigs } from "@/config/header"
import { useNewsCategory } from "@/services/news-category"

import UnifiedHeader from "@/components/common/common-header"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useEffect, useState } from "react"

export default function News() {
	// Get current date for the "Today's Information" section
	// const currentDate = format(new Date(), "MMMM d, yyyy")
	const currentDate = format(new Date(), "d MMMM, yyyy", { locale: vi })
	const { getNewsCategory } = useNewsCategory()

	const [categoryNews, setCategoryNews] = useState([])


	const fetchCategoryNews = async () => {
		// TODO: Fetch category news using API endpoint
		try {
			const response = await getNewsCategory()
			setCategoryNews(response?.data)
		} catch (error) {
			console.error('====================================');
			console.error(error);
			console.error('====================================');
		}

	}

	useEffect(() => {
		fetchCategoryNews()
	}, [])


	return (
		<main className="min-h-screen bg-background relative">
			<header
				className="relative h-screen w-full bg-cover bg-center flex flex-col bg-transparent inset-0 bg-black bg-opacity-40"
				style={{ backgroundImage: "url('/thanh_pho_tay_ninh.jpg')" }}
			>
				{/* Dark overlay */}
				<div
					className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent"
				></div>
				{/* Unified nav/header */}
				<UnifiedHeader
					config={headerConfigs?.news}
				/>

				{/* Centered Main content */}
				<div className="z-20 transition-all duration-100 flex-grow flex flex-col items-center justify-center px-4 text-center text-white">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl mb-4">
						Tin tức mới nhất của chúng tôi
					</h1>
					<p className="max-w-2xl text-base sm:text-lg md:text-xl mb-2 drop-shadow-md">
						Nguồn tin tức và cập nhật mới nhất từ tỉnh của chúng tôi.
					</p>
					<p className="max-w-2xl text-base sm:text-lg md:text-xl mb-6 drop-shadow-md">
						Nơi kết nối cộng đồng với những thông tin đáng tin cậy và kịp thời.
					</p>
					<div className="h-1 w-20 bg-blue-400 rounded-full"></div>
				</div>

				{/* Date banner */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-white/20 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full shadow-lg">
					Thông tin ngày hôm nay: <span className="font-semibold">{currentDate}</span>
				</div>
			</header>
			{/* Main content area */}
			<div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Today's Picks - Left sidebar */}
				<div className="lg:col-span-4">
					<div className="flex items-center mb-6">
						<div className="w-1 h-8 bg-blue-600 mr-4"></div>
						<h2 className="text-2xl font-bold">TIN TỨC HÔM NAY</h2>
					</div>
					<TodaysPicks />
				</div>

				{/* Featured stories - Right area */}
				<div className="lg:col-span-8 space-y-12">
					<FeaturedStory />

					{/* Category sections */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{
							categoryNews?.map((category: any) => (
								<CategoryNews category={category} limit={3} key={category.id} />
							))
						}
					</div>
				</div>
			</div>
		</main>
	)
}