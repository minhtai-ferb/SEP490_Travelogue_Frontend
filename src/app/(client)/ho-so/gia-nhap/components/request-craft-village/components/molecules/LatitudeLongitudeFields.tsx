"use client"

import { Input } from "@/components/ui/input"
import { FieldLabel } from "../atoms/FieldLabel"

interface LatitudeLongitudeFieldsProps {
	latitude: number
	longitude: number
}

export function LatitudeLongitudeFields({ latitude, longitude }: LatitudeLongitudeFieldsProps) {
	return (
		<div className="grid md:grid-cols-2 gap-4">
			<div className="space-y-2">
				<FieldLabel>Vĩ độ</FieldLabel>
				<Input type="number" step="any" value={latitude} readOnly className="bg-gray-50" />
			</div>
			<div className="space-y-2">
				<FieldLabel>Kinh độ</FieldLabel>
				<Input type="number" step="any" value={longitude} readOnly className="bg-gray-50" />
			</div>
		</div>
	)
}


