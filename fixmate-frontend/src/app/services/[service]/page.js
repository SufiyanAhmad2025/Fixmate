"use client";

import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { ArrowLeftCircle, MapPinIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function ServiceWorkersPage() {
  const params = useParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  let service = params.service?.toString();

  // Normalize service name to match backend format
  const formattedKey = service.replace(/%26/g, "and").replace(/-/g, " ");
  const serviceCategory = formattedKey.replace(/\s+/g, "-").toLowerCase();

  const [filters, setFilters] = useState({
    location: "",
    minRating: 0,
    availability: true,
    priceRange: [0, 1000],
  });

  useEffect(() => {
    console.log("Service Category:", serviceCategory); // Debugging line
    const fetchWorkers = async () => {
      try {
        const { data } = await api.get("/workers", {
          params: {
            serviceCategory: serviceCategory,
            ...filters,
            minPrice: filters.priceRange[0],
            maxPrice: filters.priceRange[1],
          },
        });
        console.log(data, "data in useEffect");

        setWorkers(data);
      } catch (err) {
        console.log(err, "err in useEffect");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [serviceCategory, filters]);

  const getLiveLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const address = `${data.locality}, ${data.city}, ${data.countryName}`;
            setFilters({ ...filters, location: address });
          } catch (error) {
            toast.error("Unable to retrieve your location");
          }
        },
        (error) => {
          toast.error("Unable to retrieve your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-6 py-16">
          <p className="text-center text-gray-600">Loading workers...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-6 py-16">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative container mx-auto px-6 ">
        <ArrowLeftCircle
          className="absolute top-6 left-6 h-8 w-8 cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => router.back()}
        />
        <h1 className="text-4xl font-bold text-center mb-10 capitalize text-gray-800 pt-6">
          {formattedKey} Workers
        </h1>

        {/* Filters Section */}
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 space-y-6 gap-x-20">
            {/* Location Input */}
            <div className="relative">
              <Input
                placeholder="Enter Location"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="pl-10 pr-24"
              />
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Button
                onClick={getLiveLocation}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                size="sm"
              >
                <MapPinIcon className="text-white" />
              </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(val) =>
                  setFilters({ ...filters, priceRange: val })
                }
                min={0}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Rating</label>
              <Select
                value={filters.minRating.toString()} // Ensure it's a string
                onValueChange={(val) =>
                  setFilters({ ...filters, minRating: parseInt(val) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <Select
                value={filters.availability.toString()} // Ensure it's a string
                onValueChange={(val) =>
                  setFilters({ ...filters, availability: val === "true" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available Now</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Workers List */}
        {workers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker, index) => (
              <Card key={index} className="shadow-lg rounded-xl">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={worker.user.profilePicture}
                      alt={worker.user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {worker.user.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {worker.serviceCategory}
                      </p>
                      {worker.trustedBadge && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span>Address:</span>
                      <span className="font-medium">
                        {worker.address || "Not specified"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-medium">
                        {worker.experience || "Not specified"}
                      </span>
                    </p>
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
                          worker.availability
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {worker.availability
                          ? "Available Now"
                          : "Not Available"}
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push(`/worker/${worker.user._id}`)}
                    className="w-full mt-4 cursor-pointer"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No workers available for this service.
          </p>
        )}
      </div>
    </>
  );
}
