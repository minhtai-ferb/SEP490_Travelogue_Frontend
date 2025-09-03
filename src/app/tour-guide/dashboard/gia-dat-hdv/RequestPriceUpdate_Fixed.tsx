'use client'

import { useTourguideAssign } from '@/services/tourguide'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
	DollarSign,
	Plus,
	Filter,
	Eye,
	Clock,
	Check,
	X,
	AlertCircle,
	CalendarIcon,
	Loader2,
	RefreshCw,
	TrendingUp,
	FileText,
	Download
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { vi } from 'date-fns/locale'
import toast from 'react-hot-toast'
import styles from './RequestPriceUpdate.module.css'
import { FaMoneyBill } from 'react-icons/fa'

// Interface for price request data
interface PriceRequest {
	id: string;
	tourGuideId: string;
	tourGuideName: string;
	requestedPrice: number;
	status: number;
	statusText: string;
	rejectionReason: string | null;
	createdTime: string;
	reviewedAt: string | null;
	reviewedBy: string | null;
	reviewedByName: string | null;
}

interface ApiResponse {
	data: PriceRequest[];
	message: string;
	succeeded: boolean;
	statusCode: number;
}

// Status configuration
const statusConfig = {
	1: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
	2: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-800 border-green-200', icon: Check },
	3: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800 border-red-200', icon: X },
}

