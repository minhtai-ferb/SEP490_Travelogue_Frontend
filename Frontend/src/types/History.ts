export interface HistoricalSite {
	id: string;
	name: string;
	description: string;
	heritageRank: string;
	content: string;
	image: string;
	latitude: string;
	longitude: string;
	districtName: string;
	heritageRankName: string;
	medias: Media[];
}

interface Media {
	mediaUrl: string;
	fileName: string;
	fileType: string;
	isThumbnail: boolean;
	sizeInBytes: number;
	createdTime: string;
}

export interface Rank {
	id: number,
	name: string,
	displayName: string
}