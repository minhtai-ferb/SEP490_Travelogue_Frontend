export type Experience = {
    id: string;
    title: string;
    description: string;
    content: string;
    locationId: string;
    locationName: string;
    eventId: string;
    eventName: string;
    typeExperienceId: string;
    typeExperienceName: string;
    districtId: string;
    districtName: string;
    medias?: ListMedia[];
};

export interface ListMedia {
    isThumbnail: boolean;
    fileType: string;
    mediaUrl: string;
}

export interface TypeExperience {
    id: string;
    typeName: string;
}

export interface ExperienceTypes {
    id: string,
    typeName: string,
    createdTime: string,
    lastUpdatedTime: string,
    createdBy: string,
    createdByName: string,
    lastUpdatedBy: string,
    lastUpdatedByName: string
}