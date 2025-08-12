"use client";

import { useEffect } from "react";
import Header from "./components/header"; 
import { useLoginCheck } from "@/lib/login-check";
import SettingsLayout from "./components/settings-layout";

export default function SettingsPage() {
  const { isLoggedIn } = useLoginCheck();

  useEffect(() => {
    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        console.log("User is not logged in. Redirecting to login...");
        // Nếu muốn redirect ngay tại đây, thêm router.push("/auth")
      } else {
        console.log("User is logged in.");
      }
    });
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SettingsLayout />
    </div>
  );
}