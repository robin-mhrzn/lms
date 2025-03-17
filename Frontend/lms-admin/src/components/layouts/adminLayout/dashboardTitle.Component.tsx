import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {
  NavigationRoutes,
  PATHS,
  RouteMapping,
} from "../../../utils/Navigation";

const DashboardTitle: React.FC = () => {
  const location = useLocation();

  // Get current route details or fallback to default
  const currentRoute: RouteMapping =
    NavigationRoutes[location.pathname] || NavigationRoutes[PATHS.DASHBOARD];
  const breadcrumbItems = currentRoute.breadcrumb.map((item, index) => ({
    key: index,
    title: item.label,
    href: item.path,
  }));
  return (
    <div className="flex items-center justify-between ">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {currentRoute.title}
        </h2>
        <Breadcrumb
          className="mt-1 text-gray-500"
          items={breadcrumbItems.map((item, index) => ({
            key: index,
            title: item.href ? (
              <Link to={item.href} className="hover:text-blue-500">
                {index === 0 && <HomeOutlined />}
                <span> {item.title}</span>
              </Link>
            ) : (
              <>
                {index === 0 && <HomeOutlined className="mr-1" />}
                {item.title}
              </>
            ),
          }))}
        />
      </div>
    </div>
  );
};

export default DashboardTitle;
