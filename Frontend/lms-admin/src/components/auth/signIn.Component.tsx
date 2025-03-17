import { Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  ILoginModel,
  UserService,
} from "../../services/userService/userService";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/Navigation";

const SignInComponent = () => {
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
    </Form>
  );
};
export default SignInComponent;
