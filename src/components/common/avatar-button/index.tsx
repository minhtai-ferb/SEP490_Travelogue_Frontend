"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface TravelogueButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  avatarUrl?: string;
  label: string;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function TravelogueButton({
  icon,
  avatarUrl,
  label,
  variant = "default",
  size = "lg",
  className,
  ...props
}: TravelogueButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-full shadow-md transition-all duration-200 hover:shadow-lg",
        {
          "bg-white/90 text-white": variant === "default",
          "bg-primary text-white": variant === "primary",
          "bg-secondary text-white": variant === "secondary",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {/* {icon && <div className="flex items-center justify-center">{icon}</div>} */}
      {avatarUrl ? (
        <div className="flex items-center justify-center">
          <img src={avatarUrl} alt={label} className="w-7 h-7 rounded-full" />
        </div>
      ) : (
        icon && <div className="flex items-center justify-center">{icon}</div>
      )}
      <span>{label}</span>
    </button>
  );
}
