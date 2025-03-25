import "./App.css";
import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import { lazy, Suspense } from "react";
import LoaderComponent from "./components/extras/loader.Component";
import Category from "./pages/category/category";
import CourseDetail from "./pages/course/courseDetail";
import CourseList from "./pages/course/courseList";
import { PATHS } from "./utils/Navigation";

const SignIn = lazy(() => import("./pages/auth/signIn/signIn"));
const Unauthorized = lazy(() => import("./pages/extra/UnAuthorized"));
const NotFound = lazy(() => import("./pages/extra/NotFound"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const ProtectedRoute = lazy(() => import("./components/protected.Component"));
const ChangePassword = lazy(() => import("./pages/user/changePassword"));
const PublicLayout = lazy(
  () => import("./components/layouts/publicLayout/public.Layout")
);
const AdminLayout = lazy(
  () => import("./components/layouts/adminLayout/admin.Layout")
);

function App() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<SignIn />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="category" element={<Category />} />
          <Route path="category/:parentId/:parentName" element={<Category />} />
          <Route path="course/list" element={<CourseList />} />
          <Route
            path={PATHS.COURSEDETAIL + "/:courseId"}
            element={<CourseDetail />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
