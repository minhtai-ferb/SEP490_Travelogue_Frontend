"use client"

import { useAtom } from "jotai"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import logo from '../../../../public/Logo.png'

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"

// UI Components
import { Button } from "@/components/ui/button"
// Icons
import { AlignJustify, Backpack, BookHeart, LogOut, Menu, MenuIcon, User, X } from "lucide-react"

// Swiper
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

// Styles
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

// Auth
import { TravelogueButton } from "@/components/common/avatar-button"
import DestinationGrid from "@/components/common/destination-grid"
import ExperienceTNPage from "@/components/common/experience-tn-page"
import { SectionExploreTravel } from "@/components/common/explore-travel"
import MapTayNinh from "@/components/common/map-tay-ninh-hp"
import Navigate from "@/components/header/navigate"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { checkRole, isAdmin } from "@/lib/check-admin"
import { cn } from "@/lib/utils"
import { useAuth } from "@/services/useAuth"
import { userAtom } from "@/store/auth"
import { Avatar, Divider, Dropdown, DropdownItem, DropdownMenu as DropdownMenuHero, DropdownTrigger } from "@heroui/react"
import { PersonIcon } from "@radix-ui/react-icons"
import DiscoverMore from "../le-hoi-va-su-kien/components/discover-more"
import { ROLES } from "@/config/rbacConfig"

// Navigation data
const menuItems = [
	{ label: "Khám phá", href: "/kham-pha" },
	{ label: "Kế hoạch chuyến đi", href: "/ke-hoach-chuyen-di" },
	{ label: "Lễ hội & Sự kiện", href: "/le-hoi-va-su-kien" },
	{ label: "Trải nghiệm", href: "/trai-nghiem" },
	{ label: "Tin tức", href: "/tin-tuc" },
	{ label: "Thông tin cần biết", href: "/thong-tin-can-biet" },
]

