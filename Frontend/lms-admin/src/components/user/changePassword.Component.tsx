import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  IChangePasswordModel,
  UserService,
} from "../../services/userService/userService";
import { ResponseModel } from "../../services/apiService";

const ChangePasswordComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userService = new UserService();
  const onFinish = (values: IChangePasswordModel) => {
    setLoading(true);
    userService.changePassword({
      data: values,
      successCallback: (res: ResponseModel) => {
        setLoading(false);
        form.resetFields();
      },
    });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Change Password
        </h2>
        <Form
          form={form}
          name="change-password"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Current Password"
              className="input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              className="input"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm New Password"
              className="input"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordComponent;
