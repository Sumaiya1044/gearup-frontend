"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface RentalItem {
  id?: string;
  quantity: number;
  gearItem?: {
    id: string;
    name: string;
    pricePerDay: number;
  };
}

interface Rental {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: RentalItem[];
  payment?: {
    status?: string;
  };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/rentals");

        console.log("MY BOOKINGS RESPONSE:", response.data);

        setBookings(response.data?.data || []);
      } catch (err: any) {
        console.error("MY BOOKINGS ERROR:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-500">
          Loading your bookings...
        </p>
      </main>
    );
  }

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

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-500">
            View your gear rental history and booking status.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-500">
              You have not booked any gear yet.
            </p>

            <Link
              href="/gear"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
            >
              Browse Gears
            </Link>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-8 space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-sm text-gray-500">
                      Booking ID
                    </p>

                    <p className="mt-1 break-all font-bold text-gray-900">
                      {booking.id}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Start Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {new Date(
                        booking.startDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      End Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {new Date(
                        booking.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-blue-600">
                      ৳{booking.totalAmount}
                    </p>
                  </div>
                </div>

                {booking.items &&
                  booking.items.length > 0 && (
                    <div className="mt-6 border-t pt-5">
                      <h3 className="font-bold text-gray-900">
                        Rented Gear
                      </h3>

                      <div className="mt-3 space-y-2">
                        {booking.items.map(
                          (item, index) => (
                            <div
                              key={
                                item.id || index
                              }
                              className="flex justify-between rounded-lg bg-gray-50 p-3"
                            >
                              <span className="font-medium text-gray-700">
                                {item.gearItem?.name ||
                                  "Gear"}
                              </span>

                              <span className="text-gray-500">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <div className="mt-6 border-t pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Booked On
                    </span>

                    <span className="font-medium text-gray-700">
                      {new Date(
                        booking.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-500">
                      Payment
                    </span>

                    <span className="font-semibold text-gray-700">
                      {booking.payment?.status ||
                        "Not paid"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
