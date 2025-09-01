"use client";

import Loading from "@/components/common/loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import Cookies from "js-cookie";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showContent, setShowContent] = useState(false);
  const [user] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    const storedUser = localStorage.getItem("USER");
    
    if (token && (user || storedUser)) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3500); // delay in ms

    return () => clearTimeout(timer);
  }, [user, router]);

  if (!showContent) return <Loading />;

  return <>{children}</>;
}
