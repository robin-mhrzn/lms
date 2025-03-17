export interface IUser {
  name: string;
  email: string;
  token: string;
}

export class AuthHelper {
  setUserData = (user: IUser) => {
    localStorage.setItem("user", JSON.stringify(user));
  };
  getUserData = (): IUser | null => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  };
  removeUserData = () => {
    localStorage.removeItem("user");
  };
  isAuthenticated = () => {
    return this.getUserData() !== null;
  };
  getToken = () => {
    const user = this.getUserData();
    if (user) {
      return user.token;
    }
    return null;
  };
}
