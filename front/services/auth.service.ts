import { LoginFormType, RegisterFormType } from "@/types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API;

export const registerService = async (values: RegisterFormType) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al registrar el usuario");
    }

    const data = await response.json();
    console.log("ESTA ES MI DATA DE REGISTER", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginService = async (values: LoginFormType & { remember?: boolean }) => {
  const { remember, ...loginPayload } = values;
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginPayload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al loguear el usuario");
    }

    const data = await response.json();
    console.log("ESTA ES MI DATA DE LOGIN", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
