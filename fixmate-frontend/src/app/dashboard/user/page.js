"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import RatingDialog from "@/components/RatingDialog";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get("/bookings/user");
        setBookings(data);
      } catch (error) {
        toast("Failed to load bookings");
      }
    };
    if (user) fetchBookings();
  }, [user]);

  console.log(bookings,"bookings in user dashboard");
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/booking/new")}
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          Book a Service
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Worker</TableHead>
            <TableHead>Service Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>{booking.user.name}</TableCell>
              <TableCell>
                {new Date(booking.serviceDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>
                {booking.status === "completed" && (
                  <RatingDialog booking={booking} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
