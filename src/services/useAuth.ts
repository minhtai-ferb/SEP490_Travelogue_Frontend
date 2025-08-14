"use client";

import useApiService from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAtom } from "jotai";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";
import { signInWithGoogle, signOut as firebaseSignOut } from "./firebase-auth";
import Cookies from "js-cookie";
import { add } from "date-fns";
import { addToast } from "@heroui/react";
import { clearActiveRole, clearStoredUser } from "@/utils/auth-storage";

export function useAuth() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const login = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const response = await callApi("post", "auth/login", values);
        console.log("login: ", response);

        // Store token
        Cookies.set("jwtToken", response.data.verificationToken, {
          expires: 2,
        });
        Cookies.set("refreshToken", response.data.refreshTokens, {
          expires: 7,
        });

        // Create user object
        const userData: User = {
          id: response.data.userId,
          accessToken: response.data.verificationToken,
          ...response.data,
          provider: "email",
        };

        // Update user in Jotai atom and localStorage
        setUser(userData);

        return userData;
      } catch (e: any) {
        addToast({
          title: "Đăng nhập thất bại!",
          description: e?.response?.data?.message || "Vui lòng thử lại",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    },
    [callApi, setUser, setLoading]
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Initiating Google login...");

      const googleUserData = await signInWithGoogle();
      console.log("Google login successful, user data:", googleUserData);
      // Store token
      if (!googleUserData?.accessToken) {
        throw new Error("Access token is undefined");
      }
      Cookies.set("jwtToken", googleUserData.accessToken, { expires: 2 });
      // Cookies.set("refreshToken", googleUserData?.refreshTokens, { expires: 7 });

      // Create user object
      const userData: User = {
        id: googleUserData.id,
        email: googleUserData.email || undefined,
        fullName: googleUserData.fullName || undefined,
        photoURL: googleUserData.photoURL || undefined,
        provider: "google",
        accessToken: googleUserData.accessToken, // Store access token for further API calls
      };

      // Update user in Jotai atom and localStorage
      setUser(userData);
      localStorage.setItem("USER", JSON.stringify(userData));
      localStorage.setItem("token", userData.id || ""); // Use user ID as token for simplicity

      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event("storage"));

      // You might want to sync this with your backend
      try {
        console.log("Syncing with backend...");
        await callApi("post", "auth/google-login", {
          token: userData?.accessToken,
        });
        console.log("Backend sync successful");
      } catch (error) {
        console.warn("Failed to sync Google login with backend:", error);
        // Continue anyway since Firebase auth succeeded
      }

      return userData;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callApi, setUser, setLoading]);

  const register = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const response = await callApi("post", "auth/register", values);
        // Create user object
        const userData: User = {
          id: response.data.userId,
          accessToken: response.data.verificationToken,
          ...response.data,
          provider: "email",
        };

        // Update user in Jotai atom and localStorage
        setUser(userData);

        return userData;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await callApi(
        "get",
        "auth/get-current-user",
        "application/json"
      );
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // If user was logged in with Google, sign out from Firebase
      if (user?.provider === "google") {
        await firebaseSignOut();
      }

      Cookies.remove("jwtToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("activeRole", { path: "/" });

      // Clear local storage and state
      clearActiveRole();
      clearStoredUser();
      setUser(null);

      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }, [setUser, router, user, setLoading]);

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        const response = await callApi("post", "auth/forgot-password", {
          email,
        });
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const checkValidCode = useCallback(
    async (email: string, token: string) => {
      try {
        setLoading(true);
        const response = await callApi("post", "auth/check-valid-code", {
          email,
          token,
        });
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const verifyEmail = useCallback(
    async (token: string) => {
      setLoading(true);
      try {
        const response = await callApi(
          "get",
          "auth/verify-email?token=" + token
        );
        console.log("Verify email response:", response);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const changePassword = useCallback(
    async (email: string, newPassword: string, confirmPassword: string) => {
      setLoading(true);
      try {
        const response = await callApi("post", "auth/change-password", {
          email,
          newPassword,
          confirmPassword,
        });

        // Store token
        Cookies.set("jwtToken", response.data.verificationToken, {
          expires: 2,
        });
        Cookies.set("refreshToken", response.data.refreshTokens, {
          expires: 7,
        });

        // Create user object
        const userData: User = {
          id: response.data.userId,
          accessToken: response.data.verificationToken,
          ...response.data,
          provider: "email",
        };

        // Update user in Jotai atom and localStorage
        setUser(userData);
      } catch (e: any) {
        console.error("Error resetting password:", e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setUser, setLoading]
  );

  const resetPassword = useCallback(
    async (
      email: string,
      token: string,
      newPassword: string,
      confirmPassword: string
    ) => {
      setLoading(true);
      try {
        const response = await callApi("post", "auth/reset-password", {
          email,
          token,
          newPassword,
          confirmPassword,
        });

        // Store token
        Cookies.set("jwtToken", response.data.verificationToken, {
          expires: 2,
        });
        Cookies.set("refreshToken", response.data.refreshTokens, {
          expires: 7,
        });

        // Create user object
        const userData: User = {
          id: response.data.userId,
          accessToken: response.data.verificationToken,
          ...response.data,
          provider: "email",
        };

        // Update user in Jotai atom and localStorage
        setUser(userData);
      } catch (e: any) {
        console.error("Error resetting password:", e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setUser, setLoading]
  );

  const getRefreshToken = async (token: string) => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await callApi("post", "auth/refresh-token", { token });
      console.log("Refresh token response:", response);
      return response;
    } catch (e: any) {
      if (e?.response?.status === 401) {
        addToast({
          title: "Lỗi xác thực!",
          // description: e?.response?.data.Message,
          description: "Vui lòng đăng nhặp lại",
          color: "warning",
        });

        if (user?.provider === "google") {
          await firebaseSignOut();
        }

        localStorage.removeItem("token");
        setUser(null);

        router.push("/");
        return;
      } else {
        console.error(e);
        throw e;
      }
    } finally {
      setLoading(false);
    }
  };

  const isTokenExpired = async () => {
    setLoading(true);
    try {
      const response = await callApi("post", "auth/check-token");
      return response.data;
    } catch (e: any) {
      if (e?.response?.status === 401) {
        addToast({
          title: "Lỗi token hết hạn!",
          // description: e?.response?.data.Message,
          description: "Vui lòng đăng nhặp lại",
          color: "warning",
        });
        //   Redirect to homepage
        if (user?.provider === "google") {
          await firebaseSignOut();
        }

        // Clear local storage and state
        localStorage.removeItem("token");
        setUser(null);

        // Redirect to login page
        router.push("/");
        return;
      } else {
        console.error(e);
        throw e;
      }
    } finally {
      setLoading(false);
    }
  };

  const resendEmailVerification = useCallback(
    async (email: string) => {
      setLoading(true);
      try {
        const response = await callApi(
          "get",
          `auth/resend-email-verification?email=${email}`
        );
        console.log("Resend email verification response:", response);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  return {
    login,
    loginWithGoogle,
    register,
    getCurrentUser,
    logout,
    forgotPassword,
    checkValidCode,
    changePassword,
    resetPassword,
    verifyEmail,
    getRefreshToken,
    isTokenExpired,
    resendEmailVerification,
    loading: isLoading || loading,
  };
}
