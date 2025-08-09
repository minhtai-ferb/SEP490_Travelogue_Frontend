"use client"

import type React from "react"

import { useMemo, useRef, useState } from "react"
import { useTourguideAssign } from "@/services/tourguide"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, FileText, ImageUp, Loader2, ShieldCheck, Trash2, UploadCloud } from "lucide-react"
import toast from "react-hot-toast"

type LocalFile = {
	id: string
	file: File
	previewUrl: string
	status: "pending" | "uploading" | "uploaded" | "error"
	progress: number
}

export default function RegisterTourGuideClient() {
	const { uploadCertifications, createCertification, loading } = useTourguideAssign()

	const [name, setName] = useState("")
	const [files, setFiles] = useState<LocalFile[]>([])
	const [dragOver, setDragOver] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const canSubmit = useMemo(() => {
		const hasUploaded = files.some((f) => f.status === "uploaded")
		return !!name && hasUploaded && !loading
	}, [name, files, loading])

	function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const list = e.target.files ? Array.from(e.target.files) : []
		addFiles(list)
	}

	function addFiles(list: File[]) {
		const accepted = list.filter((f) => {
			const okType =
				f.type.startsWith("image/") || f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
			const okSize = f.size <= 8 * 1024 * 1024 // 8MB
			if (!okType) {
				toast.error(`${f.name} không phải hình/PDF`)
			}
			if (!okSize) {
				toast.error(`${f.name} > 8MB`)
			}
			return okType && okSize
		})

		const mapped: LocalFile[] = accepted.map((f) => ({
			id: `${f.name}-${f.size}-${crypto.randomUUID()}`,
			file: f,
			previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
			status: "pending",
			progress: 0,
		}))
		setFiles((prev) => [...prev, ...mapped])
	}

	async function handleUpload() {
		const pendings = files.filter((f) => f.status === "pending")
		if (pendings.length === 0) {
			toast.error("Vui lòng chọn tệp chứng chỉ trước.")
			return
		}

		// Mark uploading
		setFiles((prev) => prev.map((f) => (f.status === "pending" ? { ...f, status: "uploading", progress: 5 } : f)))

		try {
			// Simulate chunk progress while waiting for API
			const timer = setInterval(() => {
				setFiles((prev) =>
					prev.map((f) => (f.status === "uploading" ? { ...f, progress: Math.min(95, f.progress + 7) } : f)),
				)
			}, 180)

			const urls = await uploadCertifications(pendings.map((p) => p.file))

			clearInterval(timer)

			// Map returned urls to first N uploading files
			setFiles((prev: any) => {
				const uploading = prev.filter((f: any) => f.status === "uploading")
				const others = prev.filter((f: any) => f.status !== "uploading")
				const done = uploading.map((f: any, i: any) => ({
					...f,
					status: urls[i] ? "uploaded" : "error",
					progress: 100,
					previewUrl: f.previewUrl || urls[i] || f.previewUrl,
					// keep original preview for PDFs
				}))
				return [...others, ...done]
			})

			toast.success(`Đã tải lên ${urls.length} tệp`)
		} catch (e: any) {
			setFiles((prev: any) => prev.map((f: any) => (f.status === "uploading" ? { ...f, status: "error", progress: 0 } : f)))
			toast.error(e?.message || "Vui lòng thử lại.")
		}
	}

	function removeFile(id: string) {
		setFiles((prev: any) => prev.filter((f: any) => f.id !== id))
	}

	async function handleSubmit() {
		const firstUploaded = files.find((f: any) => f.status === "uploaded")
		if (!name) {
			toast.error("Thiếu tên chứng chỉ")
			return
		}
		if (!firstUploaded) {
			toast.error("Chưa có tệp đã tải lên")
			return
		}
		try {
			await createCertification({ name, certificateUrl: firstUploaded.previewUrl })
			toast.success("Đăng ký chứng chỉ thành công")
			setName("")
			setFiles([])
		} catch (e: any) {
			toast.error(e?.message || "Không thể tạo chứng chỉ")
		}
	}

	return (
		<div className="mx-auto max-w-4xl p-4 sm:p-6">
			<Card className="overflow-hidden">
				<div className="relative h-28 bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600">
					<div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
					<div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
						<div className="text-white">
							<div className="flex items-center gap-2">
								<ShieldCheck className="h-5 w-5" />
								<span className="text-sm/6 opacity-90">Trung tâm xác thực chứng chỉ</span>
							</div>
							<h1 className="text-xl sm:text-2xl font-semibold mt-1">Đăng ký Hướng dẫn viên - Chứng chỉ</h1>
						</div>
						<div className="hidden sm:flex items-center gap-2 text-white/90">
							<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
								1. Nhập tên
							</Badge>
							<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
								2. Tải tệp
							</Badge>
							<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
								3. Gửi duyệt
							</Badge>
						</div>
					</div>
				</div>

				<CardHeader className="pb-2">
					<CardTitle>Thông tin chứng chỉ</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Name */}
					<div className="grid sm:grid-cols-3 gap-3">
						<div className="sm:col-span-2">
							<Label htmlFor="certName">Tên chứng chỉ</Label>
							<Input
								id="certName"
								placeholder="VD: Hướng dẫn viên du lịch quốc gia"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<p className="text-xs text-muted-foreground mt-1">Đặt đúng tên theo văn bản gốc để duyệt nhanh hơn.</p>
						</div>
						<div className="flex items-end">
							<Button
								type="button"
								variant="outline"
								className="w-full bg-transparent"
								onClick={() => inputRef.current?.click()}
							>
								<ImageUp className="h-4 w-4 mr-2" />
								Chọn tệp
							</Button>
							<input
								ref={inputRef}
								id="hiddenFile"
								type="file"
								multiple
								accept="image/*,application/pdf"
								className="hidden"
								onChange={onPickFiles}
							/>
						</div>
					</div>

					{/* Dropzone */}
					<div
						className={[
							"relative rounded-xl border-2 border-dashed p-6 transition-all",
							dragOver ? "border-indigo-500 bg-indigo-50" : "border-muted-foreground/30",
						].join(" ")}
						onDragEnter={(e) => {
							e.preventDefault()
							setDragOver(true)
						}}
						onDragOver={(e) => {
							e.preventDefault()
							setDragOver(true)
						}}
						onDragLeave={() => setDragOver(false)}
						onDrop={(e) => {
							e.preventDefault()
							setDragOver(false)
							const list = Array.from(e.dataTransfer.files || [])
							addFiles(list)
						}}
					>
						<div className="pointer-events-none absolute inset-0 rounded-xl" />
						<div className="flex flex-col items-center text-center">
							<UploadCloud className="h-8 w-8 text-indigo-600 mb-2" />
							<div className="font-medium">Kéo & thả tệp chứng chỉ vào đây</div>
							<div className="text-sm text-muted-foreground">Hỗ trợ hình ảnh hoặc PDF, tối đa 8MB mỗi tệp</div>
							<Button
								type="button"
								size="sm"
								variant="secondary"
								className="mt-3"
								onClick={() => inputRef.current?.click()}
							>
								Chọn từ máy
							</Button>
						</div>
					</div>

					{/* Selected list */}
					{files.length > 0 && (
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="text-sm text-muted-foreground">Đã chọn {files.length} tệp</div>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={handleUpload}
										disabled={loading || !files.some((f: any) => f.status === "pending")}
									>
										{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImageUp className="h-4 w-4 mr-2" />}
										Tải chứng chỉ
									</Button>
									<Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
										{loading ? (
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										) : (
											<CheckCircle2 className="h-4 w-4 mr-2" />
										)}
										Gửi đăng ký
									</Button>
								</div>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								{files.map((f: any) => (
									<div key={f.id} className="rounded-lg border p-3 bg-card">
										<div className="flex gap-3">
											{/* Preview */}
											<div className="w-28 h-28 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
												{f.file.type.startsWith("image/") ? (
													<img
														src={f.previewUrl || "/placeholder.svg?height=120&width=120&query=certificate"}
														alt={f.file.name}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="flex flex-col items-center text-muted-foreground">
														<FileText className="h-8 w-8" />
														<span className="text-xs mt-2">PDF</span>
													</div>
												)}
											</div>

											{/* Meta + actions */}
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-2">
													<div className="truncate">
														<div className="font-medium truncate">{f.file.name}</div>
														<div className="text-xs text-muted-foreground">
															{(f.file.size / 1024 / 1024).toFixed(2)} MB
														</div>
													</div>
													<Button size="icon" variant="ghost" onClick={() => removeFile(f.id)} aria-label="Xóa">
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>

												{/* Status */}
												<div className="mt-2">
													{f.status === "pending" && (
														<Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
															Chưa tải
														</Badge>
													)}
													{f.status === "uploading" && (
														<div className="space-y-2">
															<Progress value={Math.max(5, f.progress)} />
															<div className="text-xs text-muted-foreground">
																Đang tải... {Math.max(5, Math.floor(f.progress))}%
															</div>
														</div>
													)}
													{f.status === "uploaded" && <Badge className="bg-emerald-600">Đã tải</Badge>}
													{f.status === "error" && <Badge variant="destructive">Lỗi</Badge>}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Guidance */}
							<div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
								Mẹo duyệt nhanh: Ảnh rõ nét, không che mờ thông tin; PDF nên xuất từ bản gốc. Có thể gửi nhiều loại
								chứng chỉ khác nhau, hệ thống sẽ tổng hợp.
							</div>
						</div>
					)}

					{/* Empty state */}
					{files.length === 0 && (
						<div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
							Chưa có tệp nào được chọn. Kéo thả hoặc bấm “Chọn tệp” để bắt đầu.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
