import {
  CourseListModel,
  CourseService,
} from "@/services/courseService/courseService";
import React from "react";
import SearchListComponent from "@/components/course/searchList/searchList";
import { PaginationConstants } from "@/util/constants";

export default async function Page({
  params,
}: {
  params: Promise<{ slugs?: string[] }>;
}) {
  const { slugs } = await params;
  const [
    categoryId = "0",
    subCategoryId = "0",
    languageId = "0",
    price = "",
    query = "",
    sortBy = "",
    pageNo = "1",
    pageSize = PaginationConstants.PAGE_SIZE.toString(),
  ] = slugs || [];

  const courseService = new CourseService();

  const parsedCategoryId = parseInt(categoryId);
  const parsedSubCategoryId = parseInt(subCategoryId);
  const parsedLanguageId = parseInt(languageId);
  const parsedPageNo = parseInt(pageNo);
  const parsedPageSize = parseInt(pageSize);

  const [parentCategory, subCategory, languageList, coursePagination] =
    await Promise.all([
      courseService.getCategories(true),
      courseService.getSubCategories(parsedCategoryId),
      courseService.getLanguage(),
      courseService.getCourses(
        parsedCategoryId,
        parsedSubCategoryId,
        parsedLanguageId,
        query === "_" ? "" : query,
        parsedPageNo,
        parsedPageSize,
        price,
        sortBy
      ),
    ]);

  return (
    <section>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-10">
        <SearchListComponent
          parentCategory={parentCategory}
          subCategory={subCategory}
          languagelist={languageList}
          searchRequest={{
            categoryId: parsedCategoryId,
            subCategoryId: parsedSubCategoryId,
            price: price ? price.split("-").map(Number) : [0, 1000],
            query,
            sortBy,
            pageNo: parsedPageNo,
            pageSize: parsedPageSize,
            languageId: parsedLanguageId,
          }}
          coursePagination={coursePagination}
        />
      </div>
    </section>
  );
}
