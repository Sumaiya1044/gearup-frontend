"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface GearItem {
  id: string;
  name: string;
  pricePerDay: number;
}

interface RentalItem {
  id: string;
  quantity: number;
  pricePerDay: number;
  gearItem: GearItem;
}

interface Payment {
  id: string;
  status: string;
  amount: number;
}

interface Rental {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: RentalItem[];
  payment?: Payment | null;
}

export default function MyBookingsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get("/rentals");
        setRentals(response.data?.data || []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
              href="/dashboard/customer"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/gear"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Browse Gears
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-gray-900">
            My Bookings
          </h1>

          <p className="mt-3 text-gray-600">
            View your rental history, booking dates, status and payments.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-500">
              Loading your bookings...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-700">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && rentals.length === 0 && (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't rented any gear yet.
            </p>

            <Link
              href="/gear"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
            >
              Browse Gears
            </Link>
          </div>
        )}

        {!loading && !error && rentals.length > 0 && (
          <div className="space-y-6">
            {rentals.map((rental) => (
              <article
                key={rental.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Booking ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm text-gray-700">
                      {rental.id}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                    {rental.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Start Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(rental.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      End Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(rental.endDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-lg font-extrabold text-gray-900">
                      ৳{rental.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 font-bold text-gray-900">
                    Rented Gears
                  </h3>

                  <div className="space-y-3">
                    {rental.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.gearItem.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ৳
                            {item.pricePerDay}/day
                          </p>
                        </div>

                        <p className="font-bold text-gray-900">
                          ৳
                          {item.pricePerDay * item.quantity}
                          /day
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-5 text-sm sm:flex-row sm:justify-between">
                  <p className="text-gray-500">
                    Booked on:{" "}
                    <span className="font-medium text-gray-700">
                      {formatDate(rental.createdAt)}
                    </span>
                  </p>

                  <p className="text-gray-500">
                    Payment:{" "}
                    <span className="font-semibold text-gray-700">
                      {rental.payment?.status || "Not paid"}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
