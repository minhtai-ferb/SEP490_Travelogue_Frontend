"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addToast, Alert } from "@heroui/react"
import { useAuth } from "@/services/useAuth"
import { isValidEmailOrPhone } from "@/utils/validation"

interface ForgotPasswordFormProps {
	onSwitchToLogin: () => void
	onCodeSent: (email: string) => void
}

interface FormData {
	email: string
}

export function ForgotPasswordForm({ onSwitchToLogin, onCodeSent }: ForgotPasswordFormProps) {
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState("")
	const { resendEmailVerification } = useAuth()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			email: "",
		},
	})

	const onSubmit = async (data: FormData) => {
		setIsPending(true)
		setError("")

		try {
			// Call the API to request password reset
			await resendEmailVerification(data.email)

			addToast({
				title: "Yêu cầu đã được gửi",
				description: "Vui lòng kiểm tra email của bạn để lấy mã xác nhận",
				color: "success",
			})

			// Move to the next step (verify code)
			onCodeSent(data.email)
		} catch (error: any) {
			console.error("Forgot password error:", error)

			const errorMessage =
				error?.response?.data?.Message || error?.message || "Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu"

			setError(errorMessage)
		} finally {
			setIsPending(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

			<div className="space-y-2">
				<label htmlFor="email" className="text-sm font-medium text-gray-700">
					Email
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
						<Mail className="h-5 w-5" />
					</div>
					<Input
						id="email"
						className="pl-10"
						placeholder="example@email.com"
						{...register("email", {
							required: "Email là bắt buộc",
							validate: (value) => isValidEmailOrPhone(value) || "Email không hợp lệ",
						})}
					/>
				</div>
				{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
			</div>

			{error && (
				<div className="rounded-md bg-red-50 p-3">
					<Alert color="danger" title={error} />
				</div>
			)}

			<Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isPending}>
				{isPending ? "ĐANG GỬI..." : "GỬI MÃ XÁC NHẬN"}
			</Button>

			<div className="mt-6 text-center">
				<button
					type="button"
					onClick={onSwitchToLogin}
					className="text-sm text-sky-500 hover:underline"
					disabled={isPending}
				>
					Quay lại đăng nhập
				</button>
			</div>
		</form>
	)
}

