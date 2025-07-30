"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToast, Alert } from "@heroui/react";
import { useAuth } from "@/services/useAuth";
import { isValidEmailOrPhone, isValidPassword } from "@/utils/validation";
import { GoogleLoginButton } from "../google-button";
import { useRouter } from "next/navigation";
import { User } from "@/types/Users";

interface LoginFormProps {
  onSwitchMode: () => void;
  onForgotPassword: () => void;
}

interface FormData {
  email: string;
  password: string;
}

export function LoginForm({ onSwitchMode, onForgotPassword }: LoginFormProps) {
  const { login, loginWithGoogle } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    setError("");

    try {
      const response = await login(data);
      const user = response as User;
      if (!user || !user.roles || user.roles.length === 0) {
        throw new Error("Bạn không có quyền truy cập hệ thống");
      } else if (user.roles.includes("Admin")) {
        navigate.push("/dashboard");
      } else {
        navigate.push("/");
      }
      addToast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn đến với Goyoung Tây Ninh",
        color: "success",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.response?.data?.Message || "Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGooglePending(true);
    setError("");

    try {
      await loginWithGoogle();
      navigate.push("/");
      addToast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn đến với Goyoung Tây Ninh",
        color: "success",
      });
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error?.message || "Đã xảy ra lỗi khi đăng nhập với Google");
    } finally {
      setIsGooglePending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email/Số điện thoại
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
              validate: (value) =>
                isValidEmailOrPhone(value) || "Email không hợp lệ",
            })}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-sky-500 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Lock className="h-5 w-5" />
          </div>
          <Input
            id="password"
            type="password"
            className="pl-10"
            {...register("password", {
              required: "Mật khẩu là bắt buộc",
              validate: (value) =>
                isValidPassword(value) || "Mật khẩu phải có ít nhất 6 ký tự",
            })}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors?.password?.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <Alert color="danger" title={error} />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={isPending}
      >
        {isPending ? "Đang xử lý..." : "ĐĂNG NHẬP"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">HOẶC</span>
        </div>
      </div>

      <GoogleLoginButton
        isLoading={isGooglePending}
        onClick={handleGoogleLogin}
      />

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="font-medium text-sky-500 hover:underline"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Bằng cách đăng nhập, bạn đồng ý với{" "}
        <a href="#" className="text-sky-500 hover:underline">
          Điều khoản & Điều kiện
        </a>{" "}
        của chúng tôi và bạn đã đọc{" "}
        <a href="#" className="text-sky-500 hover:underline">
          Chính Sách Quyền Riêng Tư
        </a>{" "}
        của chúng tôi.
      </div>
    </form>
  );
}
