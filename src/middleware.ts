import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SeccretKey } from "./secret/secret";

// Map prefix -> role yêu cầu
const prefixToRole: Record<string, string> = {
  "/admin/dashboard": "Admin",
  "/moderator": "Moderator",
  "/tour-guide/dashboard": "TourGuide",
  "/craftvillage": "CraftVillageOwner",
};

// Lấy secret để verify HMAC (HS256). Nếu bạn dùng RSA/EC, thay bằng public key tương ứng.
const secret = new TextEncoder().encode(SeccretKey.JWT_SECRET);

// Verify JWT và lấy roles từ payload
async function getRolesFromJwt(req: NextRequest): Promise<string[] | null> {
  const token = req.cookies.get("jwtToken")?.value; // bạn đã set cookie này ở client

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const roles = (payload as any)?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return Array.isArray(roles) ? roles : null;
  } catch {
    // Hết hạn / sai signature
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Chỉ áp rule với các prefix bên dưới
  const match = Object.entries(prefixToRole).find(([p]) => pathname.startsWith(p));
  if (!match) return NextResponse.next();

  const requiredRole = match[1];
  const roles = await getRolesFromJwt(req);

  // Chưa đăng nhập / không đọc được roles
  if (!roles) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Không có quyền vào prefix này
  if (!roles.includes(requiredRole)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/choose-role";
    return NextResponse.redirect(url);
  }

  // Ok, cho qua
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/moderator/:path*", "/tour-guide/:path*", "/craftvillage/:path*"],
};
