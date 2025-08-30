"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
	MapPin,
	Clock,
	Phone,
	Mail,
	Globe,
	Award,
	Calendar,
	User,
	Building,
	CheckCircle,
	XCircle,
	AlertCircle,
	Star,
	WorkflowIcon as Workshop,
	Loader2,
} from "lucide-react"
import { type CraftVillageRequestResponse, CraftVillageRequestStatus, type ReviewCraftVillageRequest } from "@/types/CraftVillage"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import VietmapGL from "@/components/vietmap-gl"
import { SeccretKey } from "@/secret/secret"
import dayjs from "dayjs"

interface CraftVillageDetailViewProps {
	data: CraftVillageRequestResponse
	onApprove?: () => void
	onReject?: () => void
	showActions?: boolean
	loading?: boolean
	isReviewRequestOpen?: boolean
	setIsReviewRequestOpen?: (isOpen: boolean) => void
	onSubmitReview?: (payload: ReviewCraftVillageRequest) => void
	reviewAction?: "approve" | "reject" | null
	setReviewAction?: (action: "approve" | "reject" | null) => void
	reviewReason?: string
	setReviewReason?: (reason: string) => void
}

export default function CraftVillageDetailView({
	data,
	showActions = false,
	loading = false,
	isReviewRequestOpen = false,
	setIsReviewRequestOpen = () => { },
	onSubmitReview,
	reviewAction,
	setReviewAction,
	reviewReason,
	setReviewReason,
}: CraftVillageDetailViewProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const getStatusConfig = (status: CraftVillageRequestStatus) => {
		switch (status) {
			case CraftVillageRequestStatus.Pending:
				return {
					label: "Chờ duyệt",
					variant: "secondary" as const,
					icon: <AlertCircle className="w-4 h-4" />,
					color: "text-yellow-600 bg-yellow-50 border-yellow-200",
				}
			case CraftVillageRequestStatus.Approved:
				return {
					label: "Đã duyệt",
					variant: "default" as const,
					icon: <CheckCircle className="w-4 h-4" />,
					color: "text-green-600 bg-green-50 border-green-200",
				}
			case CraftVillageRequestStatus.Rejected:
				return {
					label: "Từ chối",
					variant: "destructive" as const,
					icon: <XCircle className="w-4 h-4" />,
					color: "text-red-600 bg-red-50 border-red-200",
				}
			default:
				return {
					label: "Không xác định",
					variant: "outline" as const,
					icon: <AlertCircle className="w-4 h-4" />,
					color: "text-gray-600 bg-gray-50 border-gray-200",
				}
		}
	}

	const statusConfig = getStatusConfig(data.status)

	const canSubmit = reviewAction === "approve" || (reviewAction === "reject" && (reviewReason?.trim()?.length || 0) >= 10)

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			{/* Header Section */}
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<Building className="w-6 h-6 text-blue-600" />
								<CardTitle className="text-2xl font-bold text-gray-900">{data.name}</CardTitle>
							</div>
							<div className="flex items-center gap-2 mb-3">
								<Badge className={`${statusConfig.color} border`}>
									{statusConfig.icon}
									<span className="ml-1">{statusConfig.label}</span>
								</Badge>
								{data.isRecognizedByUnesco && (
									<Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
										<Star className="w-3 h-3 mr-1" />
										UNESCO
									</Badge>
								)}
								{data.workshopsAvailable && (
									<Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">
										<Workshop className="w-3 h-3 mr-1" />
										Workshop
									</Badge>
								)}
							</div>
							<p className="text-gray-600 leading-relaxed">{data.description}</p>
						</div>

						{showActions && data.status === CraftVillageRequestStatus.Pending && (
							<div className="flex gap-2">
								<Button
									onClick={() => {
										setReviewAction?.("reject")
										setReviewReason?.("")
										setIsReviewRequestOpen(true)
									}}
									variant="outline"
									disabled={loading}
									className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
								>
									<XCircle className="w-4 h-4 mr-2" />
									Từ chối
								</Button>
								<Button onClick={() => {
									setReviewAction?.("approve")
									setReviewReason?.("")
									setIsReviewRequestOpen(true)
								}} disabled={loading} className="bg-green-600 hover:bg-green-700">
									<CheckCircle className="w-4 h-4 mr-2" />
									Duyệt
								</Button>
							</div>
						)}
					</div>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Detailed Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Building className="w-5 h-5 text-blue-600" />
								Thông tin chi tiết
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="font-semibold text-gray-900 mb-2">Nội dung mô tả</h4>
								<p className="text-gray-700 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: data.content }} />
							</div>

							<Separator />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">Sản phẩm đặc trưng</h4>
									<p className="text-gray-700">{data.signatureProduct}</p>
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">Số năm lịch sử</h4>
									<p className="text-gray-700">{data.yearsOfHistory} năm</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Location Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="w-5 h-5 text-green-600" />
								Thông tin vị trí
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="font-semibold text-gray-900 mb-2">Địa chỉ</h4>
								<p className="text-gray-700">{data?.address}</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Vĩ độ</h4>
									<p className="text-gray-700 font-mono text-sm">{data?.latitude}</p>
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Kinh độ</h4>
									<p className="text-gray-700 font-mono text-sm">{data?.longitude}</p>
								</div>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<VietmapGL
									apiKey={SeccretKey.VIET_MAP_KEY || ""}
									center={[data?.longitude as number, data?.latitude as number]}
									zoom={15}
									markers={[
										{
											lngLat: [data?.longitude, data?.latitude],
											popupHTML: `<div>
												<h3>${data?.name}</h3>
												<p>${data?.address}</p>
											</div>`,
										},
									]}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Workshop Information (if available) */}
					{(data as any)?.workshop && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Workshop className="w-5 h-5 text-purple-600" />
									Thông tin Workshop
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Workshop Basic Info */}
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h4>
									<div className="bg-gray-50 rounded-lg p-4 space-y-3">
										<div>
											<span className="text-sm font-medium text-gray-700">Tên workshop:</span>
											<p className="text-gray-900">{(data as any).workshop.name}</p>
										</div>
										<div>
											<span className="text-sm font-medium text-gray-700">Mô tả:</span>
											<p className="text-gray-900">{(data as any).workshop.description}</p>
										</div>
										<div>
											<span className="text-sm font-medium text-gray-700">Nội dung:</span>
											<p className="text-gray-900">{(data as any).workshop.content}</p>
										</div>
									</div>
								</div>

								{/* Ticket Types */}
								<div>
									<h4 className="font-semibold text-gray-900 mb-3">Loại vé</h4>
									<div className="grid gap-4">
										{(data as any).workshop.ticketTypes?.map((ticket: any, index: number) => (
											<div key={ticket.id || index} className="border rounded-lg p-4">
												<div className="flex items-center justify-between mb-3">
													<h5 className="font-medium text-gray-900">{ticket.name}</h5>
													<div className="flex items-center gap-2">
														<Badge variant={ticket.type === 1 ? "secondary" : "default"}>
															{ticket.type === 1 ? "Tham quan" : "Trải nghiệm"}
														</Badge>
														{ticket.isCombo && (
															<Badge variant="outline" className="text-purple-600">
																Combo
															</Badge>
														)}
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
													<div>
														<span className="text-gray-600">Giá:</span>
														<p className="font-semibold text-green-600">
															{ticket.price?.toLocaleString("vi-VN")}đ
														</p>
													</div>
													<div>
														<span className="text-gray-600">Thời gian:</span>
														<p className="font-semibold">{ticket.durationMinutes} phút</p>
													</div>
													<div>
														<span className="text-gray-600">Hoạt động:</span>
														<p className="font-semibold">{ticket.workshopActivities?.length || 0} hoạt động</p>
													</div>
												</div>

												{ticket.content && (
													<p className="text-gray-700 text-sm mt-2">{ticket.content}</p>
												)}

												{/* Workshop Activities */}
												{ticket.workshopActivities && ticket.workshopActivities.length > 0 && (
													<div className="mt-4">
														<h6 className="font-medium text-gray-900 mb-2">Chi tiết hoạt động:</h6>
														<div className="space-y-2">
															{ticket.workshopActivities.map((activity: any, actIndex: number) => (
																<div key={activity.id || actIndex} className="bg-gray-50 rounded p-3">
																	<div className="flex items-center justify-between mb-1">
																		<span className="font-medium text-gray-900">{activity.activity}</span>
																		<span className="text-sm text-gray-600">
																			{activity.startHour} - {activity.endHour}
																		</span>
																	</div>
																	<p className="text-sm text-gray-700">{activity.description}</p>
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								</div>

								{/* Recurring Rules (Schedule) */}
								{(data as any).workshop.recurringRules && (data as any).workshop.recurringRules.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-900 mb-3">Lịch trình hoạt động</h4>
										<div className="space-y-4">
											{(data as any).workshop.recurringRules.map((rule: any, index: number) => (
												<div key={rule.id || index} className="border rounded-lg p-4">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
														<div>
															<span className="text-sm font-medium text-gray-700">Thời gian:</span>
															<p className="text-gray-900">
																{dayjs(rule.startDate).format("DD/MM/YYYY")} - {dayjs(rule.endDate).format("DD/MM/YYYY")}
															</p>
														</div>
														<div>
															<span className="text-sm font-medium text-gray-700">Các ngày trong tuần:</span>
															<div className="flex flex-wrap gap-1 mt-1">
																{rule.daysOfWeek?.map((day: number) => {
																	const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
																	return (
																		<Badge key={day} variant="outline" className="text-xs">
																			{dayNames[day]}
																		</Badge>
																	);
																})}
															</div>
														</div>
													</div>

													{/* Sessions */}
													{rule.sessions && rule.sessions.length > 0 && (
														<div>
															<span className="text-sm font-medium text-gray-700 block mb-2">Các ca trong ngày:</span>
															<div className="grid gap-2">
																{rule.sessions.map((session: any, sessionIndex: number) => (
																	<div key={session.id || sessionIndex} className="bg-blue-50 rounded p-3 flex items-center justify-between">
																		<div className="flex items-center gap-4">
																			<Badge variant="outline" className="bg-blue-100 text-blue-700">
																				Ca {sessionIndex + 1}
																			</Badge>
																			<span className="text-sm font-medium">
																				{session.startTime} - {session.endTime}
																			</span>
																		</div>
																		<span className="text-sm text-gray-600">
																			Sức chứa: <span className="font-medium">{session.capacity} người</span>
																		</span>
																	</div>
																))}
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* Rejection Reason (if rejected) */}
					{data?.status === CraftVillageRequestStatus.Rejected && data?.rejectionReason && (
						<Card className="border-red-200 bg-red-50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-red-700">
									<XCircle className="w-5 h-5" />
									Lý do từ chối
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-red-700">{data?.rejectionReason}</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Contact Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="w-5 h-5 text-purple-600" />
								Thông tin liên hệ
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="font-semibold text-gray-900 mb-1">Người đăng ký</h4>
								<p className="text-gray-700">{data?.ownerFullName}</p>
							</div>

							<div className="flex items-center gap-2">
								<Phone className="w-4 h-4 text-gray-500" />
								<span className="text-gray-700">{data?.phoneNumber}</span>
							</div>

							<div className="flex items-center gap-2">
								<Mail className="w-4 h-4 text-gray-500" />
								<span className="text-gray-700">{data?.email}</span>
							</div>

							{data?.website && (
								<div className="flex items-center gap-2">
									<Globe className="w-4 h-4 text-gray-500" />
									<a
										href={data?.website?.startsWith("http") ? data?.website : `https://${data?.website}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline"
									>
										{data?.website}
									</a>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Operating Hours */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="w-5 h-5 text-orange-600" />
								Giờ hoạt động
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<span className="text-gray-700">Mở cửa:</span>
								<span className="font-semibold">{data?.openTime}</span>
							</div>
							<div className="flex items-center justify-between mt-2">
								<span className="text-gray-700">Đóng cửa:</span>
								<span className="font-semibold">{data?.closeTime}</span>
							</div>
						</CardContent>
					</Card>

					{/* Review Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-indigo-600" />
								Thông tin duyệt
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<h4 className="font-semibold text-gray-900 mb-1">Trạng thái</h4>
								<Badge className={statusConfig.color}>
									{statusConfig.icon}
									<span className="ml-1">{statusConfig.label}</span>
								</Badge>
							</div>

							{data?.reviewedAt && (
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Thời gian duyệt</h4>
									<p className="text-gray-700 text-sm">{dayjs(data?.reviewedAt).format("DD/MM/YYYY HH:mm")}</p>
								</div>
							)}

							{data?.reviewedBy && (
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Người duyệt</h4>
									<p className="text-gray-700">{data?.reviewedBy}</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Special Features */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Award className="w-5 h-5 text-amber-600" />
								Đặc điểm nổi bật
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-gray-700">Workshop/Trải nghiệm</span>
								{data?.workshopsAvailable ? (
									<CheckCircle className="w-5 h-5 text-green-500" />
								) : (
									<XCircle className="w-5 h-5 text-gray-400" />
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-gray-700">Công nhận UNESCO</span>
								{data?.isRecognizedByUnesco ? (
									<CheckCircle className="w-5 h-5 text-green-500" />
								) : (
									<XCircle className="w-5 h-5 text-gray-400" />
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<Dialog open={isReviewRequestOpen} onOpenChange={(open) => {
				if (isSubmitting) return // Prevent closing while submitting
				setIsReviewRequestOpen(open)
				if (!open) {
					setReviewAction?.(null)
					setReviewReason?.("")
				}
			}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{reviewAction === "approve" ? "Xác nhận duyệt đơn đăng ký" : reviewAction === "reject" ? "Từ chối đơn đăng ký" : "Duyệt đơn đăng ký"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						{reviewAction === "approve" && (
							<p className="text-sm text-gray-600">
								Bạn có chắc chắn muốn duyệt đơn đăng ký này? Hành động này sẽ chấp nhận làng nghề vào hệ thống.
							</p>
						)}

						<div className="space-y-2">
							<label className="text-sm font-medium">{reviewAction === "reject" ? "Lý do từ chối (tối thiểu 10 ký tự)" : "Ghi chú (tuỳ chọn)"}</label>
							<Textarea
								rows={4}
								placeholder={reviewAction === "reject" ? "Nhập lý do từ chối chi tiết để người dùng hiểu rõ..." : "Nhập ghi chú khi duyệt (tuỳ chọn)..."}
								value={reviewReason}
								onChange={(e) => setReviewReason?.(e.target.value)}
							/>
							{reviewAction === "reject" && (
								<div className="text-xs">
									{(reviewReason?.trim()?.length || 0) < 10 ? (
										<span className="text-red-500">Lý do cần ít nhất 10 ký tự.</span>
									) : (
										<span className="text-gray-500">{reviewReason?.trim()?.length || 0} ký tự</span>
									)}
								</div>
							)}
						</div>

						<DialogFooter>
							<Button
								onClick={() => setIsReviewRequestOpen(false)}
								variant="outline"
								disabled={isSubmitting}
							>
								Hủy
							</Button>
							<Button
								type="button"
								disabled={!canSubmit || loading || isSubmitting}
								onClick={async () => {
									try {
										setIsSubmitting(true)
										await onSubmitReview?.({
											status: reviewAction === "approve" ? CraftVillageRequestStatus.Approved : CraftVillageRequestStatus.Rejected,
											rejectionReason: reviewReason?.trim() || undefined,
										})
										setIsReviewRequestOpen(false)
										setReviewAction?.(null)
										setReviewReason?.("")
									} catch (error) {
										console.error("Error submitting review:", error)
									} finally {
										setIsSubmitting(false)
									}
								}}
								className={reviewAction === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Đang xử lý...
									</>
								) : (
									reviewAction === "approve" ? "Duyệt" : reviewAction === "reject" ? "Từ chối" : "Xác nhận"
								)}
							</Button>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
