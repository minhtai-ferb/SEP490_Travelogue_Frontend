import { HeaderConfig } from "@/components/common/common-header"

export const headerConfigs: Record<string, HeaderConfig> = {
	home: {
		backgroundImage: "/thien_nhien.png",
		title: "Trải nghiệm chuyến du lịch của bạn",
		height: "h-[500px]",
		showBoxReveal: true,
		showNavigate: true,
		overlayStyle: "gradient",
	},

	favorites: {
		backgroundImage: "/thien_nhien.png",
		title: "Địa điểm yêu thích của bạn",
		height: "h-screen",
		showBoxReveal: true,
		showNavigate: true,
		overlayStyle: "gradient",
	},

	info: {
		backgroundImage: "white",
		title: "Thông tin cần biết",
		height: "md:h-1/4 h-[50px]",
		showBoxReveal: false,
		showNavigate: true,
		overlayStyle: "light",
		titleColor: "blue",
	},

	events: {
		backgroundImage: "/event_bg.png",
		title: "Trang Tin Tức & Sự Kiện Tỉnh Tây Ninh",
		subtitle: "Cập nhật nhanh chóng về văn hóa, lễ hội và sự kiện nổi bật",
		height: "h-screen",
		showBoxReveal: true,
		showShinyButton: true,
		buttonText: "Xem Các Sự Kiện Nổi Bật",
		showNavigate: true,
		overlayStyle: "dark",
	},

	knowledge: {
		backgroundImage: "/thong_tin_can_biet_bg.jpg",
		title: "Thông tin cần biết",
		height: "h-screen",
		showBoxReveal: true,
		showNavigate: true,
		overlayStyle: "gradient",
	},

	news: {
		backgroundImage: "/thanh_pho_tay_ninh.jpg",
		title: "Tin Tức của tỉnh",
		height: "h-screen",
		showBoxReveal: true,
		showNavigate: true,
		overlayStyle: "gradient",
	}
}
