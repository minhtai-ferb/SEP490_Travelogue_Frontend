'use client'

import { WORKSHOP_API_URL } from "@/constants/api"
import useApiService from "@/hooks/useApi"
import { useCallback } from "react"
import type { CreateWorkshopDto, UpdateWorkshopDto, CreateScheduleDto, WorkshopFilterParams } from "@/types/Workshop"

export function useWorkshop() {
	const { callApi, loading } = useApiService()

	const createWorkshop = useCallback(async (data: CreateWorkshopDto) => {
		const res = await callApi("post", WORKSHOP_API_URL.WORKSHOP, data)
		return res?.data
	}, [callApi])

	const updateWorkshop = useCallback(async (workshopId: string, data: UpdateWorkshopDto) => {
		const url = WORKSHOP_API_URL.WORKSHOP_UPDATE.replace(":id", workshopId)
		const res = await callApi("put", url, data)
		return res?.data
	}, [callApi])

	const submitWorkshop = useCallback(async (workshopId: string) => {
		const url = WORKSHOP_API_URL.WORKSHOP_SUBMIT.replace(":id", workshopId)
		const res = await callApi("put", url)
		return res?.data
	}, [callApi])

	const createActivitiesBulk = useCallback(async (payload: any) => {
		// payload structure should be defined by backend contract
		const res = await callApi("put", WORKSHOP_API_URL.WORKSHOP_BULK, payload)
		return res?.data
	}, [callApi])

	const createSchedules = useCallback(async (workshopId: string, schedules: CreateScheduleDto[] | CreateScheduleDto) => {
		const url = WORKSHOP_API_URL.WORKSHOP_SCHEDULES.replace(":id", workshopId)
		const data = Array.isArray(schedules) ? schedules : [schedules]
		const res = await callApi("post", url, data)
		return res?.data
	}, [callApi])

	const updateSchedule = useCallback(async (scheduleId: string, schedule: CreateScheduleDto) => {
		const url = WORKSHOP_API_URL.WORKSHOP_UPDATE_SCHEDULE.replace(":scheduleId", scheduleId)
		const res = await callApi("put", url, schedule)
		return res?.data
	}, [callApi])

	const deleteSchedule = useCallback(async (scheduleId: string) => {
		const url = WORKSHOP_API_URL.WORKSHOP_DELETE_SCHEDULE.replace(":scheduleId", scheduleId)
		const res = await callApi("delete", url)
		return res?.data
	}, [callApi])

	const getWorkshopDetail = useCallback(async (workshopId: string) => {
		const url = WORKSHOP_API_URL.WORKSHOP_DETAIL.replace(":id", workshopId)
		const res = await callApi("get", url)
		return res?.data
	}, [callApi])

	const getWorkshops = useCallback(async (params?: WorkshopFilterParams) => {
		const res = await callApi("get", WORKSHOP_API_URL.WORKSHOP, { params })
		return res?.data
	}, [callApi])

	const getModeratorWorkshops = useCallback(async (params?: { status?: number | string, page?: number, pageSize?: number }) => {
		const res = await callApi("get", WORKSHOP_API_URL.WORKSHOP_MODERATOR_FILTER, { params })
		return res?.data
	}, [callApi])

	return {
		createWorkshop,
		updateWorkshop,
		submitWorkshop,
		createActivitiesBulk,
		createSchedules,
		updateSchedule,
		deleteSchedule,
		getWorkshopDetail,
		getWorkshops,
		getModeratorWorkshops,
		loading,
	}
}


