import { login } from "../../redux/reducer/authReducer";
import { APIService } from "../apiService";

export interface ILoginModel {
  email: string;
  password: string;
  isAdminType: boolean;
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
}
