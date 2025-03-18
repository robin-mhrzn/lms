import { useSelector } from "react-redux";
import SignInComponent from "../../../components/auth/signIn.Component";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../utils/Navigation";
import { useEffect, useState } from "react";
import ForgotPasswordComponent from "../../../components/auth/forgot.Component";
enum pageType {
  Login,
  ForgotPassword,
}
const SignIn = () => {
  const [page, setPage] = useState<pageType>(pageType.Login);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATHS.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  return page === pageType.Login ? (
    <SignInComponent
      handleForgotPassword={() => {
        setPage(pageType.ForgotPassword);
      }}
    />
  ) : (
    <ForgotPasswordComponent
      handleLogin={() => {
        setPage(pageType.Login);
      }}
    />
  );
};
export default SignIn;
