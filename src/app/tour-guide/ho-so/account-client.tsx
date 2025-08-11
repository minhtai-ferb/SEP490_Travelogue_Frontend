"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Camera, ImageIcon, Save } from 'lucide-react'
import toast from "react-hot-toast"

export default function AccountClient() {
	const [fullName, setFullName] = useState("Nguyễn Văn Hướng")
	const [email] = useState("guide@travelogue.com")
	const [phone, setPhone] = useState("0901234567")
	const [bio, setBio] = useState(
		"Tôi là hướng dẫn viên du lịch chuyên về các tour văn hóa và lịch sử Việt Nam. Đam mê trải nghiệm và chia sẻ.",
	)
	const [languages, setLanguages] = useState<string[]>(["Tiếng Việt", "English"])
	const [certs, setCerts] = useState<{ id?: string; name: string; imageUrl?: string }[]>([
		{ id: "1", name: "Hướng dẫn viên du lịch quốc gia", imageUrl: "/placeholder.svg?height=120&width=200" },
	])
	const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=120&width=120")
	const avatarInput = useRef<HTMLInputElement>(null)

	const addCert = () => setCerts((c) => [...c, { name: "" }])

	const save = async () => {
		// call your /api/tour-guide/profile if available
		toast.success("Cập nhật tài khoản và chứng chỉ thành công.")
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-md bg-blue-600" />
						<span className="font-semibold">Tài khoản</span>
					</div>
					<Button onClick={save}>
						<Save className="w-4 h-4 mr-2" />
						Lưu thay đổi
					</Button>
				</div>
			</header>

			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 sm:p-6">
				{/* Left nav like PREP profile */}
				<aside className="bg-white rounded-xl border p-3 h-max">
					<div className="space-y-1">
						<div className="px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">Tài khoản</div>
						<div className="px-3 py-2 rounded-md hover:bg-gray-50">Mật khẩu</div>
						<div className="px-3 py-2 rounded-md hover:bg-gray-50">Chứng chỉ</div>
						<div className="px-3 py-2 rounded-md hover:bg-gray-50">Thiết bị</div>
						<div className="px-3 py-2 rounded-md hover:bg-gray-50">Lịch sử</div>
					</div>
				</aside>

				{/* Right form panel */}
				<main>
					{/* banner */}
					<div className="rounded-xl overflow-hidden border bg-white">
						<div className="h-28 bg-gradient-to-r from-blue-600 to-blue-400 relative">
							<img
								src="/reference/prep-account.png"
								alt="reference"
								className="absolute right-4 bottom-0 w-40 h-24 object-cover opacity-60"
							/>
						</div>
						<div className="p-4 sm:p-6">
							<div className="flex items-center gap-4 -mt-12">
								<img src={avatarUrl || "/placeholder.svg"} alt="avatar" className="w-20 h-20 rounded-full border-4 border-white object-cover" />
								<Button variant="outline" onClick={() => avatarInput.current?.click()}>
									<Camera className="w-4 h-4 mr-2" />
									Đổi ảnh
								</Button>
								<input
									ref={avatarInput}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										const f = e.target.files?.[0]
										if (f) setAvatarUrl(URL.createObjectURL(f))
									}}
								/>
							</div>

							<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<Label>Họ và tên</Label>
									<Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
								</div>
								<div>
									<Label>Email</Label>
									<Input value={email} disabled className="bg-gray-50" />
								</div>
								<div>
									<Label>Số điện thoại</Label>
									<Input value={phone} onChange={(e) => setPhone(e.target.value)} />
								</div>
								<div>
									<Label>Ngôn ngữ</Label>
									<div className="flex flex-wrap gap-2 mt-2">
										{languages.map((l, i) => (
											<Badge key={i} variant="secondary">
												{l}
											</Badge>
										))}
									</div>
								</div>
								<div className="sm:col-span-2">
									<Label>Giới thiệu</Label>
									<Textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
								</div>
							</div>

							{/* Certs */}
							<div className="mt-6">
								<div className="flex items-center justify-between">
									<div className="font-semibold">Chứng chỉ</div>
									<Button variant="outline" className="bg-transparent" onClick={addCert}>
										<ImageIcon className="w-4 h-4 mr-2" />
										Thêm chứng chỉ
									</Button>
								</div>
								<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
									{certs.map((c, idx) => (
										<div key={idx} className="border rounded-xl p-4 bg-gray-50">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div>
													<Label>Tên chứng chỉ</Label>
													<Input
														value={c.name}
														onChange={(e) =>
															setCerts((arr) => arr.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it)))
														}
													/>
												</div>
												<div>
													<Label>Hình ảnh</Label>
													<div className="mt-2">
														<img
															src={c.imageUrl || "/placeholder.svg?height=120&width=200&query=certificate"}
															alt={c.name || "certificate"}
															className="w-full h-24 object-cover rounded-md border"
														/>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="mt-6 flex justify-end">
								<Button onClick={save}>
									<Save className="w-4 h-4 mr-2" />
									Lưu thay đổi
								</Button>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
