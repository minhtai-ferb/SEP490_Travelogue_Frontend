"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Calendar, Users, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface WorkshopResponseItem {
	id: string
	name: string
	description: string
	content: string
	status: number
	craftVillageId: string
	locationId: string
	craftVillageName: string
	ticketTypes?: any[]
	schedules?: any[]
	recurringRules?: any[]
	exceptions?: any[]
	medias?: any[]
}

interface WorkshopCardProps {
	workshop: WorkshopResponseItem
	onDelete?: (id: string) => void
}

export default function WorkshopCard({ workshop, onDelete }: WorkshopCardProps) {
	const router = useRouter()

	const getStatusInfo = (status: number) => {
		switch (status) {
			case 1:
				return { text: 'Đã duyệt', variant: 'default' as const, color: 'bg-green-100 text-green-800' }
			case 0:
				return { text: 'Chờ duyệt', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' }
			case -1:
				return { text: 'Bị từ chối', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
			default:
				return { text: 'Không xác định', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
		}
	}

	const statusInfo = getStatusInfo(workshop.status)
	const hasImage = workshop.medias && workshop.medias.length > 0
	const imageUrl = hasImage ? workshop.medias![0].url : "/default_image.png"

	const handleView = () => {
		router.push(`/craftvillage/dashboard/workshop/${workshop.id}`)
	}

	const handleEdit = () => {
		router.push(`/craftvillage/dashboard/workshop/${workshop.id}/edit`)
	}

	const handleDelete = () => {
		if (onDelete) {
			onDelete(workshop.id)
		}
	}

	return (
		<Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
			{/* Image */}
			<div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
				<Image
					src={imageUrl}
					alt={workshop.name}
					fill
					className="object-cover"
					onError={(e) => {
						const target = e.target as HTMLImageElement
						target.src = "/default_image.png"
					}}
				/>
				<div className="absolute top-2 right-2">
					<Badge variant={statusInfo.variant} className={statusInfo.color}>
						{statusInfo.text}
					</Badge>
				</div>
			</div>

			{/* Content */}
			<CardHeader className="flex-grow">
				<CardTitle className="line-clamp-2 text-lg">{workshop.name}</CardTitle>
				<CardDescription className="line-clamp-3">
					{workshop.description}
				</CardDescription>
			</CardHeader>

			{/* Metadata */}
			<CardContent className="pt-0 space-y-2">
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<MapPin className="h-4 w-4" />
					<span className="truncate">{workshop.craftVillageName}</span>
				</div>

				{workshop.ticketTypes && workshop.ticketTypes.length > 0 && (
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Users className="h-4 w-4" />
						<span>{workshop.ticketTypes.length} loại vé</span>
					</div>
				)}

				{workshop.schedules && workshop.schedules.length > 0 && (
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Calendar className="h-4 w-4" />
						<span>{workshop.schedules.length} lịch trình</span>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-2 pt-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={handleView}
					>
						<Eye className="h-4 w-4 mr-1" />
						Xem
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={handleEdit}
					>
						<Edit className="h-4 w-4 mr-1" />
						Sửa
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleDelete}
						className="text-red-600 hover:text-red-700"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
