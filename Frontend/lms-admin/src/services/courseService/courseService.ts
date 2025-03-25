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
  basePrice: number;
  price: number;
  tags: string[];
  constructor() {
    this.courseId = 0;
    this.title = "";
    this.description = "";
    this.parentCategoryId = 0;
    this.categoryId = 0;
    this.levelId = "";
    this.duration = 0;
    this.languageId = "";
    this.basePrice = 0;
    this.price = 0;
    this.tags = [];
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
  getById = ({
    id,
    callback,
  }: {
    id: number;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/get/?id=" + id,
        method: "get",
      })
      .then((res?: any) => {
        callback(res.data as ResponseModel);
      });
  };
  publishCourse = ({
    courseId,
    isPublished,
    callback,
  }: {
    courseId: number;
    isPublished: boolean;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        data: { courseId: courseId, isPublish: isPublished },
        url: "course/publish",
        method: "post",
      })
      .then((res: any) => {
        callback(res.data as ResponseModel);
      });
  };

  setCoursePricing = ({
    courseId,
    basePrice,
    price,
    callback,
  }: {
    courseId: number;
    basePrice: number;
    price: number;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        data: { courseId: courseId, basePrice: basePrice, price: price },
        url: "course/SetPricing",
        method: "post",
      })
      .then((res: any) => {
        callback(res.data as ResponseModel);
      });
  };
  getTags = ({
    keyword,
    callback,
  }: {
    keyword: string;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/tags/?keyword=" + keyword,
        method: "get",
      })
      .then((res: any) => {
        callback(res.data as ResponseModel);
      });
  };
  setCourseTags = ({
    courseId,
    tags,
    callback,
  }: {
    courseId: number;
    tags: string[];
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        data: { courseId: courseId, tags: tags },
        url: "course/SetTags",
        method: "post",
      })
      .then((res: any) => {
        callback(res.data as ResponseModel);
      });
  };
}
