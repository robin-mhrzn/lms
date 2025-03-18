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

export interface IResetPasswordModel {
  email: string;
  otp: string;
  password: string;
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
  sendResetOTP = ({
    data,
    callback,
  }: {
    data: IResetPasswordModel;
    callback: (res: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "auth/GenerateResetCode",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        callback(res.data as ResponseModel);
      });
  };
  verifyResetPwdOTP = ({
    data,
    callback,
  }: {
    data: IResetPasswordModel;
    callback: (res: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "auth/ValidResetCode",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        callback(res.data as ResponseModel);
      });
  };
  resetPassword = ({
    data,
    callback,
  }: {
    data: IResetPasswordModel;
    callback: (res: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "auth/ResetPassword",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        let responseData = res.data as ResponseModel;
        if (responseData.success) {
          showMessage(
            true,
            "Password reset successfully. You will be redirect to login page"
          );
        }
        callback(responseData);
      });
  };
}
