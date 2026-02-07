"use client"

import { Header } from "@/components/Header";
import ServicesPage from "@/components/Services";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { services } from "@/lib/data";
import { Verified } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

function Page() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = services.filter((service) =>
        service.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };

  const handleServiceClick = (serviceName) => {
    setSearchTerm("");
    setFilteredServices([]);
    window.location.href = `/services/${serviceName.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <>
      <Header />
      <div className="overflow-y-auto bg-gray-50">
        {/* Hero Section with Video Background */}
        <section className="relative h-screen overflow-hidden">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/user_homepage.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="container mx-auto px-6 py-24 text-center relative z-10">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Hire Skilled Professionals with Ease
            </h1>
            <p className="text-xl text-white mb-8">
              FixMate connects you with trusted, verified technicians for all
              your home service needs.
            </p>
            <div className="flex justify-center gap-4">
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search for a service..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 z-10  bg-white"
                />
                {filteredServices.length > 0 && (
                  <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-20">
                    {filteredServices.map((service) => (
                      <div
                        key={service.name}
                        onClick={() => handleServiceClick(service.name)}
                        className="text-left px-4 py-3 hover:bg-gray-100 cursor-pointer"
                      >
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold text-center mb-10">Our Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service.profession}
                  href={`/services/${service.profession.replace(/\s+/g, "-")}`}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Verified className="w-4 h-4 mr-2" />
                      <span>{service.profession}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        {!user && (
          <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-semibold mb-4 text-blue-900">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Join FixMate today for seamless service bookings.
              </p>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-6 bg-gray-900 text-white text-center">
          <div className="container mx-auto px-6">
            <p className="text-sm">&copy; 2023 FixMate. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Page;