import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "./interceptors";

export const queryClient = {
	get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
		const response: AxiosResponse<T> = await axiosInstance.get(url, config);
		return response.data;
	},
	post: async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
		const response: AxiosResponse<T> = await axiosInstance.post(url, data, config);
		console.log("--------------------------------response--------------------------------", response);
		return response.data;
	},
	put: async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
		const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
		return response.data;
	},
	delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
		const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
		return response.data;
	},
};