

import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const prefixToRole: Record<string, string> = {
  "/admin": "Admin",
  "/moderator": "Moderator",
  "/tour-guide": "TourGuide",
  "/craft-village-owner": "CraftVillageOwner",
};

export async function ensureRole(requiredRole: string) {
  const activeRole = Cookies.get("activeRole");
  if (activeRole !== requiredRole) {
    redirect("/auth/choose-role");
  }
}
