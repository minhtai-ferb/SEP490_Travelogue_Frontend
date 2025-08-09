"use client"

import { useCallback, useEffect, useState } from "react"
import { Slider, type SlideItem } from "../"
import { useTour } from "@/services/tour"

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


export function SliderShowcase() {
	const [tours, setTours] = useState([])
	const [error, setError] = useState(false)
	const { getAllTour } = useTour()

	useEffect(() => {
		fetchTours()
	}, [])

	const fetchTours = async () => {
		try {
			const response = await getAllTour()
			setTours(response)
		} catch (error) {
			console.error("Error fetching tours:", error)
			setError(true)
		} finally {
			fetchTours()
		}
	}

	return (
		<div className="w-full max-w-7xl mx-auto p-8 space-y-16">

			{/* Error Handling */}
			{error && (
				<div className="text-red-500 text-center">
					<p>Không thể tải dữ liệu chuyến đi. Vui lòng thử lại sau.</p>
				</div>
			)}

			{/* Sample Slider */}
			{!error && tours.length === 0 && (
				<div className="space-y-4">
					<Slider
						items={tours}
						variant="default"
						autoPlay={true}
						autoPlayInterval={5000}
						showDots={true}
						showArrows={true}
						height="500px"
						onSlideChange={(index) => console.log("Slide changed to:", index)}
					/>
				</div>
			)}

		</div>
	)
}
