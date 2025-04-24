import { AuthService } from "@/services/authService/authService";
import { AuthHelper } from "@/util/authHelper";
import { NavigationRoute } from "@/util/navigation";
import { AuthUserModel } from "@/util/types/authModel";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import * as yup from "yup";
interface ISignInProps {
  handleResetPassword: () => void;
}
const SignInComponent: React.FC<ISignInProps> = ({ handleResetPassword }) => {
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
  const authHelper = new AuthHelper();
  const handleSignin = (data: any) => {
    authService.login({
      data: data,
      callback: (res: AuthUserModel) => {
        authHelper.setUserAuth(res);
        setTimeout(function () {
          location.href = NavigationRoute.HOME;
        }, 2000);
      },
    });
  };

  return (
    <>
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
        Forgot Password?
        <Link
          href={""}
          onClick={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
          className="text-blue-600 hover:underline"
        >
          Click Here
        </Link>
      </p>
      <p className="text-center text-gray-600 mt-4">
        Do not have account?
        <Link
          href={NavigationRoute.REGISTER}
          className="text-blue-600 hover:underline"
        >
          Register Here
        </Link>
      </p>
    </>
  );
};
export default SignInComponent;
