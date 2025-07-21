// import { StarRating } from "@/components/common/star-rating"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@heroui/react"
import type { TourReview } from "@/types/Tour"
import { formatRating } from "@/utils/format"

interface TourReviewsProps {
	reviews: TourReview[]
	rating: number
	reviewCount: number
}

export function TourReviews({ reviews, rating, reviewCount }: TourReviewsProps) {
	const ratingDistribution = [
		{ rating: 5, percentage: 75 },
		{ rating: 4, percentage: 20 },
		{ rating: 3, percentage: 5 },
		{ rating: 2, percentage: 0 },
		{ rating: 1, percentage: 0 },
	]

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h2>
			<div className="bg-white rounded-xl p-6 border">
				{/* Rating Summary */}
				<div className="flex items-center gap-4 mb-6">
					<div className="text-center">
						{/* <div className="text-3xl font-bold">{formatRating(rating)}</div>
						<StarRating rating={rating} className="mt-1 justify-center" />
						<div className="text-sm text-gray-500 mt-1">{reviewCount} đánh giá</div> */}
					</div>

					<div className="flex-1 space-y-2">
						{ratingDistribution.map(({ rating: ratingLevel, percentage }) => (
							<div key={ratingLevel} className="flex items-center gap-2">
								<span className="text-sm w-3">{ratingLevel}</span>
								{/* <StarRating rating={1} maxRating={1} size="sm" /> */}
								<Progress value={percentage} className="flex-1 h-2" />
								<span className="text-sm text-gray-500 w-8">{percentage}%</span>
							</div>
						))}
					</div>
				</div>

				{/* Individual Reviews */}
				<div className="space-y-4">
					{reviews.map((review) => (
						<div key={review.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
							<Avatar>
								<AvatarImage src={review.userAvatar || "/placeholder.svg"} />
								<AvatarFallback>{review.userName[0]}</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									{/* <span className="font-medium">{review.userName}</span>
									<StarRating rating={review.rating} size="sm" />
									<span className="text-sm text-gray-500">{review.date}</span> */}
								</div>
								<p className="text-sm text-gray-600">{review.comment}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
