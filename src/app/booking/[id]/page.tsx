
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
  available?: boolean;
  isAvailable?: boolean;
  stock?: number;
}

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const gearId = params.id;

  const [gear, setGear] = useState<Gear | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await api.get(`/gear/${gearId}`);

        console.log("BOOKING RESPONSE:", response.data);

        setGear(response.data?.data);

        console.log("GEAR SET:", response.data?.data);
      } catch (err: any) {
        console.error("BOOKING GEAR ERROR:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load gear information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (gearId) {
      fetchGear();
    }
  }, [gearId]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return days > 0 ? days : 0;
  };

  const days = calculateDays();

  const totalAmount =
    gear && days > 0
      ? gear.pricePerDay * quantity * days
      : 0;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (days <= 0) {
      setError("End date must be after start date.");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("BOOKING CREATE REQUEST:", {
        startDate,
        endDate,
        items: [
          {
            gearItemId: gearId,
            quantity,
          },
        ],
      });

      const response = await api.post("/rentals", {
        startDate,
        endDate,
        items: [
          {
            gearItemId: gearId,
            quantity,
          },
        ],
      });

      console.log(
        "BOOKING CREATE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setSuccess("Booking created successfully!");

        setTimeout(() => {
          router.push("/dashboard/customer/bookings");
        }, 1000);
      } else {
        setError(
          response.data?.message ||
            "Failed to create booking."
        );
      }
    } catch (err: any) {
      console.error("BOOKING CREATE ERROR:", err);

      console.error(
        "BOOKING CREATE ERROR RESPONSE:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          "Failed to create booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-500">
          Loading booking information...
        </p>
      </main>
    );
  }

  if (!gear) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Gear not found
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "This gear could not be found."}
          </p>

          <Link
            href="/gear"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
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
            className="text-2xl font-extrabold text-gray-900"
          >
            Gear<span className="text-blue-600">Up</span>
          </Link>

          <div className="flex gap-3">
            <Link
              href="/gear"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Browse Gears
            </Link>

            <Link
              href="/dashboard/customer"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href={`/gear/${gearId}`}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to Gear Details
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-gray-900 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-400">
              Rental
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              {gear.name}
            </h1>

            {gear.description && (
              <p className="mt-4 leading-7 text-gray-300">
                {gear.description}
              </p>
            )}

            <div className="mt-8">
              <p className="text-sm text-gray-400">
                Price per day
              </p>

              <p className="mt-1 text-3xl font-extrabold">
                ৳{gear.pricePerDay}
              </p>
            </div>

            <div className="mt-6">
              <span
                className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Book This Gear
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select your rental dates and quantity.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-600">
                  {success}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  min={
                    startDate ||
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  max={gear.stock || 99}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Price per day</span>
                  <span>৳{gear.pricePerDay}</span>
                </div>

                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>

                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>Days</span>
                  <span>{days}</span>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-extrabold text-blue-600">
                      ৳{totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  submitting || !isAvailable
                }
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {submitting
                  ? "Creating Booking..."
                  : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
