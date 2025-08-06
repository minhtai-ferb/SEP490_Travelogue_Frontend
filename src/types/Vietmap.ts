export interface VietMapBoundary {
	type: number
	id: number
	name: string
	prefix: string
	full_name: string
}

export interface VietMapAutocompleteResult {
	ref_id: string
	distance: number
	address: string
	name: string
	display: string
	boundaries: VietMapBoundary[]
	categories: any[]
	entry_points: any[]
}

export interface VietMapAutocompleteResponse {
	results?: VietMapAutocompleteResult[]
	error?: string
}

export interface VietMapPlaceResult {
	display: string
	name: string
	hs_num: string
	street: string
	address: string
	city_id: number
	city: string
	district_id: number
	district: string
	ward_id: number
	ward: string
	lat: number
	lng: number
	compound?: {
		district: string
		commune: string
		province: string
	}
}
