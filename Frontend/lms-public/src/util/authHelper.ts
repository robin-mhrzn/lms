import { setCookie, getCookie } from "cookies-next";
import { AuthUserModel } from "./types/authModel";
export class AuthTokenModel {
  settings = {
    sameSite: "strict",
    httpOnly: true,
  };
  constructor() {
    this.name = "";
    this.email = "";
    this.access_token = "";
    this.avatar = "";
  }
  name: string;
  email: string;
  access_token: string;
  avatar: string;
}
export class AuthHelper {
  constructor() {}
  cookieName = "auth";
  options = {
    sameSite: "strict",
    httpOnly: true,
  };
  setUserAuth(model: AuthUserModel) {
    setCookie(this.cookieName, model, {
      sameSite: "strict",
      //httpOnly: true,
    });
  }

  getUserToken() {
    try {
      const userToken = getCookie(this.cookieName, {
        sameSite: "strict",
        //httpOnly: true,
      });
      if (!userToken) {
        return new AuthUserModel();
      }

      try {
        return JSON.parse(userToken) as AuthUserModel;
      } catch (error) {
        return new AuthUserModel();
      }
    } catch {
      return new AuthUserModel();
    }
  }
  removeUserToken() {
    setCookie(this.cookieName, "", {
      sameSite: "strict",
      expires: new Date(0),
    });
  }
}
