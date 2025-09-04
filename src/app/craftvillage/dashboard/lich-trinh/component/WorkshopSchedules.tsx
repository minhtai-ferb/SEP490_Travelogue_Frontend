"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useCraftVillage } from "@/services/use-craftvillage";
import { useUser } from "@/services/use-user";
import { getUserIdFromLocalStorage } from "@/utils";
import toast from "react-hot-toast";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Set moment locale to Vietnamese
moment.locale('vi');

const localizer = momentLocalizer(moment);

function generateEventsFromCraftVillageInfo(craftVillageInfo: any): any[] {
	if (!craftVillageInfo?.craftVillage?.workshop) return [];
	const { workshop } = craftVillageInfo.craftVillage;
	const events: any[] = [];

	// 1. schedules: direct mapping
	if (Array.isArray(workshop.schedules)) {
		for (const s of workshop.schedules) {
			if (!s.startTime || !s.endTime) continue;
			events.push({
				id: s.id,
				title: workshop.name || 'Workshop',
				start: new Date(s.startTime),
				end: new Date(s.endTime),
				resource: {
					capacity: s.capacity,
					description: s.description,
					...s
				}
			});
		}
	}

	// 2. recurringRules: generate for next 2 weeks
	if (Array.isArray(workshop.recurringRules)) {
		const now = moment().startOf('day');
		const endDate = moment(now).add(14, 'days');
		for (const rule of workshop.recurringRules) {
			const { daysOfWeek, sessions, id, capacity, description } = rule;
			if (!Array.isArray(daysOfWeek) || !Array.isArray(sessions)) continue;
			for (let d = moment(now); d.isBefore(endDate); d.add(1, 'day')) {
				if (daysOfWeek.includes(d.day())) { // 0: Sunday, 1: Monday, ...
					for (const session of sessions) {
						// session: { startTime: '09:00', endTime: '11:00' }
						if (!session.startTime || !session.endTime) continue;
						const start = moment(d).set({
							hour: Number(session.startTime.split(':')[0]),
							minute: Number(session.startTime.split(':')[1]),
							second: 0,
							millisecond: 0
						});
						const end = moment(d).set({
							hour: Number(session.endTime.split(':')[0]),
							minute: Number(session.endTime.split(':')[1]),
							second: 0,
							millisecond: 0
						});
						events.push({
							id: `${id || 'rec'}-${d.format('YYYYMMDD')}-${session.startTime}`,
							title: workshop.name || 'Workshop',
							start: start.toDate(),
							end: end.toDate(),
							resource: {
								capacity,
								description,
								...rule
							}
						});
					}
				}
			}
		}
	}
	return events;
}

