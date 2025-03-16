import { AuthHelper } from "@/util/authHelper";
import { NavigationRoute } from "@/util/navigation";

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
  private api: string = " https://localhost:7279/api/"; //process.env.NEXT_PUBLIC_BASE_URL as string;

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
    this.authToken = await authHelper.getUserToken().access_token;
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
  callApi = async ({ url, data, method }: ServiceTS): Promise<any> => {
    if (!this.authToken) {
      await this.init();
    }
    const options: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
      },
    };
    if (method == undefined) {
      method = "POST";
    }
    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = JSON.stringify(data);
    }
    const responseData = await (await fetch(this.api + url, options)).json();
    if (
      typeof window !== "undefined" &&
      responseData.message === "Unauthorized"
    ) {
      new AuthHelper().removeUserToken();
      location.href = NavigationRoute.LOGIN;
      return null;
    }
    return responseData;
  };
}
