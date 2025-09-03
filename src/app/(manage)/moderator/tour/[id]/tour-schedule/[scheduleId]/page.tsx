'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBookingStats, TourScheduleStatisticsResponse } from '@/services/use-dashbroad'
import BreadcrumbHeader from '@/components/common/breadcrumb-header'
import {
	StatisticsHeader,
	StatisticsOverviewCards,
	BookingStatusBreakdown,
	RevenueStatistics,
	BookingsTable,
	LoadingState,
	ErrorState,
	NoDataState
} from '@/app/(manage)/components/tour-management/tourSchedule'

export default function TourScheduleStatisticsPage() {
	const params = useParams()
	const id = params?.id as string
	const scheduleId = params?.scheduleId as string
	const { getTourScheduleStatistics, loading } = useBookingStats()
	const [statistics, setStatistics] = useState<TourScheduleStatisticsResponse | null>(null)
	const [error, setError] = useState<string>('')

	useEffect(() => {
		if (scheduleId) {
			fetchStatistics()
		}
	}, [scheduleId])

	const fetchStatistics = async () => {
		try {
			setError('')
			const data = await getTourScheduleStatistics(scheduleId)
			setStatistics(data)
		} catch (err: any) {
			console.error('Error fetching tour schedule statistics:', err)
			setError(err.message || 'Có lỗi khi tải dữ liệu thống kê')
		}
	}

	const breadcrumbItems = [
		{ label: "Quản lý chuyến tham quan", href: "/moderator/tour" },
		{ label: "Chi tiết chuyến tham quan", href: `/moderator/tour/${id}` },
		{ label: "Thống kê lịch trình" },
	]

	if (loading) {
		return <LoadingState breadcrumbItems={breadcrumbItems} />
	}

	if (error) {
		return <ErrorState breadcrumbItems={breadcrumbItems} error={error} />
	}

	if (!statistics) {
		return <NoDataState breadcrumbItems={breadcrumbItems} />
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<BreadcrumbHeader items={breadcrumbItems} showBackButton={true} />
			<div className="max-w-7xl mx-auto p-6 space-y-6">
				{/* Header */}
				<StatisticsHeader tourId={id} />

				{/* Overview Stats */}
				<StatisticsOverviewCards
					totalBookings={statistics.totalBookings}
					completionRate={statistics.completionRate}
					totalRevenue={statistics.totalRevenue}
					lostRevenue={statistics.lostRevenue}
				/>

				{/* Booking Status Breakdown */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<BookingStatusBreakdown
						pendingBookings={statistics.pendingBookings}
						confirmedBookings={statistics.confirmedBookings}
						completedBookings={statistics.completedBookings}
						cancelledBookings={statistics.cancelledBookings}
					/>

					<RevenueStatistics
						confirmedRevenue={statistics.confirmedRevenue}
						completedRevenue={statistics.completedRevenue}
						totalRevenue={statistics.totalRevenue}
					/>
				</div>

				{/* Bookings Table */}
				<BookingsTable bookings={statistics.bookings} />
			</div>
		</div>
	)
}
