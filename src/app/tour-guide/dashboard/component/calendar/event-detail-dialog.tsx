"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
	CalendarDays,
	MapPin,
	User2,
	DollarSign,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Clock,
	MessageSquare,
	FileText,
	Hash,
} from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import RejectionDialog from "../rejection-dialog"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EventDetailDialog({
	open,
	onOpenChange,
	item,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	item?: any
}) {
	const [openRejectionDialog, setOpenRejectionDialog] = useState(false)

	if (!item) return null

	const scheduleTypeConfig = {
		Booking: {
			color: "bg-blue-600",
			label: "Đặt tour",
			icon: <User2 className="w-4 h-4" />,
		},
		TourSchedule: {
			color: "bg-amber-600",
			label: "Lịch trình",
			icon: <CalendarDays className="w-4 h-4" />,
		},
	}

	const rejectionStatusConfig = {
		1: {
			// Pending
			color: "bg-amber-100 text-amber-800 border-amber-200",
			icon: <Clock className="w-4 h-4" />,
			label: "Đang chờ duyệt",
		},
		2: {
			// Approved
			color: "bg-green-100 text-green-800 border-green-200",
			icon: <CheckCircle className="w-4 h-4" />,
			label: "Đã chấp thuận",
		},
		3: {
			// Rejected
			color: "bg-red-100 text-red-800 border-red-200",
			icon: <XCircle className="w-4 h-4" />,
			label: "Đã từ chối",
		},
	}

	const router = useRouter()

	const scheduleType = item?.scheduleType || "Booking"
	const config = scheduleTypeConfig[scheduleType as keyof typeof scheduleTypeConfig] || scheduleTypeConfig.Booking
	const rejectionRequest = item?.rejectionRequest
	const hasRejectionRequest = rejectionRequest && rejectionRequest.requestType

	const handleRejectionProcess = (open: boolean) => {
		setOpenRejectionDialog(false)
		router.refresh()
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader className="space-y-3">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<DialogTitle className="text-xl font-semibold">
									{item.tourName || "Lịch trình hướng dẫn viên"}
								</DialogTitle>
								<div className="flex items-center gap-2">
									<Badge className={`${config.color} text-white flex items-center gap-1`}>
										{config.icon}
										{config.label}
									</Badge>
								</div>
							</div>
						</div>
						<DialogDescription className="text-base">Chi tiết thông tin lịch hướng dẫn viên</DialogDescription>
					</DialogHeader>

					<div className="space-y-6">
						{/* Basic Information */}
						<Card>
							<CardContent className="pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-50 rounded-lg">
											<CalendarDays className="w-5 h-5 text-blue-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Ngày thực hiện</p>
											<p className="font-medium">{dayjs(item.date).locale("vi").format("dddd, DD/MM/YYYY")}</p>
										</div>
									</div>

									{item.customerName && (
										<div className="flex items-center gap-3">
											<div className="p-2 bg-purple-50 rounded-lg">
												<User2 className="w-5 h-5 text-purple-600" />
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Khách hàng</p>
												<p className="font-medium">{item.customerName}</p>
											</div>
										</div>
									)}

									{typeof item.price === "number" && (
										<div className="flex items-center gap-3">
											<div className="p-2 bg-emerald-50 rounded-lg">
												<DollarSign className="w-5 h-5 text-emerald-600" />
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Thu nhập dự kiến</p>
												<p className="font-semibold text-emerald-600">
													{new Intl.NumberFormat("vi-VN").format(item.price)} đ
												</p>
											</div>
										</div>
									)}

									{item.note && (
										<div className="flex items-start gap-3">
											<div className="p-2 bg-gray-50 rounded-lg">
												<FileText className="w-5 h-5 text-gray-600" />
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Ghi chú</p>
												<p className="font-medium">{item.note}</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Rejection Request Status */}
						{hasRejectionRequest && (
							<Card className="border-l-4 border-l-amber-500">
								<CardContent className="pt-6">
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<AlertTriangle className="w-5 h-5 text-amber-600" />
											<h3 className="font-semibold text-lg">Yêu cầu hủy lịch trình</h3>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-3">
												<div>
													<p className="text-sm text-muted-foreground">Trạng thái</p>
													<Badge
														className={`${rejectionStatusConfig[rejectionRequest.status as keyof typeof rejectionStatusConfig]
															?.color
															} flex items-center gap-1 w-fit`}
													>
														{rejectionStatusConfig[rejectionRequest.status as keyof typeof rejectionStatusConfig]?.icon}
														{
															rejectionStatusConfig[rejectionRequest.status as keyof typeof rejectionStatusConfig]
																?.label
														}
													</Badge>
												</div>

												<div>
													<p className="text-sm text-muted-foreground">Lý do hủy</p>
													<p className="font-medium">{rejectionRequest.reason || "Không có lý do"}</p>
												</div>

												<div>
													<p className="text-sm text-muted-foreground">Request ID</p>
													<code className="bg-gray-100 px-2 py-1 rounded text-xs">{rejectionRequest.id}</code>
												</div>
											</div>

											<div className="space-y-3">
												{rejectionRequest.reviewedAt && (
													<div>
														<p className="text-sm text-muted-foreground">Thời gian duyệt</p>
														<p className="font-medium">
															{dayjs(rejectionRequest.reviewedAt).locale("vi").format("DD/MM/YYYY HH:mm")}
														</p>
													</div>
												)}

												{rejectionRequest.reviewedBy && (
													<div>
														<p className="text-sm text-muted-foreground">Người duyệt</p>
														<code className="bg-gray-100 px-2 py-1 rounded text-xs">{rejectionRequest.reviewedBy}</code>
													</div>
												)}

												{rejectionRequest.moderatorComment && (
													<div>
														<p className="text-sm text-muted-foreground">Phản hồi từ quản trị viên</p>
														<div className="flex items-start gap-2 mt-1">
															<MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
															<p className="font-medium text-blue-700">{rejectionRequest.moderatorComment}</p>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						<Separator />

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 justify-end">
							{item.tourId && (
								<Button variant="outline" asChild>
									<Link href={`/tour/${item.tourId}`} className="flex items-center gap-2">
										<CalendarDays className="w-4 h-4" />
										Xem chi tiết tour
									</Link>
								</Button>
							)}

							{item.tripPlanId && (
								<Button variant="outline" asChild>
									<Link href={`/trip-plan/${item.tripPlanId}`} className="flex items-center gap-2">
										<MapPin className="w-4 h-4" />
										Xem kế hoạch
									</Link>
								</Button>
							)}

							{/* Cancel Button Logic */}
							{!hasRejectionRequest ? (
								// No rejection request exists - show cancel button
								<Button
									variant="destructive"
									onClick={() => setOpenRejectionDialog(true)}
									className="flex items-center gap-2"
								>
									<XCircle className="w-4 h-4" />
									Hủy lịch trình
								</Button>
							) : (
								// Rejection request exists - show status-based button
								<>
									{rejectionRequest.status === 1 && (
										// Pending - show processing status
										<Button variant="outline" disabled className="flex items-center gap-2 bg-transparent">
											<Clock className="w-4 h-4 animate-pulse" />
											Đang xử lý yêu cầu hủy
										</Button>
									)}
									{rejectionRequest.status === 2 && (
										// Approved - show success status
										<Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-2 px-3 py-2">
											<CheckCircle className="w-4 h-4" />
											Yêu cầu hủy đã được chấp thuận
										</Badge>
									)}
									{/* {rejectionRequest.status === 3 && (
										// Rejected - allow new request
										<Button
											variant="destructive"
											onClick={() => setOpenRejectionDialog(true)}
											className="flex items-center gap-2"
										>
											<XCircle className="w-4 h-4" />
											Gửi yêu cầu hủy mới
										</Button>
									)} */}
								</>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<RejectionDialog open={openRejectionDialog} onOpenChange={handleRejectionProcess} item={item} />
		</>
	)
}
