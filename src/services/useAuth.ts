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
import toast from "react-hot-toast";
import { clear } from "console";
import { clearStoredUser } from "@/utils/auth-storage";

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

        const userData: User = {
          id: response.data.userId,
          accessToken: response.data.verificationToken,
          ...response.data,
          provider: "email",
        };
        if (response.status === 200) {
          toast.success("Đăng nhập thành công!");
        }
        Cookies.set("jwtToken", response.data.verificationToken, {
          expires: 2,
        });
        Cookies.set("refreshToken", response.data.refreshTokens, {
          expires: 7,
        });
        setUser(userData);
        return userData;
      } catch (e: any) {
        if (e?.response?.status === 401) {
          toast.error("Tài khoản hoặc mật khẩu không đúng!");
        } else {
          toast.error("Đăng nhập thất bại!");
        }
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

      const responseFirebase = await signInWithGoogle();

      const userDataFirebase: User = {
        id: responseFirebase.id,
        email: responseFirebase.email || undefined,
        fullName: responseFirebase.fullName || undefined,
        photoURL: responseFirebase.photoURL || undefined,
        provider: "google",
        accessToken: responseFirebase.accessToken,
      };

      if (!responseFirebase?.accessToken) {
        toast.error("Tài khoản không xác định");
        throw new Error("Access token is undefined");
      }

      const response = await callApi("post", "auth/google-login", {
        token: userDataFirebase?.accessToken,
      });

      const userData: User = {
        id: response.data.userId,
        accessToken: response.data.verificationToken,
        avatarUrl:
          response.data.avatarUrl || responseFirebase.photoURL || undefined,
        ...response.data,
        provider: "google",
      };
      if (response.status === 200) {
        toast.success("Đăng nhập bằng Google thành công!");
      }
      Cookies.set("jwtToken", response.data.verificationToken, {
        expires: 2,
      });
      Cookies.set("refreshToken", response.data.refreshTokens, {
        expires: 7,
      });
      setUser(userData);
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

        // Update user in Jotai atom
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
      if (user?.provider === "google") {
        await firebaseSignOut();
      }
      Cookies.remove("jwtToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      clearStoredUser();
      setUser(null);
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
        toast.error("Bạn đã hết hạn đăng nhập, vui lòng đăng nhập lại");
        //   Redirect to homepage
        if (user?.provider === "google") {
          await firebaseSignOut();
        }
        logout();
        // Redirect to login page
        router.push("/auth");
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
