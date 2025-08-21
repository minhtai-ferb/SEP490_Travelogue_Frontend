"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { CreateWorkshopDto, MediaDto } from "@/types/Workshop"
import { useWorkshop } from "@/services/use-workshop"
import toast from "react-hot-toast"
import { ImageUpload } from "@/app/(manage)/components/locations/create/components/image-upload"

type Props = {
	onCreated?: (workshopId: string) => void
}

export default function WorkshopCreateForm({ onCreated }: Props) {
	const [form, setForm] = useState<CreateWorkshopDto>({
		name: "",
		description: "",
		content: "",
		mediaDtos: [],
	})
	const { createWorkshop, loading } = useWorkshop()
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [dirty, setDirty] = useState(false)

	const handleChange = (field: keyof CreateWorkshopDto, value: any) => {
		setForm((prev) => ({ ...prev, [field]: value }))
		setDirty(true)
	}

	const handleImagesChange = (mediaDtos: MediaDto[]) => {
		setForm((prev) => ({ ...prev, mediaDtos }))
		setDirty(true)
	}

	useEffect(() => {
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			if (dirty) {
				e.preventDefault()
				e.returnValue = ""
			}
		}
		window.addEventListener("beforeunload", onBeforeUnload)
		return () => window.removeEventListener("beforeunload", onBeforeUnload)
	}, [dirty])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const newErrors: Record<string, string> = {}
		if (!form.name.trim()) newErrors.name = "Tên workshop là bắt buộc"
		if (!form.description.trim()) newErrors.description = "Mô tả là bắt buộc"
		if (!form.content.trim()) newErrors.content = "Nội dung là bắt buộc"
		if (!Array.isArray(form.mediaDtos) || form.mediaDtos.length === 0) newErrors.mediaDtos = "Vui lòng tải lên ít nhất 1 hình ảnh"
		const thumbnailCount = (form.mediaDtos || []).filter((m) => m.isThumbnail).length
		if ((form.mediaDtos || []).length > 0 && thumbnailCount !== 1) newErrors.mediaDtos = "Vui lòng chọn đúng 1 ảnh đại diện"
		setErrors(newErrors)
		if (Object.keys(newErrors).length > 0) return
		try {
			const res = await createWorkshop(form)
			if (res?.id || res) {
				toast.success("Tạo workshop thành công")
				onCreated?.(String(res?.id || res))
				setForm({ name: "", description: "", content: "", mediaDtos: [] })
				setErrors({})
				setDirty(false)
			}
		} catch (err: any) {
			toast.error(err?.response?.data?.message || "Tạo workshop thất bại")
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tạo workshop</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Tên workshop</Label>
						<Input id="name" value={form.name} onChange={(e) => { handleChange("name", e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }} required />
						{errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Mô tả</Label>
						<Textarea id="description" rows={3} value={form.description} onChange={(e) => { handleChange("description", e.target.value); if (errors.description) setErrors((p) => ({ ...p, description: "" })) }} required />
						{errors.description && <div className="text-sm text-red-600">{errors.description}</div>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="content">Nội dung</Label>
						<Textarea id="content" rows={5} value={form.content} onChange={(e) => { handleChange("content", e.target.value); if (errors.content) setErrors((p) => ({ ...p, content: "" })) }} required />
						{errors.content && <div className="text-sm text-red-600">{errors.content}</div>}
					</div>
					<div className="space-y-2">
						<Label>Hình ảnh</Label>
						<ImageUpload mediaDtos={form.mediaDtos} onChange={handleImagesChange} isLoading={loading} />
						{errors.mediaDtos && <div className="text-sm text-red-600">{errors.mediaDtos}</div>}
					</div>
					<div className="flex justify-end">
						<Button type="submit" disabled={loading}>{loading ? "Đang tạo..." : "Tạo"}</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}


