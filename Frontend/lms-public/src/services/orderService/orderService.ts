import { PaginationModel } from "@/util/types/paginationModel";
import { APIService } from "../apiService";
import { showMessage } from "@/util/sharedHelper";
export interface IPurchaseCourseItem {
  courseId: number;
  courseName: string;
  thumbnailImageUrl: string;
}
export interface ICourseModuleItem {
  moduleId: number;
  title: string;
  description: string;
  lesson: ICourseModuleLessonItem[];
}
export interface ICourseModuleLessonItem {
  lessonId: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  position: number;
  isCompleted: boolean;
}

export class OrderService {
  apiService = new APIService();
  addOrder = async (
    courseId: number,
    courseName: string,
    price: number,
    token: string
  ): Promise<any> => {
    return await this.apiService
      .callApi({
        url: "order/Add",
        method: "POST",
        data: {
          courseId,
          courseName,
          price,
          token,
        },
      })
      .then((response) => {
        return response;
      });
  };

  isCoursePurchased = async (courseId: number): Promise<boolean> => {
    return await this.apiService
      .callApi({
        url: "order/CoursePurchased/?courseId=" + courseId,
        method: "GET",
      })
      .then((response) => {
        if (response.success) {
          return response.data.isPurchaseItem as boolean;
        } else {
          return false;
        }
      });
  };
  purchasedCourses = async (
    pageNo: number,
    pageSize: number
  ): Promise<PaginationModel<IPurchaseCourseItem>> => {
    return await this.apiService
      .callApi({
        url:
          "order/PurchasedCourses/?currentPage=" +
          pageNo +
          "&PageSize=" +
          pageSize,
        method: "GET",
      })
      .then((response) => {
        if (response.success) {
          return response.data as PaginationModel<IPurchaseCourseItem>;
        } else {
          return {
            currentPage: 1,
            totalPage: 0,
            data: [],
            pageSize: 10,
            totalRecord: 0,
          } as PaginationModel<IPurchaseCourseItem>;
        }
      });
  };
  purchasedCourseModuleLessons = async (
    courseId: number,
    moduleId: number
  ): Promise<ICourseModuleItem> => {
    return await this.apiService
      .callApi({
        url:
          "order/PurchaseCourseModule/?courseId=" +
          courseId +
          "&moduleId=" +
          moduleId,
        method: "GET",
      })
      .then((response) => {
        if (response.success) {
          return response.data as ICourseModuleItem;
        } else {
          showMessage(false, response.message);
          return {
            moduleId: 0,
            title: "",
            description: "",
            lesson: [],
          } as ICourseModuleItem;
        }
      });
  };
}
