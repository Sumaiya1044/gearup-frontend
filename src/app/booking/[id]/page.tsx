"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Gear {
  id: string;
  name: string;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  description?: string;
  brand?: string;
  category?: {
    name: string;
  };
  provider?: {
    name: string;
  };
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();

  const gearId = params.id as string;

  const [gear, setGear] = useState<Gear | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [days, setDays] = useState(0);

  useEffect(() => {
    const fetchGear = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/gear/${gearId}`);

        console.log("BOOKING RESPONSE:", response.data);

        setGear(response.data?.data);

        console.log("GEAR SET:", response.data?.data);
      } catch (err: any) {
        console.error("GEAR FETCH ERROR:", err);

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

  useEffect(() => {
    if (!startDate || !endDate) {
      setDays(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    const calculatedDays = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    setDays(calculatedDays > 0 ? calculatedDays : 0);
  }, [startDate, endDate]);

  const totalAmount =
    gear && days > 0
      ? gear.pricePerDay * days * quantity
      : 0;

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    if (!gear) {
      setError("Gear information is not available.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select start and end dates.");
      return;
    }

    if (days <= 0) {
      setError(
        "End date must be after the start date."
      );
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    if (quantity > gear.stock) {
      setError(
        `Only ${gear.stock} item(s) are available.`
      );
      return;
    }

    if (!gear.isAvailable) {
      setError("This gear is currently unavailable.");
      return;
    }

    try {
      setBookingLoading(true);

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

        const rentalOrderId =
          response.data?.data?.id ||
          response.data?.data?.rentalOrderId;

        console.log(
          "RENTAL ORDER ID:",
          rentalOrderId
        );

        if (!rentalOrderId) {
          setError(
            "Booking created, but order ID was not received."
          );
          return;
        }

        setTimeout(() => {
          router.push(
            `/payment?rentalOrderId=${rentalOrderId}`
          );
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
      setBookingLoading(false);
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

  if (error && !gear) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => router.back()}
            className="mt-5 rounded-lg bg-gray-900 px-5 py-2 font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  if (!gear) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-extrabold text-gray-900"
          >
            Gear<span className="text-blue-600">Up</span>
          </button>

          <button
            onClick={() => router.push("/gear")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Browse Gears
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {gear.name}
            </h1>

            {gear.brand && (
              <p className="mt-2 text-gray-500">
                Brand: {gear.brand}
              </p>
            )}

            {gear.description && (
              <p className="mt-6 leading-7 text-gray-600">
                {gear.description}
              </p>
            )}

            <div className="mt-8 rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Price per day
              </p>

              <p className="mt-1 text-3xl font-extrabold text-blue-600">
                ৳{gear.pricePerDay}
              </p>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Available stock
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {gear.stock}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Book This Gear
            </h2>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-600">
                  {success}
                </p>
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
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  max={gear.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Number(e.target.value)
                      )
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Rental days</span>
                  <span>{days}</span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-gray-500">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <span className="font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-blue-600">
                    ৳{totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {bookingLoading
                  ? "Creating Booking..."
                  : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}