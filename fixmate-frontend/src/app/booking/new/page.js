"use client"

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [userBookings, setUserBookings] = useState([]); // Track user's bookings
  const [filters, setFilters] = useState({
    location: "",
    serviceCategory: "",
    minRating: 0,
    availability: true,
    priceRange: [0, 1000],
  });

  // Fetch workers based on filters
  const fetchWorkers = async () => {
    try {
      const { data } = await api.get("/workers", {
        params: {
          ...filters,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
        },
      });
      setWorkers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load workers");
    }
  };

  // Fetch user's bookings
  const fetchUserBookings = async () => {
    try {
      const { data } = await api.get("/bookings/user");
      setUserBookings(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    }
  };

  // Fetch workers and user's bookings on component mount and filter change
  useEffect(() => {
    fetchWorkers();
    fetchUserBookings();
  }, [filters]);

  // Check if the user has already booked a worker
  const hasUserBookedWorker = (workerId) => {
    return userBookings.some(
      (booking) => booking.worker._id === workerId && booking.status !== "cancelled"
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Workers</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <Select
          value={filters.serviceCategory}
          onValueChange={(val) => setFilters({ ...filters, serviceCategory: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Service Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Plumber">Plumber</SelectItem>
            <SelectItem value="Electrician">Electrician</SelectItem>
            <SelectItem value="Carpenter">Carpenter</SelectItem>
            <SelectItem value="AC Mechanic">AC Mechanic</SelectItem>
            <SelectItem value="Painter">Painter</SelectItem>
            <SelectItem value="Cleaner">Cleaner</SelectItem>
            <SelectItem value="Appliance Repair">Appliance Repair</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.minRating}
          onValueChange={(val) => setFilters({ ...filters, minRating: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Minimum Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(val) => setFilters({ ...filters, priceRange: val })}
            min={0}
            max={1000}
            step={10}
          />
        </div>
      </div>

      {/* Workers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <Card key={worker._id}>
            <CardHeader>
              <CardTitle>{worker.user.name}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{worker.serviceCategory}</span>
                {worker.trustedBadge && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-medium">{worker.ratings}/5</span>
                </p>
                <p className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span className="font-medium">${worker.hourlyRate}</span>
                </p>
                <p className="flex justify-between">
                  <span>Availability:</span>
                  <span className={`font-medium ${worker.availability ? "text-green-600" : "text-red-600"}`}>
                    {worker.availability ? "Available Now" : "Not Available"}
                  </span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/booking/new/${worker.user._id}`} className="w-full">
                <Button
                  className="w-full"
                  disabled={!worker.availability || hasUserBookedWorker(worker._id)}
                >
                  {hasUserBookedWorker(worker._id) ? "Already Booked" : "Book Now"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}