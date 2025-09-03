import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SeccretKey } from "./secret/secret";

// Map prefix -> role yêu cầu
const prefixToRole: Record<string, string> = {
  "/admin/dashboard": "Admin",
  "/moderator/dashboard": "Moderator", 
  "/tour-guide/dashboard": "TourGuide",
  "/craftvillage/dashboard": "CraftVillageOwner",
};

// Lấy secret để verify HMAC (HS256)
const secret = new TextEncoder().encode(SeccretKey.JWT_SECRET);

// Verify JWT và lấy roles từ payload
async function getRolesFromJwt(req: NextRequest): Promise<string[] | null> {
  const token = req.cookies.get("jwtToken")?.value;
  
  if (!token) {
    console.log("No JWT token found");
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("JWT verified successfully");
    
    // Try to find roles in different possible claim names
    const rolesClaim = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
                    || payload["role"] 
                    || payload["roles"]
                    || payload["authorities"];
    
    console.log("Raw roles claim:", rolesClaim);
    
    if (Array.isArray(rolesClaim)) {
      console.log("Roles found (array):", rolesClaim);
      return rolesClaim;
    } else if (typeof rolesClaim === 'string') {
      console.log("Role found (string):", rolesClaim);
      return [rolesClaim];
    }
    
    console.log("No roles found in JWT payload");
    return null;
  } catch (error) {
    console.log("JWT verification failed:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("Middleware checking:", pathname);

  // Chỉ áp rule với các prefix trong prefixToRole
  const match = Object.entries(prefixToRole).find(([prefix]) => pathname.startsWith(prefix));
  if (!match) {
    console.log("Path not protected, allowing access");
    return NextResponse.next();
  }

  const [prefix, requiredRole] = match;
  console.log(`Path ${pathname} requires role: ${requiredRole}`);
  
  const userRoles = await getRolesFromJwt(req);
  
  // Chưa đăng nhập hoặc không có roles
  if (!userRoles || userRoles.length === 0) {
    console.log("No valid roles, redirecting to /auth");
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Kiểm tra có quyền truy cập không
  if (!userRoles.includes(requiredRole)) {
    console.log(`Access denied. User roles: [${userRoles.join(', ')}], Required: ${requiredRole}`);
    const url = req.nextUrl.clone();
    url.pathname = "/auth/choose-role";
    return NextResponse.redirect(url);
  }

  console.log(`Access granted for role: ${requiredRole}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/moderator/:path*", "/tour-guide/:path*", "/craftvillage/:path*"],
};
