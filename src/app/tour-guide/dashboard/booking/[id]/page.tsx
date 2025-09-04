"use client";

import { useBookings } from "@/services/use-bookings";
import {
	ArrowLeftOutlined,
	CalendarOutlined,
	CompassOutlined,
	DollarOutlined,
	EnvironmentOutlined,
	EyeOutlined,
	MailOutlined,
	PhoneOutlined,
	TeamOutlined,
	UserOutlined
} from "@ant-design/icons";
import {
	Alert,
	Button,
	Card,
	Descriptions,
	Divider,
	Space,
	Spin,
	Table,
	Tag,
} from "antd";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types
interface Participant {
	id: string;
	bookingId: string;
	type: number;
	quantity: number;
	pricePerParticipant: number;
	fullName: string;
	gender: number;
	genderText: string;
	dateOfBirth: string;
}

interface BookingDetailData {
	id: string;
	userId: string;
	userName: string;
	tourId: string | null;
	tourName: string | null;
	tourScheduleId: string | null;
	departureDate: string | null;
	tourGuideId: string | null;
	tourGuideName: string | null;
	tripPlanId: string | null;
	tripPlanName: string | null;
	workshopId: string | null;
	workshopName: string | null;
	workshopScheduleId: string | null;
	paymentLinkId: string;
	status: number;
	statusText: string;
	bookingType: number;
	bookingTypeText: string;
	bookingDate: string;
	startDate: string;
	endDate: string;
	cancelledAt: string | null;
	promotionId: string | null;
	originalPrice: number;
	discountAmount: number;
	finalPrice: number;
	contactName: string;
	contactEmail: string;
	contactPhone: string;
	contactAddress: string;
	participants: Participant[];
}

