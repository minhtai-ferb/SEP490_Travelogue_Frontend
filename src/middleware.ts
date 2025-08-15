import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const prefixToRole: Record<string, string> = {
  "/admin": "Admin",
  "/moderator": "Moderator",
  "/tour-guide": "TourGuide",
  // "/craft-village-owner": "CraftVillageOwner",
  "/craftvillage": "CraftVillageOwner",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const match = Object.entries(prefixToRole).find(([p]) => pathname.startsWith(p));
  if (!match) return NextResponse.next();

  const requiredRole = match[1];
  const activeRole = req.cookies.get("activeRole")?.value;

  console.log(`Active role: ${activeRole}, Required role: ${requiredRole}`);

  if (activeRole !== requiredRole) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/choose-role";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/moderator/:path*", "/tour-guide/:path*", "/craftvillage/:path*"],
};
