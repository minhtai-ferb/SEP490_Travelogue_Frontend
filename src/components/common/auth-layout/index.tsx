"use client"

import Image from "next/image"
import { useState } from "react"

import { LoginForm } from "../login-form"
import { RegisterForm } from "../register-form"
import { ForgotPasswordForm } from "../forgot-password"
import { VerifyCodeForm } from "../verify-code-form"
import { ResetPasswordForm } from "../reset-password"
import { useRouter } from "next/navigation"
import Link from "next/link"

type AuthMode = "login" | "register" | "forgot-password" | "verify-code" | "reset-password"

export default function AuthLayout() {
	const [authMode, setAuthMode] = useState<AuthMode>("login")
	const [email, setEmail] = useState("")
	const [resetCode, setResetCode] = useState("")
	const router = useRouter()

	const handleSwitchToLogin = () => setAuthMode("login")
	const handleSwitchToRegister = () => setAuthMode("register")
	const handleSwitchToForgotPassword = () => setAuthMode("forgot-password")

	const handleCodeSent = (email: string) => {
		setEmail(email)
		setAuthMode("verify-code")
	}

	const handleCodeVerified = (email: string, code: string) => {
		setEmail(email)
		setResetCode(code)
		setAuthMode("reset-password")
	}

	const handleResendCode = () => {
		// Go back to forgot password to resend the code
		setAuthMode("forgot-password")
	}

	const handleResetSuccess = () => {
		// Go back to login after successful password reset
		setAuthMode("login")
	}

	return (
		<div className="flex min-h-screen flex-col md:flex-row">
			{/* Left side - Background image and branding */}
			<div className="relative flex flex-1 flex-col items-center justify-center bg-blue-900 p-8 text-center text-white">
				<div className="relative z-10 max-w-md">
					<h1 className="mb-2 font-serif text-5xl font-bold italic tracking-wide">Traveloge</h1>
					<h2 className="mb-6 text-xl">Tây Ninh Du Khảo về nguồn</h2>
					<p className="text-lg">
						Du lịch là trải nghiệm duy nhất làm phong phú tâm hồn bạn theo những cách vượt xa giá trị vật chất
					</p>
				</div>
				<div className="absolute inset-0 z-0">
					<Image
						src="/image/auth_form.JPG"
						alt="Tây Ninh landscape"
						fill
						className="object-cover opacity-40"
						priority
					/>
				</div>
			</div>

			{/* Right side - Auth form */}
			<div className="flex flex-1 flex-col items-center justify-center bg-white p-8 h-screen overflow-auto">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<div className="relative flex justify-center">
							<Link href="/">
								<Image src="/mascot.png" alt="logo" width={80} height={80} className="object-contain cursor-pointer" />
							</Link>
						</div>
						<h2 className="text-4xl font-bold text-sky-500">
							{authMode === "login"
								? "Welcome"
								: authMode === "register"
									? "Đăng ký"
									: authMode === "forgot-password"
										? "Quên mật khẩu"
										: authMode === "verify-code"
											? "Xác nhận mã"
											: "Đặt lại mật khẩu"}
						</h2>
						<p className="text-gray-500">
							{authMode === "login"
								? "Đăng nhập với Email"
								: authMode === "register"
									? "Tạo tài khoản mới"
									: authMode === "forgot-password"
										? "Nhập email để lấy lại mật khẩu"
										: authMode === "verify-code"
											? "Nhập mã xác nhận từ email của bạn."
											: "Tạo mật khẩu mới"}
						</p>
					</div>

					{authMode === "login" && (
						<LoginForm onSwitchMode={handleSwitchToRegister} onForgotPassword={handleSwitchToForgotPassword} />
					)}

					{authMode === "register" && <RegisterForm onSwitchMode={handleSwitchToLogin} />}

					{authMode === "forgot-password" && (
						<ForgotPasswordForm onSwitchToLogin={handleSwitchToLogin} onCodeSent={handleCodeSent} />
					)}

					{authMode === "verify-code" && (
						<VerifyCodeForm
							email={email}
							onCodeVerified={handleCodeVerified}
							onResendCode={handleResendCode}
							onBack={() => setAuthMode("forgot-password")}
						/>
					)}

					{authMode === "reset-password" && (
						<ResetPasswordForm
							email={email}
							code={resetCode}
							onSuccess={handleResetSuccess}
							onBack={() => setAuthMode("verify-code")}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

