'use client'
import { AuthForm } from "@/components/AuthForm";
import { registerService } from "@/services/auth.service";
import { RegisterFormType } from "@/types/auth.types";

export default function RegisterPage() {
  const handleRegister = async (data: any) => {
    try {
      await registerService(data as RegisterFormType);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <>
      <AuthForm type="register" onSubmit={handleRegister} />;
    </>
  );
}
