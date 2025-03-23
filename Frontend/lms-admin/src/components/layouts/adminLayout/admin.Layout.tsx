import { Avatar, Dropdown, Layout, Menu, MenuProps, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
// import "./styles.css";
import DashboardTitle from "./dashboardTitle.Component";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/reducer/authReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { PATHS } from "../../../utils/Navigation";
const { Header, Content, Footer, Sider } = Layout;
const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const dashboardMenuItems = [
    {
      key: PATHS.DASHBOARD,
      label: (
        <Link to={PATHS.DASHBOARD} className="menu-item">
          <DashboardOutlined /> Dashboard
        </Link>
      ),
    },
    {
      key: PATHS.CATEGORY,
      label: (
        <Link to={PATHS.CATEGORY} className="menu-item">
          <UserOutlined /> Category
        </Link>
      ),
    },
    {
      key: PATHS.COURSELIST,
      label: (
        <Link to={PATHS.COURSELIST} className="menu-item">
          <UserOutlined /> Course
        </Link>
      ),
    },
  ];
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to={PATHS.DASHBOARD} className="menu-item">
          <UserOutlined /> Dashboard
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          to={""}
          onClick={() => {
            logOff();
          }}
          className="menu-item"
        >
          <LogoutOutlined /> Log Out
        </Link>
      ),
    },
  ];
  const logOff = () => {
    dispatch(logout());
  };
  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        className="fixed left-0 top-0 h-screen overflow-auto"
      >
        <div className="flex items-center justify-center h-16 p-4">
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={dashboardMenuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer }}
          className="flex justify-between items-center !p-4"
        >
          <DashboardTitle />
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div className="flex items-center">
              <span className="mr-3">Welcome {userInfo?.name}</span>
              <Avatar
                className="cursor-pointer"
                src={"/avatar.png"}
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </Header>
        <Content className="m-4">
          <div
            className="p-6 min-h-[360px]"
            style={{ background: colorBgContainer }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          className="text-center p-2"
          style={{ background: colorBgContainer }}
        >
          Learning Management System ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
