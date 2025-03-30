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
  { label: "Home", href: "/" },
  { label: "Categories", href: "/category  " },
  { label: "Courses", href: "/#courses  " },
  { label: "Mentor", href: "/#mentor" },
  { label: "Testimonial", href: "/#testimonial" },
];
