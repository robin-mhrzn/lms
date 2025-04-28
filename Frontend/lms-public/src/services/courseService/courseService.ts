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

export interface ICourseDetailModel {
  courseId: number;
  title: string;
  description: string;
  price: number;
  basePrice: number;
  levelName: string;
  duration: number;
  languageName: string;
  thumbnailImageUrl: string;
  tags: string[];
  additionalType: IAdditionalTypeModel[];
  modules: IModuleModel[];
}

export interface IAdditionalTypeModel {
  additionalType: string;
  items: string[];
}

export interface IModuleModel {
  moduleId: number;
  title: string;
  description: string;
  lessonCount: number;
  lessons: ILessonModel[];
}

export interface ILessonModel {
  lessonId: number;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
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
  getCourseDetail = async (courseId: number): Promise<ICourseDetailModel> => {
    return await this.apiService
      .callApi({
        url: "publicCourse/CourseDetail?courseId=" + courseId,
        method: "GET",
      })
      .then((response) => {
        if (response.success) {
          return response.data as ICourseDetailModel;
        } else {
          return {} as ICourseDetailModel;
        }
      });
  };
}
