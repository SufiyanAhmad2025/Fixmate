"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook
import { useRouter } from "next/navigation"; // Import the useRouter hook

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth(); // Get the authenticated user
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    setIsClient(true);

    // Redirect logic
    if (user) {
      if (user.role === "worker") {
        router.push("/worker"); // Redirect workers to the worker dashboard
      } else if (user.role === "user") {
        router.push("/user"); // Redirect normal users to the user dashboard
      }
    }
  }, [user, router]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Render video only when client-side */}
      {isClient && !user && ( // Only show the video if the user is not logged in
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/file.svg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/homepage.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>

      {/* Content on Top */}
      {!user && ( // Only show the content if the user is not logged in
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
          <div className="bg-black/30 p-6 rounded-lg max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              Hire Skilled Professionals with Ease
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl drop-shadow-md">
              FixMate connects you with verified technicians and household
              workers for reliable and efficient services.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Link href="/user">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg cursor-pointer">
                  Book a Service
                </Button>
              </Link>
              <Link href="/register?role=worker">
                <Button
                  variant="outline"
                  className="border-white text-white bg-transparent px-8 py-4 rounded-lg text-lg shadow-lg hover:bg-white/80 cursor-pointer"
                >
                  Offer Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}