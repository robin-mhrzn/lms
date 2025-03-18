import { useState } from "react";
import { Form, Input, Button } from "antd";
import {
  IResetPasswordModel,
  UserService,
} from "../../services/userService/userService";
import { ResponseModel } from "../../services/apiService";
import { showMessage } from "../../utils/commonUtil";

interface IForgotPasswordProps {
  handleLogin: () => void;
}

enum ForgotPageType {
  Email,
  OTP,
  Password,
}

const ForgotPasswordComponent: React.FC<IForgotPasswordProps> = ({
  handleLogin,
}) => {
  const userService: UserService = new UserService();
  const [pageType, setPageType] = useState<ForgotPageType>(
    ForgotPageType.Email
  );
  const [resetPasswordModel, setResetPasswordModel] =
    useState<IResetPasswordModel>({
      email: "",
      otp: "",
      password: "",
    });
  const handleSendOTP = (model: IResetPasswordModel) => {
    userService.sendResetOTP({
      data: model,
      callback: (res: ResponseModel) => {
        if (res.success) {
          setPageType(ForgotPageType.OTP);
          showMessage(
            true,
            "OTP has been sent to your email. Please check your email"
          );
        }
      },
    });
  };
  const handleFormSubmit = async (values: Partial<IResetPasswordModel>) => {
    const updatedModel = { ...resetPasswordModel, ...values };
    setResetPasswordModel(updatedModel);

    if (pageType === ForgotPageType.Email) {
      handleSendOTP(updatedModel);
    } else if (pageType === ForgotPageType.OTP) {
      userService.verifyResetPwdOTP({
        data: updatedModel,
        callback: (res: ResponseModel) => {
          if (res.success) {
            setPageType(ForgotPageType.Password);
          }
        },
      });
    } else {
      userService.resetPassword({
        data: updatedModel,
        callback: (res: ResponseModel) => {
          if (res.success) {
            setPageType(ForgotPageType.Password);
            setTimeout(() => {
              handleLogin();
            }, 2000);
          }
        },
      });
    }
  };

  const renderForm = () => {
    switch (pageType) {
      case ForgotPageType.Email:
        return (
          <Form layout="vertical" onFinish={handleFormSubmit}>
            <h2 className="text-2xl font-semibold text-center">
              Forgot Password?
            </h2>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        );

      case ForgotPageType.OTP:
        return (
          <Form layout="vertical" onFinish={handleFormSubmit}>
            <h2 className="text-2xl font-semibold text-center">Verify OTP</h2>
            <p className="text-gray-500 text-center mb-4">
              We have sent a 6-digit OTP to your email.
            </p>
            <Form.Item
              label="Enter 6-digit OTP"
              name="otp"
              rules={[
                { required: true, message: "Please enter the OTP!" },
                { len: 6, message: "OTP must be 6 digits!" },
              ]}
            >
              <Input placeholder="Enter OTP" maxLength={6} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Verify OTP
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  handleSendOTP(resetPasswordModel);
                }}
                htmlType="button"
                block
              >
                Regenerate OTP
              </Button>
            </Form.Item>
          </Form>
        );

      case ForgotPageType.Password:
        return (
          <Form layout="vertical" onFinish={handleFormSubmit}>
            <h2 className="text-2xl font-semibold text-center">
              Reset Password
            </h2>
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return value && getFieldValue("password") === value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="">
      {renderForm()}
      <div className="text-center mt-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          Back To Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
