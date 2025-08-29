"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { TourWizard } from "@/app/(manage)/components/tour-management/TourWizard"

export default function TourCreateClient({ href }: { href: string }) {
	const router = useRouter()
	const [error, setError] = useState("")

	const handleBack = () => {
		router.push(href)
	}

	const handleComplete = () => {
		router.push(href)
	}

	return (
		<div className="container mx-auto p-6 max-w-6xl">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-bold">Tạo chuyến tham quan mới</h1>
					<p className="text-gray-600 mt-1">Tạo chuyến tham quan mới với 3 bước</p>
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
					<CardTitle>Tạo chuyến tham quan</CardTitle>
				</CardHeader>
				<CardContent>
					<TourWizard onComplete={handleComplete} onCancel={handleBack} />
				</CardContent>
			</Card>
		</div>
	)
}
