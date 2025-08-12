"use client";

import React, { useState } from "react";
import RequestsTabs from "./components/request-tabs";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// Nếu bạn có hook này, dùng để gửi lại email xác thực
import { useAuth } from "@/services/useAuth";
import { TriangleAlert } from "lucide-react";

function CraftVillageClient() {
  const [user] = useAtom(userAtom);
  const verified = Boolean(user?.isEmailVerified);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-6">Đăng ký đối tác</h1>

      {verified ? (
        <RequestsTabs />
      ) : (
        <Alert className="flex flex-col justify-center items-center border-amber-500 bg-amber-50 text-amber-800">
          <AlertTitle className="font-medium flex flex-row items-center gap-2">
            <TriangleAlert />
            Tài khoản chưa xác thực
          </AlertTitle>
          <AlertDescription className="mt-1">
            Bạn cần xác thực email để sử dụng tính năng đăng ký đối tác.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default CraftVillageClient;
