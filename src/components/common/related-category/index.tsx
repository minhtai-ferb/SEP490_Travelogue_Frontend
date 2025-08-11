import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { use, useEffect } from 'react'

interface RelatedNewsItem {
	id: string
	title: string
	description: string
	locationName: string | null
	eventName: string | null
	categoryName: string | null
	medias?: Media[]
}

interface Media {
	mediaUrl: string;
	fileName: string;
	fileType: string;
	isThumbnail: boolean,
	sizeInBytes: number,
	createdTime: string
}


interface RelatedNewsProps {
	relatedNews: RelatedNewsItem[]
	maxItems?: number
}

export default function RelatedNews({ relatedNews, maxItems = 3 }: RelatedNewsProps) {
	const displayedNews = relatedNews
		.filter((r: RelatedNewsItem) => (r.medias ?? []).length > 0) // Filter to get only items with medias
		.slice(0, maxItems); // Then slice to get the first `maxItems`

	const hasMoreNews = relatedNews.length > maxItems

	useEffect(() => {
		console.log('relatedNews', displayedNews);
	}, [])

	const getNamebyCategory = (category: string) => {
		switch (category) {
			case "News":
				return "Tin tức"
			case "Event":
				return "Sự kiện"
			case "Experience":
				return "Trải nghiệm"
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Bài viết liên quan</h2>
				{hasMoreNews && (
					<Link
						href={`/tin-tuc`}
						className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
					>
						Xem thêm
						<ArrowRight className="ml-1 h-4 w-4" />
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{displayedNews.map((news) => (
					<Link
						key={news.id}
						href={`/tin-tuc/bai-bao/${news.id}`}
						className="group"
					>
						<div className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
							<div className="relative h-48 w-full overflow-hidden bg-gray-100">
								<img
									src={news?.medias?.[0]?.mediaUrl || '/images/default-thumbnail.jpg'}
									alt={news.title}
									className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								{news.categoryName && (
									<span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
										{getNamebyCategory(news.categoryName)}
									</span>
								)}
							</div>

							<div className="p-4 space-y-2">
								<h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
									{news.title}
								</h3>
								<p className="text-sm text-gray-600 line-clamp-2">
									{news.description}
								</p>

								<div className="pt-2 flex items-center text-xs text-gray-500">
									{news.locationName && (
										<span className="flex items-center">
											<span className="mr-2">📍</span> {news.locationName}
										</span>
									)}
									{news.eventName && (
										<span className="flex items-center ml-3">
											<span className="mr-2">🗓️</span> {news.eventName}
										</span>
									)}
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
