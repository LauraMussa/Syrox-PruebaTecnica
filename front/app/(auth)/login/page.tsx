"use client";
import Cookies from "js-cookie";
import { AuthForm } from "@/components/AuthForm";
import { loginService } from "@/services/auth.service";
import { LoginFormType } from "@/types/auth.types";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const handleLogin = async (data: any) => {
    try {
      const response = await loginService(data as LoginFormType);
      dispatch(
        setCredentials({
          user: response.user,
          token: response.access_token,
        })
      );

      if (data.remember) {
        Cookies.set("auth-token", response.access_token, { expires: 7 });
      } else {
        Cookies.set("auth-token", response.access_token);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <>
      <AuthForm type="login" onSubmit={handleLogin} />;
    </>
  );
}
