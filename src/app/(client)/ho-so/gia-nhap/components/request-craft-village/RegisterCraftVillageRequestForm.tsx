"use client"

import { useCallback, useMemo, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCraftVillage } from "@/services/use-craftvillage"
import { useDistrictManager } from "@/services/district-manager"
import { AddressSearchWithMap } from "./components/organisms/AddressSearchWithMap"
import { ImageUpload } from "@/app/admin/locations/create/components/image-upload"
import type { MediaDto } from "@/app/admin/locations/create/types/CreateLocation"
import toast from "react-hot-toast"
import { Loader2, FileCog, MapPin, Clock, Award } from "lucide-react"

type FieldErrors = Record<string, string | undefined>

export default function RegisterCraftVillageRequestForm() {
	const { createCraftVillageRequest, loading } = useCraftVillage()
	const { getAllDistrict } = useDistrictManager()

	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [content, setContent] = useState("")
	const [districtId, setDistrictId] = useState("")
	const [address, setAddress] = useState("")
	const [latitude, setLatitude] = useState<number>(11.314528)
	const [longitude, setLongitude] = useState<number>(106.086614)
	const [openTime, setOpenTime] = useState("08:00")
	const [closeTime, setCloseTime] = useState("17:00")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [email, setEmail] = useState("")
	const [website, setWebsite] = useState("")
	const [workshopsAvailable, setWorkshopsAvailable] = useState(false)
	const [signatureProduct, setSignatureProduct] = useState("")
	const [yearsOfHistory, setYearsOfHistory] = useState<number | "">("")
	const [isRecognizedByUnesco, setIsRecognizedByUnesco] = useState(false)
	const [mediaDtos, setMediaDtos] = useState<MediaDto[]>([])

	const [errors, setErrors] = useState<FieldErrors>({})
	const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([])

	useMemo(() => {
		getAllDistrict().then((list) => {
			setDistrictOptions(list.map((d: any) => ({ value: d.id, label: d.name })))
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
	const isValidWebsite = (v: string) => {
		if (!v) return true
		try {
			// eslint-disable-next-line no-new
			new URL(v.startsWith("http") ? v : `https://${v}`)
			return true
		} catch {
			return false
		}
	}
	const isValidCoordinates = (lat: number, lng: number) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180

	const validate = (): boolean => {
		const next: FieldErrors = {}
		if (!name.trim()) next.name = "Bắt buộc"
		if (!description.trim()) next.description = "Bắt buộc"
		if (!content.trim()) next.content = "Bắt buộc"
		if (!districtId) next.districtId = "Bắt buộc"
		if (!address.trim()) next.address = "Bắt buộc"
		if (!isValidCoordinates(latitude, longitude)) next.coordinates = "Tọa độ không hợp lệ"
		if (!phoneNumber.trim()) next.phoneNumber = "Bắt buộc"
		if (!email.trim() || !isValidEmail(email)) next.email = "Email không hợp lệ"
		if (!isValidWebsite(website)) next.website = "Website không hợp lệ"
		if (!signatureProduct.trim()) next.signatureProduct = "Bắt buộc"
		if (yearsOfHistory === "" || Number.isNaN(Number(yearsOfHistory))) next.yearsOfHistory = "Bắt buộc"
		if ((Number(yearsOfHistory) || 0) < 1 || (Number(yearsOfHistory) || 0) > 2000) next.yearsOfHistory = "1 - 2000"
		if (openTime >= closeTime) next.closeTime = "Đóng cửa phải sau mở cửa"
		if (!mediaDtos.length) next.mediaDtos = "Vui lòng tải lên ít nhất 1 ảnh"

		setErrors(next)
		return Object.keys(next).length === 0
	}

	const onAddressChange = useCallback((addr: string, lat: number, lng: number) => {
		setAddress(addr)
		setLatitude(lat)
		setLongitude(lng)
		setErrors((e) => ({ ...e, address: undefined, coordinates: undefined }))
	}, [])

	const toHHMMSS = (time: string): string => {
		// input from <input type="time"> usually is HH:mm
		if (!time) return "00:00:00"
		return time.length === 5 ? `${time}:00` : time
	}

	const buildPayload = () => ({
		name: name.trim(),
		description: description.trim(),
		content: content.trim(),
		address: address.trim(),
		latitude,
		longitude,
		openTime: toHHMMSS(openTime),
		closeTime: toHHMMSS(closeTime),
		districtId,
		phoneNumber: phoneNumber.replace(/\s/g, ""),
		email: email.trim(),
		website: website.trim(),
		workshopsAvailable,
		signatureProduct: signatureProduct.trim(),
		yearsOfHistory: Number(yearsOfHistory) || 0,
		isRecognizedByUnesco,
		mediaDtos,
	})

	const onSubmit = async () => {
		if (!validate()) {
			toast.error("Vui lòng kiểm tra lại thông tin")
			return
		}

		try {
			const payload = buildPayload()
			const res = await createCraftVillageRequest(payload)
			console.log(res)
			toast.success("Gửi yêu cầu đăng ký làng nghề thành công")
			// reset
			setName("")
			setDescription("")
			setContent("")
			setDistrictId("")
			setAddress("")
			setLatitude(11.314528)
			setLongitude(106.086614)
			setOpenTime("08:00")
			setCloseTime("17:00")
			setPhoneNumber("")
			setEmail("")
			setWebsite("")
			setWorkshopsAvailable(false)
			setSignatureProduct("")
			setYearsOfHistory("")
			setIsRecognizedByUnesco(false)
			setMediaDtos([])
			setErrors({})
		} catch (e: any) {
			toast.error(e?.response?.data?.Message || "Không thể gửi yêu cầu, vui lòng thử lại")
		}
	}

	const hasThumbnail = mediaDtos.some((m) => m.isThumbnail)

	return (
		<div className="mx-auto max-w-6xl">
			<Card className="overflow-hidden">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileCog className="h-5 w-5 text-blue-600" /> Yêu cầu đăng ký làng nghề
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-8">
					{/* Basic Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="name">Tên làng nghề</Label>
							<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Làng nghề mây tre" />
							{errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
						</div>
						<div className="space-y-2">
							<Label>Quận/Huyện</Label>
							<Select value={districtId} onValueChange={setDistrictId}>
								<SelectTrigger>
									<SelectValue placeholder="Chọn quận/huyện" />
								</SelectTrigger>
								<SelectContent>
									{districtOptions.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.districtId && <p className="text-xs text-red-500">{errors.districtId}</p>}
						</div>
						<div className="md:col-span-2 space-y-2">
							<Label htmlFor="description">Mô tả ngắn</Label>
							<Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả 1-2 câu" />
							{errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
						</div>
						<div className="md:col-span-2 space-y-2">
							<Label htmlFor="content">Nội dung chi tiết</Label>
							<Textarea id="content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mô tả chi tiết lịch sử, sản phẩm, quy trình..." />
							{errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
						</div>
					</div>

					{/* Address & Map */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-green-600" />
							<Label>Địa chỉ & Bản đồ</Label>
						</div>
						<AddressSearchWithMap address={address} latitude={latitude} longitude={longitude} onAddressChange={onAddressChange} addressError={errors.address} coordinatesError={errors.coordinates} />
					</div>

					{/* Contact & Time */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label>Số điện thoại</Label>
							<Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="VD: 0912 345 678" />
							{errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
							{errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
						</div>
						<div className="space-y-2">
							<Label>Website</Label>
							<Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
							{errors.website && <p className="text-xs text-red-500">{errors.website}</p>}
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-purple-600" />
								<Label>Giờ hoạt động</Label>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<Label className="text-xs">Mở cửa</Label>
									<Input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
								</div>
								<div>
									<Label className="text-xs">Đóng cửa</Label>
									<Input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
								</div>
							</div>
							{errors.closeTime && <p className="text-xs text-red-500">{errors.closeTime}</p>}
						</div>
					</div>

					{/* Product & History */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Award className="h-4 w-4 text-orange-600" />
							<Label>Sản phẩm & Lịch sử</Label>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label>Sản phẩm đặc trưng</Label>
								<Input value={signatureProduct} onChange={(e) => setSignatureProduct(e.target.value)} placeholder="VD: Gốm sứ, mây tre..." />
								{errors.signatureProduct && <p className="text-xs text-red-500">{errors.signatureProduct}</p>}
							</div>
							<div className="space-y-2">
								<Label>Số năm lịch sử</Label>
								<Input type="number" value={yearsOfHistory} onChange={(e) => setYearsOfHistory(e.target.value === "" ? "" : Number(e.target.value))} placeholder="VD: 200" />
								{errors.yearsOfHistory && <p className="text-xs text-red-500">{errors.yearsOfHistory}</p>}
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="flex items-center gap-2">
								<Checkbox id="workshopsAvailable" checked={workshopsAvailable} onCheckedChange={(v) => setWorkshopsAvailable(!!v)} />
								<Label htmlFor="workshopsAvailable">Có workshop/trải nghiệm</Label>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox id="isRecognizedByUnesco" checked={isRecognizedByUnesco} onCheckedChange={(v) => setIsRecognizedByUnesco(!!v)} />
								<Label htmlFor="isRecognizedByUnesco">Được UNESCO công nhận</Label>
							</div>
						</div>
					</div>

					{/* Media Uploads */}
					<div className="space-y-2">
						<ImageUpload mediaDtos={mediaDtos} onChange={setMediaDtos} isLoading={loading} />
						{(!mediaDtos.length || !hasThumbnail) && (
							<p className="text-xs text-muted-foreground">Vui lòng tải ít nhất 1 ảnh và chọn ảnh đại diện.</p>
						)}
						{errors.mediaDtos && <p className="text-xs text-red-500">{errors.mediaDtos}</p>}
					</div>

					{/* Summary */}
					<div className="rounded-lg border p-3 bg-muted/30 text-sm text-muted-foreground space-y-1">
						<div><span className="font-medium text-foreground">Tên:</span> {name || "(chưa có)"}</div>
						<div><span className="font-medium text-foreground">Địa chỉ:</span> {address || "(chưa có)"}</div>
						<div><span className="font-medium text-foreground">Tọa độ:</span> {latitude?.toFixed(6)}, {longitude?.toFixed(6)}</div>
						<div><span className="font-medium text-foreground">Giờ:</span> {openTime} - {closeTime}</div>
						<div><span className="font-medium text-foreground">Hình ảnh:</span> {mediaDtos.length} ảnh{hasThumbnail ? " (đã chọn ảnh đại diện)" : ""}</div>
					</div>
				</CardContent>
				<CardFooter className="justify-end">
					<Button type="button" onClick={onSubmit} disabled={loading}>
						{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
						Gửi yêu cầu
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}


