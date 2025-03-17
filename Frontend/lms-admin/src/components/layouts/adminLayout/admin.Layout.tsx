import { Avatar, Dropdown, Layout, Menu, MenuProps, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
// import "./styles.css";
import DashboardTitle from "./dashboardTitle.Component";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/reducer/authReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const { Header, Content, Footer, Sider } = Layout;
const AdminLayout = () => {
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
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to="/admin" className="menu-item">
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
        className="h-screen"
      >
        <div className="flex items-center justify-center h-16 p-4">
          <img src="logo.svg" alt="Logo" className="h-10 w-auto" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
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
