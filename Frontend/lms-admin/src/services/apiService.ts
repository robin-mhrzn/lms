import axios from "axios";
import { showMessage } from "../utils/commonUtil";
import { AuthHelper } from "../utils/authHelper";
export interface ResponseModel {
  success: boolean;
  message: string;
  data: any;
}
interface Params {
  baseUrl: any;
  headers: any;
  method: string;
}

interface ServiceTS {
  url: string;
  data?: any;
  method?: string;
}

export class APIService {
  private authToken: string;
  private config: Params;
  private readonly authHelper: AuthHelper;
  constructor() {
    this.authHelper = new AuthHelper();
    this.authToken = this.authHelper.getToken() ?? "";
    this.config = {
      baseUrl: import.meta.env.VITE_REACT_APP_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      method: "post",
    };
  }

  updateAuthToken = (token: string) => {
    this.authToken = token;
    this.config = {
      ...this.config,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    };
  };
  callApi = async ({ url, data, method }: ServiceTS): Promise<any> => {
    return await axios({
      ...this.config,
      method: method ?? "get",
      url: `${this.config.baseUrl}/${url}`,
      data,
    })
      .then((response) => {
        if (response?.data?.success == false) {
          showMessage(false, response?.data?.message);
        }
        return {
          status: response?.status,
          data: response?.data,
        };
      })
      .catch((error) => {
        if (error.response.status == 401) {
          showMessage(
            false,
            "You are logged out from system. Please login again"
          );
          //localStorage.clear();
          //location.href = "/";
        } else {
          showMessage(
            false,
            "Unexpected error occured. Please try again later"
          );
        }
        return {
          status: error?.response?.status,
          data: error?.response?.data,
        };
      });
  };
  exportApiFileService = async ({ url, data }: ServiceTS) => {
    return await axios
      .post(`${this.config.baseUrl}/${url}`, data, {
        headers: {
          ...this.config.headers,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return {
          status: response?.status,
          data: response?.data,
        };
      })
      .catch((error) => {
        return {
          status: error?.response?.status,
          data: error?.response?.data,
        };
      });
  };
}
