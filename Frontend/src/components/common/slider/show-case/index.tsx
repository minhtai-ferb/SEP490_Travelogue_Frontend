"use client"

import { Slider, type SlideItem } from "../"
import { motion } from "framer-motion"
import { Star, MapPin, Heart } from "lucide-react"

// Sample data
const sampleSlides: SlideItem[] = [
	{
		id: "1",
		title: "Núi Bà Đen Hùng Vĩ",
		subtitle: "Tây Ninh",
		description: "Khám phá ngọn núi thiêng liêng với vẻ đẹp hùng vĩ và nhiều truyền thuyết bí ẩn",
		image: "/placeholder.svg?height=600&width=1200",
		overlay: true,
		textPosition: "left",
	},
	{
		id: "2",
		title: "Chùa Cao Đài",
		subtitle: "Thánh Địa",
		description: "Tham quan thánh địa của đạo Cao Đài với kiến trúc độc đáo và văn hóa tâm linh sâu sắc",
		image: "/placeholder.svg?height=600&width=1200",
		overlay: true,
		textPosition: "center",
	},
	{
		id: "3",
		title: "Ẩm Thực Đặc Sắc",
		subtitle: "Bánh Tráng Nướng",
		description: "Thưởng thức món ăn đặc sản nổi tiếng của vùng đất Tây Ninh với hương vị độc đáo",
		image: "/placeholder.svg?height=600&width=1200",
		overlay: true,
		textPosition: "right",
	},
	{
		id: "4",
		title: "Làng Nghề Truyền Thống",
		subtitle: "Gốm Sứ Bình Dương",
		description: "Khám phá nghề làm gốm truyền thống với những sản phẩm tinh xảo được làm thủ công",
		image: "/placeholder.svg?height=600&width=1200",
		overlay: true,
		textPosition: "bottom",
	},
]

const cardSlides: SlideItem[] = [
	{
		id: "1",
		title: "Tour Núi Bà Đen",
		description: "1 ngày khám phá",
		image: "/placeholder.svg?height=400&width=300",
		overlay: true,
	},
	{
		id: "2",
		title: "Tour Chùa Cao Đài",
		description: "Tham quan tâm linh",
		image: "/placeholder.svg?height=400&width=300",
		overlay: true,
	},
	{
		id: "3",
		title: "Tour Ẩm Thực",
		description: "Khám phá đặc sản",
		image: "/placeholder.svg?height=400&width=300",
		overlay: true,
	},
	{
		id: "4",
		title: "Tour Làng Nghề",
		description: "Trải nghiệm thủ công",
		image: "/placeholder.svg?height=400&width=300",
		overlay: true,
	},
]

const customContentSlides: SlideItem[] = [
	{
		id: "1",
		content: (
			<div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
				<div className="text-center">
					<Star className="w-16 h-16 mx-auto mb-4" />
					<h2 className="text-4xl font-bold mb-4">Premium Tours</h2>
					<p className="text-xl">Trải nghiệm cao cấp</p>
				</div>
			</div>
		),
	},
	{
		id: "2",
		content: (
			<div className="flex items-center justify-center h-full bg-gradient-to-br from-green-500 to-teal-600 text-white">
				<div className="text-center">
					<MapPin className="w-16 h-16 mx-auto mb-4" />
					<h2 className="text-4xl font-bold mb-4">Local Guides</h2>
					<p className="text-xl">Hướng dẫn viên địa phương</p>
				</div>
			</div>
		),
	},
	{
		id: "3",
		content: (
			<div className="flex items-center justify-center h-full bg-gradient-to-br from-pink-500 to-red-600 text-white">
				<div className="text-center">
					<Heart className="w-16 h-16 mx-auto mb-4" />
					<h2 className="text-4xl font-bold mb-4">Memorable</h2>
					<p className="text-xl">Kỷ niệm đáng nhớ</p>
				</div>
			</div>
		),
	},
]

export function SliderShowcase() {
	return (
		<div className="w-full max-w-7xl mx-auto p-8 space-y-16">

			{/* Default Slider */}
			<div className="space-y-4">
				<Slider
					items={sampleSlides}
					variant="default"
					autoPlay={true}
					autoPlayInterval={5000}
					showDots={true}
					showArrows={true}
					height="500px"
					onSlideChange={(index) => console.log("Slide changed to:", index)}
				/>
			</div>

		</div>
	)
}
