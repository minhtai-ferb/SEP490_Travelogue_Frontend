import type { TourGuide } from "@/types/Tourguide"

export const MOCK_TOURGUIDES: TourGuide[] = [
	{
		id: "guide-1",
		name: "Nguyễn Tấn Hưng",
		avatar: "/placeholder.svg?height=80&width=80",
		rating: 4.9,
		reviewCount: 127,
		experience: 5,
		languages: ["Tiếng Việt", "English", "中文"],
		specialties: ["Văn hóa", "Lịch sử", "Ẩm thực"],
		price: 500000,
		bio: "Hướng dẫn viên giàu kinh nghiệm với niềm đam mê chia sẻ văn hóa Việt Nam. Chuyên về các tour văn hóa và lịch sử.",
		isVerified: true,
		responseTime: "Trong vòng 1 giờ",
		badges: ["Top Rated", "Verified"],
		availability: "available"
	},
	{
		id: "guide-2",
		name: "Nguyễn Hữu Minh Tài",
		avatar: "/placeholder.svg?height=80&width=80",
		rating: 4.8,
		reviewCount: 89,
		experience: 3,
		languages: ["Tiếng Việt", "English", "한국어"],
		specialties: ["Thiên nhiên", "Phiêu lưu", "Nhiếp ảnh"],
		price: 450000,
		bio: "Chuyên gia về các tour thiên nhiên và phiêu lưu. Sẽ giúp bạn khám phá những địa điểm tuyệt đẹp và chụp những bức ảnh đáng nhớ.",
		isVerified: true,
		responseTime: "Trong vòng 2 giờ",
		badges: ["Nature Expert", "Photographer"],
		availability: "available"
	},
	{
		id: "guide-3",
		name: "Nguyễn Thanh Tùng",
		avatar: "/placeholder.svg?height=80&width=80",
		rating: 4.7,
		reviewCount: 156,
		experience: 7,
		languages: ["Tiếng Việt", "English", "Français"],
		specialties: ["Ẩm thực", "Chợ địa phương", "Đời sống"],
		price: 550000,
		bio: "Chuyên gia ẩm thực với kiến thức sâu rộng về các món ăn truyền thống. Sẽ dẫn bạn khám phá những quán ăn ngon nhất.",
		isVerified: true,
		responseTime: "Trong vòng 30 phút",
		badges: ["Food Expert", "Local Insider"],
		availability: "busy"
	},
	{
		id: "guide-4",
		name: "Nguyễn Tấn Hưng",
		avatar: "/placeholder.svg?height=80&width=80",
		rating: 4.6,
		reviewCount: 73,
		experience: 2,
		languages: ["Tiếng Việt", "English"],
		specialties: ["Shopping", "Thời trang", "Làm đẹp"],
		price: 400000,
		bio: "Hướng dẫn viên trẻ năng động, chuyên về shopping và khám phá xu hướng thời trang địa phương.",
		isVerified: false,
		responseTime: "Trong vòng 3 giờ",
		badges: ["Rising Star"],
		availability: "available"
	}
]


