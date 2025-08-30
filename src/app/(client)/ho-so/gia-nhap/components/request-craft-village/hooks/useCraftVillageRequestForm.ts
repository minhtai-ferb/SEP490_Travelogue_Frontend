"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

import { useCraftVillage } from "@/services/use-craftvillage"
import { useDistrictManager } from "@/services/district-manager"
import { District } from "@/types/District"
import { useTourguideAssign } from "@/services/tourguide"
import { MediaDto } from "@/app/(manage)/components/locations/create/types/CreateLocation"
import {
  CraftVillageRequest,
  timeStringToTimeString,
  WORKSHOP_STATUS
} from "@/types/CraftVillageRequest"

export interface CraftVillageFormData {
  name: string
  description: string
  content: string
  address: string
  latitude: number
  longitude: number
  openTime: string
  closeTime: string
  districtId: string
  phoneNumber: string
  email: string
  website: string
  workshopsAvailable: boolean
  signatureProduct: string
  yearsOfHistory: string
  isRecognizedByUnesco: boolean
  mediaDtos: MediaDto[]
}

export type CraftVillageFormErrors = Record<string, string>

export function useCraftVillageRequestForm() {
  const { createCraftVillageRequest } = useCraftVillage()
  const { getAllDistrict } = useDistrictManager()
  const { uploadCertifications } = useTourguideAssign()

  const [districts, setDistricts] = useState<District[]>([])
  const [formData, setFormData] = useState<CraftVillageFormData>({
    name: "",
    description: "",
    content: "",
    address: "",
    latitude: 11.3254,
    longitude: 106.1022,
    openTime: "08:00",
    closeTime: "17:00",
    districtId: "",
    phoneNumber: "",
    email: "",
    website: "",
    workshopsAvailable: false,
    signatureProduct: "",
    yearsOfHistory: "",
    isRecognizedByUnesco: false,
    mediaDtos: [],
  })

  const [errors, setErrors] = useState<CraftVillageFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Files state for `model` field (images and PDFs, up to 6) [[memory:5965260]]
  const [modelFiles, setModelFiles] = useState<File[]>([])
  const [modelPreviews, setModelPreviews] = useState<string[]>([])
  const [modelMimeTypes, setModelMimeTypes] = useState<string[]>([])
  const [modelFileNames, setModelFileNames] = useState<string[]>([])
  // Allow using pre-uploaded URLs from a custom uploader component
  const [uploadedModelUrls, setUploadedModelUrls] = useState<MediaDto[]>([])

  useEffect(() => {
    getAllDistrict().then((res) => setDistricts(res))
  }, [getAllDistrict])

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/)
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(" ")
    }
    return value
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    return cleaned.length >= 10 && cleaned.length <= 11
  }
  const validateWebsite = (website: string) => {
    if (!website) return true
    try {
      // ensure protocol
      // eslint-disable-next-line no-new
      new URL(website.startsWith("http") ? website : `https://${website}`)
      return true
    } catch {
      return false
    }
  }
  const validateCoordinates = (lat: number, lng: number) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180

  const handleInputChange = useCallback(
    (field: keyof CraftVillageFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field as string]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [errors],
  )

  const handlePhoneChange = useCallback(
    (value: string) => {
      const formatted = formatPhoneNumber(value)
      handleInputChange("phoneNumber", formatted)
    },
    [handleInputChange],
  )

  const handleAddressChange = useCallback(
    (address: string, lat: number, lng: number) => {
      setFormData((prev) => ({ ...prev, address, latitude: lat, longitude: lng }))
      if (errors.address || errors.latitude || errors.longitude) {
        setErrors((prev) => ({ ...prev, address: "", latitude: "", longitude: "" }))
      }
    },
    [errors],
  )

  const validateForm = (): boolean => {
    const newErrors: CraftVillageFormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Tên làng nghề là bắt buộc"
    if (!formData.description.trim()) newErrors.description = "Mô tả ngắn là bắt buộc"
    if (!formData.content.trim()) newErrors.content = "Nội dung chi tiết là bắt buộc"
    if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc"
    if (!formData.districtId) newErrors.districtId = "Vui lòng chọn quận/huyện"
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Số điện thoại là bắt buộc"
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc"
    if (!formData.signatureProduct.trim()) newErrors.signatureProduct = "Sản phẩm đặc trưng là bắt buộc"
    if (!formData.yearsOfHistory.trim()) newErrors.yearsOfHistory = "Số năm lịch sử là bắt buộc"
    if (uploadedModelUrls.length === 0 && modelFiles.length === 0) newErrors.mediaDtos = "Vui lòng chọn ít nhất 1 hình ảnh"

    if (formData.email && !validateEmail(formData.email)) newErrors.email = "Email không hợp lệ"
    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) newErrors.phoneNumber = "Số điện thoại không hợp lệ (10-11 số)"
    if (formData.website && !validateWebsite(formData.website)) newErrors.website = "Website không hợp lệ"
    if (!validateCoordinates(formData.latitude, formData.longitude)) newErrors.coordinates = "Tọa độ không hợp lệ"

    const years = Number.parseInt(formData.yearsOfHistory)
    if (Number.isNaN(years) || years < 1 || years > 2000) newErrors.yearsOfHistory = "Số năm lịch sử phải từ 1 đến 2000"

    if (formData.openTime >= formData.closeTime) newErrors.closeTime = "Giờ đóng cửa phải sau giờ mở cửa"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const timeToTimeSpan = (timeString: string): string => {
    const [h, m] = timeString.split(":")
    const hh = String(h).padStart(2, "0")
    const mm = String(m).padStart(2, "0")
    return `${hh}:${mm}:00`
  }

  const handleModelFileChange = (filesList: FileList | null) => {
    const files = Array.from(filesList || [])
    if (files.length === 0) return

    if (modelFiles.length + files.length > 6) {
      toast.error("Tối đa chỉ được upload 6 tập tin (ảnh/PDF)")
      return
    }

    const validFiles: File[] = []
    const validPreviews: string[] = []
    const validTypes: string[] = []
    const validNames: string[] = []

    for (const file of files) {
      const isImage = file.type.startsWith("image/")
      const isPdf = file.type === "application/pdf"
      if (!isImage && !isPdf) {
        toast.error(`${file.name} không phải là hình ảnh hoặc PDF`)
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} có kích thước vượt quá 5MB`)
        continue
      }
      validFiles.push(file)
      validTypes.push(file.type)
      validNames.push(file.name)
      validPreviews.push(URL.createObjectURL(file))
    }

    if (validFiles.length > 0) {
      setModelFiles((prev) => [...prev, ...validFiles])
      setModelPreviews((prev) => [...prev, ...validPreviews])
      setModelMimeTypes((prev) => [...prev, ...validTypes])
      setModelFileNames((prev) => [...prev, ...validNames])
    }

    if (errors.mediaDtos) setErrors((prev) => ({ ...prev, mediaDtos: "" }))
  }

  const removeModelFile = (index: number) => {
    setModelFiles((prev) => prev.filter((_, i) => i !== index))
    setModelPreviews((prev) => {
      const next = prev.filter((_, i) => i !== index)
      URL.revokeObjectURL(prev[index])
      return next
    })
    setModelMimeTypes((prev) => prev.filter((_, i) => i !== index))
    setModelFileNames((prev) => prev.filter((_, i) => i !== index))
  }

  const requestPayload = useMemo(() => {
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      content: formData.content.trim(),
      address: formData.address.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      openTime: timeStringToTimeString(formData.openTime),
      closeTime: timeStringToTimeString(formData.closeTime),
      districtId: formData.districtId,
      phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
      email: formData.email.trim(),
      website: formData.website.trim() || null,
      workshopsAvailable: formData.workshopsAvailable,
      signatureProduct: formData.signatureProduct.trim(),
      yearsOfHistory: Number.parseInt(formData.yearsOfHistory),
      isRecognizedByUnesco: formData.isRecognizedByUnesco,
      // model will be filled after upload
      mediaDtos: [],
    }
  }, [
    formData.address,
    formData.closeTime,
    formData.content,
    formData.description,
    formData.districtId,
    formData.email,
    formData.isRecognizedByUnesco,
    formData.latitude,
    formData.longitude,
    formData.name,
    formData.openTime,
    formData.phoneNumber,
    formData.signatureProduct,
    formData.website,
    formData.workshopsAvailable,
    formData.yearsOfHistory,
  ])

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      content: "",
      address: "",
      latitude: 11.3254,
      longitude: 106.1022,
      openTime: "08:00",
      closeTime: "17:00",
      districtId: "",
      phoneNumber: "",
      email: "",
      website: "",
      workshopsAvailable: false,
      signatureProduct: "",
      yearsOfHistory: "",
      isRecognizedByUnesco: false,
      mediaDtos: [],
    })
    setModelFiles([])
    setModelPreviews([])
    setModelMimeTypes([])
    setModelFileNames([])
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent, workshopData?: any[]) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin")
      return
    }

    setIsSubmitting(true)
    try {
      // Prefer pre-uploaded URLs from custom uploader; fallback to uploading local files
      let modelUrls: MediaDto[] = uploadedModelUrls
      if ((!Array.isArray(modelUrls) || modelUrls.length === 0) && modelFiles.length > 0) {
        const uploadedUrls = await uploadCertifications(modelFiles) as unknown as MediaDto[]
        modelUrls = uploadedUrls
      } else {
        modelUrls = uploadedModelUrls
      }

      // Create the final payload with mediaDtos
      const mediaDtos = modelUrls

      const finalPayload = {
        ...requestPayload,
        mediaDtos: mediaDtos,
        // Add workshop data if provided
        ...(workshopData && workshopData.length > 0 && { workshop: workshopData[0] }) // For now, send first workshop
      }

      // Debug: Log what we're sending
      console.log("=== CRAFT VILLAGE REQUEST PAYLOAD ===")
      console.log("Final payload:", JSON.stringify(finalPayload, null, 2))
      console.log("Model URLs:", modelUrls)
      console.log("Workshop data:", workshopData)
      console.log("====================================")

      await createCraftVillageRequest(finalPayload)
      setIsSuccess(true)
      toast.success("Đăng ký thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.")

      setTimeout(() => {
        resetForm()
        setIsSuccess(false)
      }, 3000)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Submit error:", error)
      toast.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    districts,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    modelFiles,
    modelPreviews,
    modelMimeTypes,
    modelFileNames,
    uploadedModelUrls,
    setUploadedModelUrls,
    // handlers
    handleInputChange,
    handlePhoneChange,
    handleAddressChange,
    handleModelFileChange,
    removeModelFile,
    handleSubmit,
  }
}


