export interface RegisterFormType {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface LoginFormType {
  email: string;
  password: string;
}

export interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (values: FormData) => Promise<void>;
}