"use client";
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
        })
      );


    } catch (error) {
      console.log(error);
      throw error; 
    }
  };

  return (
    <>
      <AuthForm type="login" onSubmit={handleLogin} />
    </>
  );
}
