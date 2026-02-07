// app/search/page.js
"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import RatingDisplay from "@/components/RatingDisplay";
import { serviceCategories } from "@/lib/data";


export default function SearchPage() {
  const [workers, setWorkers] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    serviceCategory: "",
    minRating: 0,
    availability: false,
    priceRange: [0, 1000],
  });

  const searchWorkers = async () => {
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
      toast({
        message: error.response?.data?.message || "Failed to load workers",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <Select
          value={filters.serviceCategory}
          onValueChange={(val) =>
            setFilters({ ...filters, serviceCategory: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Service Category" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
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
            {[1, 2, 3, 4, 5].map((r) => (
              <SelectItem key={r} value={r}>
                {r}+ Stars
              </SelectItem>
            ))}
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

      <Button onClick={searchWorkers} className="w-full mb-6">
        Search Workers
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <Card key={worker._id}>
            <CardHeader>
              <CardTitle>{worker.user.name}</CardTitle>
              <RatingDisplay workerId={worker._id} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {worker.serviceCategory}
                </span>
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
                  <span
                    className={`font-medium ${
                      worker.availability ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {worker.availability ? "Available Now" : "Not Available"}
                  </span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/bookings/new/${worker._id}`} className="w-full">
                <Button className="w-full" disabled={!worker.availability}>
                  Book Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
