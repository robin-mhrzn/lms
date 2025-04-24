"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthHelper } from "@/util/authHelper";
import { AuthUserModel } from "@/util/types/authModel";
import { NavigationRoute } from "@/util/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  authUser: AuthUserModel | null;
  login: (user: AuthUserModel) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUserModel | null>(null);
  const authHelper = new AuthHelper();

  useEffect(() => {
    const isLoggedIn = authHelper.isAuthenticated();
    setIsAuthenticated(isLoggedIn);
    if (isLoggedIn) {
      setAuthUser(authHelper.getAuthUser());
    }
  }, []);

  const login = (user: AuthUserModel) => {
    setIsAuthenticated(true);
    setAuthUser(user);
  };

  const logout = () => {
    authHelper.logout();
    setIsAuthenticated(false);
    setAuthUser(null);
    location.href = NavigationRoute.LOGIN;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
