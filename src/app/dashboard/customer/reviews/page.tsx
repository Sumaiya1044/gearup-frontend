"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type GearItem = {
  id: string;
  quantity: number;
  gearItem?: {
    id: string;
    name: string;
  };
};

type Rental = {
  id: string;
  status: string;
  items?: GearItem[];
};

export default function CustomerReviewsPage() {
  const router = useRouter();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedGearId, setSelectedGearId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRentals = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get("/rentals");

        const returnedRentals = (response.data?.data || []).filter(
          (rental: Rental) => rental.status === "RETURNED"
        );

        setRentals(returnedRentals);
      } catch (err: any) {
        console.error("REVIEWS LOAD ERROR:", err);

        if (
          err?.response?.status === 401 ||
          err?.response?.status === 403
        ) {
          router.push("/login");
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Failed to load returned rentals."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, [router]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedGearId) {
      setError("Please select a gear.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await api.post("/reviews", {
        gearItemId: selectedGearId,
        rating,
        comment,
      });

      setMessage("Review submitted successfully!");
      setComment("");
      setRating(5);
      setSelectedGearId("");
    } catch (err: any) {
      console.error("REVIEW SUBMIT ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading review page...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Write a Review
            </h1>
            <p className="text-sm text-gray-500">
              Review gear you have returned
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/dashboard/customer/bookings")
            }
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
          >
            My Bookings
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-8">
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-green-700">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {rentals.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No returned rental orders available for review.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Submit Your Review
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Gear
                </label>

                <select
                  value={selectedGearId}
                  onChange={(e) =>
                    setSelectedGearId(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select returned gear
                  </option>

                  {rentals.map((rental) =>
                    rental.items?.map((item) => (
                      <option
                        key={`${rental.id}-${item.gearItem?.id}`}
                        value={item.gearItem?.id}
                      >
                        {item.gearItem?.name || "Gear"}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Rating
                </label>

                <select
                  value={rating}
                  onChange={(e) =>
                    setRating(Number(e.target.value))
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>★★★★★ - 5</option>
                  <option value={4}>★★★★☆ - 4</option>
                  <option value={3}>★★★☆☆ - 3</option>
                  <option value={2}>★★☆☆☆ - 2</option>
                  <option value={1}>★☆☆☆☆ - 1</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Comment
                </label>

                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  rows={5}
                  placeholder="Write your experience..."
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:bg-gray-400"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
