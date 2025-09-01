"use client";

import React from "react";
import AuthForm from "./components/auth-form";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function Authentication() {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const token = Cookies.get("jwtToken");
  const storedUser = localStorage.getItem("USER");

  if (token && (user || storedUser)) {
    router.push("/");
    return;
  }

  return <AuthForm />;
}

export default Authentication;
