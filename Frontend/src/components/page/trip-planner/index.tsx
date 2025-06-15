"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TripPlanningForm from "./form"
import TripPlanDetail from "./detail"
import type { TripPlan } from "@/types/Tripplan"
import { Sparkles } from "lucide-react"

export default function TripPlannerPage() {
	const [activeTab, setActiveTab] = useState("create")
	const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null)

	const handlePlanCreated = (plan: TripPlan) => {
		setCurrentPlan(plan)
		setActiveTab("view")
	}

	const handleCreateNew = () => {
		setActiveTab("create")
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="mb-8 text-center">
					<h1 className="text-3xl md:text-4xl font-bold mb-3 text-primary">Lập kế hoạch Du lịch Tây Ninh</h1>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Tạo lịch trình du lịch cá nhân hóa với các điểm đến, làng nghề và ẩm thực đặc sắc của Tây Ninh
					</p>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-8">
						<TabsTrigger value="create">Tạo kế hoạch mới</TabsTrigger>
						<TabsTrigger value="view" disabled={!currentPlan}>
							Xem kế hoạch
						</TabsTrigger>
					</TabsList>

					<TabsContent value="create">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<span>Tạo kế hoạch du lịch</span>
									<Sparkles className="h-5 w-5 text-amber-500" />
								</CardTitle>
								<CardDescription>Chọn các địa điểm bạn muốn đến và thời gian cho chuyến đi của bạn</CardDescription>
							</CardHeader>
							<CardContent>
								<TripPlanningForm onPlanCreated={handlePlanCreated} />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="view">
						{currentPlan && (
							<div className="space-y-6">
								<TripPlanDetail plan={currentPlan} />
								<div className="flex justify-center mt-8">
									<Button onClick={handleCreateNew} variant="outline" className="mr-4">
										Tạo kế hoạch mới
									</Button>
									<Button>Lưu kế hoạch</Button>
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
