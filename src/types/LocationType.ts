export enum LocationType {
  Other = 0,
  CraftVillage = 1,
  HistoricalSite = 2,
  Cuisine = 3,
  ScenicSpot = 4,
}

export const LocationTypeDisplay: Record<LocationType, string> = {
  [LocationType.Other]: "Khác",
  [LocationType.CraftVillage]: "Làng nghề",
  [LocationType.HistoricalSite]: "Địa điểm lịch sử",
  [LocationType.Cuisine]: "Ẩm thực",
  [LocationType.ScenicSpot]: "Danh lam thắng cảnh",
};

export const LocationTypeReverseMap: Record<string, LocationType> =
  Object.fromEntries(
    Object.entries(LocationTypeDisplay).map(([key, value]) => [
      value,
      Number(key),
    ])
  );
