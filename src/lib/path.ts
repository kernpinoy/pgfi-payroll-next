/**
 * Normalize a path by removing trailing slashes.
 * @param path - URL pathname string
 * @returns normalized pathname without trailing slash
 */
export function normalizePath(path: string): string {
  return path.replace(/\/+$/, "");
}

/**
 * Checks if the current path is active given a target path.
 * Active if exact match or nested route (child path).
 *
 * @param currentPath - current window pathname (e.g. from usePathname())
 * @param targetPath - menu item path to check
 * @returns true if active, false otherwise
 */
export function isActiveRoute(
  currentPath: string,
  targetPath: string,
): boolean {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedTarget = normalizePath(targetPath);

  return (
    normalizedCurrent === normalizedTarget ||
    normalizedCurrent.startsWith(normalizedTarget + "/")
  );
}
