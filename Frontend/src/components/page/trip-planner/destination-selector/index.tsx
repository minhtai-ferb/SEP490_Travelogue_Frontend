"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import type { TripLocation } from "@/types/Tripplan"

// Sample data - would be replaced with API calls
const sampleDestinations: TripLocation[] = [
	{
		id: "dest1",
		name: "Núi Bà Đen",
		type: "destination",
		address: "Tây Ninh",
		description: "Ngọn núi cao nhất Nam Bộ với cảnh quan thiên nhiên tuyệt đẹp và nhiều di tích lịch sử, văn hóa",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "dest2",
		name: "Tòa Thánh Cao Đài",
		type: "destination",
		address: "Hòa Thành, Tây Ninh",
		description: "Trung tâm của đạo Cao Đài với kiến trúc độc đáo",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "dest3",
		name: "Khu Du lịch Sinh thái Núi Bà",
		type: "destination",
		address: "Tây Ninh",
		description: "Khu du lịch sinh thái với nhiều hoạt động ngoài trời",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "dest4",
		name: "Hồ Dầu Tiếng",
		type: "destination",
		address: "Dầu Tiếng, Tây Ninh",
		description: "Hồ nước ngọt nhân tạo lớn nhất Việt Nam",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
]

const sampleRestaurants: TripLocation[] = [
	{
		id: "rest1",
		name: "Nhà hàng Đặc sản Tây Ninh",
		type: "restaurant",
		address: "Trung tâm TP. Tây Ninh",
		description: "Nhà hàng chuyên phục vụ các món đặc sản địa phương",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "rest2",
		name: "Quán Bánh Canh Trảng Bàng",
		type: "restaurant",
		address: "Trảng Bàng, Tây Ninh",
		description: "Quán ăn nổi tiếng với món bánh canh trảng bàng",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "rest3",
		name: "Nhà hàng Hương Rừng",
		type: "restaurant",
		address: "Dương Minh Châu, Tây Ninh",
		description: "Nhà hàng với các món ăn từ đặc sản rừng núi",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
]

const sampleCraftVillages: TripLocation[] = [
	{
		id: "craft1",
		name: "Làng nghề Bánh Tráng Trảng Bàng",
		type: "craftVillage",
		address: "Trảng Bàng, Tây Ninh",
		description: "Làng nghề truyền thống sản xuất bánh tráng nổi tiếng",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
	{
		id: "craft2",
		name: "Làng nghề Đường thốt nốt Châu Thành",
		type: "craftVillage",
		address: "Châu Thành, Tây Ninh",
		description: "Làng nghề sản xuất đường thốt nốt truyền thống",
		imageUrl: "/placeholder.svg?height=100&width=200",
	},
]

interface DestinationSelectorProps {
	type: "destination" | "restaurant" | "craftVillage"
	onSelect: (location: TripLocation) => void
}

export default function DestinationSelector({ type, onSelect }: DestinationSelectorProps) {
	const [searchTerm, setSearchTerm] = useState("")

	const getLocations = () => {
		switch (type) {
			case "destination":
				return sampleDestinations
			case "restaurant":
				return sampleRestaurants
			case "craftVillage":
				return sampleCraftVillages
			default:
				return []
		}
	}

	const locations = getLocations().filter(
		(loc) =>
			loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			loc.address.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className="space-y-4">
			<div className="relative">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Tìm kiếm..."
					className="pl-8"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			<ScrollArea className="h-[300px] rounded-md border">
				<div className="p-4 grid grid-cols-1 gap-4">
					{locations.length > 0 ? (
						locations.map((location) => (
							<Card key={location.id} className="overflow-hidden">
								<div className="flex flex-col sm:flex-row">
									<div className="w-full sm:w-1/3 h-32 sm:h-auto bg-muted">
										<img
											src={location.imageUrl || "/placeholder.svg"}
											alt={location.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<CardContent className="flex-1 p-4">
										<div className="flex flex-col h-full justify-between">
											<div>
												<h3 className="font-semibold text-lg">{location.name}</h3>
												<p className="text-sm text-muted-foreground mb-2">{location.address}</p>
												<p className="text-sm line-clamp-2">{location.description}</p>
											</div>
											<Button className="mt-4 self-end" size="sm" onClick={() => onSelect(location)}>
												Chọn
											</Button>
										</div>
									</CardContent>
								</div>
							</Card>
						))
					) : (
						<div className="text-center py-8 text-muted-foreground">Không tìm thấy kết quả phù hợp</div>
					)}
				</div>
			</ScrollArea>
		</div>
	)
}
