import { useSelector } from "react-redux";
import SignInComponent from "../../../components/auth/signIn.Component";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../utils/Navigation";
import { useEffect } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATHS.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  return <SignInComponent></SignInComponent>;
};
export default SignIn;
