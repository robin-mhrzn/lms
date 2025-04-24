import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthService } from "@/services/authService/authService";
import { showMessage } from "@/util/sharedHelper";
import Link from "next/link";
import { ResponseModel } from "@/util/types/responseModel";

interface IResetPasswordModel {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

enum ForgotPageType {
  Email,
  OTP,
  Password,
}

interface IForgotPasswordComponentProps {
  handleSignIn: () => void;
}
const ForgotPasswordComponent: React.FC<IForgotPasswordComponentProps> = ({
  handleSignIn,
}) => {
  const authService = new AuthService();
  const [pageType, setPageType] = useState<ForgotPageType>(
    ForgotPageType.Email
  );
  const [resetPasswordModel, setResetPasswordModel] =
    useState<IResetPasswordModel>({
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    });

  // Validation schemas for each step
  const emailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const otpSchema = yup.object().shape({
    otp: yup
      .string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const passwordSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Form setup based on the current step
  const schema =
    pageType === ForgotPageType.Email
      ? emailSchema
      : pageType === ForgotPageType.OTP
      ? otpSchema
      : passwordSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPasswordModel>({
    resolver: yupResolver(schema as any),
  });

  const handleSendOTP = async (data: IResetPasswordModel) => {
    authService.sendResetOTP({
      data: data,
      callback: () => {
        setPageType(ForgotPageType.OTP);
      },
    });
  };

  const handleVerifyOTP = async (data: IResetPasswordModel) => {
    authService.verifyResetPwdOTP({
      data: data,
      callback: () => {
        setPageType(ForgotPageType.Password);
      },
    });
  };

  const handleResetPassword = async (data: IResetPasswordModel) => {
    authService.resetPassword({
      data: data,
      callback: () => {
        showMessage(
          true,
          "Password reset successfully. Redirecting to login..."
        );
        handleSignIn();
      },
    });
  };

  const handleFormSubmit = (data: IResetPasswordModel) => {
    const updatedModel = { ...resetPasswordModel, ...data };
    setResetPasswordModel(updatedModel);
    if (pageType === ForgotPageType.Email) {
      handleSendOTP(updatedModel);
    } else if (pageType === ForgotPageType.OTP) {
      handleVerifyOTP(updatedModel);
    } else {
      handleResetPassword(updatedModel);
    }
  };

  // Render form based on the current step
  const renderForm = () => {
    switch (pageType) {
      case ForgotPageType.Email:
        return (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <h2 className="text-2xl font-semibold text-center">
              Forgot Password?
            </h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Send OTP
            </button>
          </form>
        );

      case ForgotPageType.OTP:
        return (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <h2 className="text-2xl font-semibold text-center">Verify OTP</h2>
            <p className="text-gray-500 text-center mb-4">
              We have sent a 6-digit OTP to your email.
            </p>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("otp")}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Verify OTP
            </button>
          </form>
        );

      case ForgotPageType.Password:
        return (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <h2 className="text-2xl font-semibold text-center">
              Reset Password
            </h2>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Reset Password
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderForm()}
      <div className="text-center mt-4">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPageType(ForgotPageType.Email);
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          Back To Login
        </Link>
      </div>
    </>
  );
};

export default ForgotPasswordComponent;
