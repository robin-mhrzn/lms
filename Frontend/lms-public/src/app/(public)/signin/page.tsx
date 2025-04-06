"use client";
import { NavigationRoute } from "@/util/navigation";
import { useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthService } from "@/services/authService/authService";
import { useRouter } from "next/navigation";
import { AuthHelper } from "@/util/authHelper";
import { AuthUserModel } from "@/util/types/authModel";
import MainContainer from "@/components/publicLayout/mainContainer";
const Signin = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const authService = new AuthService();

  const handleSignin = (data: any) => {
    authService.login({
      data: data,
      callback: (res: AuthUserModel) => {
        debugger;
        const authHelper = new AuthHelper();
        authHelper.setUserAuth(res);
        setTimeout(function () {
          router.push(NavigationRoute.HOME);
        }, 2000);
      },
    });
  };

  return (
    <MainContainer>
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit(handleSignin)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 focus:outline-none"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Do not have account?
            <a
              href={NavigationRoute.REGISTER}
              className="text-blue-600 hover:underline"
            >
              Register Here
            </a>
          </p>
        </div>
      </div>
    </MainContainer>
  );
};

export default Signin;
