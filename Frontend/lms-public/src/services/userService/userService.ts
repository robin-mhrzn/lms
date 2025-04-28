import { showMessage } from "@/util/sharedHelper";
import { APIService } from "../apiService";

export class UserService {
  apiService = new APIService();
  changePassword = async (
    oldPassword: string,
    password: string
  ): Promise<boolean> => {
    const response = await this.apiService.callApi({
      url: "user/ChangePassword",
      method: "POST",
      data: { oldPassword, password },
    });
    if (response.success) {
      showMessage(response.success, response.message);
      return true;
    } else {
      showMessage(response.success, response.message);
      return false;
    }
  };
}
