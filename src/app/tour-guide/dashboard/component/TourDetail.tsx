"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
	CalendarDays,
	MapPin,
	User2,
	DollarSign,
	Phone,
	Mail,
	MapPinIcon,
	Users,
	Hash,
	CreditCard,
	Tag,
	Clock,
	XCircle,
} from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useBookings } from "@/services/use-bookings"

interface BookingDetail {
	id: string
	userId: string
	userName: string
	tourId: string
	tourName: string
	tourScheduleId: string
	departureDate: string
	tourGuideId: string | null
	tourGuideName: string
	tripPlanId: string | null
	tripPlanName: string
	workshopId: string | null
	workshopName: string
	workshopScheduleId: string | null
	paymentLinkId: string
	status: number
	statusText: string
	bookingType: number
	bookingTypeText: string
	bookingDate: string
	startDate: string
	endDate: string
	cancelledAt: string | null
	promotionId: string | null
	originalPrice: number
	discountAmount: number
	finalPrice: number
	contactName: string
	contactEmail: string
	contactPhone: string
	contactAddress: string
	participants: any[]
}

interface BookingDetailDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	bookingId?: string
}

export default function BookingDetailDialog({ open, onOpenChange, bookingId }: BookingDetailDialogProps) {
	const [booking, setBooking] = useState<BookingDetail | null>(null)
	const [loading, setLoading] = useState(false)
	const { getBookingById } = useBookings()

	useEffect(() => {
		if (open && bookingId) {
			fetchBookingDetail()
		}
	}, [open, bookingId])

	const fetchBookingDetail = async () => {
		if (!bookingId) return

		try {
			setLoading(true)
			const response = await getBookingById(bookingId)
			setBooking(response.data)
		} catch (error) {
			console.error("Failed to fetch booking detail:", error)
		} finally {
			setLoading(false)
		}
	}

	const getStatusColor = (status: number): string => {
		const statusColors: Record<number, string> = {
			1: "bg-yellow-100 text-yellow-800 border-yellow-200", // Pending
			2: "bg-blue-100 text-blue-800 border-blue-200", // Confirmed
			3: "bg-green-100 text-green-800 border-green-200", // In Progress
			4: "bg-red-100 text-red-800 border-red-200", // Cancelled
			5: "bg-emerald-100 text-emerald-800 border-emerald-200", // Completed
		}
		return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
	}

	const getBookingTypeColor = (type: number): string => {
		const typeColors: Record<number, string> = {
			1: "bg-blue-600", // Tour
			2: "bg-purple-600", // Workshop
			3: "bg-orange-600", // Custom
		}
		return typeColors[type] || "bg-gray-600"
	}

	if (loading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<div className="flex items-center justify-center p-8">
						<div className="flex items-center space-x-2">
							<Clock className="h-4 w-4 animate-spin" />
							<span>Đang tải thông tin booking...</span>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	if (!booking) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader className="space-y-3">
					<div className="flex items-start justify-between">
						<div className="space-y-2">
							<DialogTitle className="text-2xl font-semibold">
								Chi tiết đặt {booking.bookingTypeText.toLowerCase()}
							</DialogTitle>
							<div className="flex items-center gap-2">
								<Badge className={`${getBookingTypeColor(booking.bookingType)} text-white flex items-center gap-1`}>
									<Hash className="w-4 h-4" />
									{booking.bookingTypeText}
								</Badge>
								<Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 border`}>
									{booking.statusText}
								</Badge>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm text-muted-foreground">Booking ID</p>
							<code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{booking.id}</code>
						</div>
					</div>
					<DialogDescription className="text-base">
						Thông tin chi tiết về booking của khách hàng {booking.userName}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Customer Information */}
					<Card>
						<CardHeader className="pb-3">
							<h3 className="font-semibold text-lg flex items-center gap-2">
								<User2 className="w-5 h-5 text-blue-600" />
								Thông tin khách hàng
							</h3>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-blue-50 rounded-lg">
										<User2 className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Tên khách hàng</p>
										<p className="font-medium">{booking.userName}</p>
									</div>
								</div>

								{booking.contactEmail && (
									<div className="flex items-center gap-3">
										<div className="p-2 bg-green-50 rounded-lg">
											<Mail className="w-5 h-5 text-green-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Email</p>
											<p className="font-medium">{booking.contactEmail}</p>
										</div>
									</div>
								)}

								{booking.contactPhone && (
									<div className="flex items-center gap-3">
										<div className="p-2 bg-orange-50 rounded-lg">
											<Phone className="w-5 h-5 text-orange-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Số điện thoại</p>
											<p className="font-medium">{booking.contactPhone}</p>
										</div>
									</div>
								)}

								{booking.contactAddress && (
									<div className="flex items-center gap-3">
										<div className="p-2 bg-purple-50 rounded-lg">
											<MapPinIcon className="w-5 h-5 text-purple-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Địa chỉ</p>
											<p className="font-medium">{booking.contactAddress}</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Tour/Service Information */}
					<Card>
						<CardHeader className="pb-3">
							<h3 className="font-semibold text-lg flex items-center gap-2">
								<MapPin className="w-5 h-5 text-emerald-600" />
								Thông tin {booking.bookingTypeText.toLowerCase()}
							</h3>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-emerald-50 rounded-lg">
										<MapPin className="w-5 h-5 text-emerald-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Tên {booking.bookingTypeText.toLowerCase()}</p>
										<p className="font-medium">{booking.tourName}</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="p-2 bg-blue-50 rounded-lg">
										<CalendarDays className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Ngày khởi hành</p>
										<p className="font-medium">
											{dayjs(booking.departureDate).locale("vi").format("dddd, DD/MM/YYYY")}
										</p>
									</div>
								</div>

								{booking.tourGuideName && (
									<div className="flex items-center gap-3">
										<div className="p-2 bg-yellow-50 rounded-lg">
											<User2 className="w-5 h-5 text-yellow-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Hướng dẫn viên</p>
											<p className="font-medium">{booking.tourGuideName}</p>
										</div>
									</div>
								)}

								{booking.participants.length > 0 && (
									<div className="flex items-center gap-3">
										<div className="p-2 bg-indigo-50 rounded-lg">
											<Users className="w-5 h-5 text-indigo-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Số lượng khách</p>
											<p className="font-medium">{booking.participants.length} người</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Payment Information */}
					<Card>
						<CardHeader className="pb-3">
							<h3 className="font-semibold text-lg flex items-center gap-2">
								<CreditCard className="w-5 h-5 text-green-600" />
								Thông tin thanh toán
							</h3>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-green-50 rounded-lg">
										<DollarSign className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Giá gốc</p>
										<p className="font-medium">
											{new Intl.NumberFormat("vi-VN").format(booking.originalPrice)} đ
										</p>
									</div>
								</div>

								{booking.discountAmount > 0 && (
									<div className="flex items-center gap-3">
										<div className="p-2 bg-red-50 rounded-lg">
											<Tag className="w-5 h-5 text-red-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Giảm giá</p>
											<p className="font-medium text-red-600">
												-{new Intl.NumberFormat("vi-VN").format(booking.discountAmount)} đ
											</p>
										</div>
									</div>
								)}

								<div className="flex items-center gap-3 md:col-span-2">
									<div className="p-2 bg-emerald-50 rounded-lg">
										<CreditCard className="w-5 h-5 text-emerald-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Tổng thanh toán</p>
										<p className="font-semibold text-emerald-600 text-lg">
											{new Intl.NumberFormat("vi-VN").format(booking.finalPrice)} đ
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Booking Timeline */}
					<Card>
						<CardHeader className="pb-3">
							<h3 className="font-semibold text-lg flex items-center gap-2">
								<Clock className="w-5 h-5 text-purple-600" />
								Lịch sử booking
							</h3>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
									<CalendarDays className="w-5 h-5 text-blue-600" />
									<div>
										<p className="text-sm font-medium">Thời gian đặt</p>
										<p className="text-sm text-muted-foreground">
											{dayjs(booking.bookingDate).locale("vi").format("DD/MM/YYYY HH:mm")}
										</p>
									</div>
								</div>

								{booking.cancelledAt && (
									<div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
										<XCircle className="w-5 h-5 text-red-600" />
										<div>
											<p className="text-sm font-medium">Thời gian hủy</p>
											<p className="text-sm text-muted-foreground">
												{dayjs(booking.cancelledAt).locale("vi").format("DD/MM/YYYY HH:mm")}
											</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Separator />

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 justify-end">
						{booking.tourId && (
							<Button variant="outline" asChild>
								<Link href={`/tour/${booking.tourId}`} className="flex items-center gap-2">
									<MapPin className="w-4 h-4" />
									Xem chi tiết tour
								</Link>
							</Button>
						)}

						{booking.tripPlanId && (
							<Button variant="outline" asChild>
								<Link href={`/trip-plan/${booking.tripPlanId}`} className="flex items-center gap-2">
									<CalendarDays className="w-4 h-4" />
									Xem kế hoạch
								</Link>
							</Button>
						)}

						<Button onClick={() => onOpenChange(false)}>
							Đóng
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