export default function TourGuideBookingDetail() {
	const params = useParams();
	const router = useRouter();
	const { getBookingById, loading } = useBookings();

	const [booking, setBooking] = useState<BookingDetailData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const bookingId = params?.id as string;

	useEffect(() => {
		if (bookingId) {
			fetchBookingDetail();
		}
	}, [bookingId]);

	const fetchBookingDetail = async () => {
		try {
			setError(null);
			const data = await getBookingById(bookingId);
			console.log("Booking data:", data);

			if (data) {
				setBooking(data);
			} else {
				setError("Không tìm thấy thông tin đặt chỗ");
			}
		} catch (error) {
			console.error("Error fetching booking detail:", error);
			setError("Có lỗi xảy ra khi tải thông tin đặt chỗ");
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};

	const handleBackToList = () => {
		router.push("/tour-guide/dashboard/lich-trinh");
	};

	const handleViewTour = () => {
		if (!booking?.tourId) return;
		router.push(`/tour-guide/dashboard/tour/${booking.tourId}`);
	};

	const formatDateTime = (dateString: string) => {
		return dayjs(dateString).format("DD/MM/YYYY HH:mm");
	};

	const formatDate = (dateString: string) => {
		return dayjs(dateString).format("DD/MM/YYYY");
	};

	const getStatusTag = (status: number, statusText: string) => {
		const map: Record<number, { color: string; text: string }> = {
			0: { color: "gold", text: statusText || "Đang chờ thanh toán" },
			1: { color: "blue", text: statusText || "Đã thanh toán" },
			2: { color: "red", text: statusText || "Bị hủy chưa thanh toán" },
			3: { color: "red", text: statusText || "Bị hủy đã thanh toán" },
			4: { color: "red", text: statusText || "Bị hủy bởi nhà cung cấp" },
			5: { color: "green", text: statusText || "Đã hoàn thành" },
			6: { color: "default", text: statusText || "Hết hạn" },
		};
		const s = map[status] ?? { color: "default", text: statusText ?? "—" };
		return <Tag color={s.color}>{s.text}</Tag>;
	};

	const participantColumns = [
		{
			title: "STT",
			key: "index",
			render: (_: any, __: any, index: number) => index + 1,
			width: 60,
		},
		{
			title: "Họ tên",
			dataIndex: "fullName",
			key: "fullName",
		},
		{
			title: "Giới tính",
			dataIndex: "genderText",
			key: "genderText",
			width: 100,
		},
		{
			title: "Ngày sinh",
			dataIndex: "dateOfBirth",
			key: "dateOfBirth",
			render: (date: string) => formatDate(date),
		},
		{
			title: "Số lượng",
			dataIndex: "quantity",
			key: "quantity",
			width: 80,
		},
		{
			title: "Giá/người",
			dataIndex: "pricePerParticipant",
			key: "pricePerParticipant",
			render: (price: number) => formatPrice(price),
		},
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Spin size="large" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<Alert
					message="Lỗi"
					description={error}
					type="error"
					showIcon
					action={
						<Space>
							<Button size="small" onClick={handleBackToList}>
								Quay lại
							</Button>
							<Button size="small" type="primary" onClick={fetchBookingDetail}>
								Thử lại
							</Button>
						</Space>
					}
				/>
			</div>
		);
	}

	if (!booking) {
		return (
			<div className="p-6">
				<Alert
					message="Không tìm thấy"
					description="Không tìm thấy thông tin đặt chỗ"
					type="warning"
					showIcon
					action={
						<Button size="small" onClick={handleBackToList}>
							Quay lại
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<Button
						onClick={handleBackToList}
						icon={<ArrowLeftOutlined />}
						className="mb-2"
					>
						Quay lại lịch trình
					</Button>
					<div className="flex items-center gap-2">
						<Tag color="blue" className="font-mono text-sm">
							#{booking.id.slice(-8)}
						</Tag>
						{getStatusTag(booking.status, booking.statusText)}
					</div>
				</div>
				<div>
					<h1 className="text-3xl font-bold mb-2 text-gray-900">
						{booking.bookingType === 3
							? "Chi tiết đặt hướng dẫn viên"
							: "Chi tiết đặt chỗ tour"
						}
					</h1>
					<p className="text-gray-600">
						{booking.bookingType === 3
							? "Thông tin chi tiết về yêu cầu thuê hướng dẫn viên cá nhân"
							: "Xem thông tin chi tiết về booking và khách hàng của bạn"
						}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				{/* Main Content */}
				<div className="xl:col-span-3 space-y-6">
					{/* Booking Information - Dynamic based on booking type */}
					<Card
						title={
							<div className="flex items-center gap-2">
								<CompassOutlined className="text-blue-600" />
								<span>
									{booking.bookingType === 3
										? "Thông tin thuê hướng dẫn viên"
										: "Thông tin chuyến tham quan"
									}
								</span>
							</div>
						}
						className="shadow-sm"
					>
						<Descriptions column={2} size="middle">
							{/* Show Trip Plan info for Tour Guide bookings */}
							{booking.bookingType === 3 && booking.tripPlanId ? (
								<Descriptions.Item label="Kế hoạch chuyến đi">
									<div className="flex items-center gap-2">
										<strong className="text-lg text-purple-600">
											{booking.tripPlanName || "Hành trình cá nhân"}
										</strong>
										<Tag color="purple" className="text-xs">
											Chuyến đi riêng
										</Tag>
									</div>
								</Descriptions.Item>
							) : (
								<Descriptions.Item label="Tên tour">
									<div className="flex items-center gap-2">
										<strong className="text-lg">{booking.tourName || "Chưa có"}</strong>
										{booking.tourId && (
											<Button
												type="link"
												size="small"
												onClick={handleViewTour}
												className="flex items-center gap-1 p-0 h-auto"
											>
												<EyeOutlined /> Xem chi tiết
											</Button>
										)}
									</div>
								</Descriptions.Item>
							)}

							<Descriptions.Item label="Loại dịch vụ">
								<Tag
									color={booking.bookingType === 3 ? "purple" : "blue"}
									className="text-sm"
								>
									{booking.bookingTypeText}
								</Tag>
							</Descriptions.Item>

							<Descriptions.Item label="Hướng dẫn viên">
								<div className="flex items-center gap-2">
									<strong className="text-blue-600">
										{booking.tourGuideName || "Chưa phân công"}
									</strong>
									<Tag color="green" className="text-xs">
										Đã chỉ định
									</Tag>
								</div>
							</Descriptions.Item>

							<Descriptions.Item label="Khách hàng">
								<strong className="text-orange-600">
									{booking.userName || booking.contactName}
								</strong>
							</Descriptions.Item>

							<Descriptions.Item label="Ngày đặt">
								{formatDateTime(booking.bookingDate)}
							</Descriptions.Item>

							{/* Show departure date only if exists (for regular tours) */}
							{booking.departureDate && (
								<Descriptions.Item label="Ngày khởi hành">
									<div className="flex items-center gap-2">
										<CalendarOutlined className="text-green-600" />
										<strong className="text-green-600">
											{formatDateTime(booking.departureDate)}
										</strong>
									</div>
								</Descriptions.Item>
							)}

							<Descriptions.Item label="Thời gian dịch vụ" span={booking.departureDate ? 1 : 2}>
								<div className="bg-green-50 p-3 rounded-lg">
									<div className="text-sm">
										<div className="flex items-center gap-2 mb-1">
											<CalendarOutlined className="text-green-600" />
											<span className="font-medium">Bắt đầu:</span>
											<strong className="text-green-600">
												{formatDateTime(booking.startDate)}
											</strong>
										</div>
										<div className="flex items-center gap-2">
											<CalendarOutlined className="text-orange-600" />
											<span className="font-medium">Kết thúc:</span>
											<strong className="text-orange-600">
												{formatDateTime(booking.endDate)}
											</strong>
										</div>
									</div>
								</div>
							</Descriptions.Item>

							{booking.cancelledAt && (
								<Descriptions.Item label="Ngày hủy" span={2}>
									<span className="text-red-600 font-medium">
										{formatDateTime(booking.cancelledAt)}
									</span>
								</Descriptions.Item>
							)}
						</Descriptions>
					</Card>

					{/* Participants List */}
					<Card
						title={
							<div className="flex items-center gap-2">
								<TeamOutlined className="text-green-600" />
								<span>
									Danh sách khách tham gia ({booking.participants.length} người)
								</span>
							</div>
						}
						className="shadow-sm"
					>
						<Table
							dataSource={booking.participants}
							columns={participantColumns}
							rowKey="id"
							size="middle"
							pagination={false}
							scroll={{ x: true }}
							className="rounded-lg"
						/>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Contact Information */}
					<Card
						title={
							<div className="flex items-center gap-2">
								<UserOutlined className="text-purple-600" />
								<span>Thông tin khách hàng</span>
							</div>
						}
						className="shadow-sm"
					>
						<div className="space-y-4">
							<div>
								<div className="text-sm text-gray-500 mb-1">Tên khách hàng</div>
								<div className="font-semibold text-lg">{booking.contactName}</div>
							</div>
							<div>
								<div className="text-sm text-gray-500 mb-1">Email liên hệ</div>
								<div className="flex items-center gap-2">
									<MailOutlined className="text-blue-500" />
									<a
										href={`mailto:${booking.contactEmail}`}
										className="text-blue-600 hover:underline break-all"
									>
										{booking.contactEmail}
									</a>
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-500 mb-1">Số điện thoại</div>
								<div className="flex items-center gap-2">
									<PhoneOutlined className="text-green-500" />
									<a
										href={`tel:${booking.contactPhone}`}
										className="text-green-600 hover:underline font-medium"
									>
										{booking.contactPhone}
									</a>
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-500 mb-1">Địa chỉ</div>
								<div className="flex items-start gap-2">
									<EnvironmentOutlined className="text-red-500 mt-1 text-xs" />
									<span className="text-sm leading-relaxed">{booking.contactAddress}</span>
								</div>
							</div>
						</div>
					</Card>

					{/* Quick Actions */}
					<Card
						title={
							<div className="flex items-center gap-2">
								<span>Thao tác nhanh</span>
							</div>
						}
						className="shadow-sm"
					>
						<div className="space-y-3">
							<Button
								type="primary"
								block
								onClick={() => window.open(`tel:${booking.contactPhone}`)}
								icon={<PhoneOutlined />}
								className="bg-green-600 hover:bg-green-700 border-green-600"
							>
								Gọi khách hàng
							</Button>
							<Button
								block
								onClick={() => window.open(`mailto:${booking.contactEmail}`)}
								icon={<MailOutlined />}
							>
								Gửi email
							</Button>
							{booking.bookingType !== 3 && booking.tourId && (
								<Button
									block
									onClick={handleViewTour}
									icon={<EyeOutlined />}
									type="dashed"
								>
									Xem thông tin tour
								</Button>
							)}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
