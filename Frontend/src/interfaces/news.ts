export interface NewsItem {
	id: string;
	title: string;
	description: string;
	content: string;
	locationId: string | null;
	locationName: string | null;
	eventId: string | null;
	eventName: string | null;
	categoryId: string | null;
	categoryName: string | null;
	medias: any[];
	isHightlight: boolean;
	createdTime: string;
	lastUpdatedTime: string;
	createdBy: string;
	createdByName: string | null;
	lastUpdatedBy: string;
	lastUpdatedByName: string | null;
}

export interface NewsResponse {
	pageNumber: number;
	pageSize: number;
	totalCount: number;
	data: NewsItem[];
	message: string;
	succeeded: boolean;
	statusCode: number;
}



export interface RelatedNews {
	id: string;
	title: string;
	description: string;
	locationName: string | null;
	eventName: string | null;
	categoryName: string | null;
}

export interface NewsItem {
	id: string;
	title: string;
	description: string;
	content: string;
	locationId: string | null;
	locationName: string | null;
	eventId: string | null;
	eventName: string | null;
	categoryId: string | null;
	categoryName: string | null;
	medias: any[]; // Bạn có thể định nghĩa thêm Media type nếu có thông tin chi tiết
	relatedNews: RelatedNews[];
	createdTime: string; // ISO datetime string
	lastUpdatedTime: string;
	createdBy: string;
	createdByName: string | null;
	lastUpdatedBy: string;
	lastUpdatedByName: string | null;
}

export interface NewsApiResponse {
	data: NewsItem;
	message: string;
	succeeded: boolean;
	statusCode: number;
}