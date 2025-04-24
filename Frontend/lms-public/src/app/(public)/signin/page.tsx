"use client";

import SignInComponent from "@/components/auth/signIn.Component";
import { use, useEffect, useState } from "react";
import ResetPasswordComponent from "@/components/auth/forgotPwd.Component";
import MainContainer from "@/components/layout/public/mainContainer";
import { AuthHelper } from "@/util/authHelper";
import { useRouter } from "next/navigation";
import { NavigationRoute } from "@/util/navigation";
const Signin = () => {
  const router = useRouter();
  useEffect(() => {
    const isAuthenticate = new AuthHelper().isAuthenticated();
    if (isAuthenticate) {
      router.push(NavigationRoute.DASHBOARD);
    }
  }, []);
  const [isResetPassword, setIsResetPassword] = useState(false);
  return (
    <MainContainer>
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          {isResetPassword == false ? (
            <SignInComponent
              handleResetPassword={() => {
                setIsResetPassword(true);
              }}
            ></SignInComponent>
          ) : (
            <ResetPasswordComponent
              handleSignIn={() => {
                setIsResetPassword(false);
              }}
            ></ResetPasswordComponent>
          )}
        </div>
      </div>
    </MainContainer>
  );
};

export default Signin;
