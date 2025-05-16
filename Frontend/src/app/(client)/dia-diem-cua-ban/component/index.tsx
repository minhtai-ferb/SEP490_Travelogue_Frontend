'use client'

import Navigate from '@/components/header/navigate';
import { BoxReveal } from '@/components/magicui/box-reveal';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import logo from '../../../../../public/Logo.png'
import PersonIcon from "@mui/icons-material/Person";
import { AlignJustify, LayoutDashboard, LogOut, Menu, MenuIcon, User, X } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isAdmin } from "@/lib/check-admin";
import { cn } from "@/lib/utils";
import { useAtom } from 'jotai';
import { userAtom } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { TravelogueButton } from '@/components/common/avatar-button';
import { useAuth } from '@/services/useAuth';
import { menuItems } from '@/data/region-data';
import { Avatar, Divider, Dropdown, DropdownTrigger, DropdownMenu as DropdownMenuHero, DropdownItem } from '@heroui/react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
function Header() {
	const textRef = useRef<HTMLParagraphElement>(null);
	const router = useRouter();
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [isOpen, setIsOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [user] = useAtom(userAtom);
	const { logout } = useAuth();

	const handleAdminPage = () => {
		router.push("/admin/dashboard");
	};

	// Handle scroll effect
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

	const handleExploreClick = () => {
		document.getElementById('tin-tuc-su-kien')?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleLogout = () => {
		logout();
	};

	const handleMenuToggle = () => setIsOpen(!isOpen)

	return (
		<>
			<div className={`w-full h-screen relative bg-gradient-to-br overflow-hidden`}>
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url('/thien_nhien.png')`,
						backgroundBlendMode: 'overlay',
					}}
				/>

				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

				<div className="absolute flex flex-col md:py-6 gap-3 justify-center items-center w-full">


					{isHeaderVisible && (
						<div className="relative z-10 w-full flex items-center px-6 justify-between my-auto md:py-6 lg:px-28">
							<div className="hidden lg:block">
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
											className="w-full"
										>
											<Link href='https://tinhdoan.tayninh.gov.vn/vi/' target="_blank" className="flex gap-3 items-center justify-center">
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

							{/* Tablet Menu */}
							<div className="hidden md:block lg:hidden">
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
										</>
									</DropdownMenuHero>
								</Dropdown>
							</div>
							{/* End Tablet Menu */}
							<Link href="/">
								<Image
									src={logo.src || ''}
									alt="logo_traveloge"
									width={200}
									height={200}
									className="w-10 md:w-16 lg:w-20 md:top-6 mt-3 md:left-1/2 md:-translate-x-1/2 md:fixed cursor-pointer"
								/>
							</Link>
							{/* toggle mobile menu mobile */}
							<div className="md:hidden">
								<Sheet>
									<SheetTrigger>
										<MenuIcon
											key="trigger"
											className='text-white text-4xl self-center'
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
									</SheetContent>
								</Sheet>
							</div>
							{/* End toggle mobile menu */}

							<div className={`items-center md:block hidden`}>
								{user ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<TravelogueButton
												label={user?.fullName || ""}
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
											{isAdmin() && (
												<DropdownMenuItem className="cursor-pointer">
													<Link href='/admin/dashboard' className="flex items-center">
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
														<span> Bảng điều khiển</span>
													</Link>
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
					)}

					<div className='z-10 hidden lg:block'>
						<Navigate />
					</div>
				</div>

				<div className="w-full h-full mt-20 flex flex-col items-center justify-center text-center px-4 z-20">

					<div className="min-h-[100px] sm:min-h-[120px] flex items-center">
						<BoxReveal boxColor="#ffffff" duration={0.8} width="fit-content" className='h-full'>
							<h1
								ref={textRef}
								className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold drop-shadow-md animate-slideDown tracking-wide break-words"
							>
								Địa điểm yêu thích của bạn
							</h1>
						</BoxReveal>
					</div>
				</div>
			</div >

			{/* New header visible when scrolling */}
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


								<div className="" onClick={() => router.push("/")}>
									<Image
										src="/mascot.png"
										alt="Tây Ninh Logo"
										width={50}
										height={50}
										className="fixed w-10 md:w-16 md:top-0 top-3 left-1/2 -translate-x-1/2"
									/>
								</div>

								{/* User Menu / Auth Buttons */}
								<div className="flex items-center space-x-4">
									{user ? (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<TravelogueButton
													label={user?.fullName || "Travelogue"}
													icon={<PersonIcon />}
													className="bg-transparent hidden md:flex border bg-blue-500 hover:bg-blue-300 hover:text-slate-500"
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
												{isAdmin() && (
													<DropdownMenuItem className="cursor-pointer">
														<Link href='/admin/dashboard' className="flex items-center">
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
														</Link>
													</DropdownMenuItem>
												)}
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
													<LogOut className="mr-2 h-4 w-4 text-red-600" />
													<span>Đăng xuất</span>
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
										{menuItems?.map((item, index) => (
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
		</>
	);
}

export default Header;