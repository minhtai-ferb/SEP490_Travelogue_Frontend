import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import dayjs from 'dayjs'
import {
	Activity,
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	Globe,
	Mail,
	MapPin,
	Phone,
	Star,
	WorkflowIcon as Workshop,
	XCircle
} from 'lucide-react'

interface CraftVillageLatestRequestProps {
	latestCraftVillage: any
	fetchCraftLatest: () => void
	setLatestCraftVillage: (value: any) => void
}

function CraftVillageLatestRequest({
	latestCraftVillage,
	fetchCraftLatest,
	setLatestCraftVillage
}: CraftVillageLatestRequestProps) {

	const getStatusConfig = (statusText: string) => {
		switch (statusText) {
			case "Đã xác nhận":
				return {
					label: "Đã duyệt",
					variant: "default" as const,
					icon: <CheckCircle className="w-4 h-4" />,
					className: "bg-emerald-100 text-emerald-700 border-emerald-200",
				}
			case "Từ chối":
				return {
					label: "Từ chối",
					variant: "destructive" as const,
					icon: <XCircle className="w-4 h-4" />,
					className: "bg-red-100 text-red-700 border-red-200",
				}
			case "Chờ duyệt":
			default:
				return {
					label: "Chờ duyệt",
					variant: "secondary" as const,
					icon: <AlertCircle className="w-4 h-4" />,
					className: "bg-amber-100 text-amber-700 border-amber-200",
				}
		}
	}

	const statusConfig = getStatusConfig(latestCraftVillage?.statusText)

	return (
		<div className="space-y-6">
			{/* Header Card */}
			<Card className="border-2">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<Workshop className="w-6 h-6 text-white" />
							</div>
							<div>
								<CardTitle className="text-xl font-bold text-gray-900">
									{latestCraftVillage?.name}
								</CardTitle>
								<p className="text-sm text-gray-600 mt-1">
									Đăng ký làng nghề truyền thống
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Badge className={`${statusConfig.className} border font-medium px-3 py-1`}>
								{statusConfig.icon}
								<span className="ml-1">{statusConfig.label}</span>
							</Badge>
							{latestCraftVillage?.isRecognizedByUnesco && (
								<Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
									<Star className="w-3 h-3 mr-1" />
									UNESCO
								</Badge>
							)}
							{latestCraftVillage?.workshopsAvailable && (
								<Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">
									<Activity className="w-3 h-3 mr-1" />
									Workshop
								</Badge>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Basic Information */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<MapPin className="w-5 h-5 text-blue-600" />
							Thông tin cơ bản
						</h3>
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<div>
										<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mô tả</span>
										<p className="text-sm text-gray-900 mt-1">{latestCraftVillage?.description}</p>
									</div>
									<div>
										<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Địa chỉ</span>
										<p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
											<MapPin className="w-4 h-4 text-gray-400" />
											{latestCraftVillage?.address}
										</p>
									</div>
									<div>
										<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sản phẩm đặc trưng</span>
										<p className="text-sm text-gray-900 mt-1">{latestCraftVillage?.signatureProduct}</p>
									</div>
								</div>
								<div className="space-y-3">
									<div>
										<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Liên hệ</span>
										<div className="space-y-1 mt-1">
											<p className="text-sm text-gray-900 flex items-center gap-2">
												<Phone className="w-4 h-4 text-gray-400" />
												{latestCraftVillage?.phoneNumber}
											</p>
											<p className="text-sm text-gray-900 flex items-center gap-2">
												<Mail className="w-4 h-4 text-gray-400" />
												{latestCraftVillage?.email}
											</p>
											{latestCraftVillage?.website && (
												<p className="text-sm text-blue-600 flex items-center gap-2">
													<Globe className="w-4 h-4 text-gray-400" />
													<a href={latestCraftVillage.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
														{latestCraftVillage.website}
													</a>
												</p>
											)}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Giờ mở cửa</span>
											<p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
												<Clock className="w-4 h-4 text-gray-400" />
												{latestCraftVillage?.openTime}
											</p>
										</div>
										<div>
											<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Giờ đóng cửa</span>
											<p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
												<Clock className="w-4 h-4 text-gray-400" />
												{latestCraftVillage?.closeTime}
											</p>
										</div>
									</div>
									<div>
										<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lịch sử</span>
										<p className="text-sm text-gray-900 mt-1">{latestCraftVillage?.yearsOfHistory} năm</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Workshop Information */}
					{latestCraftVillage?.workshop && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<Workshop className="w-5 h-5 text-purple-600" />
								Thông tin Workshop
							</h3>
							<div className="bg-purple-50 rounded-lg p-4">
								<div className="space-y-4">
									<div>
										<h4 className="font-medium text-gray-900 mb-2">{latestCraftVillage.workshop.name}</h4>
										<p className="text-sm text-gray-700">{latestCraftVillage.workshop.description}</p>
									</div>

									{/* Ticket Types */}
									{latestCraftVillage.workshop.ticketTypes && latestCraftVillage.workshop.ticketTypes.length > 0 && (
										<div>
											<h5 className="font-medium text-gray-900 mb-3">Loại vé</h5>
											<div className="grid gap-3">
												{latestCraftVillage.workshop.ticketTypes.map((ticket: any, index: number) => (
													<div key={ticket.id || index} className="bg-white rounded-lg border p-3">
														<div className="flex items-center justify-between mb-2">
															<h6 className="font-medium text-gray-900">{ticket.name}</h6>
															<div className="flex items-center gap-2">
																<Badge variant={ticket.type === 1 ? "secondary" : "default"} className="text-xs">
																	{ticket.type === 1 ? "Tham quan" : "Trải nghiệm"}
																</Badge>
																{ticket.isCombo && (
																	<Badge variant="outline" className="text-purple-600 text-xs">
																		Combo
																	</Badge>
																)}
															</div>
														</div>
														<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
															<div>
																<span className="text-gray-500">Giá:</span>
																<p className="font-medium text-green-600">
																	{ticket.price?.toLocaleString("vi-VN")}đ
																</p>
															</div>
															<div>
																<span className="text-gray-500">Thời gian:</span>
																<p className="font-medium">{ticket.durationMinutes} phút</p>
															</div>
															<div>
																<span className="text-gray-500">Hoạt động:</span>
																<p className="font-medium">{ticket.workshopActivities?.length || 0} hoạt động</p>
															</div>
														</div>
														{ticket.content && (
															<p className="text-xs text-gray-600 mt-2">{ticket.content}</p>
														)}
													</div>
												))}
											</div>
										</div>
									)}

									{/* Schedule */}
									{latestCraftVillage.workshop.recurringRules && latestCraftVillage.workshop.recurringRules.length > 0 && (
										<div>
											<h5 className="font-medium text-gray-900 mb-3">Lịch trình</h5>
											{latestCraftVillage.workshop.recurringRules.map((rule: any, index: number) => (
												<div key={rule.id || index} className="bg-white rounded-lg border p-3">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
														<div>
															<span className="text-gray-500">Thời gian:</span>
															<p className="font-medium">
																{dayjs(rule.startDate).format("DD/MM/YYYY")} - {dayjs(rule.endDate).format("DD/MM/YYYY")}
															</p>
														</div>
														<div>
															<span className="text-gray-500">Các ngày:</span>
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
													{rule.sessions && rule.sessions.length > 0 && (
														<div className="mt-3">
															<span className="text-xs text-gray-500">Các ca:</span>
															<div className="flex flex-wrap gap-2 mt-1">
																{rule.sessions.map((session: any, sessionIndex: number) => (
																	<Badge key={session.id || sessionIndex} variant="outline" className="text-xs">
																		{session.startTime} - {session.endTime} ({session.capacity} chỗ)
																	</Badge>
																))}
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Media Gallery */}
					{latestCraftVillage?.medias && latestCraftVillage.medias.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{latestCraftVillage.medias.map((media: any, idx: number) => (
									<div key={`${media.mediaUrl}-${idx}`} className="relative group">
										<img
											src={media.mediaUrl}
											alt={`Làng nghề ${latestCraftVillage.name}`}
											className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
										/>
										{media.isThumbnail && (
											<Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
												Ảnh đại diện
											</Badge>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Review Information */}
					{latestCraftVillage?.reviewedAt && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<Calendar className="w-5 h-5 text-indigo-600" />
								Thông tin duyệt
							</h3>
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Thời gian duyệt</span>
										<p className="text-gray-900 mt-1">{dayjs(latestCraftVillage.reviewedAt).format("DD/MM/YYYY HH:mm")}</p>
									</div>
									<div>
										<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trạng thái</span>
										<div className="mt-1">
											<Badge className={`${statusConfig.className} border`}>
												{statusConfig.icon}
												<span className="ml-1">{statusConfig.label}</span>
											</Badge>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Rejection Reason */}
					{latestCraftVillage?.statusText === "Từ chối" && latestCraftVillage?.rejectionReason && (
						<div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
							<div className="flex items-start gap-3">
								<XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
								<div>
									<h4 className="font-medium text-red-900 mb-1">Lý do từ chối</h4>
									<p className="text-sm text-red-700">{latestCraftVillage.rejectionReason}</p>
								</div>
							</div>
						</div>
					)}

					<Separator />

					{/* Action Buttons */}
					<div className="flex gap-3 justify-end">
						<Button size="default" variant="outline" onClick={fetchCraftLatest}>
							Tải lại
						</Button>
						{latestCraftVillage?.statusText === "Đã xác nhận" && (
							<Button size="default" onClick={() => setLatestCraftVillage(null)}>
								Đăng ký mới
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default CraftVillageLatestRequest
