"use client"

import { Button } from "@/components/ui/button"
import { FieldError } from "../atoms/FieldError"
import { FieldLabel } from "../atoms/FieldLabel"
import { FileText, Trash2, Upload } from "lucide-react"

interface ModelMultiUploaderProps {
	previews: string[]
	mimeTypes: string[]
	fileNames: string[]
	onFilesSelected: (files: FileList | null) => void
	onRemove: (index: number) => void
	remainingSlots: number
	error?: string
}

export function ModelMultiUploader({
	previews,
	mimeTypes,
	fileNames,
	onFilesSelected,
	onRemove,
	remainingSlots,
	error,
}: ModelMultiUploaderProps) {
	const hasFiles = previews.length > 0
	return (
		<div className="space-y-2">
			<FieldLabel required htmlFor="model">
				Hình ảnh Model
			</FieldLabel>

			{hasFiles ? (
				<div className="space-y-4">
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{previews.map((preview, index) => (
							<div key={index} className="relative w-full">
								{mimeTypes[index]?.startsWith("image/") ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={preview} alt={`Model preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border" />
								) : (
									<a
										href={preview}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center w-full h-32 border rounded-lg bg-gray-50"
									>
										<FileText className="w-6 h-6 mr-2 text-gray-600" />
										<span className="text-sm truncate max-w-[85%]">{fileNames[index] || "Tệp PDF"}</span>
									</a>
								)}
								<Button type="button" variant="destructive" size="sm" onClick={() => onRemove(index)} className="absolute top-2 right-2">
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						))}
					</div>
					{remainingSlots > 0 && (
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
							<input type="file" id="model" accept="image/*,application/pdf,.pdf" multiple onChange={(e) => onFilesSelected(e.target.files)} className="hidden" />
							<label htmlFor="model" className="cursor-pointer flex flex-col items-center space-y-2">
								<Upload className="w-6 h-6 text-gray-400" />
								<div className="text-sm text-gray-600">
									<span className="font-medium text-blue-600 hover:text-blue-500">Thêm ảnh/PDF</span>
								</div>
								<p className="text-xs text-gray-500">Còn {remainingSlots} slot</p>
							</label>
						</div>
					)}
				</div>
			) : (
				<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
					<input type="file" id="model" accept="image/*,application/pdf,.pdf" multiple onChange={(e) => onFilesSelected(e.target.files)} className="hidden" />
					<label htmlFor="model" className="cursor-pointer flex flex-col items-center space-y-2">
						<Upload className="w-8 h-8 text-gray-400" />
						<div className="text-sm text-gray-600">
							<span className="font-medium text-blue-600 hover:text-blue-500">Chọn ảnh/PDF</span> hoặc kéo thả vào đây
						</div>
						<p className="text-xs text-gray-500">PNG, JPG, JPEG, PDF tối đa 5MB (tối đa 6 tệp)</p>
					</label>
				</div>
			)}

			<FieldError id="model-error" message={error} />
		</div>
	)
}


