"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { addToast } from "@heroui/react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import { useAuth } from "@/services/useAuth";

export default function VerificationAlert() {
  const [user] = useAtom(userAtom);
  const { resendEmailVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (user?.isEmailVerified) return null;

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      if (user?.email) {
        await resendEmailVerification(user.email);
      } else {
        console.error("User email is undefined. Cannot resend verification email.");
      }
      setResendSuccess(true);
      addToast({
        title: "Gửi mail thành công",
        description: "Email xác thực đã được gửi!",
        color: "success",
      });
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      addToast({
        title: "error",
        description: "Gửi lại email xác thực thất bại. Vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className="mb-6 border-amber-500 bg-amber-50 text-amber-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "#d97706" }}
        className="h-4 w-4"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <AlertTitle className="font-medium">Tài khoản chưa xác thực!</AlertTitle>
      <AlertDescription className="flex justify-between items-center gap-2">
        <p>
          Bạn cần xác thực email để sử dụng đầy đủ tính năng của hệ thống.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={isResending || resendSuccess}
            className="border-amber-500 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          >
            {isResending
              ? "Đang gửi..."
              : resendSuccess
              ? "Đã gửi thành công"
              : "Gửi lại email xác thực"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}