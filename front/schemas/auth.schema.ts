import * as z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Ingresa tu contraseña" }),
  remember: z.boolean().optional(),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, { message: "El nombre es obligatorio" }),

    email: z.email({ message: "Email inválido" }),
    password: z.string().regex(passwordRegex, {
      message: "Debe tener 8 caracteres, mayúscula, minúscula, número y símbolo.",
    }),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  });
