"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Gear {
  id: string;
  name: string;
  description?: string;
  pricePerDay: number;
  location?: string;
  image?: string;
  available?: boolean;
  isAvailable?: boolean;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
];

const gearImageMap: Record<string, string> = {
  Treadmill: fallbackImages[0],
  "Dumbbell Set": fallbackImages[1],
  "Barbell Set": fallbackImages[2],
  "Exercise Bike": fallbackImages[3],
  "Yoga Mat": fallbackImages[4],
  "Mountain Bike": fallbackImages[5],
  Kettlebell: fallbackImages[0],
};

export default function GearDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [gear, setGear] = useState<Gear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await api.get(`/gear/${params.id}`);

        console.log("DETAIL GEAR:", response.data);

        setGear(response.data?.data || null);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load gear details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGear();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Link
              href="/gear"
              className="text-2xl font-extrabold tracking-tight text-gray-900"
            >
              Gear<span className="text-blue-600">Up</span>
            </Link>
          </div>
        </nav>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-500">
              Loading gear details...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !gear) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Link
              href="/gear"
              className="text-2xl font-extrabold tracking-tight text-gray-900"
            >
              Gear<span className="text-blue-600">Up</span>
            </Link>
          </div>
        </nav>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="text-5xl">⚠️</div>

            <h1 className="mt-4 text-2xl font-bold text-red-700">
              Gear not found
            </h1>

            <p className="mt-2 text-red-600">
              {error || "The requested gear could not be found."}
            </p>

            <Link
              href="/gear"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-blue-600"
            >
              Back to Gears
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const isAvailable =
    gear.isAvailable !== undefined
      ? gear.isAvailable
      : gear.available !== false;

  const gearImage =
    gear.image || gearImageMap[gear.name] || fallbackImages[0];

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
            href="/gear"
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            ← Back to Gears
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 overflow-hidden rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div className="relative overflow-hidden rounded-2xl bg-gray-200">
            <Image
              src={gearImage}
              alt={gear.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

            <div
              className={`absolute left-5 top-5 rounded-full px-4 py-2 text-sm font-bold shadow ${
                !isAvailable
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {!isAvailable ? "Unavailable" : "Available"}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Gear Details
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              {gear.name}
            </h1>

            {gear.description && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Description
                </h2>

                <p className="mt-2 text-base leading-7 text-gray-600">
                  {gear.description}
                </p>
              </div>
            )}

            {gear.location && (
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  📍 {gear.location}
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
                Rental Price
              </p>

              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                ৳{gear.pricePerDay}
                <span className="ml-2 text-base font-medium text-gray-500">
                  /day
                </span>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {!isAvailable ? (
                <button
                  disabled
                  className="rounded-xl bg-gray-300 px-7 py-3.5 font-bold text-gray-500"
                >
                  Currently Unavailable
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/booking/${gear.id}`)}
                  className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition hover:bg-blue-700"
                >
                  Book / Rent Now
                </button>
              )}

              <Link
                href="/gear"
                className="rounded-xl border border-gray-300 px-7 py-3.5 text-center font-bold text-gray-700 transition hover:bg-gray-100"
              >
                Browse More Gears
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}