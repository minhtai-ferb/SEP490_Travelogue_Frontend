import { is } from "date-fns/locale";

export type News = {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId: string;
  locationName: string;
  newsCategory: NewsCategory;
  startDate: string;
  endDate: string;
  typeExperience: TypeExperience;
  isHighlighted: boolean;
  createdTime: string;
  createdBy: string;
  lastUpdatedTime: string;
  lastUpdatedBy: string;
  medias?: ListMedia[];
};

export type New = {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId: string;
  locationName: string;
  isHighlighted: boolean;
  createdTime: string;
  createdBy: string;
  lastUpdatedTime: string;
  lastUpdatedBy: string;
  medias?: ListMedia[];
};

export type Event = {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId: string;
  locationName: string;
  newsCategory: NewsCategory.Event;
  startDate: string;
  endDate: string;
  isHighlighted: boolean;
  createdTime: string;
  createdBy: string;
  lastUpdatedTime: string;
  lastUpdatedBy: string;
  medias?: ListMedia[];
};

export type Experience = {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId: string;
  locationName: string;
  typeExperience: TypeExperience;
  isHighlighted: boolean;
  createdTime: string;
  createdBy: string;
  lastUpdatedTime: string;
  lastUpdatedBy: string;
  medias?: ListMedia[];
};

export interface ListMedia {
  isThumbnail: boolean;
  mediaUrl: string;
}

export enum NewsCategory {
  News = 1,
  Event = 2,
  Experience = 3,
}

export enum TypeExperience {
  Adventure = 1,
  Cultural = 2,
  Culinary = 3,
  Ecotourism = 4,
  Leisure = 5,
  Spiritual = 6,
  Extreme = 7,
}

export enum TypeExperienceName {
  Adventure = "Phiêu lưu",
  Cultural = "Văn hóa",
  Culinary = "Ẩm thực",
  Ecotourism = "Du lịch sinh thái",
  Leisure = "Giải trí",
  Spiritual = "Tâm linh",
  Extreme = "Mạo hiểm",
}

export function getTypeExperienceLabel(type?: TypeExperience) {
  switch (type) {
    case TypeExperience.Adventure:
      return "Phiêu lưu";
    case TypeExperience.Cultural:
      return "Văn hóa";
    case TypeExperience.Culinary:
      return "Ẩm thực";
    case TypeExperience.Ecotourism:
      return "Du lịch sinh thái";
    case TypeExperience.Leisure:
      return "Giải trí";
    case TypeExperience.Spiritual:
      return "Tâm linh";
    case TypeExperience.Extreme:
      return "Mạo hiểm";
    default:
      return "Không xác định";
  }
}
