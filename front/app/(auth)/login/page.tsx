
import { AuthForm } from "@/components/AuthForm";
export default function LoginPage() {
  const handleLogin = async (data: any) => {
    "use server"; // O llama a tu API client-side
    console.log("Login data:", data);
    // fetch('/api/auth/login', ...)
  };

  return (
    <>
      <AuthForm type="login" onSubmit={handleLogin} />;
    </>
  );
}
