"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  Edit,
  Mail,
  MapPin,
  User,
  Calendar,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  WorkflowIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function WorkerProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // State for filter

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const [{ data: profileData }] = await Promise.all([
          api.get("/users/me"),
        ]);
        setProfile(profileData);

        const { data: bookingsData } = await api.get("/bookings/worker");
        console.log(bookingsData, "bookingsData");

        setActiveBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to load profile or bookings");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfileAndBookings();
  }, [user]);

  // Filter bookings based on selected status
  const filteredBookings = activeBookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  if (loading) return <ProfileSkeleton />;

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Bookings Section */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Active Bookings</h2>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "accepted" ? "default" : "outline"}
                  onClick={() => setFilter("accepted")}
                >
                  Accepted
                </Button>
                <Button
                  variant={filter === "rejected" ? "default" : "outline"}
                  onClick={() => setFilter("rejected")}
                >
                  Rejected
                </Button>
                <Button
                  variant={filter === "cancelled" ? "default" : "outline"}
                  onClick={() => setFilter("cancelled")}
                >
                  Cancelled
                </Button>
              </div>
            </div>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <Card
                  key={booking._id}
                  className="mb-4 shadow-lg rounded-xl border border-gray-200"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-4">
                      <img
                        src={booking.user.profilePicture}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-800">
                          {booking.user.name}
                        </span>
                        <span className="text-xs flex gap-x-1 text-gray-800">
                          Status:{" "}
                          {booking.status === "pending" ||
                          booking.status === "accepted" ? (
                            <span className="flex gap-x-1 text-yellow-500">
                              {String(booking.status).toUpperCase()}
                              <Clock className="w-4 h-4" />
                            </span>
                          ) : booking.status === "completed" ? (
                            <span className="flex gap-x-1 text-green-500">
                              {String(booking.status).toUpperCase()}
                              <CheckCircle className="w-4 h-4" />
                            </span>
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        Date:
                        <span className="text-gray-700">
                          {new Date(booking.serviceDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                        <WorkflowIcon className="w-5 h-5 text-gray-500" />
                        Service Type:
                        <span className="text-gray-600">
                          {booking.serviceType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        Location:
                        <span className="text-gray-700">{booking.address}</span>
                      </div>
                    </div>
                  </CardContent>
                  {booking.status === "pending" && (
                    <CardFooter>
                      <Link
                        href={`/worker/booking/${booking._id}`}
                        className="w-full"
                      >
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-gray-600">No active bookings found.</p>
            )}
          </div>

          {/* Worker Profile Section */}
          <div className="md:col-span-1">
            <Card className="p-6 shadow-lg rounded-xl border border-gray-200">
              <CardHeader className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24">
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 cursor-pointer">
                    <Link href={"/profile/worker/edit"}>
                      <Edit className="h-4 w-4 text-white" />
                    </Link>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {profile.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{profile.name}</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{profile.email}</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    {profile.address || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <Link href="/profile/worker/edit">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={logout}
                    variant="destructive"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

const ProfileSkeleton = () => (
  <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Skeleton className="h-[250px] w-full rounded-xl" />
      </div>
      <div className="md:col-span-1">
        <Skeleton className="h-[250px] w-full rounded-xl" />
      </div>
    </div>
  </div>
);
