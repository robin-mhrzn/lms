import { AuthHelper } from "@/util/authHelper";
import { NavigationRoute } from "@/util/navigation";
import { ResponseModel } from "@/util/types/responseModel";

interface Params {
  baseUrl: string;
  headers: any;
  method: string;
}

interface ServiceTS {
  url: string;
  data?: any;
  method?: string;
}
export class APIService {
  private api: string = " https://localhost:7259/api/"; //
  private authToken: string;
  private config: Params;
  constructor() {
    this.authToken = "";
    this.config = {
      baseUrl: this.api,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      method: "post",
    };
  }
  async init() {
    let authHelper = new AuthHelper();
    this.authToken = await authHelper.getUserToken().token;
    this.config = {
      ...this.config,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    };
  }

  updateAuthToken = (token: string): void => {
    this.authToken = token;
    this.config = {
      ...this.config,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    };
  };

  callApi = async ({
    url,
    data,
    method,
  }: ServiceTS): Promise<ResponseModel> => {
    if (!this.authToken) {
      await this.init();
    }

    const options: RequestInit = {
      method: method || "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
      },
    };
    if (["POST", "PUT", "PATCH"].includes(method || "POST")) {
      options.body = JSON.stringify(data);
    }
    const responseData = await (await fetch(this.api + url, options)).json();
    debugger;
    if (
      typeof window !== "undefined" &&
      responseData.message === "Unauthorized"
    ) {
      new AuthHelper().logout();
      location.href = NavigationRoute.LOGIN;
      return new ResponseModel(
        false,
        "You are not authorized to access this resource",
        null
      );
    }
    return responseData;
  };
}
