import React from "react";
import { Spin } from "antd"; // Ant Design Spin component
import { LoadingOutlined } from "@ant-design/icons"; // LoadingOutlined icon
import "./loader.css";
const LoaderComponent: React.FC = () => {
  return (
    <div className="loader">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        size="large"
      />
    </div>
  );
};

export default LoaderComponent;
