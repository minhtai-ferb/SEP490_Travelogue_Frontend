export type News = {
    id: string;
    title: string;
    description: string;
    content: string;
    locationId: string;
    locationName: string;
    eventId: string;
    eventName: string;
    newsCategoryId: string;
    categoryName: string;
    isHighlighted: boolean;
    medias?: ListMedia[];
};

export interface ListMedia {
    isThumbnail: boolean;
    fileType: string;
    mediaUrl: string;
}

export interface Newcategory {
    id: string;
    category: string;
}
