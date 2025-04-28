"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserService } from "@/services/userService/userService";
import { showMessage } from "@/util/sharedHelper";
import { useState } from "react";

const ChangePasswordComponent = () => {
  const userService = new UserService();
  const [loader, setLoader] = useState(false);
  const schema = yup.object().shape({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChangePassword = async (data: any) => {
    try {
      setLoader(true);
      const response = await userService.changePassword(
        data.currentPassword,
        data.newPassword
      );
      if (response) {
        reset();
      }
    } catch (error) {
      showMessage(false, "Unexpected error occurred. Please try again later.");
    } finally {
      setLoader(false);
    }
  };
  return (
    <Card className="max-w-md mx-auto">
      <CardContent>
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword">New Password</label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loader}>
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default ChangePasswordComponent;
