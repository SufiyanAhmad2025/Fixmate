"use client";
import { useState } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Header } from "@/components/Header";
import { serviceCategories } from "@/lib/data";

const profilePictures = [
  "/profile-pics/pic1.png",
  "/profile-pics/pic2.png",
  "/profile-pics/pic3.png",
  "/profile-pics/pic4.png",
];

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "worker"]),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  profilePicture: z.string(), // Store the selected profile picture path
  workerDetails: z
    .object({
      address: z.string().optional(), // Replaced skills with address
      serviceCategory: z.enum(serviceCategories).optional().default("Plumber"),
      hourlyRate: z.number().optional(),
    })
    .optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();

  const isWorker = params.get("role") === "worker";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: isWorker ? "worker" : "user",
      address: "",
      phoneNumber: "",
      profilePicture: "/profile-pics/pic1.png", // Default profile picture
      workerDetails: isWorker
        ? {
            address: "", // Initialize workerDetails.address only for workers
            hourlyRate: 0, // Initialize workerDetails.hourlyRate only for workers
            serviceCategory: "Plumber", // Initialize workerDetails.serviceCategory only for workers
          }
        : undefined,
    },
  });

  const {
    formState: { isSubmitting, errors },
  } = form;

  const role = form.watch("role");
  console.log(errors, "errors in register");

  const onSubmit = async (values) => {
    try {
      await api.post("/auth/register", values);
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating account");
    }
  };

  return (
    <>
      <Header />
      <div className="mx-auto p-4 h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl pb-10 font-bold">Register to Fixmate</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full max-w-md"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Register as</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Customer</SelectItem>
                      <SelectItem value="worker">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {profilePictures.map((pic) => (
                        <img
                          key={pic}
                          src={pic}
                          alt="Profile"
                          className={`w-12 h-12 cursor-pointer rounded-full ${
                            field.value === pic
                              ? "border-2 border-blue-500"
                              : ""
                          }`}
                          onClick={() => field.onChange(pic)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      placeholder="Enter your WhatsApp number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {role === "worker" && (
              <>
                <FormField
                  control={form.control}
                  name="workerDetails.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workerDetails.serviceCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workerDetails.hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || 0}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </>
  );
}
