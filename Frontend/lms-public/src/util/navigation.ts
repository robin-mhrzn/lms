export enum NavigationRoute {
  HOME = "/",
  LOGIN = "/signin/",
  REGISTER = "/signup/",
  COURSE = "/course",
  COURSEDETAIL = "/courseDetail/",
  CATEGORY = "/category",
  DASHBOARD = "/admin",
  PROFILE = "/admin/profile",
  MY_PURCHASES = "/admin/my-purchases",
}

export const generateCourseUrl = (
  categoryId?: number,
  subCategoryId?: number,
  languageId?: number,
  price?: string,
  query?: string,

  sortBy?: string,
  pageNo?: number,
  pageSize?: number
): string => {
  let url = NavigationRoute.COURSE.toString();
  url =
    url +
    "/" +
    (categoryId || 0) +
    "/" +
    (subCategoryId || 0) +
    "/" +
    (languageId || 0) +
    "/" +
    (price || "_") +
    "/" +
    (query || "_") +
    "/" +
    (sortBy || "_") +
    "/" +
    (pageNo || 1) +
    "/" +
    (pageSize || 10);
  return url;
};
