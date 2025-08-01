"use client"
import { Button, Card, CardBody } from "@heroui/react"
import { AlertTriangle } from "lucide-react"
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
			<Card className="border-danger-200 bg-danger-50">
				<CardBody className="flex flex-row items-center gap-3 p-4">
					<AlertTriangle className="w-6 h-6 text-danger flex-shrink-0" />
					<div>
						<h4 className="font-semibold text-danger">Xác nhận xóa tour</h4>
						<p className="text-sm text-danger-600">Hành động này không thể hoàn tác. Tour sẽ bị xóa vĩnh viễn.</p>
					</div>
				</CardBody>
			</Card>

			<div className="space-y-2">
				<p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa tour:</p>
				<div className="p-3 bg-gray-100 rounded-lg">
					<p className="font-semibold">{tour.name}</p>
					<p className="text-sm text-gray-600">{tour.description}</p>
				</div>
			</div>

			<div className="flex justify-end gap-3 pt-4">
				<Button variant="light" onPress={onCancel} isDisabled={isLoading}>
					Hủy
				</Button>
				<Button color="danger" onPress={onConfirm} isLoading={isLoading}>
					Xóa Tour
				</Button>
			</div>
		</div>
	)
}
