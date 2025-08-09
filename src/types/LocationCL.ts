export type LocationTable = {
	id: string;
	name: string;
	description: string;
	content: string;
	address: string;
	latitude: number;
	longitude: number;
	rating: string;
	openTime?: string;
	closeTime?: string;
	category: string;
	districtId: string;
	districtName: string;
	medias?: ListMedia[];
};

export interface ListMedia {
	isThumbnail: boolean;
	fileType: string;
	mediaUrl: string;
}

export interface TypeLocation {
	id: string;
	name: string;
	description: string;
}


export interface LocationDTO {
	id: string;
	name: string;
	description: string;
	content: string;
	address: string;
	latitude: number;
	longitude: number;
	districtId: string;
	locationType: number;
}


export interface Location {
	id: string;
	name: string;
	description: string;
	content: string;
	address: string;
	latitude: number;
	longitude: number;
	districtId: string;
	locationType: number;
	heritageRankName?: string;
	medias?: ListMedia[];
	cuisineType?: string;
	specialties?: string[];
	priceRange?: string;
	openTime?: string;
	closeTime?: string;
	rating?: number;
	category?: string;
	districtName: string;
}