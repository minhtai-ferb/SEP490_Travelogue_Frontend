"use client"

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { useNewsManager } from "@/services/news-services"
import type { NewsItem } from "@/interfaces/news"

export default function FeaturedStory() {
	const { getNewsSearchPaged } = useNewsManager()
	const [featuredStory, setFeaturedStory] = useState<NewsItem | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const fetchNewsFeatured = async () => {
		setIsLoading(true)
		try {
			const response = await getNewsSearchPaged({
				title: "",
				categoryId: "",
				pageNumber: 1,
				pageSize: 1000,
			})

			console.log("Fetched featured", response);


			// Get the newest highlighted news item
			if (response?.data && response.data.length > 0) {
				// Sort by date if there's a date field, otherwise use the first item
				const sortedNews = response.data.sort((a: any, b: any) => {
					if (a.lastUpdatedTime && b.lastUpdatedTime) {
						return new Date(b.lastUpdatedTime).getTime() - new Date(a.lastUpdatedTime).getTime()
					}
					return 0
				})
				console.log("Sorted news", sortedNews);

				const newsItems = sortedNews.filter((item: NewsItem) => item.isHightlight)
				setFeaturedStory(newsItems.filter((item: NewsItem) => item.isHightlight)[0] || sortedNews[0])
			}
		} catch (error) {
			console.error("Error fetching featured news:", error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchNewsFeatured()
	}, [])

	if (isLoading) {
		return (
			<Card className="overflow-hidden border-0 shadow-lg animate-pulse">
				<div className="relative">
					<div className="w-full aspect-[16/9] bg-gray-300" />
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
						<div className="h-6 w-24 bg-gray-400 mb-2 rounded"></div>
						<div className="h-10 bg-gray-400 mb-2 rounded w-3/4"></div>
						<div className="h-6 bg-gray-400 mb-4 rounded w-1/2"></div>
						<div className="h-10 w-32 bg-gray-400 rounded"></div>
					</div>
				</div>
			</Card>
		)
	}

	if (!featuredStory) {
		return (
			<Card className="overflow-hidden border-0 shadow-lg">
				<div className="relative">
					<Image
						src="/placeholder.svg?height=600&width=1200&text=No%20Featured%20Story"
						alt="No featured story available"
						width={1200}
						height={600}
						className="w-full object-cover aspect-[16/9]"
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
						<h2 className="text-2xl md:text-4xl font-bold mb-2">Hiện chưa cập nhật</h2>
						<p className="text-lg mb-4"></p>
					</div>
				</div>
			</Card>
		)
	}

	// Determine the image source - use the news image if available, otherwise use a placeholder
	const imageUrl = featuredStory.medias.filter(media => media.type === "IMAGE").length > 0
		? featuredStory.medias.filter(media => media.isThumbnail)[0].mediaUrl
		: featuredStory.medias[0].mediaUrl

	return (
		<Card className="overflow-hidden border-0 shadow-lg">
			<div className="relative">
				<Image
					src={imageUrl || "/placeholder.svg"}
					alt={featuredStory.title || "Featured story image"}
					width={1200}
					height={600}
					className="w-full object-cover aspect-[16/9]"
				/>
				<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
					<div className="flex items-center mb-2">
						<span className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold">Tin nổi bật</span>
						{featuredStory.categoryName && (
							<span className="bg-emerald-600 text-white px-3 py-1 text-sm font-bold ml-2">
								{featuredStory.categoryName}
							</span>
						)}
					</div>
					<h2 className="text-2xl md:text-4xl font-bold mb-2">{featuredStory.title}</h2>
					<p className="text-lg mb-4 line-clamp-2">
						{featuredStory.description || "Read more about this featured story."}
					</p>
					<Link href={`/tin-tuc/bai-bao/${featuredStory.id}`}>
						<Button className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Đọc tin
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	)
}

