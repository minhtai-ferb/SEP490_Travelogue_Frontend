export type District = {
    id: string;
    name: string;
    description: string;
    area?: number; 
    createdTime?: string; 
    lastUpdatedTime?: string;
    createdBy?: string;
    lastUpdatedBy?: string;
    medias?: ListMedia[];
};

export interface ListMedia {  
    isThumbnail: boolean;
    mediaUrl: string;
}

export type DistrictCreate = {
    Name: string;
    Description: string;
    Area?: number; 
    ImageUploads?: FormData;
};