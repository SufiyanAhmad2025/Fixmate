// app/bookings/new/[workerId]/page.js
"use client";
import { use, useEffect, useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPinIcon, WrenchIcon } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { getLiveLocation } from "@/lib/getLiveLocation";

const formSchema = z.object({
  serviceDate: z.date(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  serviceType: z
    .string()
    .min(2, { message: "Service type must be at least 2 characters long" }),
  description: z.string().optional(),
});

export default function NewBookingPage({ params }) {
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceDate: new Date(),
      address: "",
      serviceType: "",
      description: "",
    },
  });

  const {
    formState: { isSubmitting, errors },
    watch,
  } = form;

  console.log(errors);

  const { workerId } = use(params);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const { data } = await api.get(`/workers/${workerId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setWorker(data[0]);
        console.log(data[0], "data");

        form.setValue("serviceType", data[0].serviceCategory);
        console.log(watch(), "watch");
      } catch (error) {
        toast.error("Failed to load worker details");
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [workerId]);

  const checkWorkerAvailability = async (workerId, serviceDate) => {
    try {
      const response = await api.get(`/workers/${workerId}/availability`, {
        params: { serviceDate },
      });
      return response.data.available;
    } catch (error) {
      console.error("Error checking worker availability:", error);
      return false;
    }
  };

  const onSubmit = async (values) => {
    try {
      // Check worker availability before submitting
    const isAvailable = await checkWorkerAvailability(worker._id, values.serviceDate);
    if (!isAvailable) {
      toast.error("This worker is already booked for the selected date. Please choose another date or time.");
      return;
    }
      await api.post("/bookings", {
        ...values,
        workerId: worker._id,
      });
      toast.success("Booking created successfully!");
      router.push("/profile/user");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error creating booking");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <p className="text-center text-gray-600">Loading worker details...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <p className="text-center text-red-600">
          Failed to load worker details.
        </p>
      </div>
    );
  }

  const handleGetLocation = () => {
    getLiveLocation()
      .then((address) => {
        form.setValue("address", address);
        console.log("Address:", address);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error); // Display error using toast
      });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Book {worker.serviceCategory}
          </h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center gap-4">
              <img
                src={worker.user.profilePicture}
                alt={worker.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">{worker.user.name}</p>
                <p className="text-sm text-gray-600">
                  Hourly Rate: ${worker.hourlyRate}
                </p>
                <p className="text-sm text-gray-600">
                  Rating: {worker.ratings}/5
                </p>
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white shadow-md rounded-lg p-6"
          >
            <FormField
              control={form.control}
              name="serviceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    Service Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    Service Address
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="Enter service address" />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={handleGetLocation}
                      className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Use My Location
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className={"h-40"}
                      {...field}
                      placeholder="Enter description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-4">
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                {`${isSubmitting ? "Submitting..." : "Confirm Booking"}`}
              </Button>
              <Button
                onClick={() => router.back()}
                className="w-full cursor-pointer"
              >
                Go back
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
