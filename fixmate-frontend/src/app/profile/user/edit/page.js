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
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";

// Predefined profile pictures
const profilePictures = [
  "/profile-pics/pic1.png",
  "/profile-pics/pic2.png",
  "/profile-pics/pic3.png",
  "/profile-pics/pic4.png",
];

// Form schema
const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  address: z.string().min(5),
  password: z.string().optional(),
  profilePicture: z.string(), // Add profile picture field
});

export default function EditUserProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      profilePicture: "/profile-pics/pic1.png", // Default profile picture
    },
  });

  // Fetch user data and set default values
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/users/me");
        form.reset({
          name: data.name,
          email: data.email,
          address: data.address || "",
          password: "",
          profilePicture: data.profilePicture || "/profile-pics/pic1.png",
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserData();
  }, [form]);

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (!payload.password) delete payload.password;

      const { data } = await api.patch("/users/me", payload);

      toast.success("Profile updated successfully");
      router.push("/profile/user");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 max-w-md">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture Selection */}
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Profile Picture</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-4 gap-2">
                        {profilePictures.map((pic) => (
                          <div
                            key={pic}
                            className={`relative w-16 h-16 cursor-pointer rounded-full overflow-hidden transition-transform transform hover:scale-105 ${
                              field.value === pic
                                ? "ring-2 ring-blue-500"
                                : "ring-1 ring-gray-200"
                            }`}
                            onClick={() => field.onChange(pic)}
                          >
                            <img
                              src={pic}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Address</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">New Password (optional)</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  className="w-full cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}