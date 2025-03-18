import { Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  ILoginModel,
  UserService,
} from "../../services/userService/userService";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/Navigation";
import React from "react";
interface SignInProps {
  handleForgotPassword: any;
}
const SignInComponent: React.FC<SignInProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const userService = new UserService();
  const navigate = useNavigate();
  const handleSubmit = (values: ILoginModel) => {
    dispatch(
      userService.login({
        data: values,
        successCallback: () => {
          navigate(PATHS.DASHBOARD);
        },
      })
    );
  };
  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <h2 className="text-2xl font-semibold text-center">Sign In</h2>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter your email!" }]}
      >
        <Input type="email" placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
      <Form.Item className="text-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault(); // Prevent the default anchor link behavior
            props.handleForgotPassword(); // Call the handleForgotPassword function
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          Forgot Password?
        </a>
      </Form.Item>
    </Form>
  );
};
export default SignInComponent;
