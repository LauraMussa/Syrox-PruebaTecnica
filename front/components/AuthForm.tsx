"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Checkbox } from "./ui/checkbox";
import { PasswordInput } from "./ui/password-input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";


type FormData = z.infer<typeof registerSchema> | z.infer<typeof loginSchema>;

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (values: FormData) => Promise<void>;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string>("");
  const router = useRouter();
  const schema = type === "login" ? loginSchema : registerSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      repeatPassword: "",
    },
  });

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    setGlobalError("");
    try {
      await onSubmit(values);
      form.reset();
      router.replace("/");
    } catch (error: any) {
      setGlobalError(error.message || "Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-[500px] py-12 px-8 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            {/* Tu Logo aquí */}
            <Image width={150} height={150} alt="logo" src="/logo.svg" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {type === "login" ? "Inicia Sesión" : "Crear Cuenta"}
          </CardTitle>
          <CardDescription>
            {type === "login" ? "Ingresa a tu cuenta para continuar" : "Regístrate para acceder al panel"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {type === "register" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan Perez"
                          {...field}
                          className="h-12 text-base px-4 bg-gray-50 border-gray-200 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {type === "register" && (
                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repetir Contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="********" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {type === "login" && (
                <FormField
                  control={form.control}
                  name="remember" 
                  render={({ field }) => (
                    <FormItem className="flex justify-center flex-row items-start  space-y-0 rounded-md pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-foreground/80 cursor-pointer">
                          Mantener sesión iniciada
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {globalError !== "" && (
                <span className="flex items-center gap-2 border border-destructive bg-destructive/50 py-1 w-fit px-3 dark:text-destructive-foreground/80 text-foreground/80 text-center m-auto rounded-md">
                  <p>{globalError}</p>
                  <CircleAlert />
                </span>
              )}

              <Button
                className="w-full cursor-pointer h-12 text-base bg-foreground/90 hover:bg-foreground text-background  shadow-md mt-6 rounded-lg"
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {type === "login" ? "Enviar" : "Registrarse"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {type === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <Link
              href={type === "login" ? "/register" : "/login"}
              className="font-medium text-primary hover:underline"
            >
              {type === "login" ? "Regístrate" : "Inicia sesión"}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
