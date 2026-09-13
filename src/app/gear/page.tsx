"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Gear {
  id: string;
  name: string;
  description?: string;
  pricePerDay: number;
  location?: string;
  image?: string;
  available?: boolean;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
];

const displayNames = [
  "Mountain Bike",
  "Treadmill",
  "Dumbbell Set",
  "Barbell Set",
  "Exercise Bike",
  "Yoga Mat",
  "Mountain Bike",
];

export default function GearPage() {
  const [gears, setGears] = useState<Gear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGears = async () => {
      try {
        const response = await api.get("/gear");
        setGears(response.data?.data || []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load gears. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGears();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-gray-900"
          >
            Gear<span className="text-blue-600">Up</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-600">
          GearUp Marketplace
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Explore Gears
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600">
          Browse fitness equipment available for rent from GearUp providers.
        </p>
      </section>

      {loading && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-500">
              Loading gears...
            </p>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-700">
              Unable to load gears
            </h2>

            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        </section>
      )}

      {!loading && !error && gears.length === 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <div className="text-5xl">🏋️</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No gears available
            </h2>

            <p className="mt-2 text-gray-500">
              There are no gears available for rent at the moment.
            </p>
          </div>
        </section>
      )}

      {!loading && !error && gears.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Equipment
            </h2>

            <p className="text-sm text-gray-500">
              {gears.length} gear{gears.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {gears.map((gear, index) => (
              <article
                key={gear.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={
                      gear.image ||
                      fallbackImages[index % fallbackImages.length]
                    }
                    alt={displayNames[index] || gear.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow ${
                      gear.available === false
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {gear.available === false
                      ? "Unavailable"
                      : "Available"}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {displayNames[index] || gear.name}
                  </h3>

                  {gear.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                      {gear.description}
                    </p>
                  )}

                  {gear.location && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <span>📍</span>
                      <span>{gear.location}</span>
                    </div>
                  )}

                  <div className="mt-6 flex items-end justify-between border-t border-gray-100 pt-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Rental Price
                      </p>

                      <p className="mt-1 text-xl font-extrabold text-gray-900">
                        ৳{gear.pricePerDay}
                        <span className="ml-1 text-sm font-medium text-gray-500">
                          /day
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/gear/${gear.id}`}
                      className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
