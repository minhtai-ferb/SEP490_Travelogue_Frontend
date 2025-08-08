"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import Sidebar from "./sidebar"
import ToursGrid from "./tour-grid"
import TripPlansBoard from "./trip-plans-board"

export default function ManagerClient() {
	const [active, setActive] = useState<"tours" | "trip-plans">("tours")
	const [subTab, setSubTab] = useState<"current" | "history">("current")

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Top bar similar to PREP */}
			<header className="sticky top-0 z-30 bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-md bg-blue-600" />
							<span className="font-semibold">Guide Center</span>
						</div>
						<div className="hidden sm:block w-px h-6 bg-gray-200" />
						<span className="text-sm text-gray-500 hidden sm:block">Giao diện thân thiện để quản lý công việc</span>
					</div>
					<div className="flex items-center gap-2">
						{/* <Button variant="ghost" size="icon" aria-label="Thông báo">
							<Bell className="w-5 h-5" />
						</Button>
						<Button variant="ghost" size="icon" aria-label="Trợ giúp">
							<HelpCircle className="w-5 h-5" />
						</Button> */}
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
				<aside className="bg-white border-r hidden md:block">
					<Sidebar active={active} onChange={setActive} />
				</aside>

				<main className="p-4 sm:p-6">
					{/* Hero/Heading like PREP */}
					<div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 shadow-md">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h1 className="text-2xl sm:text-3xl font-bold">
									{active === "tours" ? "Tour của tôi" : "Lịch trình của tôi"}
								</h1>
								<p className="mt-1 text-blue-100">
									{active === "tours"
										? "Quản lý các tour bạn đang phụ trách: lịch khởi hành, giá, tình trạng, lịch trình."
										: "Xem và xử lý các yêu cầu/đặt lịch của khách cho bạn."}
								</p>
							</div>
						</div>

						<div className="mt-4">
							<Tabs value={subTab} onValueChange={(v) => setSubTab(v as any)} className="w-full">
								<TabsList className="bg-white/20 backdrop-blur text-white">
									<TabsTrigger value="current" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
										{active === "tours" ? "Tour hiện tại" : "Đang xử lý"}
									</TabsTrigger>
									<TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
										{active === "tours" ? "Lịch sử" : "Đã hoàn thành"}
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					</div>

					{/* Content */}
					<div className="mt-6">
						{active === "tours" ? <ToursGrid view={subTab === "history" ? "history" : "current"} /> : <TripPlansBoard />}
					</div>
				</main>
			</div>
		</div>
	)
}
