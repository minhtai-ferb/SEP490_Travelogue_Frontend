"use client";

import Loading from "@/components/common/loading";
import { useEffect, useState } from "react";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3500); // delay in ms

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) return <Loading />;

  return <>{children}</>;
}
