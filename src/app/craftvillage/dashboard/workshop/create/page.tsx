"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WorkshopCreateForm from "../organisms/WorkshopCreateForm"
import ActivitiesForm from "./steps/ActivitiesForm"
import SchedulesForm from "./steps/SchedulesForm"

export default function WorkshopCreateFlowPage() {
	const [workshopId, setWorkshopId] = useState<string | null>(null)
	const [step, setStep] = useState<number>(1)

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Tạo workshop</CardTitle>
					<div className="text-sm text-gray-500">Bước {step} / 3</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{step === 1 && (
						<WorkshopCreateForm onCreated={(id) => { setWorkshopId(id); setStep(2) }} />
					)}
					{step === 2 && workshopId && (
						<ActivitiesForm workshopId={workshopId} onNext={() => setStep(3)} onBack={() => setStep(1)} />
					)}
					{step === 3 && workshopId && (
						<SchedulesForm workshopId={workshopId} onBack={() => setStep(2)} />
					)}
					{!workshopId && step > 1 && (
						<div className="text-sm text-red-500">Vui lòng tạo workshop trước khi tiếp tục.</div>
					)}
				</CardContent>
			</Card>
			{step > 1 && (
				<div className="flex justify-between">
					<Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))}>Quay lại</Button>
					{step < 3 && <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>Tiếp tục</Button>}
				</div>
			)}
		</div>
	)
}


