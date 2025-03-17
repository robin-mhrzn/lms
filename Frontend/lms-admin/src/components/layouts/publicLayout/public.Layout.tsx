import { Outlet } from "react-router-dom";
import { Card } from "antd";
import { Layout } from "antd";
import logo from "/public/logo.svg";

const PublicLayout = () => {
  const { Footer } = Layout;
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="flex justify-center items-center flex-grow">
          <Card className="w-full max-w-sm p-8 rounded-lg shadow-lg text-center">
            <div className="flex justify-center items-center mb-6">
              <img src={logo} alt="Logo" className="w-24" />
            </div>
            <Outlet />
          </Card>
        </div>
        <Footer className="bg-gray-900 text-white text-center py-4 mt-auto">
          <p>
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </Footer>
      </div>
    </>
  );
};

export default PublicLayout;
