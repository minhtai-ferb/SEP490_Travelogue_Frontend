import { Badge } from "@/components/ui/badge"
// import { StarRating } from "@/components/common/star-rating"
import type { Tour } from "@/types/Tour"
import { Award, Clock, MapPin, Users } from "lucide-react"

interface TourInfoHeaderProps {
	tour: Tour
}

export function TourInfoHeader({ tour }: TourInfoHeaderProps) {
	const badgeVariants = [
		{ bg: "bg-gradient-to-r from-red-500 to-pink-500", text: "text-white", icon: "🔥" },
		{ bg: "bg-gradient-to-r from-blue-500 to-cyan-500", text: "text-white", icon: "⭐" },
		{ bg: "bg-gradient-to-r from-emerald-500 to-teal-500", text: "text-white", icon: "🎯" },
		{ bg: "bg-gradient-to-r from-purple-500 to-pink-500", text: "text-white", icon: "💎" },
	]

	return (
		<div className="space-y-6">
			{/* Badges Section */}
			{/* <div className="flex items-center gap-3 flex-wrap">
				{tour.badges.map((badge, index) => {
					const variant = badgeVariants[index % badgeVariants.length]

					return (
						<Badge
							key={index}
							className={`
                ${variant.bg} ${variant.text} border-0 px-4 py-2 text-sm font-semibold
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                flex items-center gap-2
              `}
						>
							<span>{variant.icon}</span>
							{badge}
						</Badge>
					)
				})}
			</div> */}

			{/* Title Section */}
			<div className="space-y-4">
				<h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
					<span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent">
						{tour?.name}
					</span>
				</h1>

				{/* Quick Actions */}
				{/* <div className="flex items-center gap-3">
					<Button
						variant="outline"
						size="sm"
						className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
					>
						<Heart className="h-4 w-4" />
						Yêu thích
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
					>
						<Share2 className="h-4 w-4" />
						Chia sẻ
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-colors"
					>
						<Bookmark className="h-4 w-4" />
						Lưu
					</Button>
				</div> */}
			</div>

			{/* Info Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Location Card */}
				{/* <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<MapPin className="h-6 w-6 text-white" />
						</div>
						<div>
							<p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Địa điểm</p>
							<p className="font-bold text-gray-800">{tour.location}</p>
						</div>
					</div>
				</div> */}

				{/* Duration Card */}
				<div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<Clock className="h-6 w-6 text-white" />
						</div>
						<div>
							<p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Thời gian</p>
							<p className="font-bold text-gray-800">{tour?.totalDays}</p>
						</div>
					</div>
				</div>

				{/* Group Size Card */}
				{/* <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<Users className="h-6 w-6 text-white" />
						</div>
						<div>
							<p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Nhóm</p>
							<p className="font-bold text-gray-800">Tối đa {tour.maxGuests}</p>
						</div>
					</div>
				</div> */}

				{/* Rating Card */}
				{/* <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<Award className="h-6 w-6 text-white" />
						</div>
						<div>
							<p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Đánh giá</p>
							<div className="flex items-center gap-2">
								<span className="font-bold text-gray-800">{tour.rating}</span>
							</div>
							<p className="text-xs text-gray-600">({tour.reviewCount} đánh giá)</p>
						</div>
					</div> 
				</div> */}
			</div>

			{/* Trust Indicators */}
			<div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
				<div className="flex items-center justify-center gap-8 text-sm">
					<div className="flex items-center gap-2 text-green-700">
						<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-xs">✓</span>
						</div>
						<span className="font-semibold">Hoàn tiền 100%</span>
					</div>
					<div className="flex items-center gap-2 text-green-700">
						<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-xs">24</span>
						</div>
						<span className="font-semibold">Hỗ trợ 24/7</span>
					</div>
					<div className="flex items-center gap-2 text-green-700">
						<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-xs">🏆</span>
						</div>
						<span className="font-semibold">Chất lượng đảm bảo</span>
					</div>
				</div>
			</div>
		</div>
	)
}
