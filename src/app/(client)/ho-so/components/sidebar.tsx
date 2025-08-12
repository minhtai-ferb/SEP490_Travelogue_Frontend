"use client";

import { Button } from "@/components/ui/button";
import LogoutDialog from "./logout-dialog";
import ProfileCard from "./profile-card";
import { useRouter, usePathname } from "next/navigation";
import { CircleUser, Handshake } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Tài khoản",
      icon: (
        <>
          <CircleUser />
        </>
      ),
      href: "/ho-so",
    },
    {
      label: "Đăng ký đối tác",
      icon: (
        <>
          <Handshake />
        </>
      ),
      href: "/ho-so/gia-nhap",
    },
  ];

  return (
    <aside className="w-full h-fit md:w-64 bg-white rounded-lg shadow-sm">
      <ProfileCard />

      <nav className="p-4 border-b">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Button
                  className={`group flex items-center px-4 py-2 w-full font-semibold border rounded-md ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-700"
                      : "bg-white text-blue-500 border-blue-700 hover:text-white"
                  }`}
                  variant="default"
                  onClick={() => router.push(item.href)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-5 h-5 mr-2 ${
                      isActive
                        ? "text-white"
                        : "text-blue-500 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </svg>
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <LogoutDialog />
          </li>
        </ul>
      </nav>
    </aside>
  );
}
