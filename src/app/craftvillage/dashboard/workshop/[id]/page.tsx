"use client"

import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useWorkshop } from "@/services/use-workshop"
import { Clock, Users, MapPin, Star, Calendar, Camera, CreditCard } from "lucide-react"
import type { WorkshopDetail } from "@/types/Workshop"
import { cn } from "@/lib/utils"
import Image from "next/image"

function WorkshopDetailPage() {
	const { id } = useParams()
	const { getWorkshopDetail } = useWorkshop()
	const searchParams = useSearchParams()
	const useMock = searchParams.get("mock") === "1"

	const [workshop, setWorkshop] = useState<any>(null)

	const mockItems: any[] = useMemo(
		() => [
			{
				id: "ws_001",
				name: "Trải nghiệm làm gốm truyền thống Tây Ninh",
				description:
					"Khám phá nghệ thuật nặn gốm cổ truyền với các nghệ nhân lành nghề, tạo ra những sản phẩm gốm độc đáo mang đậm bản sắc văn hóa địa phương.",
				content: `🏺 **Giới thiệu về trải nghiệm**

Trải nghiệm làm gốm truyền thống Tây Ninh là cơ hội tuyệt vời để bạn khám phá một trong những nghề thủ công lâu đời nhất của vùng đất này. Dưới sự hướng dẫn của các nghệ nhân có kinh nghiệm hơn 30 năm, bạn sẽ được học từ những kỹ thuật cơ bản nhất đến những bí quyết tạo nên những sản phẩm gốm tinh xảo.

🎯 **Nội dung trải nghiệm**

**Phần 1: Tìm hiểu nguyên liệu và dụng cụ (30 phút)**
- Giới thiệu về đất sét địa phương và đặc tính
- Các loại dụng cụ làm gốm truyền thống
- Lịch sử và văn hóa gốm sứ Tây Ninh

**Phần 2: Thực hành nặn gốm cơ bản (90 phút)**
- Kỹ thuật chuẩn bị đất sét
- Học cách nặn hình cơ bản: bát, chén, lọ hoa
- Tạo hoa văn và trang trí bề mặt
- Kỹ thuật làm mịn và hoàn thiện sản phẩm

**Phần 3: Trang trí và hoàn thiện (60 phút)**
- Vẽ hoa văn truyền thống
- Kỹ thuật tạo màu tự nhiên
- Cách bảo quản và sấy khô sản phẩm

🎁 **Bạn sẽ nhận được:**
- 1 sản phẩm gốm do chính tay bạn làm
- Kiến thức về nghề gốm truyền thống
- Certificate hoàn thành workshop
- Ảnh kỷ niệm với nghệ nhân
- Tài liệu hướng dẫn làm gốm tại nhà

👥 **Phù hợp với:** Mọi lứa tuổi từ 8 tuổi trở lên, đặc biệt thích hợp cho gia đình, nhóm bạn, và những ai yêu thích nghệ thuật thủ công.`,
				status: "Approved",
				statusText: "Đã duyệt",
				rating: 4.8,
				totalReviews: 127,
				difficulty: "Dễ",
				duration: "3 giờ",
				category: "Gốm sứ",
				location: "Làng gốm Tân Biên, Tây Ninh",
				instructor: "Nghệ nhân Nguyễn Văn Thành",
				instructorExperience: "35 năm kinh nghiệm",
				languages: ["Tiếng Việt", "Tiếng Anh cơ bản"],
				includes: [
					"Nguyên liệu làm gốm",
					"Dụng cụ chuyên dụng",
					"Hướng dẫn viên chuyên nghiệp",
					"Nước uống và bánh kẹo",
					"Certificate hoàn thành",
					"Đóng gói sản phẩm",
				],
				requirements: [
					"Mặc trang phục thoải mái, có thể bẩn",
					"Mang theo tạp dề (hoặc sẽ được cung cấp)",
					"Cắt ngắn móng tay",
					"Không mang đồ trang sức quý",
				],
				mediaDtos: [
					{ mediaUrl: "/traditional-pottery-making-workshop.png", isThumbnail: true },
					{ mediaUrl: "/clay-pottery-wheel-spinning.png", isThumbnail: false },
					{ mediaUrl: "/finished-ceramic-bowls-and-vases.png", isThumbnail: false },
					{ mediaUrl: "/pottery-instructor-teaching-students.png", isThumbnail: false },
				],
				schedules: [
					{
						scheduleId: "sch_001",
						startTime: "08:00",
						endTime: "11:00",
						maxParticipant: 12,
						currentBookings: 8,
						adultPrice: 280000,
						childrenPrice: 180000,
						notes: "Buổi sáng - Không khí mát mẻ, thích hợp nhất",
						availableDates: ["2024-12-20", "2024-12-22", "2024-12-24", "2024-12-27"],
					},
					{
						scheduleId: "sch_002",
						startTime: "14:00",
						endTime: "17:00",
						maxParticipant: 10,
						currentBookings: 6,
						adultPrice: 280000,
						childrenPrice: 180000,
						notes: "Buổi chiều - Ánh sáng đẹp cho chụp ảnh",
						availableDates: ["2024-12-21", "2024-12-23", "2024-12-25", "2024-12-28"],
					},
				],
				createdAt: "2024-07-01",
				updatedAt: "2024-12-15",
			},
			{
				id: "ws_002",
				name: "Dệt thổ cẩm và nhuộm màu tự nhiên",
				description:
					"Trải nghiệm quy trình dệt thổ cẩm hoàn chỉnh từ chuẩn bị sợi, nhuộm màu tự nhiên đến dệt thành sản phẩm hoàn chỉnh.",
				content: `🧵 **Khám phá nghệ thuật dệt thổ cẩm**

Thổ cẩm là một trong những nghề thủ công truyền thống quý báu của các dân tộc thiểu số Việt Nam. Tại workshop này, bạn sẽ được trải nghiệm toàn bộ quy trình từ việc chuẩn bị nguyên liệu đến khi hoàn thành một sản phẩm thổ cẩm đẹp mắt.

🎨 **Quy trình trải nghiệm**

**Bước 1: Tìm hiểu về thổ cẩm (45 phút)**
- Lịch sử và ý nghĩa văn hóa của thổ cẩm
- Các loại sợi và nguyên liệu truyền thống
- Ý nghĩa của các họa tiết và màu sắc

**Bước 2: Nhuộm màu tự nhiên (90 phút)**
- Chuẩn bị các loại lá, củ, quả để nhuộm
- Kỹ thuật nhuộm màu đỏ từ gấc, màu vàng từ nghệ
- Cách tạo màu xanh từ lá chàm, màu nâu từ vỏ cây

**Bước 3: Dệt thổ cẩm (120 phút)**
- Cách dựng khung cửi truyền thống
- Kỹ thuật dệt cơ bản và tạo hoa văn
- Hoàn thiện sản phẩm và cách bảo quản

🎁 **Sản phẩm mang về:**
- 1 khăn thổ cẩm nhỏ (30x30cm) do bạn tự dệt
- Bộ sợi nhuộm màu tự nhiên
- Hướng dẫn dệt thổ cẩm tại nhà`,
				status: "Approved",
				statusText: "Đã duyệt",
				rating: 4.6,
				totalReviews: 89,
				difficulty: "Trung bình",
				duration: "4.5 giờ",
				category: "Dệt may",
				location: "Làng dệt Châu Thành, Tây Ninh",
				instructor: "Cô Nguyễn Thị Lan",
				instructorExperience: "25 năm kinh nghiệm",
				languages: ["Tiếng Việt"],
				includes: [
					"Nguyên liệu nhuộm tự nhiên",
					"Sợi cotton chất lượng cao",
					"Khung cửi mini",
					"Dụng cụ dệt chuyên dụng",
					"Bữa trưa nhẹ",
					"Tài liệu hướng dẫn",
				],
				requirements: [
					"Mặc quần áo tối màu",
					"Mang theo găng tay (nếu có)",
					"Cần kiên nhẫn và tỉ mỉ",
					"Phù hợp từ 12 tuổi trở lên",
				],
				mediaDtos: [
					{ mediaUrl: "/traditional-weaving-loom-with-colorful-threads.png", isThumbnail: true },
					{ mediaUrl: "/natural-dye-materials-herbs-and-plants.png", isThumbnail: false },
					{ mediaUrl: "/finished-brocade-textile-patterns.png", isThumbnail: false },
				],
				schedules: [
					{
						scheduleId: "sch_101",
						startTime: "08:30",
						endTime: "13:00",
						maxParticipant: 8,
						currentBookings: 5,
						adultPrice: 350000,
						childrenPrice: 250000,
						notes: "Bao gồm bữa trưa nhẹ",
						availableDates: ["2024-12-19", "2024-12-21", "2024-12-26", "2024-12-28"],
					},
				],
				createdAt: "2024-06-20",
				updatedAt: "2024-12-10",
			},
			{
				id: "ws_003",
				name: "Đan lát tre trúc nghệ thuật",
				description:
					"Học nghệ thuật đan lát từ tre trúc địa phương, tạo ra những sản phẩm thủ công tinh xảo và thân thiện với môi trường.",
				content: `🎋 **Nghệ thuật đan lát tre trúc**

Tre trúc là nguyên liệu quen thuộc trong đời sống người Việt từ hàng ngàn năm nay. Workshop này sẽ giúp bạn khám phá vẻ đẹp và tính ứng dụng cao của nghề đan lát truyền thống.

🛠️ **Nội dung trải nghiệm**

**Phần 1: Chuẩn bị nguyên liệu (30 phút)**
- Cách chọn tre tốt và xử lý tre
- Kỹ thuật chẻ tre thành các thanh nhỏ
- Làm mềm và tạo độ dẻo cho tre

**Phần 2: Kỹ thuật đan cơ bản (90 phút)**
- Các kiểu đan cơ bản: đan thẳng, đan chéo, đan xoắn
- Cách tạo đáy và thành giỏ
- Kỹ thuật tạo độ chắc chắn cho sản phẩm

**Phần 3: Hoàn thiện sản phẩm (60 phút)**
- Tạo viền và quai xách
- Kỹ thuật hoàn thiện và làm đẹp
- Cách bảo quản sản phẩm tre

🌿 **Ý nghĩa môi trường:**
- Sử dụng nguyên liệu tự nhiên 100%
- Có thể tái chế và phân hủy sinh học
- Góp phần bảo vệ môi trường`,
				status: "Approved",
				statusText: "Đã duyệt",
				rating: 4.7,
				totalReviews: 156,
				difficulty: "Trung bình",
				duration: "3 giờ",
				category: "Thủ công mỹ nghệ",
				location: "Làng tre Gò Dầu, Tây Ninh",
				instructor: "Thầy Trần Văn Minh",
				instructorExperience: "40 năm kinh nghiệm",
				languages: ["Tiếng Việt", "Tiếng Anh"],
				includes: [
					"Nguyên liệu tre đã xử lý",
					"Bộ dụng cụ đan lát",
					"Găng tay bảo hộ",
					"Nước mát và trái cây",
					"Túi đựng sản phẩm",
				],
				requirements: [
					"Mặc quần dài và áo tay dài",
					"Mang giày bảo hộ hoặc giày kín",
					"Cẩn thận với dụng cụ sắc nhọn",
					"Phù hợp từ 10 tuổi trở lên",
				],
				mediaDtos: [
					{ mediaUrl: "/bamboo-basket-weaving-workshop.png", isThumbnail: true },
					{ mediaUrl: "/bamboo-strips-preparation-cutting.png", isThumbnail: false },
					{ mediaUrl: "/finished-bamboo-baskets-and-containers.png", isThumbnail: false },
				],
				schedules: [
					{
						scheduleId: "sch_201",
						startTime: "08:00",
						endTime: "11:00",
						maxParticipant: 15,
						currentBookings: 12,
						adultPrice: 220000,
						childrenPrice: 150000,
						notes: "Buổi sáng mát mẻ, dễ tập trung",
						availableDates: ["2024-12-20", "2024-12-22", "2024-12-24", "2024-12-27", "2024-12-29"],
					},
					{
						scheduleId: "sch_202",
						startTime: "14:30",
						endTime: "17:30",
						maxParticipant: 12,
						currentBookings: 7,
						adultPrice: 220000,
						childrenPrice: 150000,
						notes: "Buổi chiều thoáng mát",
						availableDates: ["2024-12-21", "2024-12-23", "2024-12-25", "2024-12-28", "2024-12-30"],
					},
				],
				createdAt: "2024-05-10",
				updatedAt: "2024-12-12",
			},
			{
				id: "ws_004",
				name: "Làm bánh tráng phơi sương Tây Ninh",
				description:
					"Trải nghiệm làm bánh tráng phơi sương - đặc sản nổi tiếng của Tây Ninh với công thức truyền thống được truyền qua nhiều thế hệ.",
				content: `🥞 **Bánh tráng phơi sương - Đặc sản Tây Ninh**

Bánh tráng phơi sương là món ăn đặc trưng không thể thiếu trong ẩm thực Tây Ninh. Với hương vị thơm ngon độc đáo và cách làm truyền thống, bánh tráng đã trở thành niềm tự hào của người dân địa phương.

👩‍🍳 **Quy trình làm bánh**

**Bước 1: Chuẩn bị nguyên liệu (30 phút)**
- Gạo tẻ chất lượng cao của địa phương
- Nước trong sạch và muối biển
- Cách ngâm và xay gạo đúng cách
- Pha bột với tỷ lệ chuẩn

**Bước 2: Tráng bánh (90 phút)**
- Kỹ thuật đốt lửa và điều chỉnh nhiệt độ
- Cách tráng bánh mỏng đều
- Thời điểm lật bánh và lấy bánh
- Bí quyết tạo độ giòn và thơm

**Bước 3: Phơi sương (60 phút)**
- Cách phơi bánh đúng cách
- Tầm quan trọng của sương đêm
- Cách bảo quản và đóng gói

🍽️ **Thưởng thức bánh tráng:**
- Cách ăn bánh tráng truyền thống
- Các loại nước chấm đặc trưng
- Kết hợp với các món ăn khác`,
				status: "Approved",
				statusText: "Đã duyệt",
				rating: 4.9,
				totalReviews: 203,
				difficulty: "Dễ",
				duration: "3 giờ",
				category: "Ẩm thực",
				location: "Làng bánh tráng Trảng Bàng, Tây Ninh",
				instructor: "Bà Nguyễn Thị Hoa",
				instructorExperience: "45 năm kinh nghiệm",
				languages: ["Tiếng Việt"],
				includes: [
					"Nguyên liệu làm bánh tráng",
					"Dụng cụ tráng bánh chuyên dụng",
					"Bữa sáng nhẹ",
					"Bánh tráng mang về (1kg)",
					"Công thức làm bánh",
					"Nước chấm đặc biệt",
				],
				requirements: [
					"Mặc quần áo thoải mái, chịu nhiệt",
					"Mang theo nón hoặc khăn che đầu",
					"Cẩn thận với lửa và nhiệt độ cao",
					"Phù hợp mọi lứa tuổi",
				],
				mediaDtos: [
					{ mediaUrl: "/traditional-rice-paper-making-process.png", isThumbnail: true },
					{ mediaUrl: "/rice-paper-drying-in-morning-dew.png", isThumbnail: false },
					{ mediaUrl: "/finished-rice-papers-stacked.png", isThumbnail: false },
					{ mediaUrl: "/rice-paper-with-dipping-sauce.png", isThumbnail: false },
				],
				schedules: [
					{
						scheduleId: "sch_301",
						startTime: "05:30",
						endTime: "08:30",
						maxParticipant: 20,
						currentBookings: 18,
						adultPrice: 180000,
						childrenPrice: 120000,
						notes: "Buổi sáng sớm để tận dụng sương mai",
						availableDates: ["2024-12-20", "2024-12-21", "2024-12-22", "2024-12-23", "2024-12-24"],
					},
					{
						scheduleId: "sch_302",
						startTime: "15:00",
						endTime: "18:00",
						maxParticipant: 15,
						currentBookings: 10,
						adultPrice: 180000,
						childrenPrice: 120000,
						notes: "Buổi chiều, phơi bánh qua đêm",
						availableDates: ["2024-12-25", "2024-12-26", "2024-12-27", "2024-12-28"],
					},
				],
				createdAt: "2024-04-02",
				updatedAt: "2024-12-14",
			},
		],
		[],
	)

	useEffect(() => {
		const load = async () => {
			const workshopId = id as string
			if (!workshopId) return
			if (useMock) {
				const found = mockItems.find((m: any) => m.id === workshopId) || { ...mockItems[0], id: workshopId }
				setWorkshop(found || mockItems[0])
				return
			}
			try {
				const res = await getWorkshopDetail(workshopId)
				setWorkshop(res as any)
			} catch (error) {
				setWorkshop(mockItems[0])
			}
		}
		load()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, useMock])

	const breadcrumbItems = {
		items: [
			{
				label: "Trải nghiệm",
				href: "/craftvillage/dashboard/workshop",
			},
			{
				label: "Chi tiết trải nghiệm",
				href: `/craft-village/workshop/${id}`,
			},
		],
		active: workshop?.name || "Chi tiết trải nghiệm",
		activeHref: `/craft-village/workshop/${id}?mock=1`,
	}

	const getStatusBadge = (status: string, statusText: string) => {
		const variants = {
			Approved: "default",
			Pending: "secondary",
			Draft: "outline",
			Rejected: "destructive",
		} as const

		return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{statusText}</Badge>
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Dễ":
				return "text-green-600 bg-green-50"
			case "Trung bình":
				return "text-yellow-600 bg-yellow-50"
			case "Khó":
				return "text-red-600 bg-red-50"
			default:
				return "text-gray-600 bg-gray-50"
		}
	}

	if (!workshop) {
		return (
			<>
				<BreadcrumbHeader items={breadcrumbItems.items} />
				<div className="p-4">
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-center h-32">
								<div className="text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
									<p className="text-muted-foreground">Đang tải thông tin workshop...</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</>
		)
	}

	return (
		<>
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<div className="p-4 space-y-6">
				{/* Header Card */}
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<CardTitle className="text-2xl">{workshop.name}</CardTitle>
									{getStatusBadge(workshop.status, workshop.statusText)}
								</div>
								<p className="text-muted-foreground text-lg">{workshop.description}</p>

								{/* Rating and Reviews */}
								{workshop.rating && (
									<div className="flex items-center gap-2 mt-3">
										<div className="flex items-center gap-1">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<span className="font-medium">{workshop.rating}</span>
										</div>
										<span className="text-muted-foreground">({workshop.totalReviews} đánh giá)</span>
									</div>
								)}
							</div>

							{/* Quick Info */}
							<div className="flex flex-col gap-2 min-w-[200px]">
								<div className="flex items-center gap-2 text-sm">
									<Clock className="h-4 w-4 text-blue-600" />
									<span>{workshop.duration}</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Users className="h-4 w-4 text-green-600" />
									<span>Tối đa {workshop.schedules?.[0]?.maxParticipant || "N/A"} người</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<MapPin className="h-4 w-4 text-red-600" />
									<span>{workshop.location}</span>
								</div>
								{workshop.difficulty && (
									<Badge className={cn("w-fit", getDifficultyColor(workshop.difficulty))}>{workshop.difficulty}</Badge>
								)}
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Images Gallery */}
				{workshop.mediaDtos && workshop.mediaDtos.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Camera className="h-5 w-5" />
								Hình ảnh trải nghiệm
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<Image
									src="/imgws.png"
									alt={workshop.name}
									width={100}
									height={100}
									className="w-full h-48 object-cover rounded-lg border hover:shadow-lg transition-shadow"
								/>
							</div>
						</CardContent>
					</Card>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Workshop Content */}
						<Card>
							<CardHeader>
								<CardTitle>Nội dung trải nghiệm</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="prose max-w-none">
									<div className="whitespace-pre-wrap text-sm leading-relaxed">{workshop.content}</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Workshop Info */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<Label className="text-xs text-muted-foreground">Danh mục</Label>
										<p className="font-medium">{workshop.category}</p>
									</div>
									<div>
										<Label className="text-xs text-muted-foreground">Thời lượng</Label>
										<p className="font-medium">{workshop.duration}</p>
									</div>
									<div>
										<Label className="text-xs text-muted-foreground">Ngày tạo</Label>
										<p className="font-medium">{new Date(workshop.createdAt).toLocaleDateString("vi-VN")}</p>
									</div>
								</div>

								<Separator />

								<div>
									<Label className="text-xs text-muted-foreground">Địa điểm</Label>
									<p className="font-medium text-sm">{workshop.location}</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Schedules */}
				{workshop.schedules && workshop.schedules.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Lịch tổ chức trải nghiệm
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{workshop.schedules.map((schedule: any, idx: any) => (
									<div key={schedule.scheduleId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex justify-between items-start mb-3">
											<div>
												<div className="flex items-center gap-2 mb-1">
													<Clock className="h-4 w-4 text-blue-600" />
													<span className="font-medium">
														{schedule.startTime} - {schedule.endTime}
													</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Users className="h-4 w-4" />
													<span>
														{schedule.currentBookings || 0}/{schedule.maxParticipant} người
													</span>
												</div>
											</div>
											<div className="text-right">
												<div className="flex items-center gap-1 text-lg font-bold text-green-600">
													<CreditCard className="h-4 w-4" />
													{schedule.adultPrice.toLocaleString("vi-VN")}đ
												</div>
												{schedule.childrenPrice > 0 && (
													<div className="text-sm text-muted-foreground">
														Trẻ em: {schedule.childrenPrice.toLocaleString("vi-VN")}đ
													</div>
												)}
											</div>
										</div>

										{schedule.notes && <p className="text-sm text-muted-foreground mb-3">{schedule.notes}</p>}

										{schedule.availableDates && (
											<div className="mb-3">
												<Label className="text-xs">Ngày có sẵn</Label>
												<div className="flex flex-wrap gap-1 mt-1">
													{schedule.availableDates.slice(0, 4).map((date: any, idx: any) => (
														<Badge key={idx} variant="outline" className="text-xs">
															{new Date(date).toLocaleDateString("vi-VN")}
														</Badge>
													))}
													{schedule.availableDates.length > 4 && (
														<Badge variant="outline" className="text-xs">
															+{schedule.availableDates.length - 4} ngày khác
														</Badge>
													)}
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</>
	)
}

export default WorkshopDetailPage
