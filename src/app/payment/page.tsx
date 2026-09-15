"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rentalOrderId = searchParams.get("rentalOrderId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!rentalOrderId) {
      setError("Rental order ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/payments/create", {
        rentalOrderId,
      });

      console.log("PAYMENT RESPONSE:", response.data);

      const gatewayUrl = response.data?.data?.gatewayUrl;

      if (!gatewayUrl) {
        throw new Error("Payment gateway URL was not received.");
      }

      window.location.href = gatewayUrl;
    } catch (err: any) {
      console.error("PAYMENT ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to start payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(
      rentalOrderId
        ? `/payment/cancel?status=cancelled&tran_id=${rentalOrderId}`
        : "/payment/cancel"
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Complete Payment
        </h1>

        <p className="mt-3 text-gray-500">
          Pay securely through SSLCommerz.
        </p>

        {rentalOrderId ? (
          <p className="mt-6 break-all rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            Order ID: {rentalOrderId}
          </p>
        ) : (
          <p className="mt-6 text-red-500">
            Rental order ID is missing.
          </p>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !rentalOrderId}
          className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Redirecting to payment..." : "Pay with SSLCommerz"}
        </button>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="mt-3 w-full rounded-lg border border-gray-300 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel Payment
        </button>
      </div>
    </main>
  );
}
