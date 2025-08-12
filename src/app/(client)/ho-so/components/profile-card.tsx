"use client";

import { Badge } from "@/components/ui/badge";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";

export default function ProfileCard() {
  const [user] = useAtom(userAtom);

  return (
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
  );
}