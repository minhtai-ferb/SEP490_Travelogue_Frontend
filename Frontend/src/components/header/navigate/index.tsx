"use client";

import Link from "next/link";
import { cn } from "@/lib/utils"; // Nếu bạn có utility function này

const menuItems = [
  { label: "Khám phá", href: "/kham-pha" },
  // { label: "Kế hoạch chuyến đi", href: "/ke-hoach-chuyen-di" },
  { label: "Lễ hội & Sự kiện", href: "/le-hoi-va-su-kien" },
  { label: "Trải nghiệm", href: "/trai-nghiem" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Thông tin cần biết", href: "/thong-tin-can-biet" },
];

interface NavigateProps {
  style?: React.CSSProperties;
  onEnter?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onLeave?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

function Navigate({ style, onEnter, onLeave }: NavigateProps) {
  return (
    <nav className="relative z-10 lg:text-4xl md:text-3xl text-4xl mb-20 max-w-screen">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex justify-center items-end gap-10 lg:gap-20">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              key={index}
              className="navlink text-base md:text-[20px]"
              style={style}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigate;
