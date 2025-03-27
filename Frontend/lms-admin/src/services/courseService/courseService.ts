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
  thumbnailImageUrl: string;
  isPublished: boolean;
  courseAdditional: ICourseAdditional[];
  courseAdditionalTypes: ICourseAdditionalType[];
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
    this.thumbnailImageUrl = "";
    this.isPublished = false;
    this.courseAdditional = [];
    this.courseAdditionalTypes = [];
  }
}
export interface ICourseAdditionalType {
  courseAdditionalTypeId: number;
  additionalType: string;
}
export interface ICourseAdditional {
  courseAdditionalTypeId: number;
  courseAdditionalId: number;
  description: string;
  courseId: number;
}
export interface ICourseListRequestModel extends IPaginationModel {}

export interface IModuleListModel {
  moduleId: number;
  name: string;
  description: string;
  lessons: number;
  duration: number;
}
export interface IModuleModel {
  title: string;
  moduleId: number;
  description: string;
  courseId: number;
  lessons: ILessonModule[];
}
export interface ILessonModule {
  description: string;
  duration: number;
  lessonId: number;
  title: string;
  videoUrl: string;
}

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
  getModuleByCourse = ({
    id,
    callback,
  }: {
    id: number;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/Module?courseId=" + id,
        method: "get",
      })
      .then((res: any) => {
        callback(res?.data as ResponseModel);
      });
  };
  saveModule = ({
    data,
    callback,
  }: {
    data: IModuleModel;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/AddModule",
        method: "post",
        data: data,
      })
      .then((res: any) => {
        callback(res?.data as ResponseModel);
      });
  };
  getModuleById = ({
    moduleId,
    callback,
  }: {
    moduleId: number;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/GetByModule/?moduleId=" + moduleId,
        method: "get",
      })
      .then((res: any) => {
        callback(res?.data as ResponseModel);
      });
  };
  deleteModule = ({
    moduleId,
    callback,
  }: {
    moduleId: number;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/deleteModule/?moduleId=" + moduleId,
        method: "Delete",
      })
      .then((res: any) => {
        callback(res?.data as ResponseModel);
      });
  };
  sortModule = ({
    courseId,
    moduleId,
    callback,
  }: {
    courseId: number;
    moduleId: number[];
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/sortModule",
        method: "post",
        data: { courseId: courseId, moduleId: moduleId },
      })
      .then((res: any) => {
        callback(res?.data as ResponseModel);
      });
  };

  sortLesson = ({
    moduleId,
    lessonId,
    callback,
  }: {
    moduleId: number;
    lessonId: number[];
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/sortLesson",
        method: "post",
        data: { moduleId: moduleId, lessonId: lessonId },
      })
      .then((res: any) => {
        callback(res?.data as ResponseModel);
      });
  };
  setCourseThumbnail = ({
    courseId,
    thumbnailUrl,
    callback,
  }: {
    courseId: number;
    thumbnailUrl: string;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/setCourseThumbnail",
        data: { courseId: courseId, thumbnailUrl: thumbnailUrl },
        method: "POST",
      })
      .then((res: any) => {
        callback(res?.data as ResponseModel);
      });
  };
  saveCourseAdditional = ({
    data,
    callback,
  }: {
    data: ICourseAdditional;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/SetCourseAdditional",
        data: data,
        method: "POST",
      })
      .then((res: any) => {
        debugger;
        if (res?.data?.success == true) {
          callback(res?.data as ResponseModel);
        }
      });
  };
  deleteCourseAdditional = ({
    id,
    callback,
  }: {
    id: number;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "course/DeleteCourseAdditional",
        data: { id: id },
        method: "DELETE",
      })
      .then((res: any) => {
        if (res?.data?.success == true) {
          callback(res?.data as ResponseModel);
        }
      });
  };
}