export default function HeroSlider() {
	// State
	const [isOpen, setIsOpen] = useState(false)
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	// Router
	const router = useRouter()

	// Auth
	const [user] = useAtom(userAtom)
	const { logout } = useAuth()

	// Handlers
	const handleMenuToggle = () => setIsOpen(!isOpen)

	const handleAdminPage = () => {
		router.push("/admin/dashboard");
	};

	const handleLogout = () => logout()

	// Scroll event listener
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10)
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	// Scroll event listener
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsHeaderVisible(false); // Scrolled down
			} else {
				setIsHeaderVisible(true); // At the top
			}
		};

		window.addEventListener("scroll", handleScroll);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<div>
				{/* Header */}
				<div
					className="relative w-full h-[80vh] overflow-hidden"
					style={{
						borderBottomLeftRadius: "50% 20%",
						borderBottomRightRadius: "50% 20%",
					}}
				>

					{isHeaderVisible &&
						<div className="absolute z-10 w-full flex items-center px-6 justify-between my-auto md:py-6 lg:px-28 bg-transparent">
							{/* Header Navigation */}
							<div className="left-20 z-10 hidden lg:block">
								<Dropdown onOpenChange={handleMenuToggle}>
									<DropdownTrigger
										onClick={handleMenuToggle}
										className="transition-all duration-600 text-[#fff] font-bold text-center"
									>
										{isOpen ? (
											<X className="cursor-pointer" size={40} />
										) : (
											<AlignJustify className="cursor-pointer" size={40} />
										)}
									</DropdownTrigger>
									<DropdownMenuHero
										aria-label="Static Actions"
										className="bg-slate-50 w-full text-center"
									>
										<DropdownItem
											key={"trang lien ket"}
											className="w-full z-10"
										>
											<Link href='https://tinhdoan.tayninh.gov.vn/vi/' target="_blank" className="z-10 flex gap-3 items-center justify-center">
												Trang Liên Kết
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
													/>
												</svg>
											</Link>
										</DropdownItem>
									</DropdownMenuHero>
								</Dropdown>
							</div>
							<Link href="/">
								<Image
									src={logo}
									alt="Travelogue"
									width={100}
									height={100}
									className="absolute z-10 top-2 w-10 md:w-20 md:left-1/2 md:-translate-x-1/2"
									priority
								/>
							</Link>

							{/* menu mobile */}
							<div className="md:hidden mt-3">
								<Sheet>
									<SheetTrigger>
										<MenuIcon
											key="trigger"
											className="text-white"
										/>
									</SheetTrigger>
									<SheetContent
										side="right"
										className="w-3/4 sm:w-2/3 bg-slate-800/90 text-white p-6"
									>
										<SheetTitle className="mb-6">
											{user ? (
												<TravelogueButton
													key="user"
													label={user?.fullName || ""}
													icon={<Avatar className="w-10 h-10" />}
													className="w-full flex items-center gap-3 text-lg font-semibold text-white bg-slate-700 p-3 rounded-lg transition duration-300"
												/>
											) : (
												<div
													key="ketnoivoichungtoi"
													className="flex items-center justify-center gap-4"
												>
													<button
														key="btnKetnoi"
														className="text-white border-2 border-blue-500 font-medium px-6 py-2 text-base rounded-xl hover:bg-blue-500 hover:border-white hover:text-white transition duration-300"
														onClick={() => router.push("/auth")}
													>
														Kết nối cùng chúng tôi
													</button>
												</div>
											)}
										</SheetTitle>

										{/* Menu Items */}
										<div
											key="menu"
											className="w-full flex flex-col gap-3 py-4 bg-slate-800/90 text-white"
										>
											{menuItems?.map((link, index) => (
												<div key={link.label} className="flex flex-col">
													<Link
														href={link.href}
														className="text-lg font-medium py-2 px-4 hover:bg-slate-700 rounded-lg transition duration-300"
													>
														{link.label}
													</Link>
													<Divider
														orientation="horizontal"
														key={index}
													/>
												</div>
											))}
										</div>

										{/* External Link Section */}
										<Divider
											orientation="horizontal"
										/>
										<div className="w-full flex flex-col bg-slate-800/90 text-white">
											<Link
												href="https://tinhdoan.tayninh.gov.vn/vi/"
												target="_blank"
												className="text-lg font-medium py-3 px-4 hover:bg-slate-700 rounded-lg transition duration-300 flex items-center gap-3"
											>
												<span>Trang Liên Kết</span>
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
													/>
												</svg>
											</Link>
										</div>
										<Divider />
										<div>
											{user && (
												<div>
													<Link
														href="/admin/dashboard"
														className="text-lg font-medium py-3 px-4 hover:bg-slate-700 rounded-lg transition duration-300 flex items-center gap-3"
													>
														Quản lý
													</Link>
													<Divider
														orientation="horizontal"
													/>
													<button
														key="btnLogout"
														className="text-lg font-medium w-full py-3 px-4 text-white bg-red-700 hover:text-red-700 bg-slate-600/20 rounded-lg transition duration-300 flex items-center gap-3"
														onClick={handleLogout}
													>
														Đăng xuất
													</button>
												</div>
											)}
										</div>
									</SheetContent>
								</Sheet>
							</div>
							{/* end menu mobile */}
							{/* Tablet Menu */}
							<div className="absolute top-6 hidden md:block lg:hidden left-10">
								<Dropdown backdrop="blur">
									<DropdownTrigger>
										<button className="p-2 rounded-md hover:bg-gray-700/50 transition-colors">
											<Menu className="w-8 h-8 text-white" />
										</button>
									</DropdownTrigger>
									<DropdownMenuHero aria-label="Link Actions" className="w-64">
										<>
											{menuItems?.map((item, index) => (
												<DropdownItem
													key={index}
													className={cn(
														"text-gray-700 hover:text-primary font-medium transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
													)}
												>
													<Link href={item.href}>
														{item.label}
													</Link>
												</DropdownItem>
											))}
											<DropdownItem
												key="trang lien ket"
												href="https://tinhdoan.tayninh.gov.vn/vi/"
												className={cn(
													"text-gray-700 hover:text-primary flex font-medium transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
												)}
											>
												<div className="flex gap-2">
													<p>
														Trang liên kết
													</p>
													<svg
														className="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
												</div>
											</DropdownItem>
											{!user && (
												<DropdownItem key="ket noi cung chung noi">
													<Button
														variant="ghost"
														className="w-full justify-start text-primary font-medium px-4 py-2 hover:bg-gray-100 rounded-md lg:hidden"
														onClick={() => {
															router.push("/auth");
															setIsMobileMenuOpen(false);
														}}
													>
														Kết nối cùng chúng tôi
													</Button>
												</DropdownItem>
											)}
										</>
									</DropdownMenuHero>
								</Dropdown>
							</div>
							{/* End Tablet Menu */}

							{/*  */}
							<div className={`absolute z-10 right-10 top-6 items-center md:block hidden`}>
								{user ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<TravelogueButton
												label={user.fullName || "Travelogue"}
												icon={<PersonIcon />}
												className="bg-transparent border hover:bg-blue-500"
											/>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-56">
											<DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem className="cursor-pointer">
												<Link href={`${!checkRole(ROLES.TOUR_GUIDE) ? '/ho-so' : '/ho-so-tourguide'}`} className="flex items-center">
													<User className="mr-2 h-4 w-4 text-primary" />
													<span>Hồ sơ</span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem className="cursor-pointer">
												<Link href='/dia-diem-cua-ban' className="flex items-center">
													<BookHeart className="mr-2 h-4 w-4 text-primary text-red-600" />
													<span>Địa điểm yêu thích</span>
												</Link>
											</DropdownMenuItem>
											{checkRole(ROLES.TOUR_GUIDE) && (
												<DropdownMenuItem className="cursor-pointer">
													<Link href="/cac-tour-cua-ban" className="flex items-center">
														<Backpack className="mr-2 h-4 w-4 text-primary" />
														<span>Xem tour của bạn</span>
													</Link>
												</DropdownMenuItem>
											)}
											{isAdmin() && (
												<DropdownMenuItem onClick={handleAdminPage} className="cursor-pointer">
													<div className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															className="mr-2 h-4 w-4 text-primary"
														>
															<rect width="18" height="18" x="3" y="3" rx="2" />
															<path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M9 12h6" />
														</svg>
														<span>Bảng điều khiển</span>
													</div>
												</DropdownMenuItem>
											)}
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
												<div className="flex items-center">
													<LogOut className="mr-2 h-4 w-4 text-red-600" />
													<span>Đăng xuất</span>
												</div>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<div className="hidden md:flex items-center gap-4">
										<button
											className="text-white border-blue-500 text-nowrap border-2 font-medium px-8 md:py-3 text-base rounded-xl hover:bg-blue-500 hover:border-white duration-500"
											onClick={() => router.push("/auth")}
										>
											Kết nối cùng chúng tôi
										</button>
									</div>
								)}
							</div>
						</div>
					}

					<div className="absolute hidden lg:block top-20 w-full py-10">
						<Navigate />
					</div>

					<Swiper
						spaceBetween={0}
						effect={"fade"}
						pagination={{
							clickable: true,
							dynamicBullets: true,
						}}
						autoplay={{
							delay: 5000,
							disableOnInteraction: false,
						}}
						modules={[EffectFade, Pagination, Autoplay]}
						loop
						className="relative inset-0 w-full h-full z-10"
					>
						{slides.map((slide, index) => (
							<SwiperSlide key={index}>
								<img
									src={slide.image || "/placeholder_image.jpg"}
									alt={slide.title}
									className="w-full h-full object-cover" // Changed to object-cover for better fit
								/>
								<div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 z-5"></div>

								{/* Slide Content */}
								<div className="absolute left-6 top-20 md:left-10 lg:left-40 inset-0 flex flex-col justify-center items-start text-start max-w-3xl z-10">
									<div className="mb-4">
										<span className="text-stone-100 border-l-4 border-green-400 pl-2 font-semibold">
											{slide.category}
										</span>
									</div>
									<h1 className="text-2xl md:text-4xl font-bold mb-4 text-white">
										{slide.title}
									</h1>
									<p className="text-sm md:text-base mb-6 leading-relaxed max-w-xl text-white">
										{slide.description}
									</p>
									{/* <Button
										className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md w-fit transition-all duration-300"
										size="lg"
									>
										Xem thêm
									</Button> */}
								</div>
							</SwiperSlide>
						))}
					</Swiper>

				</div>
				{/* End Header */}
				<ExperienceTNPage />

				<MapTayNinh />

				<DestinationGrid />

				{/* section introduce */}
				<SectionExploreTravel className="my-20" text={"Khám phá những khoảnh khắc du lịch đáng nhớ như một câu chuyện!"} />

				<DiscoverMore />
			</div >
			{/* Secondary Header - Shown when scrolled */}
			{
				!isHeaderVisible && (
					<header
						className={cn(
							"fixed top-0 left-0 w-full z-40 transition-all duration-300",
							isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-white/80 backdrop-blur-sm",
						)}
					>
						<div className="container mx-auto px-4">
							<div className="flex items-center justify-between">
								{/* Mobile Menu Button */}
								<div className="h-10 w-10 flex items-center justify-center">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
										className="text-primary h-8 w-8 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
									>
										{isMobileMenuOpen ? (
											<X className="h-6 w-6" />
										) : (
											<Menu className="h-6 w-6" />
										)}
									</Button>
								</div>

								<div className="">
									<Image
										src="/mascot.png"
										alt="Tây Ninh Logo"
										width={50}
										height={50}
										className="fixed w-10 md:w-16 top-3 md:top-0 left-1/2 -translate-x-1/2"
									/>
								</div>

								{/* User Menu / Auth Buttons */}
								<div className="items-center space-x-4 md:block hidden">
									{user ? (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<TravelogueButton
													label={user?.fullName || ""}
													icon={<PersonIcon />}
													className="bg-transparent md:flex hidden border bg-blue-500 hover:bg-blue-300 hover:text-slate-500"
												/>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-56">
												<DropdownMenuItem className="cursor-pointer">
													<Link href={`${!checkRole(ROLES.TOUR_GUIDE) ? '/ho-so' : '/ho-so-tourguide'}`} className="flex items-center">
														<User className="mr-2 h-4 w-4 text-primary" />
														<span>Hồ sơ</span>
													</Link>
												</DropdownMenuItem>
												{isAdmin() && (
													<DropdownMenuItem onClick={handleAdminPage} className="cursor-pointer">
														<div className="flex items-center">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																className="mr-2 h-4 w-4 text-primary"
															>
																<rect width="18" height="18" x="3" y="3" rx="2" />
																<path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M9 12h6" />
															</svg>
															<span>Bảng điều khiển</span>
														</div>
													</DropdownMenuItem>
												)}
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
													<div className="flex items-center">
														<LogOut className="mr-2 h-4 w-4 text-red-600" />
														<span>Đăng xuất</span>
													</div>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									) : (
										<div className="flex items-center gap-3">
											<Button
												variant="outline"
												className="hidden md:flex border-primary text-primary hover:bg-primary/10"
												onClick={() => router.push("/auth")}
											>
												Kết nối cùng chúng tôi
											</Button>
										</div>
									)}
								</div>

							</div>

							{/* Mobile Menu */}
							{isMobileMenuOpen && (
								<div className="mt-4 pb-4 border-t border-gray-100 pt-4">
									<nav className="flex flex-col space-y-4">
										{menuItems.map((item, index) => (
											<Link
												key={index}
												href={item.href}
												className={cn(
													"text-gray-700 hover:text-primary font-medium transition-colors px-2 py-1.5 rounded-md hover:bg-gray-100"
												)}
												onClick={() => setIsMobileMenuOpen(false)}
											>
												{item.label}
											</Link>
										))}
										{!user && (
											<Button
												variant="ghost"
												className="justify-start text-primary md:hidden"
												onClick={() => {
													router.push("/auth")
													setIsMobileMenuOpen(false)
												}}
											>
												Kết nối cùng chúng tôi
											</Button>
										)}
									</nav>
								</div>
							)}
						</div>
					</header>
				)
			}
		</>
	)
}


