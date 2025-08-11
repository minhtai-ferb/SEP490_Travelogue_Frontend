"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ChevronRight, Clock } from "lucide-react"
import { useNews } from "@/services/use-news"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { News, NewsCategory } from "@/types/News"
import { toAbsoluteUrl } from "@/lib/url"
interface CategoryNewsProps {
	category: NewsCategory | "News" | "Event" | "Experience"
	title?: string
	limit?: number
}

function resolveCategoryId(category: CategoryNewsProps["category"]): NewsCategory | undefined {
	if (typeof category === "number") return category as NewsCategory
	switch (category) {
		case "News":
			return NewsCategory.News
		case "Event":
			return NewsCategory.Event
		case "Experience":
			return NewsCategory.Experience
		default:
			return undefined
	}
}

function resolveCategoryLabel(category: CategoryNewsProps["category"], fallback?: string) {
	if (fallback) return fallback
	if (typeof category === "number") {
		if (category === NewsCategory.News) return "Tin tức"
		if (category === NewsCategory.Event) return "Sự kiện"
		if (category === NewsCategory.Experience) return "Trải nghiệm"
		return String(category)
	}
	switch (category) {
		case "News":
			return "Tin tức"
		case "Event":
			return "Sự kiện"
		case "Experience":
			return "Trải nghiệm"
		default:
			return String(category)
	}
}

export default function CategoryNews({ category, title, limit = 3 }: CategoryNewsProps) {
	const { getByCategory } = useNews()
	const [news, setNews] = useState<News[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchCategoryNews = async () => {
			setIsLoading(true)
			try {
				const categoryId = resolveCategoryId(category)
				const response = await getByCategory(categoryId)

				if (response?.data) {
					setNews(response.data)
				}
			} catch (error) {
				console.error(`Error fetching ${category} news:`, error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchCategoryNews()
	}, [category, limit, getByCategory])

	if (isLoading) {
		return <CategoryNewsSkeleton category={category} />
	}

	return (
		<div className="space-y-4">
			<div className="border-b border-gray-200 pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div className="w-1 h-6 bg-blue-500 mr-3"></div>
						<h2 className="text-xl font-bold uppercase">{title}</h2>
					</div>
					<Link
						href={`/tin-tuc/phan-loai/${typeof category === "number" ? category : category}`}
						className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center"
					>
						Xem tất cả
						<ChevronRight className="h-4 w-4 ml-1" />
					</Link>
				</div>
			</div>

			{news.length === 0 ? (
				<div className="text-center py-8 text-gray-500">Không có tin tức nào trong danh mục này</div>
			) : (
				<div className="space-y-4">
					{/* Featured article in category */}
					{news[0] && (
						<Link href={`/tin-tuc/bai-bao/${news[0].id}`} className="block group">
							<Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
								<div className="relative">
									<Image
										src={
											toAbsoluteUrl(news[0].medias?.[0]?.mediaUrl) ||
											`/placeholder.svg?height=300&width=600&text=${encodeURIComponent(news[0].title || '')}`
										}
										alt={news[0].title || "News image"}
										width={600}
										height={300}
										className="w-full object-cover aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
								</div>
								<div className="p-4">
									<h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
										{news[0].title}
									</h3>
									{news[0].createdTime && (
										<div className="flex items-center mt-2 text-xs text-gray-500">
											<Clock className="h-3 w-3 mr-1" />
											{format(new Date(news[0].createdTime), "d MMMM, yyyy", { locale: vi })}
										</div>
									)}
								</div>
							</Card>
						</Link>
					)}

					{/* List of other articles */}
					<div className="space-y-3">
						{news.slice(1, 4).map((item) => (
							<Link key={item.id} href={`/tin-tuc/bai-bao/${item.id}`} className="block group">
								<div className="flex gap-3 items-start py-2 border-b border-gray-100">
									<div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded">
										<Image
											src={
												toAbsoluteUrl(item.medias?.[0]?.mediaUrl) ||
												`/placeholder.svg?height=80&width=80&text=${encodeURIComponent(item.title?.substring(0, 10) || "")}`
											}
											alt={item.title || "News thumbnail"}
											width={80}
											height={80}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
										/>
									</div>
									<div className="flex-1">
										<h3 className="font-medium line-clamp-2 group-hover:text-emerald-600 transition-colors">
											{item.title}
										</h3>
										{item.createdTime && (
											<div className="flex items-center mt-1 text-xs text-gray-500">
												<Clock className="h-3 w-3 mr-1" />
												{format(new Date(item.createdTime), "d MMMM, yyyy", { locale: vi })}
											</div>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

// Loading skeleton for the category news component
function CategoryNewsSkeleton({ category }: any) {
	return (
		<div className="space-y-4">
			<div className="border-b border-gray-200 pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div className="w-1 h-6 bg-emerald-600 mr-3"></div>
						<h2 className="text-xl font-bold uppercase">{category?.category}</h2>
					</div>
					<div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</div>

			<div className="space-y-4">
				{/* Featured article skeleton */}
				<div className="overflow-hidden rounded-lg border border-gray-200">
					<Skeleton className="w-full h-48" />
					<div className="p-4 space-y-2">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-1/4" />
					</div>
				</div>

				{/* List items skeleton */}
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex gap-3 items-start py-2 border-b border-gray-100">
							<Skeleton className="flex-shrink-0 w-20 h-20 rounded" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/4" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

