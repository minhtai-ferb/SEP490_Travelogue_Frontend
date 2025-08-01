"use client"
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react"
import type { Tour } from "@/types/Tour"

interface TourDetailsProps {
	tour: Tour
}

export function TourDetails({ tour }: TourDetailsProps) {
	const getStatusColor = (status: string) => {
		const colorMap: Record<string, "warning" | "success" | "danger" | "default"> = {
			Draft: "warning",
			Published: "success",
			Active: "success",
			Cancelled: "danger",
		}
		return colorMap[status] || "default"
	}

	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<div className="flex justify-between items-start w-full">
						<div>
							<h3 className="text-xl font-bold">{tour.name}</h3>
							<p className="text-small text-default-500">ID: {tour.tourId}</p>
						</div>
						<Chip color={getStatusColor(tour.statusText)} variant="flat">
							{tour.statusText}
						</Chip>
					</div>
				</CardHeader>
				<CardBody>
					<div className="space-y-4">
						<div>
							<h4 className="font-semibold text-default-700 mb-2">Mô tả</h4>
							<p className="text-default-600">{tour.description || "Chưa có mô tả"}</p>
						</div>

						{tour.content && (
							<div>
								<h4 className="font-semibold text-default-700 mb-2">Nội dung chi tiết</h4>
								<p className="text-default-600">{tour.content}</p>
							</div>
						)}
					</div>
				</CardBody>
			</Card>

			{/* Tour Information */}
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold">Thông Tin Tour</h3>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-3">
							<div>
								<span className="text-small font-medium text-default-500">Loại Tour</span>
								<p className="text-default-700">{tour.tourTypeText}</p>
							</div>

							<div>
								<span className="text-small font-medium text-default-500">Thời Gian</span>
								<p className="text-default-700">{tour.totalDaysText}</p>
							</div>

							<div>
								<span className="text-small font-medium text-default-500">Số Ngày</span>
								<p className="text-default-700">{tour.totalDays} ngày</p>
							</div>
						</div>

						<div className="space-y-3">
							<div>
								<span className="text-small font-medium text-default-500">Mã Loại Tour</span>
								<p className="text-default-700">{tour.tourType}</p>
							</div>

							<div>
								<span className="text-small font-medium text-default-500">Mã Trạng Thái</span>
								<p className="text-default-700">{tour.status}</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Pricing Information */}
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold">Thông Tin Giá</h3>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center p-4 bg-success-50 rounded-lg">
							<span className="text-small font-medium text-success-600">Giá Người Lớn</span>
							<p className="text-2xl font-bold text-success-700">{tour.adultPrice.toLocaleString("vi-VN")} VNĐ</p>
						</div>

						<div className="text-center p-4 bg-warning-50 rounded-lg">
							<span className="text-small font-medium text-warning-600">Giá Trẻ Em</span>
							<p className="text-2xl font-bold text-warning-700">{tour.childrenPrice.toLocaleString("vi-VN")} VNĐ</p>
						</div>

						<div className="text-center p-4 bg-primary-50 rounded-lg">
							<span className="text-small font-medium text-primary-600">Giá Cuối</span>
							<p className="text-2xl font-bold text-primary-700">{tour.finalPrice.toLocaleString("vi-VN")} VNĐ</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	)
}
