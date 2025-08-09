export type Event = {
    id: string;
    name: string;
    description: string;
    content: string;
    rating: string;
    locationId: string;
    locationName: string;
    typeEventId: string;
    typeEventName: string;
    districtId: string;
    districtName: string;
    isRecurring: boolean;
    recurrencePattern: string;
    isHighlighted: boolean;
    lunarStartDate: string;
    lunarEndDate: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
    medias?: ListMedia[];
};

export interface ListMedia {
    isThumbnail: boolean;
    fileType: string;
    mediaUrl: string;
    fileName: string;
}

export interface TypeEvent {
    id: string;
    typeName: string;
}