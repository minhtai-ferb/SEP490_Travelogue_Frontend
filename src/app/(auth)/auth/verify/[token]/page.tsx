"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/services/useAuth";

const VerifySuccess = ({ params }: { params: Promise<{ token: string }> }) => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [done, setdone] = useState(false);
  const { verifyEmail, loading } = useAuth();

  const { token } = use(params);

  useEffect(() => {
    const verify = async () => {
      try {
        if (token) {
          console.log("Token exists:", token);
        } else {
          console.log("Token does not exist in URL");
        }
        const response = await verifyEmail(token);
        console.log("Verification response:", response);

        const userData = localStorage.getItem("USER");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          parsedUserData.isEmailVerified = true;
          localStorage.setItem("USER", JSON.stringify(parsedUserData));
        }

        setdone(true);
      } catch (error: any) {
        console.log("Verification failed", error);
        if (error.response && error.response.data) {
          setError(String(error.response.data) || "Verification failed");
        } else {
          setError(String(error.message) || "Verification failed");
        }
      }
    };
    verify();
  }, [router]);

  useEffect(() => {
    let tokenCookies = Cookies.get("jwtToken");
    if (done == true) {
      timerRef.current = setTimeout(() => {
        if (!tokenCookies) {
          router.push("/login");
        } else router.push("/");
      }, 5000);

      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        clearInterval(interval);
      };
    }
  }, [done, error, router]);

  const handleGoHome = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    router.push("/");
  };

  return (
    <div className="fixed flex inset-0 top-0 left-0 right-0 bottom-0 items-center justify-center bg-gradient">
      <div className="z-10 flex flex-col relative bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
        {error && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-center text-green-600">
              Email Verified Successfully!
            </h2>
            <h3 className="text-3xl font-bold mb-4 text-center text-black">
              Nhưng!!! Bạn cần phải đăng nhập lại.
            </h3>
            <p className="mb-4 text-center text-gray-600">
              Bạn sẽ được chuyển hướng đến trang chủ trong{" "}
              <span className="font-semibold text-gray-800">{countdown}</span>{" "}
              giây...
            </p>
          </>
        )}
        {loading && (
          <p className="mb-4 text-center text-gray-600">Loading...</p>
        )}
        {!error && !loading && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-center  text-green-600">
              Email của bạn xác thực thành công!
            </h2>
            <p className="mb-4 text-center text-gray-600">
              Bạn sẽ được chuyển hướng đến trang chủ trong{" "}
              <span className="font-semibold text-gray-800">{countdown}</span>{" "}
              giây...
            </p>
            <div className="flex justify-center">
              <Button onClick={handleGoHome} disabled={loading}>
                Trở về trang chủ
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifySuccess;
