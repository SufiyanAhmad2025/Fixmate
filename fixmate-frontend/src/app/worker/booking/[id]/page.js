"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeftCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        console.log(data, "data");
        setBooking(data);
      } catch (error) {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleAccept = async () => {
    try {
      await api.put(`/bookings/${id}`, {
        status: "accepted",
      });
      toast.success("Booking accepted");
      router.push(`/worker/`);
    } catch (error) {
      toast.error("Failed to accept booking");
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/bookings/${id}`, {
        status: "rejected",
      });
      toast.success("Booking rejected");
      router.push("/worker");
    } catch (error) {
      toast.error("Failed to reject booking");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4">
          <p className="text-center text-gray-600">
            Loading booking details...
          </p>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4">
          <p className="text-center text-red-600">Booking not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex w-full gap-x-4 container mx-auto p-4">
        <ArrowLeftCircle
          className="mt-4 h-8 w-8 cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => router.back()}
        />
        <Card className="shadow-lg rounded-xl border border-gray-200 w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            {/* User Details */}
            <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
              <img
                src={booking.user.profilePicture}
                alt={booking.user.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {booking.user.name}
                </h2>
                <p className="text-sm text-gray-600">{booking.user.email}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{booking.serviceType}</span>
              </div>
              <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  {new Date(booking.serviceDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{booking.address}</span>
              </div>
              <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      booking.status === "pending"
                        ? "text-yellow-600"
                        : booking.status === "accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-end">
            <Button
              onClick={handleAccept}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Accept
            </Button>
            <Button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
