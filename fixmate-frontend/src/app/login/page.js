"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    formState: { isSubmitting, isSubmitted },
  } = form;

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post("/auth/login", values);
      login(data.user, data.token);
      setUserRole(data.user.role);
      router.push(
        data.user.role === "user" ? "/user" : "/worker"
      );
      toast.success("Login Successful");
    } catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push(`/dashboard/${userRole}`); // Redirect to dashboard if already logged in
    }
  }, []);

  return (
    <>
      <Header />
      <div className="mx-auto p-4 h-screen flex flex-col justify-center items-center">
        <Form {...form}>
          <h1 className="text-3xl pb-10 font-bold">Login to Fixmate</h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-md"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitted ? "Submitting..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </>
  );
}
