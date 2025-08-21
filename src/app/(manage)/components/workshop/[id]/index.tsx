'use client'

import { useWorkshop } from '@/services/use-workshop'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import StatusBadge from '@/app/craftvillage/dashboard/workshop/molecules/StatusBadge'
import { Loader2 } from 'lucide-react'

function formatTimespan(ts?: any): string {
	if (!ts) return ''
	const h = String(ts.hours ?? 0).padStart(2, '0')
	const m = String(ts.minutes ?? 0).padStart(2, '0')
	return `${h}:${m}`
}

function WorkShopView({ href }: { href: string }) {
	const { id } = useParams()
	const { getWorkshopDetail, loading } = useWorkshop()
	const [workshop, setWorkshop] = useState<any>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await getWorkshopDetail(id as string)
				setWorkshop(res)
			} catch (error) {
				toast.error('Lỗi khi lấy chi tiết workshop')
			}
		}
		if (id) run()
	}, [getWorkshopDetail, id])

	const thumbnail = useMemo(() => {
		const medias: any[] = workshop?.medias || []
		const thumb = medias.find((m) => m.isThumbnail)
		return thumb?.mediaUrl || medias[0]?.mediaUrl || ''
	}, [workshop])

	if (loading && !workshop) {
		return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" /></div>
	}

	if (!workshop) return <div className="text-center text-sm text-gray-500 py-10">Không tìm thấy workshop</div>

	return (
		<div className="space-y-6">
			<Card>
				<CardContent className="p-0">
					<div className="relative">
						<div className="aspect-[16/6] bg-gray-100 overflow-hidden">
							{thumbnail ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={thumbnail} alt={workshop.name} className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
							)}
						</div>
						<div className="p-4 md:p-6">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h1 className="text-xl md:text-2xl font-semibold mb-2">{workshop.name}</h1>
									<div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
										<StatusBadge status={workshop.status} text={workshop.statusText} />
										{workshop.craftVillageName && <span>• {workshop.craftVillageName}</span>}
										<span>• Đánh giá: {Number(workshop.averageRating || 0).toFixed(1)} ({workshop.totalReviews || 0})</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Gallery */}
			<Card>
				<CardHeader>
					<CardTitle>Thư viện ảnh</CardTitle>
				</CardHeader>
				<CardContent>
					{Array.isArray(workshop.medias) && workshop.medias.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							{workshop.medias.map((m: any, idx: number) => (
								<div key={idx} className="aspect-video bg-gray-100 overflow-hidden rounded-md border">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={m.mediaUrl} alt={workshop.name} className="w-full h-full object-cover" />
								</div>
							))}
						</div>
					) : (
						<div className="text-sm text-gray-500">Chưa có hình ảnh</div>
					)}
				</CardContent>
			</Card>

			{/* Tabs */}
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Tổng quan</TabsTrigger>
					<TabsTrigger value="activities">Hoạt động</TabsTrigger>
					<TabsTrigger value="schedules">Lịch trình</TabsTrigger>
					<TabsTrigger value="promotions">Khuyến mãi</TabsTrigger>
					<TabsTrigger value="reviews">Đánh giá</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<Card>
						<CardHeader>
							<CardTitle>Giới thiệu</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<div className="text-sm text-gray-500 mb-1">Mô tả</div>
								<div>{workshop.description}</div>
							</div>
							<div>
								<div className="text-sm text-gray-500 mb-1">Nội dung</div>
								<div className="prose max-w-none whitespace-pre-line">{workshop.content}</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="activities">
					<Card>
						<CardHeader>
							<CardTitle>Hoạt động</CardTitle>
						</CardHeader>
						<CardContent>
							{Array.isArray(workshop.days) && workshop.days.length > 0 ? (
								<div className="space-y-6">
									{workshop.days.map((day: any, idx: number) => (
										<div key={idx} className="space-y-3">
											<div className="font-semibold">Ngày {day.dayNumber}</div>
											<div className="space-y-3">
												{day.activities?.map((a: any) => (
													<div key={a.id} className="border-l-2 border-blue-200 pl-3">
														<div className="text-sm text-gray-500">{a.startTimeFormatted} - {a.endTimeFormatted} • {a.duration}</div>
														<div className="font-medium">{a.activity}</div>
														{a.description && <div className="text-sm text-gray-600">{a.description}</div>}
														{a.notes && <div className="text-xs text-gray-500">Ghi chú: {a.notes}</div>}
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							) : Array.isArray(workshop.activities) && workshop.activities.length > 0 ? (
								<div className="space-y-3">
									{workshop.activities.map((a: any) => (
										<div key={a.activityId} className="border-l-2 border-blue-200 pl-3">
											<div className="text-sm text-gray-500">{formatTimespan(a.startTime)} - {formatTimespan(a.endTime)}</div>
											<div className="font-medium">{a.activity}</div>
											{a.description && <div className="text-sm text-gray-600">{a.description}</div>}
											{a.notes && <div className="text-xs text-gray-500">Ghi chú: {a.notes}</div>}
										</div>
									))}
								</div>
							) : (
								<div className="text-sm text-gray-500">Chưa có hoạt động</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="schedules">
					<Card>
						<CardHeader>
							<CardTitle>Lịch trình</CardTitle>
						</CardHeader>
						<CardContent>
							{Array.isArray(workshop.schedules) && workshop.schedules.length > 0 ? (
								<div className="rounded-md border overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Bắt đầu</TableHead>
												<TableHead>Kết thúc</TableHead>
												<TableHead>Tối đa</TableHead>
												<TableHead>Đã đặt</TableHead>
												<TableHead>Giá NL</TableHead>
												<TableHead>Giá TE</TableHead>
												<TableHead>Ghi chú</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{workshop.schedules.map((s: any) => (
												<TableRow key={s.scheduleId}>
													<TableCell>{s.startTime}</TableCell>
													<TableCell>{s.endTime}</TableCell>
													<TableCell>{s.maxParticipant}</TableCell>
													<TableCell>{s.currentBooked}</TableCell>
													<TableCell>{s.adultPrice?.toLocaleString('vi-VN')}</TableCell>
													<TableCell>{s.childrenPrice?.toLocaleString('vi-VN')}</TableCell>
													<TableCell>{s.notes}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							) : (
								<div className="text-sm text-gray-500">Chưa có lịch</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="promotions">
					<Card>
						<CardHeader>
							<CardTitle>Khuyến mãi</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{Array.isArray(workshop.promotions) && workshop.promotions.length > 0 ? (
								workshop.promotions.map((p: any) => (
									<div key={p.id} className="border rounded-md p-3">
										<div className="font-medium">{p.name}</div>
										<div className="text-sm text-gray-600">{p.description}</div>
										<div className="text-xs text-gray-500">{p.startDate} - {p.endDate}</div>
									</div>
								))
							) : (
								<div className="text-sm text-gray-500">Chưa có khuyến mãi</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="reviews">
					<Card>
						<CardHeader>
							<CardTitle>Đánh giá ({workshop.totalReviews || 0})</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{Array.isArray(workshop.reviews) && workshop.reviews.length > 0 ? (
								workshop.reviews.map((r: any) => (
									<div key={r.id} className="border rounded-md p-3">
										<div className="text-sm font-medium">{r.userName}</div>
										<div className="text-xs text-gray-500">{r.createdAt}</div>
										<div className="mt-1">{r.comment}</div>
									</div>
								))
							) : (
								<div className="text-sm text-gray-500">Chưa có đánh giá</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default WorkShopView;
