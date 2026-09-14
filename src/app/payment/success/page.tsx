"use client";

import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="text-6xl">✅</div>

        <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment has been completed successfully.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/customer/bookings"
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
          >
            View My Bookings
          </Link>

          <Link
            href="/dashboard/customer"
            className="rounded-lg border border-gray-300 px-6 py-3 font-bold text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
