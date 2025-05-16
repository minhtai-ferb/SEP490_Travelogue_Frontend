"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "./components/header/index";
import AccountInfo from "./components/ho-so-ca-nhan/account-info";
import PasswordSecurity from "./components/doi-mat-khau/password-security";
import { useLoginCheck } from "@/lib/login-check";
import { userAtom } from "@/store/auth";
import { useAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/services/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addToast } from "@heroui/react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const { logout, resendEmailVerification } = useAuth();
  const { isLoggedIn } = useLoginCheck();
  const [user] = useAtom(userAtom);

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        console.log("User is not logged in. Redirecting to login...");
      } else {
        console.log("User is logged in.");
      }
    });
  }, []);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setTimeout(() => router.push("/login"), 1500);
  };

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
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full h-fit md:w-64 bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-800">{user?.fullName}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>

              {user?.isEmailVerified ? (
                <Badge className="w-fit h-fit mt-4 border border-green-300 bg-green-300/20 text-green-700 hover:bg-green-400 hover:text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Tài khoản đã xác thực
                </Badge>
              ) : (
                <Badge className="w-fit h-fit mt-4 border border-red-300 bg-red-300/20 text-red-700 hover:bg-red-600 hover:text-white font-semibold  py-2 px-4 rounded-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Tài khoản cần xác thực
                </Badge>
              )}
            </div>

            <nav className="p-4 border-b">
              <ul className="space-y-1">
                <li>
                  <Button
                    className="flex items-center px-4 py-2 w-full text-white font-semibold bg-blue-500 border border-blue-700 rounded-md"
                    variant="default"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-white"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                    </svg>
                    Tài khoản
                  </Button>
                </li>
              </ul>
            </nav>

            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Dialog
                    open={showLogoutConfirm}
                    onOpenChange={setShowLogoutConfirm}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex items-center px-4 py-2 w-full text-white font-semibold rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-white"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                        Đăng xuất
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bạn muốn đăng xuất</DialogTitle>
                        <DialogDescription>
                          Bạn muốn đăng xuất khởi trang này chứ ??
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowLogoutConfirm(false)}
                        >
                          Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                          Đăng xuất
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </li>
              </ul>
            </nav>
          </div>
          {/* Main content */}
          <div className="flex-1">
            {!user?.isEmailVerified && (
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
                <AlertTitle className="font-medium">
                  Tài khoản chưa xác thực!
                </AlertTitle>
                <AlertDescription className="flex justify-between items-center gap-2">
                  <p>
                    Bạn cần xác thực email để sử dụng đầy đủ tính năng của hệ
                    thống.
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
            )}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-xl font-semibold mb-6">Cài đặt</h1>

              <Tabs defaultValue="account" className="w-full">
                <TabsList className="mb-6 border-b w-full justify-start md:text-2xl text-sm rounded-none bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="account"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600"
                    onClick={() => setActiveTab("account")}
                  >
                    Thông tin tài khoản
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600"
                    onClick={() => setActiveTab("password")}
                  >
                    Mật khẩu & Bảo mật
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                  <AccountInfo />
                </TabsContent>

                <TabsContent value="password">
                  <PasswordSecurity />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
