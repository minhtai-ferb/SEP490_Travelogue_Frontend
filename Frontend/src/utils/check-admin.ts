export function isAdmin(userRoles: string[] | undefined): boolean {
  if (!userRoles || !Array.isArray(userRoles)) {
    return false; // Return false if userRoles is undefined or not an array
  }
  return userRoles.includes("admin");
}
