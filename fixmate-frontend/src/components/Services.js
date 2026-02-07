import { services } from "@/lib/data";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-10">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link key={service.name} href={`/services/${service.name.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105">
              <h2 className="text-2xl font-semibold text-blue-900">{service.name}</h2>
              <p className="text-gray-600 mt-2">{service.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