const categories = [
	{ name: "Tất cả", slug: "all", icon: "/placeholder_image.jpg?height=24&width=24" },
	{ name: "Văn hóa & Lịch sử", slug: "van-hoa-lich-su", icon: "/placeholder_image.jpg?height=24&width=24" },
	{ name: "Ẩm thực", slug: "am-thuc", icon: "/placeholder_image.jpg?height=24&width=24" },
	{ name: "Mua sắm", slug: "mua-sam", icon: "/placeholder_image.jpg?height=24&width=24" },
	{ name: "Giải trí", slug: "giai-tri", icon: "/placeholder_image.jpg?height=24&width=24" },
	{ name: "Thiên nhiên", slug: "thien-nhien", icon: "/placeholder_image.jpg?height=24&width=24" },
]

const slides = [
	{
		category: "Giải trí",
		title: "Quầy hết mình tại những khu vui chơi ở Tây Ninh 'HOT' nhất hiện nay",
		description:
			'Thành phố này dần trở thành nơi dừng chân lý tưởng của giới trẻ yêu "xê dịch" với các địa điểm du lịch Tây Ninh như Ma Thiên Lãnh, tòa thánh Cao Đài và Núi bà Đen, hồ Dầu Tiếng,...lại chỉ cách TP Hồ Chí Minh tầm 100km',
		image: "giai-tri.jpg",
	},
	{
		category: "Văn hóa & Lịch sử",
		title: "Khám phá tòa thánh Cao Đài - Kiến trúc độc đáo của Tây Ninh",
		description:
			"Tòa thánh Cao Đài là công trình kiến trúc tôn giáo đặc sắc, thu hút hàng nghìn du khách mỗi năm. Với lối kiến trúc kết hợp giữa phương Đông và phương Tây, đây là điểm đến không thể bỏ qua khi du lịch Tây Ninh.",
		image: "toa_thanh_tay_ninh.jpg",
	},
	{
		category: "Ẩm thực",
		title: "Hành trình khám phá ẩm thực đặc sắc của vùng đất Tây Ninh",
		description:
			"Tây Ninh không chỉ nổi tiếng với cảnh đẹp mà còn có nền ẩm thực phong phú với nhiều món ngon đặc sản như bánh canh Trảng Bàng, bánh tráng phơi sương, mật ong rừng và nhiều món ăn đặc sắc khác.",
		image: "dac_san.jpg",
	},
	{
		category: "Thiên nhiên",
		title: "Những trải nghiệm giải trí hấp dẫn không thể bỏ lỡ ở Tây Ninh",
		description:
			"Từ leo núi Bà Đen đến khám phá khu du lịch sinh thái, Tây Ninh mang đến nhiều hoạt động giải trí thú vị cho du khách. Hãy chuẩn bị sẵn sàng cho những trải nghiệm đáng nhớ tại vùng đất này.",
		image: "thien_nhien.png",
	},
]

