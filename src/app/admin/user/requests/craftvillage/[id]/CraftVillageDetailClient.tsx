"use client"

import { useCraftVillage } from "@/services/use-craftvillage"
import { useEffect, useState } from "react"
import { CraftVillageRequestResponse, CraftVillageRequestStatus, ReviewCraftVillageRequest } from "@/types/CraftVillage"
import CraftVillageDetailView from "./component"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"



function CraftVillageClient({ id }: { id: string }) {
	const { getCraftVillageRequestById, reviewCraftVillageRequest } = useCraftVillage()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<CraftVillageRequestResponse | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isReviewRequestOpen, setIsReviewRequestOpen] = useState(false)


	const fetchData = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await getCraftVillageRequestById(id)
			if (response) {
				setData(response)
			} else {
				setError("Không tìm thấy dữ liệu")
			}
		} catch (error: any) {
			console.error("Error fetching craft village:", error)
			setError(error?.message || "Có lỗi xảy ra khi tải dữ liệu")
		} finally {
			setLoading(false)
		}
	}

	const handleReview = async (id: string, data: ReviewCraftVillageRequest) => {
		try {
			const response = await reviewCraftVillageRequest(id, data)
			if (response) {
				toast.success(data.status === CraftVillageRequestStatus.Approved ? "Đã duyệt đơn đăng ký" : "Đã từ chối đơn đăng ký")
				fetchData()
			}
		} catch (error: any) {
			console.log(error)
			toast.error(data.status === CraftVillageRequestStatus.Approved ? "Duyệt đơn đăng ký thất bại" : "Từ chối đơn đăng ký thất bại")
		}
	}

	useEffect(() => {
		if (id) {
			fetchData()
		}
	}, [id])

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 p-4">
				<div className="max-w-6xl mx-auto">
					<Card>
						<CardContent className="flex items-center justify-center py-12">
							<div className="text-center">
								<Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải thông tin...</h3>
								<p className="text-gray-600">Vui lòng chờ trong giây lát</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	// Error state
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 p-4">
				<div className="max-w-6xl mx-auto">
					<Card className="border-red-200 bg-red-50">
						<CardContent className="flex items-center justify-center py-12">
							<div className="text-center">
								<AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-red-900 mb-2">Không thể tải dữ liệu</h3>
								<p className="text-red-700 mb-4">{error}</p>
								<Button
									onClick={fetchData}
									variant="outline"
									className="text-red-600 border-red-300 hover:bg-red-100 bg-transparent"
								>
									Thử lại
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	// No data state
	if (!data) {
		return (
			<div className="min-h-screen bg-gray-50 p-4">
				<div className="max-w-6xl mx-auto">
					<Card>
						<CardContent className="flex items-center justify-center py-12">
							<div className="text-center">
								<AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy dữ liệu</h3>
								<p className="text-gray-600">Đơn đăng ký làng nghề không tồn tại hoặc đã bị xóa</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-6xl mx-auto">
				{/* Breadcrumb */}
				<nav className="mb-6">
					<div className="flex items-center space-x-2 text-sm text-gray-600">
						<span>Quản lý làng nghề</span>
						<span>/</span>
						<span>Đơn đăng ký</span>
						<span>/</span>
						<span className="text-gray-900 font-medium">{data.Name}</span>
					</div>
				</nav>

				{/* Main Content */}
				<CraftVillageDetailView
					data={data}
					onApprove={() => {
						setIsReviewRequestOpen(true)
					}}
					onReject={() => {
						setIsReviewRequestOpen(true)
					}}
					showActions={true}
					isReviewRequestOpen={isReviewRequestOpen}
					setIsReviewRequestOpen={setIsReviewRequestOpen}
					onSubmitReview={(payload) => handleReview(data.Id, payload)}
					loading={loading}
				/>
			</div>
		</div>
	)
}

export default CraftVillageClient
