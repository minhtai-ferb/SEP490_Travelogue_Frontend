'use client'

import { REPORT_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { useCallback } from "react"
import { ReportStatus } from "@/types/report"

export const useReport = () => {

	const { callApi, loading, setIsLoading } = useApiService();

	const getReport = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await callApi("get", REPORT_API_URL.GET_REPORT)
			return res?.data
		} catch (error) {
			console.error(error)
			return null
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	const filterReportByStatus = useCallback(async (status?: ReportStatus | number) => {
		try {
			setIsLoading(true)
			const res = await callApi("get", REPORT_API_URL.GET_REPORT_BY_STATUS, {
				params: {
					status: typeof status === "number" ? status : undefined,
				},
			})
			return res?.data
		} catch (error) {
			console.error(error)
			return null
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	const getReportDetail = useCallback(async (reportId: string) => {
		try {
			setIsLoading(true)
			const res = await callApi("get", REPORT_API_URL.GET_REPORT_BY_ID.replace(":reportId", reportId))
			return res?.data
		}
		catch (error) {
			console.error(error)
			return null
		}
		finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	const adminProcessReport = useCallback(async (reportId: string, status: number, adminNote: string) => {
		const payload = {
			status: status,
		}
		try {
			setIsLoading(true)
			const res = await callApi("post", REPORT_API_URL.ADMIN_PROCESS_REPORT.replace(":reportId", reportId), payload)
			return res?.data
		}
		catch (error) {
			console.error(error)
			return null
		}
		finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	return {
		getReport,
		filterReportByStatus,
		getReportDetail,
		adminProcessReport,
		loading
	}
}

