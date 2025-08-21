"use client"

import { AddressSearchInput } from "@/app/(manage)/components/locations/create/components/address-search-input"
import { FieldError } from "../atoms/FieldError"
import { FieldLabel } from "../atoms/FieldLabel"
import VietmapGL from "@/components/vietmap-gl"
import { SeccretKey } from "@/secret/secret"

interface AddressSearchWithMapProps {
	address: string
	latitude: number
	longitude: number
	onAddressChange: (address: string, lat: number, lng: number) => void
	addressError?: string
	coordinatesError?: string
}

export function AddressSearchWithMap({
	address,
	latitude,
	longitude,
	onAddressChange,
	addressError,
	coordinatesError,
}: AddressSearchWithMapProps) {
	return (
		<div className="space-y-2">
			<FieldLabel required>Địa chỉ</FieldLabel>
			<AddressSearchInput
				value={address}
				latitude={latitude}
				longitude={longitude}
				onChange={onAddressChange}
				placeholder="Nhập địa chỉ để tìm kiếm..."
			/>
			<FieldError message={addressError} />
			<FieldError message={coordinatesError} />

			<div className="w-full h-[300px]">
				<VietmapGL
					apiKey={SeccretKey.VIET_MAP_KEY || ""}
					center={[longitude || 106.69531282536502, latitude || 10.776983649766555]}
					markers={[
						{
							lngLat: [longitude, latitude],
							popupHTML: `<div>${address}</div>`,
							popupOptions: { offset: 25 },
						},
					]}
					zoom={9}
					width="100%"
					height="300px"
				/>
			</div>
		</div>
	)
}


