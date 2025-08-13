"use client"
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
} from "lucide-react"
import { type CraftVillageRequestResponse, CraftVillageRequestStatus } from "@/types/CraftVillage"

interface CraftVillageDetailViewProps {
	data: CraftVillageRequestResponse
	onApprove?: () => void
	onReject?: () => void
	showActions?: boolean
	loading?: boolean
}

export default function CraftVillageDetailView({
	data,
	onApprove,
	onReject,
	showActions = false,
	loading = false,
}: CraftVillageDetailViewProps) {
	// Helper functions
	const formatTime = (ticks: number) => {
		const totalMinutes = Math.floor(ticks / 600000000)
		const hours = Math.floor(totalMinutes / 60)
		const minutes = totalMinutes % 60
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
	}

	const formatDate = (ticks: number) => {
		if (!ticks) return "Chưa có"
		const date = new Date(ticks / 10000)
		return date.toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

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

	const statusConfig = getStatusConfig(data.Status)

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			{/* Header Section */}
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<Building className="w-6 h-6 text-blue-600" />
								<CardTitle className="text-2xl font-bold text-gray-900">{data.Name}</CardTitle>
							</div>
							<div className="flex items-center gap-2 mb-3">
								<Badge className={`${statusConfig.color} border`}>
									{statusConfig.icon}
									<span className="ml-1">{statusConfig.label}</span>
								</Badge>
								{data.IsRecognizedByUnesco && (
									<Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
										<Star className="w-3 h-3 mr-1" />
										UNESCO
									</Badge>
								)}
								{data.WorkshopsAvailable && (
									<Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">
										<Workshop className="w-3 h-3 mr-1" />
										Workshop
									</Badge>
								)}
							</div>
							<p className="text-gray-600 leading-relaxed">{data.Description}</p>
						</div>

						{showActions && data.Status === CraftVillageRequestStatus.Pending && (
							<div className="flex gap-2">
								<Button
									onClick={onReject}
									variant="outline"
									disabled={loading}
									className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
								>
									<XCircle className="w-4 h-4 mr-2" />
									Từ chối
								</Button>
								<Button onClick={onApprove} disabled={loading} className="bg-green-600 hover:bg-green-700">
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
								<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.Content}</p>
							</div>

							<Separator />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">Sản phẩm đặc trưng</h4>
									<p className="text-gray-700">{data.SignatureProduct}</p>
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">Số năm lịch sử</h4>
									<p className="text-gray-700">{data.YearsOfHistory} năm</p>
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
								<p className="text-gray-700">{data.Address}</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Vĩ độ</h4>
									<p className="text-gray-700 font-mono text-sm">{data.Latitude}</p>
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Kinh độ</h4>
									<p className="text-gray-700 font-mono text-sm">{data.Longitude}</p>
								</div>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<Button variant="outline" className="w-full bg-transparent">
									<MapPin className="w-4 h-4 mr-2" />
									Xem trên bản đồ
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Rejection Reason (if rejected) */}
					{data.Status === CraftVillageRequestStatus.Rejected && data.RejectionReason && (
						<Card className="border-red-200 bg-red-50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-red-700">
									<XCircle className="w-5 h-5" />
									Lý do từ chối
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-red-700">{data.RejectionReason}</p>
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
								<p className="text-gray-700">{data.OwnerFullName}</p>
							</div>

							<div className="flex items-center gap-2">
								<Phone className="w-4 h-4 text-gray-500" />
								<span className="text-gray-700">{data.PhoneNumber}</span>
							</div>

							<div className="flex items-center gap-2">
								<Mail className="w-4 h-4 text-gray-500" />
								<span className="text-gray-700">{data.Email}</span>
							</div>

							{data.Website && (
								<div className="flex items-center gap-2">
									<Globe className="w-4 h-4 text-gray-500" />
									<a
										href={data.Website.startsWith("http") ? data.Website : `https://${data.Website}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline"
									>
										{data.Website}
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
								<span className="font-semibold">{formatTime(data.OpenTime.ticks)}</span>
							</div>
							<div className="flex items-center justify-between mt-2">
								<span className="text-gray-700">Đóng cửa:</span>
								<span className="font-semibold">{formatTime(data.CloseTime.ticks)}</span>
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

							{data.ReviewedAt && (
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Thời gian duyệt</h4>
									<p className="text-gray-700 text-sm">{formatDate(data.ReviewedAt.ticks)}</p>
								</div>
							)}

							{data.ReviewedBy && (
								<div>
									<h4 className="font-semibold text-gray-900 mb-1">Người duyệt</h4>
									<p className="text-gray-700">{data.ReviewedBy}</p>
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
								{data.WorkshopsAvailable ? (
									<CheckCircle className="w-5 h-5 text-green-500" />
								) : (
									<XCircle className="w-5 h-5 text-gray-400" />
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-gray-700">Công nhận UNESCO</span>
								{data.IsRecognizedByUnesco ? (
									<CheckCircle className="w-5 h-5 text-green-500" />
								) : (
									<XCircle className="w-5 h-5 text-gray-400" />
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
