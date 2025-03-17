import { login } from "../../redux/reducer/authReducer";
import { showMessage } from "../../utils/commonUtil";
import { APIService, ResponseModel } from "../apiService";

export interface ILoginModel {
  email: string;
  password: string;
  isAdminType: boolean;
}
export interface IChangePasswordModel {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
export class UserService {
  private apiService: APIService;
  constructor() {
    this.apiService = new APIService();
  }
  login = ({
    data,
    finalCallback,
    successCallback,
  }: {
    data: ILoginModel;
    finalCallback?: () => void;
    successCallback: (res?: any) => void;
  }) => {
    return (dispatch?: any) => {
      data.isAdminType = true;
      this.apiService
        .callApi({
          url: "auth/login",
          data: data,
          method: "post",
        })
        .then((res?: any) => {
          if (res.data.success == true) {
            dispatch(login(res.data.data));
            successCallback();
          }
        })
        .finally(() => {
          if (finalCallback) {
            finalCallback();
          }
        });
    };
  };
  changePassword = ({
    data,
    successCallback,
  }: {
    data: IChangePasswordModel;
    successCallback: (res: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "user/changePassword",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        if (res.data.success == true) {
          showMessage(true, "Password changed successfully");
        }
        successCallback(res.data as ResponseModel);
      });
  };
}
