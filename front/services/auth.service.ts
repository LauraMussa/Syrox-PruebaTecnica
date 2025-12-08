import { RegisterFormType } from "@/types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API;

export const registerService = async (values: RegisterFormType) => {
  try {
    console.log(process.env.NEXT_PUBLIC_API);
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
