import { APIService } from "../apiService";

export class OrderService {
  apiService = new APIService();
  addOrder = async (
    courseId: number,
    price: number,
    token: string
  ): Promise<any> => {
    return await this.apiService
      .callApi({
        url: "order/Add",
        method: "POST",
        data: {
          courseId,
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
}
