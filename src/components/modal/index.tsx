/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { isValidEmailOrPhone, isValidPassword } from "@/utils"
import { addToast, Tab, Tabs } from "@heroui/react"
import { Box } from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useAuth } from "@/services/useAuth"
import { useAtom } from "jotai"
import { userAtom } from "@/store/auth"
import { GoogleLoginButton } from "../common/google-button"

interface ModalProps {
	isLogin: boolean | null
	open: boolean
	onClose: () => void
}

interface FormData {
	email: string
	password: string
}

interface RegisterFormData {
	fullName: string
	email: string
	password: string
	confirmPassword: string
}

function Modal({ isLogin, open, onClose }: ModalProps) {
	const { login, register, loginWithGoogle, logout } = useAuth()
	const [user, setUser] = useAtom(userAtom)
	const [isPending, setIsPending] = useState(false)
	const [selected, setSelected] = useState("login")
	const [error, setError] = useState("")
	const [registerError, setRegisterError] = useState("")
	const [isGooglePending, setIsGooglePending] = useState(false)

	const {
		control,
		handleSubmit: handleLoginSubmit,
		reset: resetLoginForm,
		formState: { errors, isValid },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	})

	// Register form
	const {
		control: registerControl,
		handleSubmit: handleRegisterSubmit,
		reset: resetRegisterForm,
		formState: { errors: registerErrors, isValid: isRegisterValid },
	} = useForm<RegisterFormData>({
		mode: "onChange",
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	const onSubmitRegister = async (data: RegisterFormData) => {
		setIsPending(true)
		try {
			// Validate confirm password
			console.log("====================================")
			console.log("''''register data-------", data)
			console.log("====================================")
			if (data.password !== data.confirmPassword) {
				setRegisterError("Mật khẩu và xác nhận mật khẩu không khớp")
				return
			}

			// Perform registration
			const response = await register(data)
			addToast({
				title: "Đăng ký thành công!",
				description: "Chào mừng bạn đến với Traveloge",
				color: "success",
			})
			onClose()
			resetRegisterForm()
		} catch (error: any) {
			console.error("Registration error:", error)
			addToast({
				title: "Lỗi đăng ký!",
				description: error.message || "Đã xảy ra lỗi khi đăng ký",
				color: "danger",
			})
		} finally {
			setIsPending(false)
		}
	}

	const onSubmitLogin = async (data: FormData) => {
		setIsPending(true)
		try {
			const response = await login(data)
			if (!response) {
				throw new Error("No data returned from login")
			}

			// The login function already updates the Jotai atom

			addToast({
				title: "Đăng nhập thành công!",
				description: "Chào mừng bạn đến với Traveloge",
				color: "success",
			})
			onClose()
			resetLoginForm()
		} catch (error: any) {
			console.log("====================================")
			console.log(error)
			console.log("====================================")
			setError(error?.response?.data.Message || "Đã xảy ra lỗi khi đăng nhập")
		} finally {
			setIsPending(false)
		}
	}

	const handleClose = () => {
		resetLoginForm()
		resetRegisterForm()
		onClose()
	}

	const handleGoogleLogin = async () => {
		setIsGooglePending(true)
		try {
			await loginWithGoogle()
			addToast({
				title: "Đăng nhập thành công!",
				description: "Chào mừng bạn đến với Traveloge",
				color: "success",
			})
			onClose()
		} catch (error: any) {
			console.error("Google login error:", error)
			addToast({
				title: "Lỗi đăng nhập!",
				description: error.message || "Đã xảy ra lỗi khi đăng nhập với Google",
				color: "danger",
			})
		} finally {
			setIsGooglePending(false)
		}
	}

	useEffect(() => {
		// Set the initial tab based on isLogin prop
		setSelected(isLogin ? "login" : "register")
	}, [isLogin])

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				component: "form",
				onSubmit: selected === "login" ? handleLoginSubmit(onSubmitLogin) : handleRegisterSubmit(onSubmitRegister),
			}}
		>
			<div className="flex w-full flex-col h-screen">
				<Tabs
					color="warning"
					radius="full"
					classNames={{
						tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider font-semibold",
						cursor: "w-full bg-[#22d3ee]",
						tab: "max-w-full h-12",
						tabContent: "group-data-[selected=true]:text-[#22d3ee] text-lg",
					}}
					variant="underlined"
					selectedKey={selected} // Set the selected key
					onSelectionChange={(key) => setSelected(key as string)}
				>
					{/* Đăng nhập */}
					<Tab key="login" title="Đăng nhập">
						<DialogContent>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
								<Controller
									name="email"
									control={control}
									rules={{
										required: "Email/Số điện thoại là bắt buộc",
										validate: (value) => isValidEmailOrPhone(value) || "Email/Số điện thoại không hợp lệ",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											autoFocus
											required
											margin="dense"
											id="email"
											label="Email/Số điện thoại di động"
											fullWidth
											variant="standard"
											error={!!errors.email}
											helperText={errors.email?.message}
										/>
									)}
								/>

								<Controller
									name="password"
									control={control}
									rules={{
										required: "Mật khẩu là bắt buộc",
										validate: (value: string) => isValidPassword(value) || "Mật khẩu phải có ít nhất 6 ký tự",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											required
											type="password"
											margin="dense"
											id="password"
											label="Mật khẩu"
											fullWidth
											variant="standard"
											error={!!errors.password}
											helperText={errors.password?.message}
										/>
									)}
								/>
							</Box>
						</DialogContent>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 1,
								width: "100%",
								gap: 2,
							}}
						>
							<Button
								type="submit"
								disabled={!isValid || isPending}
								sx={
									!isValid || isPending
										? { backgroundColor: "#bdbdbd", color: "#000000", width: "90%", fontWeight: 600 }
										: { backgroundColor: "#FE5E1D", color: "white", width: "90%", fontWeight: 600 }
								}
							>
								<span className="font-medium">{isPending ? "Đang xử lý..." : "Đăng nhập"}</span>
							</Button>
							{/* Divider */}
							<div className="relative my-2 w-full">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="bg-white px-2 text-gray-500">Hoặc</span>
								</div>
							</div>
							{/* Google Login Button */}
							<GoogleLoginButton isLoading={isGooglePending} onClick={handleGoogleLogin} />
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<Link href="/quen-mat-khau">
								<p className="text-sky-600 font-medium">Quên mật khẩu?</p>
							</Link>
						</Box>

						<DialogContent>
							<DialogContentText id="alert-dialog-description" sx={{ textAlign: "center" }}>
								Bằng cách đăng ký, bạn đồng ý với{" "}
								<Link href="#" className="text-sky-500">
									Điều khoản & Điều kiện
								</Link>{" "}
								của chúng tôi và bạn đã đọc{" "}
								<Link href="#" className="text-sky-500">
									Chính Sách Quyền Riêng Tư
								</Link>{" "}
								của chúng tôi.
							</DialogContentText>
						</DialogContent>
					</Tab>

					{/* Đăng ký */}
					<Tab key="register" title="Đăng ký">
						<DialogContent>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
								{/* Full Name */}
								<Controller
									name="fullName"
									control={registerControl}
									rules={{ required: "Họ và tên là bắt buộc" }}
									render={({ field }) => (
										<TextField
											{...field}
											required
											margin="dense"
											id="fullName"
											label="Họ và tên"
											fullWidth
											variant="standard"
											error={!!registerErrors.fullName}
											helperText={registerErrors.fullName?.message}
										/>
									)}
								/>

								{/* Email/Phone */}
								<Controller
									name="email"
									control={registerControl}
									rules={{
										required: "Email/Số điện thoại là bắt buộc",
										validate: (value) => isValidEmailOrPhone(value) || "Email/Số điện thoại không hợp lệ",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											required
											margin="dense"
											id="email"
											label="Email/Số điện thoại"
											fullWidth
											variant="standard"
											error={!!registerErrors.email}
											helperText={registerErrors.email?.message}
										/>
									)}
								/>

								{/* Password */}
								<Controller
									name="password"
									control={registerControl}
									rules={{
										required: "Mật khẩu là bắt buộc",
										validate: (value: string) => isValidPassword(value) || "Mật khẩu phải có ít nhất 6 ký tự",
									}}
									render={({ field }) => (
										<TextField
											{...field}
											required
											type="password"
											margin="dense"
											id="password"
											label="Mật khẩu"
											fullWidth
											variant="standard"
											error={!!registerErrors.password}
											helperText={registerErrors.password?.message}
										/>
									)}
								/>

								{/* Confirm Password */}
								<Controller
									name="confirmPassword"
									control={registerControl}
									rules={{ required: "Xác nhận mật khẩu là bắt buộc" }}
									render={({ field }) => (
										<TextField
											{...field}
											required
											type="password"
											margin="dense"
											id="confirmPassword"
											label="Xác nhận mật khẩu"
											fullWidth
											variant="standard"
											error={!!registerErrors.confirmPassword}
											helperText={registerErrors.confirmPassword?.message}
										/>
									)}
								/>
							</Box>
						</DialogContent>

						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 1,
								width: "100%",
								gap: 2,
							}}
						>
							<Button
								type="submit"
								disabled={!isRegisterValid || isPending}
								sx={
									!isRegisterValid || isPending
										? { backgroundColor: "#bdbdbd", color: "#000000", width: "90%", fontWeight: 600 }
										: { backgroundColor: "#FE5E1D", color: "white", width: "90%", fontWeight: 600 }
								}
							>
								<span className="font-medium">{isPending ? "Đang xử lý..." : "Đăng ký"}</span>
							</Button>

							{/* Divider */}
							<div className="relative my-2 w-full">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="bg-white px-2 text-gray-500">Hoặc</span>
								</div>
							</div>

							{/* Google Login Button */}
							<GoogleLoginButton label="Đăng ký với Google" isLoading={isGooglePending} onClick={handleGoogleLogin} />
							{registerError && <p className="text-red-500 text-sm">{registerError}</p>}
						</Box>

						<DialogContent>
							<DialogContentText id="alert-dialog-description" sx={{ textAlign: "center" }}>
								Bằng cách đăng ký, bạn đồng ý với{" "}
								<Link href="#" className="text-sky-500">
									Điều khoản & Điều kiện
								</Link>{" "}
								của chúng tôi và bạn đã đọc{" "}
								<Link href="#" className="text-sky-500">
									Chính Sách Quyền Riêng Tư
								</Link>{" "}
								của chúng tôi.
							</DialogContentText>
						</DialogContent>
					</Tab>
				</Tabs>
			</div>
		</Dialog>
	)
}

export default Modal

