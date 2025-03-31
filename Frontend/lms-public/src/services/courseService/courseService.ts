import { APIService } from "../apiService";

export class CourseService {
  apiService = new APIService();
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
          return response.data;
        }
      });
  };
}
