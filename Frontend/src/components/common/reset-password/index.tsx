"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addToast, Alert } from "@heroui/react"
import { useAuth } from "@/services/useAuth"
import { isValidPassword } from "@/utils/validation"
import { useRouter } from "next/navigation"

interface ResetPasswordFormProps {
	email: string
	code: string
	onSuccess: () => void
	onBack: () => void
}

// Update the FormData interface to match the API expectations
interface FormData {
	newPassword: string
	confirmPassword: string
}

export function ResetPasswordForm({ email, code, onSuccess, onBack }: ResetPasswordFormProps) {
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState("")
	const { resetPassword } = useAuth()
	const navigate = useRouter()

	// Update the defaultValues to use the correct field names
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	})

	// Update the password watch to use the correct field name
	const password = watch("newPassword")

	// Update the onSubmit function to send the correct data structure to the API
	const onSubmit = async (data: FormData) => {
		setIsPending(true)
		setError("")

		try {
			// Call API to reset password with the correct data structure
			await resetPassword(email, code, data.newPassword, data.confirmPassword)
			navigate.push("/")
			addToast({
				title: "Thành công",
				description: "Mật khẩu đã được đặt lại thành công",
				color: "success",
			})

			// Redirect to login
			onSuccess()
		} catch (error: any) {
			console.error("Reset password error:", error)

			const errorMessage = error?.response?.data?.Message || error?.message || "Đã xảy ra lỗi khi đặt lại mật khẩu"

			setError(errorMessage)

			addToast({
				title: "Lỗi",
				description: errorMessage,
				color: "danger",
			})
		} finally {
			setIsPending(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="text-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
				<p className="text-gray-600 mt-2">Tạo mật khẩu mới cho tài khoản của bạn</p>
			</div>

			<div className="space-y-2">
				<label htmlFor="password" className="text-sm font-medium text-gray-700">
					Mật khẩu mới
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
						<Lock className="h-5 w-5" />
					</div>
					<Input
						id="password"
						type="password"
						className="pl-10"
						{...register("newPassword", {
							required: "Mật khẩu là bắt buộc",
							validate: (value) => isValidPassword(value) || "Mật khẩu phải có ít nhất 6 ký tự",
						})}
					/>
				</div>
				{errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
			</div>

			<div className="space-y-2">
				<label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
					Xác nhận mật khẩu
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
						<Lock className="h-5 w-5" />
					</div>
					<Input
						id="confirmPassword"
						type="password"
						className="pl-10"
						{...register("confirmPassword", {
							required: "Xác nhận mật khẩu là bắt buộc",
							validate: (value) => value === password || "Mật khẩu không khớp",
						})}
					/>
				</div>
				{errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
			</div>

			{error && (
				<div className="rounded-md bg-red-50 p-3">
					<Alert color="danger" title={error} />
				</div>
			)}

			<Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isPending}>
				{isPending ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
			</Button>

			<div className="mt-6 text-center">
				<button type="button" onClick={onBack} className="text-sm text-sky-500 hover:underline">
					Quay lại
				</button>
			</div>
		</form>
	)
}

