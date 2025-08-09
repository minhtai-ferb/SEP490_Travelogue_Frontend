"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addToast } from "@heroui/react"
import { useAuth } from "@/services/useAuth"
import { useRouter } from "next/navigation"
import { GoogleLoginButton } from "@/components/common/google-button"

interface RegisterFormProps {
	onSwitchMode: () => void
	onForgotPassword?: () => void
}

export function RegisterForm({ onSwitchMode, onForgotPassword }: RegisterFormProps) {
	const [isPending, setIsPending] = useState(false)
	const { login, loginWithGoogle, register } = useAuth()
	const [error, setError] = useState("")
	const [isGooglePending, setIsGooglePending] = useState(false)
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	})
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

	const router = useRouter()

	const handleGoogleLogin = async () => {
		setIsGooglePending(true)
		setError("")

		try {
			await loginWithGoogle()
			router.push("/")
			addToast({
				title: "Đăng nhập thành công!",
				description: "Chào mừng bạn đến với Traveloge",
				color: "success",
			})
		} catch (error: any) {
			console.error("Google login error:", error)
			setError(error?.message || "Đã xảy ra lỗi khi đăng nhập với Google")

			addToast({
				title: "Lỗi đăng nhập",
				description: error?.message || "Đã xảy ra lỗi khi đăng nhập với Google",
				color: "danger",
			})
		} finally {
			setIsGooglePending(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))

		// Clear validation error when user types
		if (validationErrors[name]) {
			setValidationErrors((prev) => ({
				...prev,
				[name]: "",
			}))
		}
	}

	const validateForm = () => {
		const errors: Record<string, string> = {}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(formData.email)) {
			errors.email = "Email không hợp lệ"
		}

		// Validate password length
		if (formData.password.length < 6) {
			errors.password = "Mật khẩu phải có ít nhất 6 ký tự"
		}

		// Validate password match
		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = "Mật khẩu không khớp"
		}

		// Validate full name
		if (formData.fullName.trim().length < 2) {
			errors.fullName = "Vui lòng nhập họ và tên hợp lệ"
		}

		setValidationErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsPending(true)
		setError("")

		try {
			console.log("Registration with:", formData)
			const response = await register({
				fullName: formData.fullName,
				email: formData.email,
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			})

			console.log("Registration response:", response)

			// Don't automatically verify email - let the user click the link in their email
			// Instead, just show a success message and redirect to login

			addToast({
				title: "Thành công",
				description: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
				color: "success",
			})
			router.push("/")

			// Or if you're toggling between login/register in the same page:
			// onSwitchMode()
		} catch (error: any) {
			console.error("Registration error:", error)

			const errorMessage = error?.response?.data?.Message || error?.message || "Đã xảy ra lỗi khi đăng ký tài khoản"

			setError(errorMessage)

			addToast({
				title: "Lỗi đăng ký",
				description: errorMessage,
				color: "danger",
			})
		} finally {
			setIsPending(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="space-y-2">
				<label htmlFor="fullName" className="text-sm font-medium text-gray-700">
					Họ và tên
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
						<User className="h-5 w-5" />
					</div>
					<Input
						id="fullName"
						name="fullName"
						type="text"
						placeholder="Nguyễn Văn A"
						className={`pl-10 ${validationErrors.fullName ? "border-red-500" : ""}`}
						value={formData.fullName}
						onChange={handleChange}
						required
					/>
				</div>
				{validationErrors.fullName && <p className="text-sm text-red-500 mt-1">{validationErrors.fullName}</p>}
			</div>

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
						name="email"
						type="email"
						placeholder="example@email.com"
						className={`pl-10 ${validationErrors.email ? "border-red-500" : ""}`}
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				{validationErrors.email && <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>}
			</div>

			<div className="space-y-2">
				<label htmlFor="password" className="text-sm font-medium text-gray-700">
					Mật khẩu
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
						<Lock className="h-5 w-5" />
					</div>
					<Input
						id="password"
						name="password"
						type="password"
						className={`pl-10 ${validationErrors.password ? "border-red-500" : ""}`}
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				{validationErrors.password && <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>}
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
						name="confirmPassword"
						type="password"
						className={`pl-10 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
						value={formData.confirmPassword}
						onChange={handleChange}
						required
					/>
				</div>
				{validationErrors.confirmPassword && (
					<p className="text-sm text-red-500 mt-1">{validationErrors.confirmPassword}</p>
				)}
			</div>

			{error && <div className="bg-red-50 p-3 rounded-md text-red-500 text-sm">{error}</div>}

			<Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isPending}>
				{isPending ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
			</Button>

			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-300"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-white px-2 text-gray-500">HOẶC</span>
				</div>
			</div>

			<div className="mx-auto w-full flex items-center justify-center">
				<GoogleLoginButton isLoading={isGooglePending} onClick={handleGoogleLogin} />
			</div>

			<div className="mt-8 text-center">
				<p className="text-gray-600">
					Đã có tài khoản?{" "}
					<button
						type="button"
						onClick={onSwitchMode}
						className="font-medium text-sky-500 hover:underline"
						disabled={isPending}
					>
						Đăng nhập
					</button>
				</p>
			</div>
		</form>
	)
}

