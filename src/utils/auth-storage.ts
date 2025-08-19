export type AppUser = {
  id: string;
  email: string;
  roles: string[];
  [k: string]: any;
};

const USER_KEY = "USER";


export function getStoredUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function clearStoredUser() {
  localStorage.clear();
}