function RequestPriceUpdate() {
	const { createPriceRequest, getBookingPriceRequest, loading } = useTourguideAssign();

	// State for create form
	const [newPrice, setNewPrice] = useState<string>('');
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [createLoading, setCreateLoading] = useState(false);

	// State for list
	const [requests, setRequests] = useState<PriceRequest[]>([]);
	const [filteredRequests, setFilteredRequests] = useState<PriceRequest[]>([]);

	// Filter states
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
	const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Detail modal
	const [selectedRequest, setSelectedRequest] = useState<PriceRequest | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	// Fetch data
	const fetchRequests = async () => {
		try {
			const params: any = {
				fromDate: format(fromDate, 'yyyy-MM-dd'),
				toDate: format(toDate, 'yyyy-MM-dd')
			};

			if (statusFilter !== 'all') {
				params.status = parseInt(statusFilter);
			}

			const response = await getBookingPriceRequest(params);

			if (response && response.succeeded) {
				setRequests(response.data || []);
				setFilteredRequests(response.data || []);
			} else {
				toast.error(response?.message || 'Không thể tải danh sách yêu cầu');
			}
		} catch (error: any) {
			toast.error(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
		}
	};

	// Handle create request
	const handleCreateRequest = async () => {
		if (!newPrice || parseFloat(newPrice) <= 0) {
			toast.error('Vui lòng nhập giá hợp lệ');
			return;
		}

		if (parseFloat(newPrice) < 10000) {
			toast.error('Giá không được nhỏ hơn 10,000 VNĐ');
			return;
		}

		setCreateLoading(true);
		try {
			await createPriceRequest({ price: parseFloat(newPrice) });
			toast.success('Tạo yêu cầu thành công!');
			setNewPrice('');
			setIsCreateDialogOpen(false);
			fetchRequests(); // Refresh list
		} catch (error: any) {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo yêu cầu');
		} finally {
			setCreateLoading(false);
		}
	};

	// Export to CSV
	const exportToCSV = () => {
		if (filteredRequests.length === 0) {
			toast.error('Không có dữ liệu để xuất');
			return;
		}

		const csvContent = [
			['Giá đề xuất', 'Trạng thái', 'Ngày tạo', 'Ngày xét duyệt', 'Người xét duyệt', 'Lý do từ chối'],
			...filteredRequests.map((request: PriceRequest) => [
				request.requestedPrice.toString(),
				request.statusText,
				formatDate(request.createdTime),
				request.reviewedAt ? formatDate(request.reviewedAt) : '',
				request.reviewedByName || '',
				request.rejectionReason || ''
			])
		].map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(',')).join('\n');

		const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `yeu-cau-gia-${format(new Date(), 'dd-MM-yyyy')}.csv`;
		link.click();
		toast.success('Đã xuất dữ liệu thành công');
	};

	// Get latest price
	const getLatestApprovedPrice = () => {
		const approvedRequests = requests.filter(r => r.status === 2);
		if (approvedRequests.length === 0) return null;
		return approvedRequests.sort((a, b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime())[0];
	};

	const latestApprovedPrice = getLatestApprovedPrice();

	// Filter requests
	useEffect(() => {
		let filtered = requests;

		if (statusFilter !== 'all') {
			filtered = filtered.filter(req => req.status === parseInt(statusFilter));
		}

		setFilteredRequests(filtered);
		setCurrentPage(1);
	}, [requests, statusFilter]);

	// Load data on mount
	useEffect(() => {
		fetchRequests();
	}, [fromDate, toDate]);

	// Pagination
	const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<h1 className="text-3xl font-bold text-gray-900">Quản lý Yêu cầu Cập nhật Giá</h1>
							{latestApprovedPrice && (
								<Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									Giá hiện tại: {formatCurrency(latestApprovedPrice.requestedPrice)}
								</Badge>
							)}
						</div>
						<p className="text-gray-600">Tạo và theo dõi các yêu cầu thay đổi giá dịch vụ hướng dẫn viên</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						{/* Export Button */}
						<Button
							onClick={exportToCSV}
							variant="outline"
							disabled={filteredRequests.length === 0}
							className="flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							Xuất dữ liệu
						</Button>

						{/* Create Request Button */}
						<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
							<DialogTrigger asChild>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
									<Plus className="h-4 w-4 mr-2" />
									Tạo yêu cầu mới
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle>Tạo yêu cầu cập nhật giá</DialogTitle>
									<DialogDescription>
										Nhập mức giá mới bạn muốn đề xuất cho dịch vụ hướng dẫn viên
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 mt-4">
									{latestApprovedPrice && (
										<div className="bg-blue-50 p-3 rounded-md">
											<p className="text-sm text-blue-800">
												<strong>Giá hiện tại:</strong> {formatCurrency(latestApprovedPrice.requestedPrice)}
											</p>
											<p className="text-xs text-blue-600 mt-1">
												Được phê duyệt vào {formatDate(latestApprovedPrice.reviewedAt!)}
											</p>
										</div>
									)}
									<div className="space-y-2">
										<Label htmlFor="price">Giá đề xuất (VNĐ)</Label>
										<div className="relative">
											<DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
											<Input
												id="price"
												type="number"
												placeholder="Ví dụ: 500000"
												value={newPrice}
												onChange={(e) => setNewPrice(e.target.value)}
												className="pl-10"
												min="10000"
												step="1000"
											/>
										</div>
										{newPrice && parseFloat(newPrice) > 0 && (
											<div className="space-y-1">
												<p className="text-sm text-gray-600">
													Giá đề xuất: <strong>{formatCurrency(parseFloat(newPrice))}</strong>
												</p>
												{latestApprovedPrice && (
													<p className="text-xs text-gray-500">
														{parseFloat(newPrice) > latestApprovedPrice.requestedPrice ? (
															<span className="text-green-600">
																Tăng {formatCurrency(parseFloat(newPrice) - latestApprovedPrice.requestedPrice)}
															</span>
														) : parseFloat(newPrice) < latestApprovedPrice.requestedPrice ? (
															<span className="text-red-600">
																Giảm {formatCurrency(latestApprovedPrice.requestedPrice - parseFloat(newPrice))}
															</span>
														) : (
															<span className="text-gray-600">Giữ nguyên giá hiện tại</span>
														)}
													</p>
												)}
											</div>
										)}
									</div>
									<div className="flex justify-end space-x-2">
										<Button
											variant="outline"
											onClick={() => setIsCreateDialogOpen(false)}
											disabled={createLoading}
										>
											Hủy
										</Button>
										<Button
											onClick={handleCreateRequest}
											disabled={createLoading}
											className="bg-blue-600 hover:bg-blue-700"
										>
											{createLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
											Tạo yêu cầu
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{/* Filters */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Filter className="h-5 w-5" />
							Bộ lọc
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{/* Status Filter */}
							<div className="space-y-2">
								<Label>Trạng thái</Label>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Tất cả</SelectItem>
										<SelectItem value="1">Chờ xác nhận</SelectItem>
										<SelectItem value="2">Đã chấp nhận</SelectItem>
										<SelectItem value="3">Đã từ chối</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* From Date */}
							<div className="space-y-2">
								<Label>Từ ngày</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="outline" className="w-full justify-start text-left">
											<CalendarIcon className="mr-2 h-4 w-4" />
											{format(fromDate, 'dd/MM/yyyy')}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={fromDate}
											onSelect={(date) => date && setFromDate(date)}
											locale={vi}
										/>
									</PopoverContent>
								</Popover>
							</div>

							{/* To Date */}
							<div className="space-y-2">
								<Label>Đến ngày</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="outline" className="w-full justify-start text-left">
											<CalendarIcon className="mr-2 h-4 w-4" />
											{format(toDate, 'dd/MM/yyyy')}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={toDate}
											onSelect={(date) => date && setToDate(date)}
											locale={vi}
										/>
									</PopoverContent>
								</Popover>
							</div>

							{/* Refresh Button */}
							<div className="flex items-end">
								<Button
									onClick={fetchRequests}
									disabled={loading}
									variant="outline"
									className="w-full"
								>
									{loading ? (
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									) : (
										<RefreshCw className="h-4 w-4 mr-2" />
									)}
									Làm mới
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Tổng yêu cầu</p>
									<p className="text-2xl font-bold text-gray-900">{filteredRequests.length}</p>
								</div>
								<div className="bg-blue-100 p-3 rounded-full">
									<FaMoneyBill className="h-6 w-6 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
									<p className="text-2xl font-bold text-yellow-600">
										{filteredRequests.filter(r => r.status === 1).length}
									</p>
								</div>
								<div className="bg-yellow-100 p-3 rounded-full">
									<Clock className="h-6 w-6 text-yellow-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Đã chấp nhận</p>
									<p className="text-2xl font-bold text-green-600">
										{filteredRequests.filter(r => r.status === 2).length}
									</p>
								</div>
								<div className="bg-green-100 p-3 rounded-full">
									<Check className="h-6 w-6 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Đã từ chối</p>
									<p className="text-2xl font-bold text-red-600">
										{filteredRequests.filter(r => r.status === 3).length}
									</p>
								</div>
								<div className="bg-red-100 p-3 rounded-full">
									<X className="h-6 w-6 text-red-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Requests Table */}
				<Card>
					<CardHeader>
						<CardTitle>Danh sách yêu cầu</CardTitle>
						<CardDescription>
							Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRequests.length)} của {filteredRequests.length} yêu cầu
						</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="space-y-3">
								{[...Array(3)].map((_, i) => (
									<div key={i} className={`h-16 rounded-md ${styles['skeleton-loading']}`} />
								))}
							</div>
						) : paginatedRequests.length === 0 ? (
							<div className="text-center py-12">
								<AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có yêu cầu nào</h3>
								<p className="text-gray-500 mb-4">Bắt đầu bằng việc tạo yêu cầu cập nhật giá đầu tiên của bạn</p>
								<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
									<DialogTrigger asChild>
										<Button className="bg-blue-600 hover:bg-blue-700 text-white">
											<Plus className="h-4 w-4 mr-2" />
											Tạo yêu cầu đầu tiên
										</Button>
									</DialogTrigger>
								</Dialog>
							</div>
						) : (
							<div className={`overflow-x-auto ${styles['custom-scrollbar']}`}>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="min-w-[140px]">Giá đề xuất</TableHead>
											<TableHead className="min-w-[120px]">Trạng thái</TableHead>
											<TableHead className="min-w-[150px]">Ngày tạo</TableHead>
											<TableHead className="min-w-[150px]">Ngày xét duyệt</TableHead>
											<TableHead className="min-w-[140px]">Người xét duyệt</TableHead>
											<TableHead className="w-[100px]">Thao tác</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{paginatedRequests.map((request) => {
											const statusInfo = statusConfig[request.status as keyof typeof statusConfig];
											const StatusIcon = statusInfo.icon;

											return (
												<TableRow key={request.id} className="hover:bg-gray-50 transition-colors">
													<TableCell className="font-medium">
														<div className="flex items-center gap-2">
															<span className="text-lg">{formatCurrency(request.requestedPrice)}</span>
															{latestApprovedPrice && request.status === 2 && request.id === latestApprovedPrice.id && (
																<Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
																	Hiện tại
																</Badge>
															)}
														</div>
													</TableCell>
													<TableCell>
														<Badge
															className={`${statusInfo.color} flex items-center gap-1 w-fit ${request.status === 1 ? styles['status-pending'] :
																request.status === 2 ? styles['status-approved'] :
																	styles['status-rejected']
																}`}
														>
															<StatusIcon className="h-3 w-3" />
															{statusInfo.label}
														</Badge>
													</TableCell>
													<TableCell className="text-gray-600">
														{formatDate(request.createdTime)}
													</TableCell>
													<TableCell className="text-gray-600">
														{request.reviewedAt ? formatDate(request.reviewedAt) : (
															<span className="text-gray-400 italic">Chưa xét duyệt</span>
														)}
													</TableCell>
													<TableCell className="text-gray-600">
														{request.reviewedByName || (
															<span className="text-gray-400 italic">-</span>
														)}
													</TableCell>
													<TableCell>
														<Button
															variant="outline"
															size="sm"
															onClick={() => {
																setSelectedRequest(request);
																setIsDetailModalOpen(true);
															}}
															className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
														>
															<Eye className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between mt-4">
								<p className="text-sm text-gray-600">
									Trang {currentPage} của {totalPages}
								</p>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
										disabled={currentPage === 1}
									>
										Trước
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
										disabled={currentPage === totalPages}
									>
										Sau
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Detail Modal */}
			<Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
				<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-blue-600" />
							Chi tiết yêu cầu
						</DialogTitle>
					</DialogHeader>
					{selectedRequest && (
						<div className="space-y-6 mt-4">
							{/* Header Info */}
							<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
									<div>
										<p className="text-sm text-gray-600 mb-1">Mã yêu cầu</p>
										<p className="font-mono text-sm font-medium">{selectedRequest.id}</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-gray-600 mb-1">Giá đề xuất</p>
										<p className="font-bold text-2xl text-blue-600">
											{formatCurrency(selectedRequest.requestedPrice)}
										</p>
									</div>
								</div>
							</div>

							{/* Status and Timeline */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<h4 className="font-semibold text-gray-900 flex items-center gap-2">
										<Clock className="h-4 w-4" />
										Trạng thái & Thời gian
									</h4>

									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
											<div className="flex-1">
												<p className="text-sm font-medium">Tạo yêu cầu</p>
												<p className="text-xs text-gray-500">{formatDate(selectedRequest.createdTime)}</p>
											</div>
										</div>

										{selectedRequest.reviewedAt && (
											<div className="flex items-center gap-3">
												<div className={`w-2 h-2 rounded-full ${selectedRequest.status === 2 ? 'bg-green-500' : 'bg-red-500'
													}`}></div>
												<div className="flex-1">
													<p className="text-sm font-medium">
														{selectedRequest.status === 2 ? 'Được phê duyệt' : 'Bị từ chối'}
													</p>
													<p className="text-xs text-gray-500">{formatDate(selectedRequest.reviewedAt)}</p>
												</div>
											</div>
										)}
									</div>

									<div className="pt-3 border-t">
										<Badge
											className={`${statusConfig[selectedRequest.status as keyof typeof statusConfig].color} flex items-center gap-2 w-fit`}
										>
											{React.createElement(statusConfig[selectedRequest.status as keyof typeof statusConfig].icon, { className: "h-4 w-4" })}
											{statusConfig[selectedRequest.status as keyof typeof statusConfig].label}
										</Badge>
									</div>
								</div>

								<div className="space-y-4">
									<h4 className="font-semibold text-gray-900 flex items-center gap-2">
										<Eye className="h-4 w-4" />
										Thông tin xét duyệt
									</h4>

									{selectedRequest.reviewedAt ? (
										<div className="space-y-3">
											<div>
												<p className="text-sm text-gray-600">Người xét duyệt</p>
												<p className="font-medium">{selectedRequest.reviewedByName}</p>
											</div>
											<div>
												<p className="text-sm text-gray-600">Thời gian xét duyệt</p>
												<p className="font-medium">{formatDate(selectedRequest.reviewedAt)}</p>
											</div>
											<div>
												<p className="text-sm text-gray-600">Thời gian xử lý</p>
												<p className="font-medium">
													{Math.ceil(
														(new Date(selectedRequest.reviewedAt).getTime() -
															new Date(selectedRequest.createdTime).getTime()) /
														(1000 * 60 * 60 * 24)
													)} ngày
												</p>
											</div>
										</div>
									) : (
										<div className="text-center py-6 text-gray-500">
											<Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
											<p>Đang chờ xét duyệt...</p>
										</div>
									)}
								</div>
							</div>

							{/* Rejection Reason */}
							{selectedRequest.rejectionReason && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4">
									<h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
										<AlertCircle className="h-4 w-4" />
										Lý do từ chối
									</h4>
									<p className="text-red-700 text-sm leading-relaxed">
										{selectedRequest.rejectionReason}
									</p>
								</div>
							)}

							{/* Price Comparison */}
							{latestApprovedPrice && selectedRequest.id !== latestApprovedPrice.id && (
								<div className="bg-gray-50 border rounded-lg p-4">
									<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
										<TrendingUp className="h-4 w-4" />
										So sánh với giá hiện tại
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
										<div className="text-center">
											<p className="text-gray-600 mb-1">Giá hiện tại</p>
											<p className="font-semibold text-green-600">
												{formatCurrency(latestApprovedPrice.requestedPrice)}
											</p>
										</div>
										<div className="text-center">
											<p className="text-gray-600 mb-1">Giá đề xuất</p>
											<p className="font-semibold text-blue-600">
												{formatCurrency(selectedRequest.requestedPrice)}
											</p>
										</div>
										<div className="text-center">
											<p className="text-gray-600 mb-1">Chênh lệch</p>
											<p className={`font-semibold ${selectedRequest.requestedPrice > latestApprovedPrice.requestedPrice
												? 'text-red-600' : selectedRequest.requestedPrice < latestApprovedPrice.requestedPrice
													? 'text-green-600' : 'text-gray-600'
												}`}>
												{selectedRequest.requestedPrice > latestApprovedPrice.requestedPrice && '+'}
												{formatCurrency(selectedRequest.requestedPrice - latestApprovedPrice.requestedPrice)}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Actions */}
							<div className="flex justify-end pt-4 border-t">
								<Button
									onClick={() => setIsDetailModalOpen(false)}
									className="bg-gray-600 hover:bg-gray-700 text-white"
								>
									Đóng
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default RequestPriceUpdate
