"use client";

import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import VerificationAlert from "./components/verificationAlert";
import { useLoginCheck } from "@/lib/login-check";

function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useLoginCheck();

  useEffect(() => {
    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        console.log("User is not logged in. Redirecting to login...");
      } else {
        console.log("User is logged in.");
      }
    });
  }, [isLoggedIn]);

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
