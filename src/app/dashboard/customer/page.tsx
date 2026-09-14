"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

interface Rental {
  id: string;
  status: string;
  payment?: {
    status?: string;
  };
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, loadAuth, logout } = useAuthStore();

  const [bookings, setBookings] = useState<Rental[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (user && user.role !== "CUSTOMER") {
      router.replace("/gear");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/rentals");
        setBookings(response.data?.data || []);
      } catch (err: any) {
        console.error("CUSTOMER DASHBOARD BOOKINGS ERROR:", err);

        setBookingError(
          err?.response?.data?.message ||
            "Failed to load booking statistics."
        );
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const totalBookings = bookings.length;

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status !== "RETURNED" &&
      booking.status !== "CANCELLED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "RETURNED"
  ).length;

  const completedPayments = bookings.filter(
    (booking) => booking.payment?.status === "COMPLETED"
  ).length;

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

          <div className="flex items-center gap-3">
            <Link
              href="/gear"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Browse Gears
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl bg-gray-900 p-8 text-white md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Customer Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-3 max-w-2xl text-gray-300">
            Manage your gear rentals, bookings and payments from one place.
          </p>

          <Link
            href="/gear"
            className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
          >
            Explore Gears
          </Link>
        </div>

        {bookingError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-600">
              {bookingError}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Total Bookings
            </p>

            <p className="mt-3 text-3xl font-extrabold text-gray-900">
              {loadingBookings ? "..." : totalBookings}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Active Bookings
            </p>

            <p className="mt-3 text-3xl font-extrabold text-blue-600">
              {loadingBookings ? "..." : activeBookings}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>

            <p className="mt-3 text-3xl font-extrabold text-green-600">
              {loadingBookings ? "..." : completedBookings}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Payments
            </p>

            <p className="mt-3 text-3xl font-extrabold text-purple-600">
              {loadingBookings ? "..." : completedPayments}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            href="/gear"
            className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">🏋️</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Browse Gears
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Find fitness equipment and rent the gear you need.
            </p>
          </Link>

          <Link
            href="/dashboard/customer/bookings"
            className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">📦</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              My Bookings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              View your booking history, rental status and payments.
            </p>
          </Link>

          <Link
            href="/dashboard/customer/reviews"
            className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">⭐</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Reviews & Ratings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review and rate gear after returning your rental.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
