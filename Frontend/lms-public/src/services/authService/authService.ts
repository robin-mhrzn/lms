import { showMessage } from "@/util/sharedHelper";
import { APIService } from "../apiService";
import { LoginModel, SignupModel } from "./authModel";

export interface IResetPasswordModel {
  email: string;
  otp: string;
  password: string;
}
export class AuthService {
  apiService = new APIService();
  sendEmailVerification = async ({
    email,
    callback,
  }: {
    email: string;
    callback: () => void;
  }) => {
    const response = await this.apiService.callApi({
      url: "Auth/generateOTP",
      method: "POST",
      data: { email: email },
    });
    if (response.success) {
      callback();
    } else {
      showMessage(false, response.message);
    }
  };
  verifyRegisterEmailCode = async ({
    email,
    code,
    callback,
  }: {
    email: string;
    code: string;
    callback: () => void;
  }) => {
    const response = await this.apiService.callApi({
      url: "Auth/validateOTP",
      method: "POST",
      data: { email: email, otp: code },
    });
    if (response.success) {
      callback();
    } else {
      showMessage(false, response.message);
    }
  };
  register = async ({
    data,
    callback,
  }: {
    data: SignupModel;
    callback: () => void;
  }) => {
    const response = await this.apiService.callApi({
      url: "auth/signup/",
      method: "POST",
      data: data,
    });
    showMessage(response.success, response.message);
    if (response.success) {
      callback();
    }
  };

  login = async ({
    data,
    callback,
  }: {
    data: LoginModel;
    callback: (res: any) => void;
  }) => {
    const response = await this.apiService.callApi({
      url: "auth/login/",
      method: "POST",
      data: data,
    });
    if (response.success) {
      callback(response.data);
    } else {
      showMessage(response.success, response.message);
    }
  };

  sendResetOTP = async ({
    data,
    callback,
  }: {
    data: IResetPasswordModel;
    callback: () => void;
  }) => {
    const response = await this.apiService.callApi({
      url: "auth/GenerateResetCode",
      method: "POST",
      data: { email: data.email },
    });
    if (response.success) {
      callback();
    } else {
      showMessage(response.success, response.message);
    }
  };

  verifyResetPwdOTP = async ({
    data,
    callback,
  }: {
    data: IResetPasswordModel;
    callback: () => void;
  }) => {
    const response = await this.apiService.callApi({
      url: "auth/ValidResetCode",
      method: "POST",
      data: { email: data.email, otp: data.otp },
    });
    if (response.success) {
      callback();
    } else {
      showMessage(response.success, response.message);
    }
  };
  resetPassword = async ({
    data,
    callback,
  }: {
    data: IResetPasswordModel;
    callback: () => void;
  }) => {
    const response = await this.apiService.callApi({
      url: "auth/ResetPassword",
      method: "POST",
      data: data,
    });
    if (response.success) {
      showMessage(response.success, response.message);
      callback();
    } else {
      showMessage(response.success, response.message);
    }
  };
}
