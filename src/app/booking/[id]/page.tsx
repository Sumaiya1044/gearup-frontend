"use client";

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

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();

  const [gear, setGear] = useState<Gear | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await api.get(`/gear/${params.id}`);
        setGear(response.data?.data || null);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load gear details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGear();
    }
  }, [params.id]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const days = calculateDays();

  const totalPrice =
    gear && days > 0
      ? gear.pricePerDay * days
      : 0;

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    // Login check
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (days <= 0) {
      setError("End date must be after start date.");
      return;
    }

    try {
      setBooking(true);

      const response = await api.post("/rentals", {
        startDate,
        endDate,
        items: [
          {
            gearItemId: params.id,
            quantity: 1,
          },
        ],
      });

      console.log("RENTAL CREATED:", response.data);

      const rentalData = response.data?.data;

      const rentalOrderId =
        rentalData?.id ||
        rentalData?.rentalOrderId ||
        rentalData?.rental?.id ||
        rentalData?.order?.id;

      if (!rentalOrderId) {
        console.error("Rental ID not found:", response.data);

        setError(
          "Rental was created, but the rental order ID was not received."
        );

        return;
      }

      setSuccess(
        "Rental created successfully! Redirecting to payment..."
      );

      setTimeout(() => {
        router.push(
          `/payment?rentalOrderId=${rentalOrderId}`
        );
      }, 800);
    } catch (err: any) {
      console.error("RENTAL ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to create rental. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 font-medium text-gray-600">
            Loading booking page...
          </p>
        </div>
      </main>
    );
  }

  if (!gear) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Gear not found
          </h1>

          <p className="mt-2 text-gray-500">
            We could not find this gear.
          </p>

          <Link
            href="/gear"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white"
          >
            Back to Gears
          </Link>
        </div>
      </main>
    );
  }

  const isAvailable =
    gear.isAvailable !== undefined
      ? gear.isAvailable
      : gear.available !== false;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-gray-900"
          >
            Gear<span className="text-blue-600">Up</span>
          </Link>

          <Link
            href={`/gear/${gear.id}`}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            ← Back to Gear
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">

          {/* Gear Information */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Rental Item
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
              {gear.name}
            </h1>

            {gear.description && (
              <p className="mt-4 leading-7 text-gray-600">
                {gear.description}
              </p>
            )}

            {gear.location && (
              <p className="mt-5 text-sm font-medium text-gray-600">
                📍 {gear.location}
              </p>
            )}

            <div className="mt-8 border-t pt-6">
              <p className="text-sm text-gray-500">
                Rental Price
              </p>

              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                ৳{gear.pricePerDay}

                <span className="ml-2 text-base font-medium text-gray-500">
                  /day
                </span>
              </p>
            </div>

            <div className="mt-6">
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isAvailable
                  ? "Available"
                  : "Currently Unavailable"}
              </span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Book This Gear
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select your rental dates.
            </p>

            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={
                    startDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {days > 0 && (
              <div className="mt-6 rounded-xl bg-gray-50 p-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Rental Duration</span>

                  <span className="font-semibold text-gray-900">
                    {days} {days === 1 ? "day" : "days"}
                  </span>
                </div>

                <div className="mt-3 flex justify-between border-t pt-3">
                  <span className="font-semibold text-gray-700">
                    Total Price
                  </span>

                  <span className="text-xl font-extrabold text-gray-900">
                    ৳{totalPrice}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleBooking}
              disabled={!isAvailable || booking}
              className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {booking
                ? "Creating Rental..."
                : "Confirm Rental"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}