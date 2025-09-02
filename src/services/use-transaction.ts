'use client'

import { TRANSACTIONS_API_URL, WALLET_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { useCallback } from "react"

export const useTransaction = () => {

    const { callApi, loading, setIsLoading } = useApiService();

    const getTopTransactionLatest = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await callApi("get", TRANSACTIONS_API_URL.GET_TOP_TRANSACTION_LATEST)
            return res?.data
        } catch (error) {
            console.error(error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [callApi, setIsLoading]) // Xóa loading khỏi dependency

    const getAllTransactions = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await callApi("get", TRANSACTIONS_API_URL.GET_ALL_TRANSACTIONS)
            return res?.data
        } catch (error) {
            console.error(error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [callApi, setIsLoading]) // Xóa loading khỏi dependency

    const getTransactionById = useCallback(async (id: string) => {
        try {
            setIsLoading(true)
            const res = await callApi("get", TRANSACTIONS_API_URL.GET_TRANSACTION_BY_ID.replace(":id", id))
            return res?.data
        } catch (error) {
            console.error(error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [callApi, setIsLoading]) // Xóa loading khỏi dependency

    return {
        loading,
        getTopTransactionLatest,
        getAllTransactions,
        getTransactionById
    }
}
