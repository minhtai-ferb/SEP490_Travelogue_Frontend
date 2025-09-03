"use client";

import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import VerificationAlert from "./components/verificationAlert";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Layout({ children }: { children: React.ReactNode }) {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, []);
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      {/* <div className="flex-1">{children}</div> */}
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Sidebar />
            <main className="flex-1">
              <VerificationAlert />
              {children}
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Layout;
