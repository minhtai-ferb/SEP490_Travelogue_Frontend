export interface Media {
	mediaUrl: string;
	fileName: string;
	fileType: string;
	isThumbnail: boolean;
	sizeInBytes: number;
	createdTime: string; // ISO 8601 format
}

export interface District {
	id: string;
	name: string;
	description: string;
	medias: Media[];
	area: number;
	createdTime: string; // ISO 8601 format
	lastUpdatedTime: string; // ISO 8601 format
	createdBy: string;
	createdByName?: string | null;
	lastUpdatedBy: string;
	lastUpdatedByName?: string | null;
}
