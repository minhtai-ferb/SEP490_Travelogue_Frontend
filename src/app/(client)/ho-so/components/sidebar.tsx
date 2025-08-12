"use client";

import { Button } from "@/components/ui/button";
import LogoutDialog from "./logout-dialog";
import ProfileCard from "./profile-card";

type Props = {
  onSelectTab?: (value: string) => void;
};

export default function Sidebar({ onSelectTab }: Props) {
  return (
    <aside className="w-full h-fit md:w-64 bg-white rounded-lg shadow-sm">
      <ProfileCard />

      <nav className="p-4 border-b">
        <ul className="space-y-1">
          <li>
            <Button
              className="flex items-center px-4 py-2 w-full text-white font-semibold bg-blue-500 border border-blue-700 rounded-md"
              variant="default"
              onClick={() => onSelectTab?.("account")}
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
            <LogoutDialog />
          </li>
        </ul>
      </nav>
    </aside>
  );
}