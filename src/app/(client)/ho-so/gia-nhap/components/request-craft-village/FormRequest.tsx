"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

import { useCraftVillageRequestForm, CraftVillageFormData } from "./hooks/useCraftVillageRequestForm"
import { SectionBasicInfo, SectionContactSchedule, SectionLocationInfo, SectionProductHistory } from "./components/templates/RequestSections"

export function FormRequest() {
	const {
		districts,
		formData,
		errors,
		isSubmitting,
		isSuccess,
		modelPreviews,
		modelMimeTypes,
		modelFileNames,
		handleInputChange,
		handlePhoneChange,
		handleAddressChange,
		handleModelFileChange,
		removeModelFile,
		handleSubmit,
	} = useCraftVillageRequestForm()

	const onFieldChange = (field: string, value: any) => {
		return handleInputChange(field as keyof CraftVillageFormData, value)
	}

	if (isSuccess) {
		return (
			<Card className="max-w-md mx-auto">
				<CardContent className="pt-6">
					<div className="text-center space-y-4">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						<h3 className="text-xl font-semibold text-gray-900">Đăng ký thành công!</h3>
						<p className="text-gray-600">Cảm ơn bạn đã đăng ký. Chúng tôi sẽ xem xét thông tin và liên hệ sớm nhất.</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	const districtOptions = districts.map((d) => ({ value: d.id, label: d.name }))

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			<SectionBasicInfo
				name={formData.name}
				description={formData.description}
				content={formData.content}
				districtId={formData.districtId}
				districtsOptions={districtOptions}
				errors={errors}
				onChange={onFieldChange}
				model={{
					previews: modelPreviews,
					mimeTypes: modelMimeTypes,
					fileNames: modelFileNames,
					onFilesSelected: handleModelFileChange,
					onRemove: removeModelFile,
					remainingSlots: Math.max(0, 6 - modelPreviews.length),
				}}
			/>

			<SectionLocationInfo
				address={formData.address}
				latitude={formData.latitude}
				longitude={formData.longitude}
				errors={errors}
				onAddressChange={handleAddressChange}
			/>

			<SectionContactSchedule
				phoneNumber={formData.phoneNumber}
				email={formData.email}
				website={formData.website}
				openTime={formData.openTime}
				closeTime={formData.closeTime}
				errors={errors}
				onPhoneChange={handlePhoneChange}
				onChange={onFieldChange}
			/>

			<SectionProductHistory
				signatureProduct={formData.signatureProduct}
				yearsOfHistory={formData.yearsOfHistory}
				workshopsAvailable={formData.workshopsAvailable}
				isRecognizedByUnesco={formData.isRecognizedByUnesco}
				errors={errors}
				onChange={onFieldChange}
			/>

			<div className="flex justify-center pt-6">
				<Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 py-3 text-lg font-medium" size="lg">
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang gửi đăng ký...
						</>
					) : (
						"Gửi đăng ký làng nghề"
					)}
				</Button>
			</div>
		</form>
	)
}


