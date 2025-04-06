import { PaginationModel } from "@/util/types/paginationModel";
import { APIService } from "../apiService";
export interface CategoryItemModel {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
}
export interface CourseListModel {
  courseId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  description?: string;
  price: number;
  thumbnailImageUrl?: string;
  languageId: number;
  language: string;
  levelId: number;
  levelName: string;
}
export interface ILanguageModel {
  languageId: number;
  name: string;
}
export class CourseService {
  apiService = new APIService();
  getLanguage = async (): Promise<ILanguageModel[]> => {
    return await this.apiService
      .callApi({
        url: "publicCourse/Language",
        method: "GET",
      })
      .then((response) => {
        if (response.success) {
          return response.data as ILanguageModel[];
        } else {
          return [];
        }
      });
  };
  getCategories = async (includeSubCategory: boolean) => {
    return await this.apiService
      .callApi({
        url:
          "publicCourse/ActiveCategory/?includeSubCategory=" +
          includeSubCategory,
        method: "GET",
      })
      .then((response) => {
        if (response.success) {
          return response.data as CategoryItemModel[];
        } else {
          return [];
        }
      });
  };
  getSubCategories = async (categoryId: number) => {
    if (categoryId == 0) return [];
    return await this.apiService
      .callApi({
        url: "publicCourse/SubCategory/?categoryId=" + categoryId,
        method: "GET",
        data: {},
      })
      .then((response) => {
        if (response.success) {
          return response.data as CategoryItemModel[];
        } else {
          return [];
        }
      });
  };
  getCourses = async (
    categoryId: number,
    subCategoryId: number,
    languageId: number,
    query: string,
    pageNo: number,
    pageSize: number,
    price: string,
    sortBy: string = ""
  ): Promise<PaginationModel<CourseListModel>> => {
    return await this.apiService
      .callApi({
        url:
          "publicCourse/Course/?categoryId=" +
          categoryId +
          "&subCategoryId=" +
          subCategoryId +
          "&languageId=" +
          languageId +
          "&SearchText=" +
          query +
          "&pageNum=" +
          pageNo +
          "&pageSize=" +
          pageSize +
          "&price=" +
          price +
          "&sortBy=" +
          sortBy,
        method: "GET",
      })
      .then((response) => {
        if (response.success) {
          return response.data as PaginationModel<CourseListModel>;
        } else {
          return new PaginationModel<CourseListModel>();
        }
      })
      .catch(() => {
        return new PaginationModel<CourseListModel>();
      });
  };
}
