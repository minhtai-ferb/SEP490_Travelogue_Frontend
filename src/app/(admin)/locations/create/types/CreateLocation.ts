export enum LocationType {
  Other = 0,
  CraftVillage = 1,
  HistoricalSite = 2,
  Cuisine = 3,
  ScenicSpot = 4,
}

export enum TypeHistoricalLocation {
  SpecialNationalMonument = 1,
  NationalMonument = 2,
  ProvincialMonument = 3,
}

export interface Location {
  name: string
  description: string
  content: string
  address: string
  latitude: number
  longitude: number
  openTime: { ticks: number }
  closeTime: { ticks: number }
  districtId: string
  locationType: LocationType
}

export interface CuisineData {
  signatureProduct: string
  cookingMethod: string
  cuisineType: string
  phoneNumber: string
  email: string
  website: string
}

export interface CraftVillageData {
  phoneNumber: string
  email: string
  website: string
  workshopsAvailable: boolean
  signatureProduct: string
  yearsOfHistory: number
  isRecognizedByUnesco: boolean
}

export interface HistoricalLocationData {
  heritageRank: number
  establishedDate: string
  locationId: string
  typeHistoricalLocation: TypeHistoricalLocation
}
