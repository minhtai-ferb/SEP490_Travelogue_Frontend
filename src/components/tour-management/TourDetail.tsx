"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tour } from "@/types/Tour"

interface TourDetailsProps {
	tour: Tour
}

const statusColorMap = {
	Draft: "bg-yellow-100 text-yellow-800",
	Published: "bg-green-100 text-green-800",
	Active: "bg-blue-100 text-blue-800",
	Cancelled: "bg-red-100 text-red-800",
} as const

export function TourDetails({ tour }: TourDetailsProps) {
	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle>Thông Tin Cơ Bản</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-600">Tên Tour</p>
							<p className="font-semibold">{tour.name}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Loại Tour</p>
							<p className="font-semibold">{tour.tourTypeText}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Thời Gian</p>
							<p className="font-semibold">{tour.totalDaysText}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Số Ngày</p>
							<p className="font-semibold">{tour.totalDays} ngày</p>
						</div>
					</div>

					<div>
						<p className="text-sm text-gray-600 mb-2">Mô Tả</p>
						<p className="text-sm leading-relaxed">{tour.description}</p>
					</div>

					{tour.content && (
						<div>
							<p className="text-sm text-gray-600 mb-2">Nội Dung Chi Tiết</p>
							<p className="text-sm leading-relaxed">{tour.content}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Pricing Information */}
			<Card>
				<CardHeader>
					<CardTitle>Thông Tin Giá</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-green-50 rounded-lg border">
							<p className="text-sm text-gray-600">Giá Người Lớn</p>
							<p className="text-xl font-bold text-green-600">{tour.adultPrice?.toLocaleString()} VNĐ</p>
						</div>
						<div className="text-center p-4 bg-blue-50 rounded-lg border">
							<p className="text-sm text-gray-600">Giá Trẻ Em</p>
							<p className="text-xl font-bold text-blue-600">{tour.childrenPrice?.toLocaleString()} VNĐ</p>
						</div>
						<div className="text-center p-4 bg-orange-50 rounded-lg border">
							<p className="text-sm text-gray-600">Giá Cuối</p>
							<p className="text-xl font-bold text-orange-600">{tour.finalPrice?.toLocaleString()} VNĐ</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Status Information */}
			<Card>
				<CardHeader>
					<CardTitle>Trạng Thái</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<div>
							<p className="text-sm text-gray-600">Trạng Thái Hiện Tại</p>
							<Badge className={`${statusColorMap[tour.statusText] || "bg-gray-100 text-gray-800"} text-sm mt-1`}>
								{tour.statusText}
							</Badge>
						</div>
						<div>
							<p className="text-sm text-gray-600">Mã Trạng Thái</p>
							<p className="font-semibold">{tour.status}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Mã Loại Tour</p>
							<p className="font-semibold">{tour.tourType}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Additional Information */}
			{(tour.location || tour.maxParticipants || tour.minParticipants) && (
				<Card>
					<CardHeader>
						<CardTitle>Thông Tin Bổ Sung</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{tour.location && (
								<div>
									<p className="text-sm text-gray-600">Địa Điểm</p>
									<p className="font-semibold">{tour.location}</p>
								</div>
							)}
							{tour.maxParticipants && (
								<div>
									<p className="text-sm text-gray-600">Số Người Tối Đa</p>
									<p className="font-semibold">{tour.maxParticipants} người</p>
								</div>
							)}
							{tour.minParticipants && (
								<div>
									<p className="text-sm text-gray-600">Số Người Tối Thiểu</p>
									<p className="font-semibold">{tour.minParticipants} người</p>
								</div>
							)}
							{tour.bookedCount !== undefined && (
								<div>
									<p className="text-sm text-gray-600">Đã Đặt</p>
									<p className="font-semibold">{tour.bookedCount} người</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* System Information */}
			<Card>
				<CardHeader>
					<CardTitle>Thông Tin Hệ Thống</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-600">ID Tour</p>
							<p className="font-mono text-sm">{tour.tourId}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Trạng Thái Hoạt Động</p>
							<Badge
								className={`${tour.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-sm mt-1`}
							>
								{tour.isActive ? "Hoạt động" : "Không hoạt động"}
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
