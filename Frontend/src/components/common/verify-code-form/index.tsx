"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addToast, Alert } from "@heroui/react"
import { useAuth } from "@/services/useAuth"

interface VerifyCodeFormProps {
	email: string
	onCodeVerified: (email: string, code: string) => void
	onResendCode: () => void
	onBack: () => void
}

interface FormData {
	code: string[]
}

export function VerifyCodeForm({ email, onCodeVerified, onResendCode, onBack }: VerifyCodeFormProps) {
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState("")
	const [countdown, setCountdown] = useState(60)
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	const { checkValidCode } = useAuth()

	const {
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm<FormData>({
		defaultValues: {
			code: ["", "", "", ""],
		},
	})

	const codeValues = watch("code")

	// Set up countdown timer
	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [countdown])

	// Handle input change
	const handleChange = (index: number, value: string) => {
		if (value.length > 1) {
			value = value.charAt(0)
		}

		// Only allow numbers
		if (value && !/^\d+$/.test(value)) {
			return
		}

		const newCode = [...codeValues]
		newCode[index] = value
		setValue("code", newCode)

		// Auto-focus next input
		if (value && index < 3) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	// Handle key down
	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !codeValues[index] && index > 0) {
			// Focus previous input when backspace is pressed on empty input
			inputRefs.current[index - 1]?.focus()
		}
	}

	// Handle paste
	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData("text")

		// Only allow numbers
		if (!/^\d+$/.test(pastedData)) {
			return
		}

		const digits = pastedData.slice(0, 4).split("")
		const newCode = [...codeValues]

		digits.forEach((digit, index) => {
			if (index < 4) {
				newCode[index] = digit
			}
		})

		setValue("code", newCode)

		// Focus the appropriate input
		if (digits.length < 4) {
			inputRefs.current[digits.length]?.focus()
		}
	}

	const onSubmit = async (data: FormData) => {
		const fullCode = data.code.join("")
		if (fullCode.length !== 4) {
			setError("Vui lòng nhập đầy đủ mã xác nhận 4 số")
			return
		}

		setIsPending(true)
		setError("")

		try {
			// Call API to verify the code
			await checkValidCode(email, fullCode)

			// Move to reset password step
			onCodeVerified(email, fullCode)
		} catch (error: any) {
			console.error("Code verification error:", error)

			const errorMessage =
				error?.response?.data?.Message || error?.message || "Mã xác nhận không hợp lệ hoặc đã hết hạn"

			setError(errorMessage)

			addToast({
				title: "Lỗi xác thực",
				description: errorMessage,
				color: "danger",
			})
		} finally {
			setIsPending(false)
		}
	}

	const handleResendCode = () => {
		setCountdown(60)
		onResendCode()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="text-center mb-6">
				{/* <h2 className="text-2xl font-bold text-gray-800">Xác nhận mã</h2> */}
				{/* <p className="text-gray-600 mt-2">Nhập mã 4 số đã được gửi đến email {email}. Có hạn trong 5 phút.</p> */}
			</div>

			<div className="space-y-4">
				<div className="flex justify-center gap-6">
					{codeValues.map((digit, index) => (
						<Input
							key={index}
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type="text"
							inputMode="numeric"
							maxLength={1}
							className="w-12 h-12 text-center text-xl"
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={index === 0 ? handlePaste : undefined}
							required
						/>
					))}
				</div>

				{error && (
					<div className="rounded-md bg-red-50 p-3">
						<Alert color="danger" title={error} />
					</div>
				)}
			</div>

			<Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isPending}>
				{isPending ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
			</Button>

			<div className="mt-4 text-center">
				<p className="text-gray-600 text-sm">
					Không nhận được mã?{" "}
					{countdown > 0 ? (
						<span className="text-gray-500">Gửi lại sau {countdown} giây</span>
					) : (
						<button type="button" onClick={handleResendCode} className="text-sky-500 hover:underline">
							Gửi lại mã
						</button>
					)}
				</p>
			</div>

			<div className="mt-6 text-center">
				<button type="button" onClick={onBack} className="text-sm text-sky-500 hover:underline">
					Quay lại
				</button>
			</div>
		</form>
	)
}

