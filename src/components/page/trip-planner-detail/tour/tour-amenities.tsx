import { Car, Coffee, Camera, Wifi, CheckCircle, Sparkle } from "lucide-react"
import type { TourAmenity } from "@/types/Tour"

interface TourAmenitiesProps {
	amenities: TourAmenity[]
}

const iconMap = {
	Car,
	Coffee,
	Camera,
	Wifi,
}

const colorSchemes = [
	{
		bg: "bg-gradient-to-br from-blue-50 to-blue-100",
		iconBg: "bg-blue-500",
		iconColor: "text-white",
		border: "border-blue-200",
		hover: "hover:from-blue-100 hover:to-blue-200",
	},
	{
		bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
		iconBg: "bg-emerald-500",
		iconColor: "text-white",
		border: "border-emerald-200",
		hover: "hover:from-emerald-100 hover:to-emerald-200",
	},
	{
		bg: "bg-gradient-to-br from-purple-50 to-purple-100",
		iconBg: "bg-purple-500",
		iconColor: "text-white",
		border: "border-purple-200",
		hover: "hover:from-purple-100 hover:to-purple-200",
	},
	{
		bg: "bg-gradient-to-br from-orange-50 to-orange-100",
		iconBg: "bg-orange-500",
		iconColor: "text-white",
		border: "border-orange-200",
		hover: "hover:from-orange-100 hover:to-orange-200",
	},
]

export function TourAmenities({ amenities }: TourAmenitiesProps) {
	return (
		<div className="space-y-6">
			<div className="text-center">
				<section className="flex items-center align-center justify-center">
					<Sparkle className="w-6 h-6 text-yellow-500 mr-2" />
					<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
						Tiện ích đặc biệt
					</h2>
				</section>
				<p className="text-gray-600">Những dịch vụ tuyệt vời đã bao gồm trong tour</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{amenities.map((amenity, index) => {
					const IconComponent = iconMap[amenity.icon as keyof typeof iconMap]
					const colorScheme = colorSchemes[index % colorSchemes.length]

					return (
						<div
							key={amenity.id}
							className={`
                relative overflow-hidden rounded-2xl p-4 border-2 transition-all duration-300 
                transform hover:scale-105 hover:shadow-lg cursor-pointer group
                ${colorScheme.bg} ${colorScheme.border} ${colorScheme.hover}
              `}
						>
							{/* Background decoration */}
							<div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>

							<div className="relative z-10 flex flex-col items-center text-center space-y-3">
								{/* Icon with animated background */}
								<div
									className={`
                  relative p-3 rounded-full ${colorScheme.iconBg} 
                  transform transition-transform duration-300 group-hover:rotate-12
                `}
								>
									{IconComponent && <IconComponent className={`h-6 w-6 ${colorScheme.iconColor}`} />}

									{/* Check mark indicator */}
									<div className="absolute -top-1 -right-1">
										<CheckCircle className="h-4 w-4 text-green-500 bg-white rounded-full" />
									</div>
								</div>

								<div>
									<span className="font-semibold text-gray-800 text-sm leading-tight">{amenity.name}</span>
									<div className="text-xs text-gray-600 mt-1">Miễn phí</div>
								</div>
							</div>

							{/* Shine effect on hover */}
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
						</div>
					)
				})}
			</div>

			{/* Additional value proposition */}
			{/* <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
				<div className="flex items-center justify-center gap-2 text-green-700">
					<CheckCircle className="h-5 w-5" />
					<span className="font-medium">Tất cả đã bao gồm - Không phí phát sinh!</span>
				</div>
			</div> */}
		</div >
	)
}
