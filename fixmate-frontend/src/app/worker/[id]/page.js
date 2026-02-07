"use client";

import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  DollarSignIcon,
  StarIcon,
  ArrowLeftCircle,
} from "lucide-react";

export default function WorkerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkerAndReviews = async () => {
      try {
        // Fetch worker details
        const { data: workerData } = await api.get(`/workers/${params.id}`);
        console.log(workerData, "worker data");

        // Fetch reviews for the worker
        const { data: reviewsData } = await api.get(`/reviews/${params.id}`);
        console.log(reviewsData, "reviews data");

        // Combine worker details and reviews
        setWorker({
          ...workerData[0],
          reviews: reviewsData,
        });
      } catch (err) {
        console.log(err, "err in useEffect");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerAndReviews();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-6 py-16">
          <p className="text-center text-gray-600">Loading worker profile...</p>
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

  if (!worker) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-6 py-16">
          <p className="text-center text-gray-600">Worker not found.</p>
        </div>
      </>
    );
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "1234567890"; // Replace with the worker's phone number
    const message = `Hello ${worker.user.name}, I found your profile on the platform and would like to discuss your services.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-16">
        <div className="flex gap-x-5">
          <ArrowLeftCircle
            className="mt-5 h-8 w-8 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => router.back()}
          />
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 transition hover:shadow-lg w-full">
            {/* Profile Section */}
            <div className="flex items-center gap-5">
              <img
                src={worker.user.profilePicture}
                alt={worker.user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {worker.user.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {worker.serviceCategory}
                </p>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-5 space-y-3">
              <InfoRow
                icon={<MapPinIcon className="h-5 w-5 text-gray-500" />}
                text={worker.address || "Not specified"}
              />
              <InfoRow
                icon={<BriefcaseIcon className="h-5 w-5 text-gray-500" />}
                text={`Experience: ${worker.experience || "Not specified"}`}
              />
              <InfoRow
                icon={<DollarSignIcon className="h-5 w-5 text-gray-500" />}
                text={`Hourly Rate: $${worker.hourlyRate || "Not specified"}`}
              />
              <InfoRow
                icon={<ClockIcon className="h-5 w-5 text-gray-500" />}
                text={`Availability: ${
                  worker.availability ? "Available" : "Not Available"
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                onClick={() => router.push(`/booking/new/${worker.user._id}`)}
              >
                Book Now
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                onClick={handleWhatsAppClick}
              >
                Contact on WhatsApp
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pl-10">
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Ratings & Reviews
            </h2>
            <div className="space-y-4">
              {worker.reviews && worker.reviews.length > 0 ? (
                worker.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.user.profilePicture}
                          alt={review.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-gray-800 font-medium">
                            {review.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-5 w-5 ${
                              index < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-4">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No reviews available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    {icon}
    <p className="text-gray-700">{text}</p>
  </div>
);
