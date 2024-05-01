import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { loadingState } from "@/reducers/authReducer";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { login, register } from "@/actions/authActions";
import { useLocation } from "react-router-dom";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerFormSchema = z.object({
  name: z.string().min(4).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const AuthForm: React.FC<AuthFormProps> = ({ className, ...props }) => {
  const dispacth = useAppDispatch();
  const isLoading = useAppSelector(loadingState);
  const [authAction, setAuthAction] = useState<string>("");

  const { pathname } = useLocation();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
  });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    // Extract the action from the pathname
    if (pathname === "/sign-in") {
      setAuthAction("login");
      // Reset the register form state
      registerForm.reset();
    } else if (pathname === "/sign-up") {
      setAuthAction("register");
      loginForm.reset();
    }
  }, [pathname, loginForm, registerForm]);

  const handleLogin = (input: z.infer<typeof loginFormSchema>) => {
    dispacth(login(input)).then((value) => {
      if (value.meta.requestStatus === "fulfilled") {
        toast.success(`Login Success!`);
      } else if (value.meta.requestStatus === "rejected") {
        toast.error(`Invalid password or credentials!`);
      }
    });
  };

  const handleRegister = (input: z.infer<typeof registerFormSchema>) => {
    dispacth(register(input)).then((value) => {
      if (value.meta.requestStatus === "fulfilled") {
        toast.success(`Register Success!`);
      } else if (value.meta.requestStatus === "rejected") {
        toast.error(`Invalid credentials!`);
      }
    });
  };

  return (
    <div
      className={cn("flex flex-col justify-center gap-2", className)}
      {...props}
    >
      {authAction === "login" && (
        <div>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} autoComplete="email" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "" : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      )}
      {authAction === "register" && (
        <div>
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} autoComplete="name" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} autoComplete="email" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "" : "Register"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      <Separator textCenter className="my-6" />

      <Button
        disabled={isLoading}
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-full"
        onClick={() => {}}
      >
        {isLoading ? null : <Icons.google className="size-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default AuthForm;
