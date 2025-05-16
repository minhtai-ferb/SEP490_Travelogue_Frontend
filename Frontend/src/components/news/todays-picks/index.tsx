'use client'

import { NewsItem } from "@/interfaces/news";
import { useNewsManager } from "@/services/news-services";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TodaysPicks() {
	const [todaysNews, setTodaysNews] = useState<NewsItem[]>([])
	const [size, setSize] = useState<number>(6)
	const { getNewsSearchPaged } = useNewsManager()
	const [totalItems, setTotalItems] = useState<number>(0)

	const fetchNewsTodays = async (newSize = size) => {
		try {
			const response = await getNewsSearchPaged({
				title: "",
				categoryId: "",
				pageNumber: 1,
				pageSize: newSize
			})

			const allNews = response?.data || []
			setTotalItems(response?.totalCount || allNews.length)

			const today = new Date().toDateString()

			const newsToday = allNews.filter((item: NewsItem) =>
				new Date(item.lastUpdatedTime).toDateString() === today
			)

			if (newsToday.length === 0) {
				const sortedNews = allNews.sort((a: NewsItem, b: NewsItem) => {
					const dateA = new Date(a.lastUpdatedTime).getTime()
					const dateB = new Date(b.lastUpdatedTime).getTime()
					return Math.abs(dateA - Date.now()) - Math.abs(dateB - Date.now())
				})
				setTodaysNews(sortedNews.slice(0, newSize))
			} else {
				setTodaysNews(newsToday.slice(0, newSize))
			}
		} catch (error) {
			console.log('Error fetching news:', error)
		}
	}

	useEffect(() => {
		fetchNewsTodays(size)
	}, [size])

	// Function to handle See More
	const handleSeeMoreClick = () => {
		const newSize = size + 5
		if (newSize <= totalItems) {
			setSize(newSize)
		} else {
			setSize(totalItems)
		}
	}

	const handleSeeLessClick = () => {
		setSize(6)
	}

	return (
		<div className="space-y-6">
			{todaysNews.map((item, index) => (
				<div key={index} className="flex gap-4">
					<div className="flex-shrink-0">
						<Image
							src={item?.medias[1]?.mediaUrl || "/placeholder.svg"}
							alt={item.title}
							width={120}
							height={120}
							className="object-cover w-24 h-24"
						/>
					</div>
					<div>
						<h3 className="font-bold hover:text-gray-600 transition-colors">
							<Link href={`/tin-tuc/bai-bao/${item.id}`}>{item.title}</Link>
						</h3>
						<p className="text-sm font-bold text-gray-600 mb-1">
							{item.description?.split(" ").slice(0, 20).join(" ")}...
						</p>
					</div>
				</div>
			))}

			{/* See more button */}
			{todaysNews.length < totalItems ? (
				<button
					onClick={handleSeeMoreClick}
					className="mt-4 text-sm font-bold hover:bg-emerald-600 hover:text-white px-4 py-2 rounded transition-colors duration-300 ease-in-out"
				>
					Xem thêm
				</button>
			) : (
				<button className="mt-4 text-sm font-bold text-gray-600" onClick={handleSeeLessClick}>
					Ẩn bớt
				</button>
			)}
		</div>
	)
}
