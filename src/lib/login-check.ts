"use client";

import { useAuth } from "@/services/useAuth";
import { addToast } from "@heroui/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const RedirectLogin = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData");
    Cookies.remove("jwtToken");
    Cookies.remove("refreshToken");
    addToast({
      title: "Lỗi xác thực!",
      description: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      color: "danger",
    });
    window.location.href = "/auth";
  }
};

let isRefreshing = false;
let isCheckingToken = false;
let tokenStatusCache: { data: boolean; message: string } | null = null;

export const useLoginCheck = () => {
  const { getRefreshToken, isTokenExpired } = useAuth();

  const isLoggedIn = async () => {
    const token = Cookies.get("jwtToken");
    const refreshToken = Cookies.get("refreshToken");

    if (!token || !refreshToken) {
      RedirectLogin();
      return false;
    }

    if (!tokenStatusCache) {
      if (isCheckingToken) {
        return false;
      }
      isCheckingToken = true;

      try {
        tokenStatusCache = await isTokenExpired();
      } catch (error) {
        console.error("Error checking token status:", error);
        isCheckingToken = false;
        return false;
      }
      isCheckingToken = false;
    }

    const tokenStatus = tokenStatusCache;

    if (!tokenStatus) {

    } else if (tokenStatus.data === false) {
      if (isRefreshing) {
        return false;
      }
      isRefreshing = true;

      let response;
      try {
        response = await getRefreshToken(refreshToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        isRefreshing = false;
        tokenStatusCache = null;
        return false;
      }

      isRefreshing = false;
      tokenStatusCache = null;

      if (response?.data == null) {
        // addToast({
        //   title: "Lỗi xác thực!",
        //   description: response?.message || "Không thể làm mới token.",
        //   color: "danger",
        // });
        toast.error(response?.message || "Không thể làm mới token.");
        return false;
      }

      Cookies.set("jwtToken", response.data.verificationToken);
      Cookies.set("refreshToken", response.data.refreshTokens);
      return true;
    }

    return true;
  };

  return { isLoggedIn };
};
