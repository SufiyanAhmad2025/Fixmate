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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        // Fetch worker profile
        
        // Fetch worker-specific bookings
        const { data: bookingsData } = await api.get("/bookings/worker");
        console.log(bookingsData,"bookingsData");
        
        setAvailability(bookingsData[0].worker.availability);
        setBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to load worker data");
      }
    };
    if (user?.role === "worker") fetchWorkerData();
  }, [user]);

  const handleAvailabilityChange = async () => {
    try {
      console.log("Updating availability for worker:", user._id);
      console.log("New availability:", !availability);

      const response = await api.put(`/workers/${user._id}`, {
        availability: !availability,
      });
      console.log("API response:", response.data);

      setAvailability(!availability);
      toast("Availability updated");
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        message: error.response?.data?.message || "Error updating availability",
      });
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
      toast("Status updated successfully");
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Error updating status",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Worker Dashboard</h1>
        <div className="flex items-center gap-2">
          <span>Available Now:</span>
          <Switch
            checked={availability}
            onCheckedChange={handleAvailabilityChange}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Service Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell className="flex gap-x-4">
                <Button
                  disabled={
                    booking.status === "completed" ||
                    booking.status === "cancelled"
                  }
                  variant="outline"
                  onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                >
                  Cancelled
                </Button>
                <Button
                  disabled={
                    booking.status === "completed" ||
                    booking.status === "cancelled"
                  }
                  variant="outline"
                  onClick={() => handleUpdateStatus(booking._id, "completed")}
                >
                  Mark Complete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
