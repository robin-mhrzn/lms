import { NavigationRoute } from "@/util/navigation";

export type SubmenuItem = {
  label: string;
  href: string;
};

export type HeaderItem = {
  label: string;
  href: string;
  submenu?: SubmenuItem[];
};
export const headerData: HeaderItem[] = [
  { label: "Home", href: NavigationRoute.HOME },
  { label: "Categories", href: NavigationRoute.CATEGORY },
  { label: "Courses", href: NavigationRoute.COURSE },
  { label: "Mentor", href: "/#mentor" },
  { label: "Testimonial", href: "/#testimonial" },
];
