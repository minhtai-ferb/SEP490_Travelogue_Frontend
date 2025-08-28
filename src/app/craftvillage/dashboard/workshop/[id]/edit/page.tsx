"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWorkshop } from "@/services/use-workshop"
import type { MediaDto, UpdateWorkshopDto, WorkshopDetail } from "@/types/Workshop"
import toast from "react-hot-toast"
import { ImageUpload } from "@/app/(manage)/components/locations/create/components/image-upload"
import BreadcrumbHeader from "@/components/common/breadcrumb-header"

export default function EditWorkshopPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const { getWorkshopDetail, updateWorkshop, loading } = useWorkshop()
	const [detail, setDetail] = useState<WorkshopDetail | null>(null)
	const [form, setForm] = useState<UpdateWorkshopDto>({ name: "", description: "", content: "", mediaDtos: [] })

	useEffect(() => {
		const load = async () => {
			if (!params?.id) return
			try {
				const res = await getWorkshopDetail(String(params.id))
				setDetail(res)
				setForm({
					name: res?.name || "",
					description: res?.description || "",
					content: res?.content || "",
					mediaDtos: res?.mediaDtos || [],
				})
			} catch (e: any) {
				toast.error(e?.response?.data?.message || "Không tải được dữ liệu workshop")
			}
		}
		load()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params?.id])

	const handleChange = (field: keyof UpdateWorkshopDto, value: any) => {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	const handleImagesChange = (mediaDtos: MediaDto[]) => {
		setForm((prev) => ({ ...prev, mediaDtos }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!params?.id) return
		try {
			await updateWorkshop(String(params.id), form)
			toast.success("Cập nhật workshop thành công")
			router.push("/craftvillage/dashboard/workshop")
		} catch (e: any) {
			toast.error(e?.response?.data?.message || "Cập nhật workshop thất bại")
		}
	}

	const breadcrumbItems = {
		items: [
			{
				label: "Dashboard",
				href: "/craftvillage/dashboard",
			},
			{
				label: "Workshop",
				href: "/craftvillage/dashboard/workshop",
			},
			{
				label: "Chỉnh sửa workshop",
			},
		],
	}

	return (
		<div className="space-y-6">
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Chỉnh sửa workshop {detail?.name}</CardTitle>
					<Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Tên workshop</Label>
							<Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Mô tả</Label>
							<Textarea id="description" rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="content">Nội dung</Label>
							<Textarea id="content" rows={5} value={form.content} onChange={(e) => handleChange("content", e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label>Hình ảnh</Label>
							<ImageUpload mediaDtos={form.mediaDtos as MediaDto[]} onChange={handleImagesChange} isLoading={loading} />
						</div>
						<div className="flex justify-end">
							<Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}


