"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/DateRangePicker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPriceSimple } from "@/utils/format"
import { formatDate } from "date-fns"
import { Calendar, Filter, TrendingDown } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface WithdrawalRequest {
	id: string
	amount: number
	status: number
	statusText: string
	requestTime?: string
	createdAt?: string
	date?: string
	bankAccount?: {
		bankName: string
		bankOwnerName: string
		bankAccountNumber: string
	}
}

interface Props {
	withdrawalRequests: WithdrawalRequest[]
	status: string | number
	setStatus: (status: string | number) => void
	fromDate: string
	setFromDate: (date: string) => void
	toDate: string
	setToDate: (date: string) => void
	onRefresh: () => void
	loading?: boolean
}

const statusConfig = {
	1: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800 border-amber-200" },
	2: { label: "Đã xác nhận", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
	3: { label: "Đã từ chối", color: "bg-red-100 text-red-800 border-red-200" },
}

export function WithdrawalCard({
	withdrawalRequests,
	status,
	setStatus,
	fromDate,
	setFromDate,
	toDate,
	setToDate,
	onRefresh,
	loading = false,
}: Props) {
	const totalAmount = withdrawalRequests?.reduce((sum, wr) => sum + (wr.amount || 0), 0) || 0
	const pendingCount = withdrawalRequests?.filter((wr) => wr.status === 1).length || 0

	// Handle date range picker
	const handleDateRangeSelect = (range: DateRange | undefined) => {
		if (range?.from) {
			setFromDate(range.from.toISOString().slice(0, 10))
		} else {
			setFromDate("")
		}

		if (range?.to) {
			setToDate(range.to.toISOString().slice(0, 10))
		} else {
			setToDate("")
		}
	}

	const dateRange: DateRange | undefined =
		fromDate && toDate
			? { from: new Date(fromDate), to: new Date(toDate) }
			: fromDate
				? { from: new Date(fromDate), to: undefined }
				: undefined

	return (
		<>
			<style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

			<Card className="overflow-hidden flex flex-col h-[600px]">
				{/* Header with Stats */}
				<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex-shrink-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<TrendingDown className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-900">Yêu cầu rút tiền</h3>
								<div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
									<span>{withdrawalRequests?.length || 0} yêu cầu</span>
									<span>•</span>
									<span className="font-medium text-blue-600">{formatPriceSimple(totalAmount)}</span>
									{pendingCount > 0 && (
										<>
											<span>•</span>
											<Badge variant="secondary" className="bg-amber-100 text-amber-700">
												{pendingCount} chờ duyệt
											</Badge>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</CardHeader>

				{/* Enhanced Filters with Beautiful Date Pickers */}
				<div className="p-4 bg-gray-50/50 border-b flex-shrink-0">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{/* Status Filter */}
						<div className="space-y-1">
							<label className="text-xs font-medium text-gray-600 flex items-center gap-1">
								<Filter className="w-3 h-3" />
								Trạng thái
							</label>
							<Select
								value={status?.toString() || "all"}
								onValueChange={(value) => setStatus(value === "all" ? "all" : Number(value))}
							>
								<SelectTrigger className="h-9 w-full">
									<SelectValue placeholder="Chọn trạng thái" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả trạng thái</SelectItem>
									<SelectItem value="1">Chờ xác nhận</SelectItem>
									<SelectItem value="2">Đã xác nhận</SelectItem>
									<SelectItem value="3">Đã từ chối</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Date Range Picker */}
						<div className="space-y-1">
							<label className="text-xs font-medium text-gray-600 flex items-center gap-1">
								<Calendar className="w-3 h-3" />
								Khoảng thời gian
							</label>
							<DateRangePicker
								dateRange={dateRange}
								onSelect={handleDateRangeSelect}
								placeholder="Chọn khoảng thời gian"
								className="h-9"
							/>
						</div>
					</div>
				</div>

				{/* Scrollable Content */}
				<div className="flex-1 overflow-hidden">
					{withdrawalRequests?.length ? (
						<ScrollArea className="h-full">
							<div className="divide-y divide-gray-100">
								{withdrawalRequests.map((wr, index) => (
									<Dialog key={wr.id}>
										<DialogTrigger asChild>
											<div
												className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 group relative overflow-hidden"
												style={{
													animationDelay: `${index * 50}ms`,
													animation: "fadeInUp 0.5s ease-out forwards",
												}}
											>
												{/* Subtle gradient overlay on hover */}
												<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/0 to-transparent group-hover:via-blue-50/50 transition-all duration-500 opacity-0 group-hover:opacity-100" />

												<div className="flex items-center justify-between relative z-10">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-2">
															<Badge
																variant="outline"
																className={`${statusConfig[wr.status as keyof typeof statusConfig]?.color} transition-all duration-200 group-hover:scale-105`}
															>
																{wr.statusText}
															</Badge>
															<span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
																{formatDate(wr.requestTime || wr.createdAt || wr.date || "", "dd/MM/yyyy HH:mm")}
															</span>
														</div>
														<div className="font-medium text-gray-900 truncate group-hover:text-blue-900 transition-colors">
															{wr?.bankAccount?.bankOwnerName} • {wr?.bankAccount?.bankName}
														</div>
														<div className="text-sm text-gray-500 font-mono group-hover:text-gray-600 transition-colors">
															•••• {String(wr?.bankAccount?.bankAccountNumber || "").slice(-4)}
														</div>
													</div>
													<div className="text-right ml-4">
														<div className="font-semibold text-lg text-blue-600 group-hover:text-blue-700 group-hover:scale-105 transition-all duration-200">
															{formatPriceSimple(wr.amount || 0)}
														</div>
													</div>
												</div>

												{/* Animated border bottom */}
												<div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 w-0 group-hover:w-full transition-all duration-500" />
											</div>
										</DialogTrigger>

										<DialogContent className="sm:max-w-md">
											<DialogHeader>
												<DialogTitle className="flex items-center gap-2">
													Chi tiết yêu cầu rút tiền
													<Badge
														variant="outline"
														className={statusConfig[wr.status as keyof typeof statusConfig]?.color}
													>
														{wr.statusText}
													</Badge>
												</DialogTitle>
											</DialogHeader>

											<div className="space-y-4">
												{/* Amount */}
												<div className="text-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
													<div className="text-2xl font-bold text-blue-600">{formatPriceSimple(wr.amount || 0)}</div>
													<div className="text-sm text-gray-600 mt-1">
														{formatDate(wr.requestTime || wr.createdAt || wr.date || "", "HH:mm - dd/MM/yyyy")}
													</div>
												</div>

												{/* Bank Card */}
												<div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden shadow-lg">
													<div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
													<div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full -ml-6 -mb-6" />
													<div className="relative z-10">
														<div className="text-sm text-blue-100 mb-1">{wr?.bankAccount?.bankName}</div>
														<div className="text-lg font-semibold mb-2">{wr?.bankAccount?.bankOwnerName}</div>
														<div className="text-base font-mono tracking-wider">
															{String(wr?.bankAccount?.bankAccountNumber)}
														</div>
													</div>
												</div>
											</div>
										</DialogContent>
									</Dialog>
								))}
							</div>

							{/* Scroll indicator */}
							<div className="flex justify-center py-2">
								<div className="w-8 h-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-50" />
							</div>
						</ScrollArea>
					) : (
						<div className="flex-1 flex items-center justify-center p-8">
							<div className="text-center">
								<div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<TrendingDown className="w-8 h-8 text-blue-400" />
								</div>
								<div className="text-gray-500 font-medium">Chưa có yêu cầu rút tiền</div>
								<div className="text-sm text-gray-400 mt-1">Các yêu cầu rút tiền sẽ hiển thị tại đây</div>
							</div>
						</div>
					)}
				</div>
			</Card>
		</>
	)
}
