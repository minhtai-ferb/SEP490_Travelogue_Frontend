"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletSection } from "@/components/tourguide/dashboard/wallet-section"
import { ToursSection } from "@/components/tourguide/dashboard/tours-section"
import { TripPlansSection } from "@/components/tourguide/dashboard/trip-plans"
import { ProfileQuickSection } from "@/components/tourguide/dashboard/profile-quick-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAtom } from "jotai"
import { userAtom } from "@/store/auth"

export default function TourGuideDashboardClient() {
	const [user] = useAtom(userAtom)

	return (
		<div>
			<div className="min-h-screen bg-gray-50">
				<header className="bg-white border-b">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
						<h1 className="text-xl sm:text-2xl font-bold">Bảng điều khiển Hướng dẫn viên</h1>
						<div className="flex items-center gap-3">
							<div className="text-right hidden sm:block">
								<div className="text-sm font-medium">{user?.fullName || "Hướng dẫn viên"}</div>
								<div className="text-xs text-gray-500">Quản lý hoạt động của bạn</div>
							</div>
							<Avatar>
								<AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40&query=avatar"} />
								<AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>

				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">Tổng quan</CardTitle>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="tours" className="w-full">
								<TabsList className="w-full flex flex-wrap">
									<TabsTrigger value="tours" className="flex-1 sm:flex-none">Tour của tôi</TabsTrigger>
									<TabsTrigger value="trip-plans" className="flex-1 sm:flex-none">Trip Plans</TabsTrigger>
									<TabsTrigger value="wallet" className="flex-1 sm:flex-none">Ví tiền</TabsTrigger>
									<TabsTrigger value="profile" className="flex-1 sm:flex-none">Hồ sơ</TabsTrigger>
								</TabsList>

								<TabsContent value="tours" className="mt-6">
									<ToursSection />
								</TabsContent>

								<TabsContent value="trip-plans" className="mt-6">
									<TripPlansSection />
								</TabsContent>

								<TabsContent value="wallet" className="mt-6">
									<WalletSection />
								</TabsContent>

								<TabsContent value="profile" className="mt-6">
									<ProfileQuickSection />
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</main>
			</div>
		</div>
	)
}
