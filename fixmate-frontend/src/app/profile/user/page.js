"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { toast } from "sonner";
import { ReviewModal } from "@/components/ReviewModal";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("accepted"); // State for filter
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const { data: profileData } = await api.get("/users/me");
        setProfile(profileData);

        const { data: bookingsData } = await api.get("/bookings/user");
        console.log(bookingsData, "data of booking");
        setBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to load profile or bookings");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfileAndBookings();
  }, [user]);

  // Filter bookings based on selected status
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const handleMarkAsCompleted = async (bookingId,workerId) => {
    try {
      // Call the API to update the booking status
      const { data } = await api.put(`/bookings/${bookingId}`, {
        status: "completed",
      });

      // Update the local state to reflect the new status
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: data.status }
            : booking
        )
      );

      setSelectedWorkerId(workerId);
      setShowReviewModal(true);

      toast.success("Booking marked as completed successfully");
    } catch (error) {
      toast.error("Failed to mark booking as completed");
    }
  };

  const handleReviewSubmit = async ({ workerId, rating, comment }) => {
    console.log(workerId,"workerId");
    
    try {
      // Call the API to create a review
      await api.post("/reviews", {
        worker: workerId,
        user: user._id,
        rating,
        comment,
      });

      toast.success("Review submitted successfully");
      // Redirect to the worker's profile
      window.location.href = `/worker/${workerId}`;
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booked Workers Section */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Booked Workers</h2>
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
                    <div className="flex items-center justify-between">
                      <Link href={`/worker/${booking.worker.user._id}`}>
                        <CardTitle className="text-xl font-semibold flex items-center gap-4">
                          <img
                            src={booking.worker.user.profilePicture}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                          />
                          <div className="flex flex-col">
                            <span className="text-gray-800">
                              {booking.worker.user.name}
                            </span>
                            {booking.worker.trustedBadge && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-sm text-green-600">
                                  Verified
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-green-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </CardTitle>
                      </Link>
                      <div
                        className={`flex items-center gap-2 text-sm font-medium uppercase ${
                          booking.status === "pending"
                            ? "text-yellow-600"
                            : booking.status === "completed"
                            ? "text-green-600"
                            : booking.status === "accepted"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {booking.status === "pending" ? (
                          <Clock className="w-4 h-4" />
                        ) : booking.status === "completed" ||
                          booking.status === "accepted" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>{booking.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      <div className="flex items-center gap-4 p-1 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">
                          {booking.serviceType}
                        </span>
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
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">
                          Hourly Rate: ${booking.worker.hourlyRate}
                        </span>
                      </div>
                    </div>
                    {booking.status === "accepted" && (
                      <div className="mt-4">
                        <Button
                          onClick={() => handleMarkAsCompleted(booking._id,booking.worker.user._id)}
                          variant="default"
                          className="w-full flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Completed
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-600">No bookings found.</p>
            )}
          </div>

          {/* User Profile Section */}
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
                    <Link href={"/profile/user/edit"}>
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
                  <Link href="/profile/user/edit">
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
      {showReviewModal && (
        <ReviewModal
          workerId={selectedWorkerId}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
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
