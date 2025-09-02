import { TourGuide } from "./Tourguide";

export interface Activity {
  tripPlanLocationId: string;
  locationId: string;
  type: string;
  name: string;
  description: string;
  address: string;
  startTime: string;
  endTime: string;
  startTimeFormatted: string;
  endTimeFormatted: string;
  duration: string;
  notes: string;
  order: number;
  imageUrl: string;
}

export interface Day {
  dayNumber: number;
  date: string;
  dateFormatted: string;
  activities: Activity[];
}

export interface TripPlan {
  id: string;
  name: string;
  description: string;
  pickupAddress: string | null;
  startDate: string;
  endDate: string;
  imageUrl: string;
  totalDays: number;
  userId: string;
  ownerName: string;
  status: number;
  statusText: string;
  days: Day[];
}

export interface TripPlanResponse {
  items: TripPlan[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}


//Tour Guide

export interface TripLocation {
	id: string
	name: string
	type: "destination" | "restaurant" | "craftVillage"
	address: string
	description: string
	imageUrl: string
}

export interface TripActivity {
	time: string
	title: string
	description: string
	location: string
}

export interface TripDay {
	day: number
	activities: TripActivity[]
}
export interface TourGuideTripplan {
	id: string
	name: string
	description: string
	startDate: string | Date
	endDate: string | Date
	imageUrl: string | null
	userId: string
	ownerName: string
	createdTime: string | Date
	lastUpdatedTime: string | Date
	createdBy: string
	createdByName: string | null
	lastUpdatedBy: string
	lastUpdatedByName: string | null
}
export interface TripPlanTourGuide {
	id: string
	isAIGenerated: boolean
	title?: string
	startDate: Date
	duration: number
	destinations: TripLocation[]
	restaurants?: TripLocation[]
	craftVillages?: TripLocation[]
	budget: number
	estimatedCost?: number
	travelers: number
	preferences?: string
	itinerary?: TripDay[]
	tourguide?: TourGuide
	statusText: TripPlanStatus
	status: number
	ownerName: string
}

export type TripPlanStatus = "pending" | "confirmed" | "completed" | "cancelled"
