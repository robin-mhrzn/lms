export const PATHS = {
  LANDINGPAGE: "/",
  DASHBOARD: "/admin",
  CATEGORY: "/admin/category",
  SETTINGS: "/settings",
  USERS: "/users",
  REPORTS: "/reports",
  PROFILE: "/profile",
} as const;
export interface RouteMapping {
  title: string;
  breadcrumb: { label: string; path?: string }[];
}

export const NavigationRoutes: Record<string, RouteMapping> = {
  [PATHS.DASHBOARD]: {
    title: "Dashboard",
    breadcrumb: [
      { label: "Home", path: PATHS.DASHBOARD },
      { label: "Dashboard" },
    ],
  },
  [PATHS.SETTINGS]: {
    title: "Settings",
    breadcrumb: [
      { label: "Home", path: PATHS.DASHBOARD },
      { label: "Settings" },
    ],
  },
  [PATHS.USERS]: {
    title: "User Management",
    breadcrumb: [{ label: "Home", path: PATHS.DASHBOARD }, { label: "Users" }],
  },
  [PATHS.REPORTS]: {
    title: "Reports",
    breadcrumb: [
      { label: "Home", path: PATHS.DASHBOARD },
      { label: "Reports" },
    ],
  },
  [PATHS.PROFILE]: {
    title: "Profile",
    breadcrumb: [
      { label: "Home", path: PATHS.DASHBOARD },
      { label: "Profile" },
    ],
  },
};
