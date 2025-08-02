"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"
import type { Tour } from "@/types/Tour"

interface DeleteConfirmationProps {
	tour: Tour
	onConfirm: () => void
	onCancel: () => void
	isLoading: boolean
}

export function DeleteConfirmation({ tour, onConfirm, onCancel, isLoading }: DeleteConfirmationProps) {
	return (
		<div className="space-y-4">
			<Alert className="border-red-200 bg-red-50">
				<AlertTriangle className="h-4 w-4 text-red-600" />
				<AlertDescription className="text-red-800">
					<div>
						<h4 className="font-semibold">Xác nhận xóa tour</h4>
						<p className="text-sm mt-1">Hành động này không thể hoàn tác. Tour sẽ bị xóa vĩnh viễn.</p>
					</div>
				</AlertDescription>
			</Alert>

			<div className="space-y-2">
				<p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa tour:</p>
				<Card className="bg-gray-50">
					<CardContent className="p-3">
						<p className="font-semibold">{tour.name}</p>
						<p className="text-sm text-gray-600">{tour.description}</p>
					</CardContent>
				</Card>
			</div>

			<div className="flex justify-end gap-3 pt-4">
				<Button variant="outline" onClick={onCancel} disabled={isLoading}>
					Hủy
				</Button>
				<Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Xóa Tour
				</Button>
			</div>
		</div>
	)
}
