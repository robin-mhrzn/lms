"use client";
import { NavigationRoute } from "@/util/navigation";
import { useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthService } from "@/services/authService/authService";
import { useRouter } from "next/navigation";
import { FiRefreshCcw } from "react-icons/fi";
const Signup = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),

    otp:
      step === 2
        ? yup.string().required("OTP is required")
        : yup.string().notRequired(),

    name:
      step === 3
        ? yup.string().required("Username is required")
        : yup.string().notRequired(),

    password:
      step === 3
        ? yup
            .string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required")
        : yup.string().notRequired(),
    confirmPassword:
      step === 3
        ? yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required")
        : yup.string().notRequired(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { step },
  });

  const authService = new AuthService();

  const handleSendOtp = (data: any) => {
    authService.sendEmailVerification({
      email: data.email,
      callback: () => {
        setEmail(data.email);
        setStep(2);
      },
    });
  };

  const handleVerifyOtp = (data: any) => {
    authService.verifyRegisterEmailCode({
      email: data.email,
      code: data.otp,
      callback: () => {
        setStep(3);
      },
    });
  };

  const handleSignup = (data: any) => {
    authService.register({
      data: data,
      callback: () => {
        setTimeout(function () {
          router.push(NavigationRoute.LOGIN);
        }, 2000);
      },
    });
  };
  const handleResendOtp = () => {
    handleSendOtp({ email: email });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        {step === 1 && (
          <form onSubmit={handleSubmit(handleSendOtp)}>
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 focus:outline-none"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(handleVerifyOtp)} className="">
            <p className="text-gray-600 text-center mb-6">
              We've sent a 6-digit OTP to your email. Enter it below to proceed.
            </p>

            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  placeholder="6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center tracking-widest text-lg"
                  {...register("otp")}
                />
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition-all duration-200 focus:outline-none flex items-center justify-center"
            >
              Verify OTP
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              className="w-full bg-gray-100 text-blue-600 py-3 rounded-lg mt-3 hover:bg-gray-200 transition-all duration-200 focus:outline-none flex items-center justify-center"
            >
              <FiRefreshCcw className="mr-2 text-xl"></FiRefreshCcw> Resend OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit(handleSignup)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="Name"
                  placeholder="Name"
                  className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
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
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Phone No.
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  id="phoneNo"
                  placeholder="Phone No."
                  className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 focus:outline-none"
            >
              Sign Up
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-4">
          Already have an account?
          <a
            href={NavigationRoute.LOGIN}
            className="text-blue-600 hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
