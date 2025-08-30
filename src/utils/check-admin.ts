export function isAdmin(userRoles: string[] | undefined): boolean {
  if (!userRoles || !Array.isArray(userRoles)) {
    return false; // Return false if userRoles is undefined or not an array
  }
  return userRoles.includes("admin");
}

export function hasAdminInPath(pathname: string): boolean {
  if (!pathname) {
    return false;
  }
  
  return pathname.toLowerCase().includes("/admin");
}