function WorkshopSchedules() {
	const userId = getUserIdFromLocalStorage();
	const { getCraftVillageInfo } = useCraftVillage();
	const { getUserDetail } = useUser();

	const [user, setUser] = useState<any>(null);
	const [craftVillageInfo, setCraftVillageInfo] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [selectedEvent, setSelectedEvent] = useState<any>(null);
	const [showDialog, setShowDialog] = useState(false);
	const [currentView, setCurrentView] = useState<any>(Views.MONTH);
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		if (userId) {
			getUserDetail(userId).then((data) => {
				setUser(data);
			});
		}
	}, [userId]);

	const getCraftVillageInfoDetail = async () => {
		const craftVillageId = user?.craftVillagesInfo?.id;
		if (craftVillageId) {
			try {
				setLoading(true);
				const response = await getCraftVillageInfo(craftVillageId);
				setCraftVillageInfo(response);
				setLoading(false);
				toast.success("Tải thông tin làng nghề thành công", {
					duration: 2000,
					position: 'top-center',
					style: {
						background: '#333',
						color: '#fff',
					},
				});
			} catch (error) {
				setLoading(false);
				toast.error("Không thể tải thông tin làng nghề", {
					duration: 3000,
					position: 'top-center',
					style: {
						background: '#c00',
						color: '#fff',
					},
				});
			}
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		getCraftVillageInfoDetail();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const events = useMemo(() => generateEventsFromCraftVillageInfo(craftVillageInfo), [craftVillageInfo]);

	const handleSelectEvent = (event: any) => {
		setSelectedEvent(event);
		setShowDialog(true);
	};

	const handleViewChange = (view: any) => {
		setCurrentView(view);
	};

	const handleNavigate = (date: Date) => {
		setCurrentDate(date);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header với actions */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
				<div>
					<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
						Lịch trình Workshop Làng nghề
					</h1>
					<p className="text-gray-600">Quản lý và xem lịch trình các workshop trong làng nghề</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<button
						onClick={() => getCraftVillageInfoDetail()}
						disabled={loading}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						{loading ? 'Đang tải...' : 'Làm mới'}
					</button>
					<button
						onClick={() => window.print()}
						className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
					>
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
						</svg>
						In lịch
					</button>
					<button
						onClick={() => setCurrentDate(new Date())}
						className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
					>
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						Hôm nay
					</button>
				</div>
			</div>

			{/* Stats cards */}
			{events.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow border p-6">
						<div className="flex items-center">
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-600">Tổng số sự kiện</p>
								<p className="text-3xl font-bold text-gray-900">{events.length}</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow border p-6">
						<div className="flex items-center">
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-600">Tuần này</p>
								<p className="text-3xl font-bold text-gray-900">
									{events.filter(e => {
										const eventDate = moment(e.start);
										return eventDate.isSame(moment(), 'week');
									}).length}
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
								<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow border p-6">
						<div className="flex items-center">
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-600">Hôm nay</p>
								<p className="text-3xl font-bold text-gray-900">
									{events.filter(e => moment(e.start).isSame(moment(), 'day')).length}
								</p>
							</div>
							<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
								<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Calendar */}
			{loading ? (
				<div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow border">
					<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
					<p className="text-lg font-medium text-gray-700 mb-2">Đang tải dữ liệu lịch trình...</p>
					<p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
				</div>
			) : events.length > 0 ? (
				<div className="bg-white rounded-lg shadow-lg border overflow-hidden">
					{/* Calendar toolbar */}
					<div className="border-b bg-gray-50 px-6 py-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div className="flex items-center space-x-2">
								<span className="text-sm text-gray-600">Xem theo:</span>
								<div className="flex bg-white rounded-lg border">
									<button
										onClick={() => setCurrentView(Views.MONTH)}
										className={`px-3 py-1 text-sm rounded-l-lg transition-colors ${currentView === Views.MONTH
											? 'bg-blue-600 text-white'
											: 'hover:bg-blue-50 text-gray-700'
											}`}
									>
										Tháng
									</button>
									<button
										onClick={() => setCurrentView(Views.WEEK)}
										className={`px-3 py-1 text-sm border-l transition-colors ${currentView === Views.WEEK
											? 'bg-blue-600 text-white'
											: 'hover:bg-blue-50 text-gray-700'
											}`}
									>
										Tuần
									</button>
									<button
										onClick={() => setCurrentView(Views.DAY)}
										className={`px-3 py-1 text-sm border-l transition-colors ${currentView === Views.DAY
											? 'bg-blue-600 text-white'
											: 'hover:bg-blue-50 text-gray-700'
											}`}
									>
										Ngày
									</button>
									<button
										onClick={() => setCurrentView(Views.AGENDA)}
										className={`px-3 py-1 text-sm border-l rounded-r-lg transition-colors ${currentView === Views.AGENDA
											? 'bg-blue-600 text-white'
											: 'hover:bg-blue-50 text-gray-700'
											}`}
									>
										Danh sách
									</button>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-sm text-gray-600">Tổng: <span className="font-semibold">{events.length} sự kiện</span></span>
								<span className="text-sm text-gray-400">•</span>
								<span className="text-sm text-gray-500">Hiển thị 2 tuần tới</span>
							</div>
						</div>
					</div>

					{/* Calendar component */}
					<div className="p-6">
						<Calendar
							localizer={localizer}
							events={events}
							startAccessor="start"
							endAccessor="end"
							style={{ height: 650 }}
							view={currentView}
							onView={handleViewChange}
							date={currentDate}
							onNavigate={handleNavigate}
							onSelectEvent={handleSelectEvent}
							popup
							eventPropGetter={(event) => ({
								style: {
									backgroundColor: event.resource?.capacity > 20 ? '#10b981' : event.resource?.capacity > 10 ? '#f59e0b' : '#ef4444',
									borderRadius: '6px',
									border: 'none',
									color: 'white',
									fontWeight: '500',
									fontSize: '13px'
								}
							})}
							messages={{
								next: 'Sau',
								previous: 'Trước',
								today: 'Hôm nay',
								month: 'Tháng',
								week: 'Tuần',
								day: 'Ngày',
								agenda: 'Danh sách',
								date: 'Ngày',
								time: 'Thời gian',
								event: 'Sự kiện',
								allDay: 'Cả ngày',
								work_week: 'Tuần làm việc',
								yesterday: 'Hôm qua',
								tomorrow: 'Ngày mai',
								noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này',
								showMore: (total) => `+${total} sự kiện khác`,
							}}
						/>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-96 text-center bg-white rounded-lg shadow border">
					<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
						<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
					<h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có lịch trình workshop</h3>
					<p className="text-gray-500 mb-6">Hiện tại chưa có lịch trình nào cho workshop trong 2 tuần tới.</p>
					<button
						onClick={() => getCraftVillageInfoDetail()}
						className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Tải lại dữ liệu
					</button>
				</div>
			)}

			{/* Modal chi tiết event - Interactive & Enhanced */}
			{showDialog && selectedEvent && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						{/* Backdrop */}
						<div
							className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
							onClick={() => setShowDialog(false)}
						/>

						{/* Modal */}
						<div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							{/* Header */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center">
									<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
										<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
								</div>
								<button
									onClick={() => setShowDialog(false)}
									className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
								>
									<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							{/* Content */}
							<div className="space-y-4">
								{/* Time */}
								<div className="flex items-start">
									<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
										<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">Thời gian</p>
										<p className="text-sm text-gray-600">
											{moment(selectedEvent.start).format('dddd, DD/MM/YYYY [lúc] HH:mm')}
											{' - '}
											{moment(selectedEvent.end).format('HH:mm')}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Thời lượng: {moment(selectedEvent.end).diff(moment(selectedEvent.start), 'hours')}h {moment(selectedEvent.end).diff(moment(selectedEvent.start), 'minutes') % 60}m
										</p>
									</div>
								</div>

								{/* Capacity */}
								<div className="flex items-start">
									<div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
										<svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
										</svg>
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">Sức chứa</p>
										<div className="flex items-center">
											<p className="text-sm text-gray-600">{selectedEvent.resource?.capacity || 'Không rõ'} người</p>
											{selectedEvent.resource?.capacity && (
												<span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${selectedEvent.resource.capacity > 20
													? 'bg-green-100 text-green-800'
													: selectedEvent.resource.capacity > 10
														? 'bg-yellow-100 text-yellow-800'
														: 'bg-red-100 text-red-800'
													}`}>
													{selectedEvent.resource.capacity > 20 ? 'Lớn' : selectedEvent.resource.capacity > 10 ? 'Vừa' : 'Nhỏ'}
												</span>
											)}
										</div>
									</div>
								</div>

								{/* Description */}
								<div className="flex items-start">
									<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
										<svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">Mô tả</p>
										<p className="text-sm text-gray-600">
											{selectedEvent.resource?.description || 'Chưa có mô tả chi tiết cho workshop này.'}
										</p>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
								<button
									onClick={() => {
										// Copy event details to clipboard
										const eventText = `${selectedEvent.title}\nThời gian: ${moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')} - ${moment(selectedEvent.end).format('HH:mm')}\nSức chứa: ${selectedEvent.resource?.capacity || 'N/A'}\nMô tả: ${selectedEvent.resource?.description || 'N/A'}`;
										navigator.clipboard.writeText(eventText);
										toast.success('Đã sao chép thông tin sự kiện!');
									}}
									className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
								>
									<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
									Sao chép
								</button>
								<button
									onClick={() => setShowDialog(false)}
									className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
								>
									Đóng
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default WorkshopSchedules;
