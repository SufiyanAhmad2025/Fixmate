"use client";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { serviceCategories } from "@/lib/data";

// Form schema
const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().optional(),
  address: z.string().min(2),
  serviceCategory: z.string().min(2),
  hourlyRate: z.number().min(0),
  availability: z.boolean(),
  profilePicture: z.string(), // Add profile picture field
});

// Predefined profile pictures
const profilePictures = [
  "/profile-pics/pic1.png",
  "/profile-pics/pic2.png",
  "/profile-pics/pic3.png",
  "/profile-pics/pic4.png",
];

export default function EditWorkerProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      serviceCategory: "",
      hourlyRate: 0,
      availability: false,
      profilePicture: "/profile-pics/pic1.png", // Default profile picture
    },
  });

  // Fetch worker and user data when user is available
  useEffect(() => {
    if (user?._id) {
      const fetchData = async () => {
        try {
          // Fetch worker data
          const { data: workerData } = await api.get(`/workers/${user._id}`);
          // Fetch user data
          const { data: userData } = await api.get(`/users/me`);

          // Set form values
          form.reset({
            name: userData.name,
            email: userData.email,
            password: "",
            address: workerData[0].address,
            serviceCategory: workerData[0].serviceCategory,
            hourlyRate: workerData[0].hourlyRate,
            availability: workerData[0].availability,
            profilePicture: workerData[0].profilePicture || "/profile-pics/pic1.png",
          });
        } catch (error) {
          console.log(error);
          toast.error("Failed to load profile data");
        } finally {
          setIsLoading(false); // Stop loading
        }
      };

      fetchData();
    }
  }, [user, form]);

  const onSubmit = async (values) => {
    try {
      // Update user data
      await api.patch("/users/me", {
        name: values.name,
        email: values.email,
        password: values.password || undefined, // Only send password if provided
      });

      // Update worker data
      await api.put(`/workers/${user._id}`, {
        address: values.address.split(",").map((s) => s.trim()),
        serviceCategory: values.serviceCategory,
        hourlyRate: values.hourlyRate,
        availability: values.availability,
        profilePicture: values.profilePicture,
      });

      toast.success("Profile updated successfully");
      router.push("/worker");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 max-w-md">
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
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

              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service Category Field */}
              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Service Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-50">
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

              {/* Hourly Rate Field */}
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  className="w-full"
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