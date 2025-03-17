// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { JSX } from "react";
import { PATHS } from "../utils/Navigation";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={PATHS.LANDINGPAGE} replace />
  );
};

export default ProtectedRoute;
