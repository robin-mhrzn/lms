import { IPaginationModel } from "../../components/types/paginationTypes";
import { showMessage } from "../../utils/commonUtil";
import { APIService, ResponseModel } from "../apiService";
export interface ICourseLevelModel {
  levelId: number;
  name: string;
}

export interface ICourseLanguageModel {
  languageId: number;
  name: string;
}
export interface ICourseListModel {
  courseId: number;
  name: string;
  price: number;
  language: string;
  level: string;
  categoryName: string;
  parentCategoryName: string;
  isPublished: boolean;
}
export class CourseModel {
  courseId: number;
  title: string;
  description: string;
  parentCategoryId: number;
  categoryId: number;
  levelId: string;
  duration: number;
  languageId: string;
  constructor() {
    this.courseId = 0;
    this.title = "";
    this.description = "";
    this.parentCategoryId = 0;
    this.categoryId = 0;
    this.levelId = "";
    this.duration = 0;
    this.languageId = "";
  }
}
export interface ICourseListRequestModel extends IPaginationModel {}

export class CourseService {
  private readonly apiService: APIService;
  constructor() {
    this.apiService = new APIService();
  }

  getCourseLevel = ({
    callback,
  }: {
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/level",
        method: "GET",
      })
      .then((res?: any) => {
        if (res?.data?.success == true) {
          callback(res?.data as ResponseModel);
        }
      });
  };
  getCourseLanguage = ({
    callback,
  }: {
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/language",
        method: "GET",
      })
      .then((res?: any) => {
        if (res?.data?.success == true) {
          callback(res?.data as ResponseModel);
        }
      });
  };
  list = ({
    data,
    callback,
  }: {
    data: ICourseListRequestModel;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/list",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        callback(res.data as ResponseModel);
      });
  };
  saveCourse = ({
    data,
    callback,
  }: {
    data: CourseModel;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/add",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        if (res?.success == true) {
          showMessage(true, "Record saved successfully");
        }
        callback(res.data as ResponseModel);
      });
  };
}
