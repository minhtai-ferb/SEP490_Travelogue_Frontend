export type AppUser = {
  id: string;
  email: string;
  roles: string[];
  [k: string]: any;
};

const USER_KEY = "USER";
const ACTIVE_ROLE_KEY = "activeRole";
import Cookies from "js-cookie";


export function getStoredUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function setStoredUser(user: AppUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export function getActiveRole(): string | null {
  const user = getStoredUser();
  const r = localStorage.getItem(ACTIVE_ROLE_KEY);
  if (user?.roles?.includes(r ?? "")) return r!;
  localStorage.removeItem(ACTIVE_ROLE_KEY);
  return null;
}
export function setActiveRole(role: string) {
  const user = getStoredUser();
  if (!user?.roles?.includes(role)) return;
  localStorage.setItem(ACTIVE_ROLE_KEY, role);
  Cookies.set(ACTIVE_ROLE_KEY, role, { expires: 7, path: "/" });
}
export function clearActiveRole() {
  localStorage.removeItem(ACTIVE_ROLE_KEY);
  Cookies.remove(ACTIVE_ROLE_KEY, { path: "/" });
}

export function getActiveRoleFromStorage(validRoles: string[]) {
  const active = localStorage.getItem(ACTIVE_ROLE_KEY);
  if (active && validRoles?.includes(active)) return active;
  localStorage.removeItem(ACTIVE_ROLE_KEY);
  Cookies.remove(ACTIVE_ROLE_KEY, { path: "/" });
  return null;
}