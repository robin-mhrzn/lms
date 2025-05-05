"use client";

import SignInComponent from "@/components/auth/signIn.Component";
import { useEffect, useState } from "react";
import ResetPasswordComponent from "@/components/auth/forgotPwd.Component";
import MainContainer from "@/components/layout/public/mainContainer";
import { AuthHelper } from "@/util/authHelper";
import { useRouter, useSearchParams } from "next/navigation";
import { NavigationRoute } from "@/util/navigation";

const Signin = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters
  const redirectUrl = searchParams.get("redirect"); // Extract the redirect URL

  useEffect(() => {
    const isAuthenticate = new AuthHelper().isAuthenticated();
    if (isAuthenticate) {
      router.push(redirectUrl || NavigationRoute.DASHBOARD);
    }
  }, [redirectUrl, router]);

  const [isResetPassword, setIsResetPassword] = useState(false);

  const handleLoginSuccess = () => {
    const url = redirectUrl || NavigationRoute.DASHBOARD;
    location.href = url;
  };

  return (
    <MainContainer>
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          {isResetPassword == false ? (
            <SignInComponent
              handleResetPassword={() => {
                setIsResetPassword(true);
              }}
              onLoginSuccess={handleLoginSuccess}
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
