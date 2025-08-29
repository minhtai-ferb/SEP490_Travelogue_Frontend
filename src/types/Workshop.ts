export interface MediaDto {
	mediaUrl: string
	isThumbnail: boolean
}

export interface CreateWorkshopDto {
	name: string
	description: string
	content: string
	mediaDtos: MediaDto[]
}


export interface UpdateWorkshopDto {
	name: string
	description: string
	content: string
	mediaDtos: MediaDto[]
}

export interface UpdateActivityRequestDto {
	activityId: string
	activity: string
	description: string
	startTime: string
	endTime: string
	notes: string
	dayOrder: number
}

export interface CreateActivityDto {
	activity: string
	description: string
	startTime: string
	endTime: string
	notes: string
	dayOrder: number
}

export interface CreateScheduleDto {
	startTime: string
	endTime: string
	maxParticipant: number
	adultPrice: number
	childrenPrice: number
	notes: string
}

export type WorkshopStatus = "Draft" | "Pending" | "Approved" | "Rejected"

export interface WorkshopSchedule extends CreateScheduleDto {
	scheduleId: string
}

export interface WorkshopDetail {
	id: string
	name: string
	description: string
	content: string
	status: WorkshopStatus | number
	statusText?: string
	mediaDtos: MediaDto[]
	schedules: WorkshopSchedule[]
	createdAt?: string
	updatedAt?: string
}

export interface WorkshopFilterParams {
	craftVillageId: string
	name?: string
	status?: number | string
}
