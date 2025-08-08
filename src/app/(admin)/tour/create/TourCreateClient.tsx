"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { TourWizard } from "../../../../components/tour-management/TourWizard"
// Note: Tour creation now happens inside the wizard; no data is returned here

export default function TourCreateClient() {
	const router = useRouter()
	const [error, setError] = useState("")

	const handleBack = () => {
		router.push("/tour")
	}

	const handleComplete = () => {
		router.push("/tour")
	}

	return (
		<div className="container mx-auto p-6 max-w-6xl">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
					<ArrowLeft className="w-4 h-4" />
					Quay lại
				</Button>
				<div>
					<h1 className="text-3xl font-bold">Tạo Tour Mới</h1>
					<p className="text-gray-600 mt-1">Tạo tour du lịch mới với wizard 3 bước</p>
				</div>
			</div>

			{error && (
				<Alert className="mb-6 border-red-200 bg-red-50">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{error}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Tạo Tour</CardTitle>
				</CardHeader>
				<CardContent>
					<TourWizard onComplete={handleComplete} onCancel={handleBack} />
				</CardContent>
			</Card>
		</div>
	)
}
