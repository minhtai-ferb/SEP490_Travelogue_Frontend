"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Camera, ImageIcon, Save } from 'lucide-react'

interface Certification {
	id?: string
	name: string
	imageUrl?: string
}

export function ProfileQuickSection() {
	const [fullName, setFullName] = useState("Nguyễn Văn Hướng")
	const [phone, setPhone] = useState("0901234567")
	const [bio, setBio] = useState(
		"Tôi là hướng dẫn viên du lịch chuyên về các tour văn hóa và lịch sử Việt Nam. Đam mê trải nghiệm và chia sẻ.",
	)
	const [languages, setLanguages] = useState<string[]>(["Tiếng Việt", "English"])
	const [certs, setCerts] = useState<Certification[]>([
		{ id: "1", name: "Hướng dẫn viên du lịch quốc gia", imageUrl: "/placeholder.svg?height=200&width=300" },
	])
	const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=120&width=120")
	const avatarInput = useRef<HTMLInputElement>(null)

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Cập nhật nhanh hồ sơ</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center gap-4">
						<img src={avatarUrl || "/placeholder.svg"} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
						<div className="flex gap-2">
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
									const file = e.target.files?.[0]
									if (file) {
										const url = URL.createObjectURL(file)
										setAvatarUrl(url)
									}
								}}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<Label>Họ và tên</Label>
							<Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
						</div>
						<div>
							<Label>Số điện thoại</Label>
							<Input value={phone} onChange={(e) => setPhone(e.target.value)} />
						</div>
					</div>

					<div>
						<Label>Giới thiệu</Label>
						<Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
					</div>

					<div className="space-y-2">
						<Label>Ngôn ngữ</Label>
						<div className="flex flex-wrap gap-2">
							{languages.map((l, i) => (
								<Badge key={i} variant="secondary">
									{l}
								</Badge>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Chứng nhận</Label>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{certs.map((c, i) => (
								<div key={i} className="border rounded-lg p-3 bg-gray-50">
									<div className="font-medium">{c.name}</div>
									<div className="mt-2">
										<img
											src={c.imageUrl || "/placeholder.svg?height=120&width=200&query=certificate"}
											alt={c.name}
											className="w-full h-24 object-cover rounded-md border"
										/>
									</div>
								</div>
							))}
						</div>
						<Button variant="outline" className="bg-transparent">
							<ImageIcon className="w-4 h-4 mr-2" />
							Thêm chứng nhận
						</Button>
					</div>

					<div className="flex justify-end">
						<Button>
							<Save className="w-4 h-4 mr-2" />
							Lưu thay đổi
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Quản lý chi tiết hồ sơ</CardTitle>
				</CardHeader>
				<CardContent className="text-sm text-gray-600">
					Bạn có thể quản lý hồ sơ đầy đủ hơn (đổi mật khẩu, cập nhật chứng chỉ kèm hình, v.v.) tại trang Hồ sơ chi tiết.
					<div className="mt-3">
						<a
							href="/tour-guide/profile"
							className="inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800"
						>
							Mở trang hồ sơ chi tiết
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
