"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Clock, Globe, MapPin } from "lucide-react"
import { TextField } from "../molecules/TextField"
import { SelectField } from "../molecules/SelectField"
import { AddressSearchWithMap } from "../organisms/AddressSearchWithMap"
import { LatitudeLongitudeFields } from "../molecules/LatitudeLongitudeFields"
import { PhoneEmailFields } from "../molecules/PhoneEmailFields"
import { WebsiteField } from "../molecules/WebsiteField"
import { TimeRangeFields } from "../molecules/TimeRangeFields"
import { CheckboxField } from "../molecules/CheckboxField"
import { ModelMultiUploader } from "../organisms/ModelMultiUploader"

interface BasicInfoProps {
  name: string
  description: string
  content: string
  districtId: string
  districtsOptions: { label: string; value: string }[]
  errors: Record<string, string>
  onChange: (field: string, value: any) => void
  model: {
    previews: string[]
    mimeTypes: string[]
    fileNames: string[]
    onFilesSelected: (files: FileList | null) => void
    onRemove: (index: number) => void
    remainingSlots: number
  }
}

export function SectionBasicInfo({ name, description, content, districtId, districtsOptions, errors, onChange, model }: BasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" /> Thông tin cơ bản
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <TextField id="name" label="Tên làng nghề" value={name} onChange={(v) => onChange("name", v)} required error={errors.name} placeholder="VD: Làng gốm Bàu Trúc" />
          <SelectField
            id="districtId"
            label="Quận/Huyện"
            value={districtId}
            onChange={(v) => onChange("districtId", v)}
            options={districtsOptions}
            placeholder="Chọn quận/huyện"
            required
            error={errors.districtId}
          />
        </div>

        <ModelMultiUploader
          previews={model.previews}
          mimeTypes={model.mimeTypes}
          fileNames={model.fileNames}
          onFilesSelected={model.onFilesSelected}
          onRemove={model.onRemove}
          remainingSlots={model.remainingSlots}
          error={errors.model}
        />

        <TextField id="description" label="Mô tả ngắn" value={description} onChange={(v) => onChange("description", v)} required error={errors.description} placeholder="Mô tả ngắn gọn về làng nghề (1-2 câu)" variant="textarea" rows={3} />

        <TextField id="content" label="Nội dung chi tiết" value={content} onChange={(v) => onChange("content", v)} required error={errors.content} placeholder="Mô tả chi tiết về lịch sử, quy trình sản xuất, sản phẩm..." variant="textarea" rows={5} />
      </CardContent>
    </Card>
  )
}

interface LocationInfoProps {
  address: string
  latitude: number
  longitude: number
  errors: Record<string, string>
  onAddressChange: (address: string, lat: number, lng: number) => void
}

export function SectionLocationInfo({ address, latitude, longitude, errors, onAddressChange }: LocationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" /> Thông tin vị trí
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddressSearchWithMap
          address={address}
          latitude={latitude}
          longitude={longitude}
          onAddressChange={onAddressChange}
          addressError={errors.address}
          coordinatesError={errors.coordinates}
        />
        <LatitudeLongitudeFields latitude={latitude} longitude={longitude} />
      </CardContent>
    </Card>
  )
}

interface ContactScheduleProps {
  phoneNumber: string
  email: string
  website: string
  openTime: string
  closeTime: string
  errors: Record<string, string>
  onPhoneChange: (value: string) => void
  onChange: (field: string, value: any) => void
}

export function SectionContactSchedule({ phoneNumber, email, website, openTime, closeTime, errors, onPhoneChange, onChange }: ContactScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" /> Liên hệ & Giờ hoạt động
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PhoneEmailFields phoneNumber={phoneNumber} email={email} onPhoneChange={onPhoneChange} onEmailChange={(v) => onChange("email", v)} phoneError={errors.phoneNumber} emailError={errors.email} />
        <WebsiteField value={website} onChange={(v) => onChange("website", v)} error={errors.website} />
        <TimeRangeFields openTime={openTime} closeTime={closeTime} onOpenChange={(v) => onChange("openTime", v)} onCloseChange={(v) => onChange("closeTime", v)} closeTimeError={errors.closeTime} />
      </CardContent>
    </Card>
  )
}

interface ProductHistoryProps {
  signatureProduct: string
  yearsOfHistory: string
  workshopsAvailable: boolean
  isRecognizedByUnesco: boolean
  errors: Record<string, string>
  onChange: (field: string, value: any) => void
}

export function SectionProductHistory({ signatureProduct, yearsOfHistory, workshopsAvailable, isRecognizedByUnesco, errors, onChange }: ProductHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-orange-600" /> Sản phẩm & Lịch sử
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <TextField id="signatureProduct" label="Sản phẩm đặc trưng" value={signatureProduct} onChange={(v) => onChange("signatureProduct", v)} required error={errors.signatureProduct} placeholder="VD: Gốm sứ, đồ mây tre đan..." />
          <TextField id="yearsOfHistory" label="Số năm lịch sử" value={yearsOfHistory} onChange={(v) => onChange("yearsOfHistory", v)} type="number" placeholder="VD: 200" required error={errors.yearsOfHistory} />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Tính năng & Chứng nhận</h4>
          <CheckboxField id="workshopsAvailable" label="Có tổ chức workshop/trải nghiệm cho du khách" checked={workshopsAvailable} onChange={(v) => onChange("workshopsAvailable", v)} />
          <CheckboxField
            id="isRecognizedByUnesco"
            checked={isRecognizedByUnesco}
            onChange={(v) => onChange("isRecognizedByUnesco", v)}
            label={
              <span className="flex items-center gap-2">
                Được UNESCO công nhận <Badge variant="secondary" className="text-xs">Danh tiếng</Badge>
              </span>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}


