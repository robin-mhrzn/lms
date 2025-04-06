"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CategoryItemModel,
  CourseListModel,
  CourseService,
  ILanguageModel,
} from "@/services/courseService/courseService";
import { Filter, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateCourseUrl, NavigationRoute } from "@/util/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PaginationModel } from "@/util/types/paginationModel";
import Link from "next/link";

interface RequestCourseListProps {
  categoryId?: number;
  subCategoryId?: number;
  price?: number[];
  query?: string;
  sortBy?: string;
  languageId?: number;
  pageNo?: number;
  pageSize?: number;
}

export interface SearchListProps {
  parentCategory: CategoryItemModel[];
  subCategory: CategoryItemModel[];
  searchRequest: RequestCourseListProps;
  coursePagination: PaginationModel<CourseListModel>;
  languagelist: ILanguageModel[];
}

const SearchListComponent: React.FC<SearchListProps> = ({
  parentCategory,
  subCategory,
  searchRequest,
  coursePagination,
  languagelist,
}) => {
  const router = useRouter();
  const [subCategoryList, setSubCategoryList] = useState(subCategory);
  const [categoryRequestItem, setCategoryRequestItem] =
    useState<RequestCourseListProps>(searchRequest);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    (searchRequest.price as [number, number]) || [0, 1000]
  );
  const courseService = new CourseService();

  const handleFilterChange = (
    key: keyof RequestCourseListProps,
    value: any
  ) => {
    setCategoryRequestItem((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCategoryChange = async (categoryId: number) => {
    const subCategoryList = await courseService.getSubCategories(categoryId);
    setSubCategoryList(subCategoryList);
    handleFilterChange("categoryId", categoryId);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    if (value.length !== 2) return;
    setPriceRange(value);
    handleFilterChange("price", `${value[0]}-${value[1]}`);
  };

  const handleSearch = (pageNo: number = 1) => {
    const { categoryId, subCategoryId, languageId, price, query, sortBy } =
      categoryRequestItem;
    const url = generateCourseUrl(
      categoryId,
      subCategoryId,
      languageId,
      (priceRange?.[0] ?? 0) + "-" + (priceRange?.[1] ?? 1000),
      query,
      sortBy,
      pageNo,
      searchRequest.pageSize
    );
    router.push(url);
  };

  const handlePageChange = (pageNo: number) => {
    handleSearch(pageNo);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="lg:w-1/4 bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="flex items-center gap-2 font-semibold text-xl text-gray-800">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          <button
            type="button"
            className="flex items-center gap-2 text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
            onClick={() => {
              router.push(NavigationRoute.COURSE);
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="category">
            <AccordionTrigger className="text-lg font-medium text-gray-700">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <select
                className="w-full mt-2 p-2 border rounded-lg text-gray-700"
                value={categoryRequestItem.categoryId || ""}
                onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
              >
                <option value="">All Categories</option>
                {parentCategory.map((category) => (
                  <option value={category.categoryId} key={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="subCategory">
            <AccordionTrigger className="text-lg font-medium text-gray-700">
              Sub Category
            </AccordionTrigger>
            <AccordionContent>
              <select
                className="w-full mt-2 p-2 border rounded-lg text-gray-700"
                value={categoryRequestItem.subCategoryId || ""}
                onChange={(e) =>
                  handleFilterChange("subCategoryId", parseInt(e.target.value))
                }
              >
                <option value="">All Subcategories</option>
                {subCategoryList.map((category) => (
                  <option value={category.categoryId} key={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="language">
            <AccordionTrigger className="text-lg font-medium text-gray-700">
              Language
            </AccordionTrigger>
            <AccordionContent>
              <select
                className="w-full mt-2 p-2 border rounded-lg text-gray-700"
                value={categoryRequestItem.languageId || ""}
                onChange={(e) =>
                  handleFilterChange("languageId", parseInt(e.target.value))
                }
              >
                <option value="">All</option>
                {languagelist.map((language) => (
                  <option
                    value={language.languageId}
                    key={"language_" + language.languageId}
                  >
                    {language.name}
                  </option>
                ))}
              </select>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger className="text-lg font-medium text-gray-700">
              Price Range
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) =>
                    handlePriceRangeChange(value as [number, number])
                  }
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="center">
          <Button onClick={() => handleSearch(1)}>Search</Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full lg:w-1/3">
            <div className="flex items-center bg-white  rounded-xl shadow-sm overflow-hidden ">
              <Search className="ml-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 text-gray-700 bg-transparent focus:outline-none"
                value={categoryRequestItem.query || ""}
                onChange={(e) => handleFilterChange("query", e.target.value)}
              />
              <Button onClick={() => handleSearch(1)}>Search</Button>
            </div>
          </div>
          <select
            className="w-full lg:w-40 p-2 border rounded-lg text-gray-700"
            value={categoryRequestItem.sortBy || ""}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price">Price (Asc)</option>
            <option value="priceDesc">Price (Desc)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursePagination.data.length > 0 ? (
            coursePagination.data.map((course) => (
              <Link
                href={`${NavigationRoute.COURSEDETAIL}${course.courseId}`}
                key={course.courseId}
              >
                <Card
                  key={course.courseId}
                  className="shadow-lg rounded-lg overflow-hidden border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnailImageUrl}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      {course.language}
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium text-gray-800">
                          Category:
                        </span>
                        <b>{course.categoryName}</b>
                      </p>
                      <p>
                        <span className="font-medium text-gray-800">
                          Sub Category:
                        </span>
                        <b>{course.subCategoryName}</b>
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-primary">
                        ${course.price}
                      </span>
                      <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary-dark">
                        Enroll Now
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No courses found.
            </div>
          )}
        </div>
        {coursePagination.totalPage > 1 && (
          <div className="flex justify-center items-center mt-6">
            <Button
              disabled={coursePagination.currentPage === 1}
              onClick={() => handlePageChange(coursePagination.currentPage - 1)}
              className="mr-2"
            >
              Previous
            </Button>
            <span className="text-gray-700">
              Page {coursePagination.currentPage} of{" "}
              {coursePagination.totalPage}
            </span>
            <Button
              disabled={
                coursePagination.currentPage === coursePagination.totalPage
              }
              onClick={() => handlePageChange(coursePagination.currentPage + 1)}
              className="ml-2"
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchListComponent;
