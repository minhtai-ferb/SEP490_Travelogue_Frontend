'use client'

import { TravelogueButton } from "@/components/common/avatar-button"
import Navigate from "@/components/header/navigate"
import CategoryNews from "@/components/news/category-news"
import FeaturedStory from "@/components/news/featured-story"
import TodaysPicks from "@/components/news/todays-picks"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { menuItems } from "@/data/region-data"
import { isAdmin } from "@/lib/check-admin"
import { cn } from "@/lib/utils"
import { useNewsCategory } from "@/services/news-category"
import { useAuth } from "@/services/useAuth"
import { userAtom } from "@/store/auth"
import { Avatar, Divider, Dropdown, DropdownItem, DropdownMenu as DropdownMenuHero, DropdownTrigger } from "@heroui/react"
import { Button } from "@/components/ui/button"

import { PersonIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useAtom } from "jotai"
import { AlignJustify, ArrowBigLeft, BookHeart, LogOut, Menu, MenuIcon, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function News() {
	// Get current date for the "Today's Information" section
	// const currentDate = format(new Date(), "MMMM d, yyyy")
	const currentDate = format(new Date(), "d MMMM, yyyy", { locale: vi })
	const router = useRouter()
	const { getNewsCategory } = useNewsCategory()

	const [categoryNews, setCategoryNews] = useState([])
	const [isOpen, setIsOpen] = useState(false)
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	// Router

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

	const fetchCategoryNews = async () => {
		// TODO: Fetch category news using API endpoint
		try {
			const response = await getNewsCategory()
			setCategoryNews(response?.data)
		} catch (error) {
			console.error('====================================');
			console.error(error);
			console.error('====================================');
		}

	}

	useEffect(() => {
		fetchCategoryNews()
	}, [])


	return (
		<main className="min-h-screen bg-background relative">

			{/* Hero section */}
			<section className="relative text-white py-16 px-4 md:px-6 text-center" style={{ height: '100vh' }}>
				{/* Background image layer */}
				{/* Header with current date */}
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `url('/news_bg.jpg')`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						zIndex: 0
					}}
				></div>

				{/* Dark overlay with opacity */}
				<div className="absolute inset-0 bg-black/50 z-0"></div>
				{isHeaderVisible &&
					<div className="relative -top-10 z-10 w-full flex items-center px-2 justify-between py-4 bg-transparent">
						{/* Header Navigation */}
						<div className="z-10 hidden lg:block">
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
								src='/Logo.png'
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
													onClick={() => router.push("/login")}
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
														router.push("/login");
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
											<Link href='/ho-so' className="flex items-center">
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
										onClick={() => router.push("/login")}
									>
										Kết nối cùng chúng tôi
									</button>
								</div>
							)}
						</div>
					</div>
				}
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
														<Link href='/ho-so' className="flex items-center">
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
													onClick={() => router.push("/login")}
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
														router.push("/login")
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
				{isHeaderVisible &&
					<>
						<div className="relative mt-10">
							<Navigate />
						</div>
					</>
				}
				<div className="relative z-10 container mx-auto my-auto mt-28 max-w-5xl">
					<h1 className="text-4xl md:text-6xl my-auto font-bold tracking-tight mb-6 drop-shadow-lg">
						Tin tức mới nhất của chúng tôi
					</h1>
					<div className="flex flex-col justify-center items-center">
						<p className="text-lg md:text-xl mb-4 text-gray-200 drop-shadow-md">
							Nguồn tin tức và cập nhật mới nhất từ tỉnh của chúng tôi.
						</p>
						<p className="text-lg md:text-xl mb-4 text-gray-200 drop-shadow-md">
							Nơi kết nối cộng đồng với những thông tin đáng tin cậy và kịp thời.
						</p>
					</div>
					<div className="h-1 w-16 bg-blue-500 mx-auto mt-6"></div>
				</div>
				{/* Content */}
				<div className="absolute left-1/2 transform -translate-x-1/2 bg-transparent z-10 text-white py-2 text-sm text-center">
					<p className="z-10">Thông tin ngày hôm nay: {currentDate}</p>
				</div>
			</section>



			{/* Main content area */}
			<div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Today's Picks - Left sidebar */}
				<div className="lg:col-span-4">
					<div className="flex items-center mb-6">
						<div className="w-1 h-8 bg-blue-600 mr-4"></div>
						<h2 className="text-2xl font-bold">TIN TỨC HÔM NAY</h2>
					</div>
					<TodaysPicks />
				</div>

				{/* Featured stories - Right area */}
				<div className="lg:col-span-8 space-y-12">
					<FeaturedStory />

					{/* Category sections */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{
							categoryNews?.map((category: any) => (
								<CategoryNews category={category} limit={3} key={category.id} />
							))
						}
					</div>
				</div>
			</div>
		</main>
	)
}

