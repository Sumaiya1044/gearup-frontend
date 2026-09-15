"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  address?: string;
  createdAt: string;
};

type Gear = {
  id: string;
  name: string;
  pricePerDay: number;
  stock?: number;
  isAvailable?: boolean;
  category?: { name: string };
  provider?: { name: string; email: string };
};

type Rental = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer?: { name: string; email: string };
  items?: {
    quantity: number;
    gearItem?: { name: string };
  }[];
  payment?: { status: string };
};

type Review = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
  gearItem?: {
    name: string;
  };
};

const USERS_PER_PAGE = 5;

export default function AdminDashboard() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [gears, setGears] = useState<Gear[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        usersResponse,
        gearResponse,
        rentalsResponse,
        reviewsResponse,
      ] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/gear"),
        api.get("/admin/rentals"),
        api.get("/reviews/admin/all"),
      ]);

      setUsers(usersResponse.data?.data || []);
      setGears(gearResponse.data?.data || []);
      setRentals(rentalsResponse.data?.data || []);
      setReviews(reviewsResponse.data?.data || []);
    } catch (err: any) {
      console.error("ADMIN DASHBOARD ERROR:", err);

      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        router.push("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadDashboard();
  }, [router]);

  const updateStatus = async (
    id: string,
    status: "ACTIVE" | "SUSPENDED"
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      await api.patch(`/admin/users/${id}`, { status });

      await loadDashboard();
    } catch (err: any) {
      console.error("UPDATE USER STATUS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update user status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const updateRentalStatus = async (
    id: string,
    status:
      | "CONFIRMED"
      | "PICKED_UP"
      | "RETURNED"
      | "CANCELLED"
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      await api.patch(`/admin/rentals/${id}/status`, {
        status,
      });

      await loadDashboard();
    } catch (err: any) {
      console.error("UPDATE RENTAL STATUS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update rental order status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const updateGearAvailability = async (
    id: string,
    isAvailable: boolean
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      await api.patch(`/gear/admin/${id}/availability`, {
        isAvailable: !isAvailable,
      });

      await loadDashboard();
    } catch (err: any) {
      console.error("UPDATE GEAR AVAILABILITY ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update gear availability."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const filteredUsers = useMemo(() => {
    const search = userSearch.trim().toLowerCase();

    if (!search) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search)
      );
    });
  }, [users, userSearch]);

  const totalPages = Math.ceil(
    filteredUsers.length / USERS_PER_PAGE
  );

  const paginatedUsers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * USERS_PER_PAGE;

    return filteredUsers.slice(
      startIndex,
      startIndex + USERS_PER_PAGE
    );
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const activeUsers = users.filter(
    (user) => user.status === "ACTIVE"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "SUSPENDED"
  ).length;

  const totalRevenue = rentals.reduce(
    (sum, rental) =>
      sum + Number(rental.totalAmount || 0),
    0
  );

  const startUserNumber =
    filteredUsers.length === 0
      ? 0
      : (currentPage - 1) * USERS_PER_PAGE + 1;

  const endUserNumber = Math.min(
    currentPage * USERS_PER_PAGE,
    filteredUsers.length
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading admin dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Manage users, gear and rental orders
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeUsers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Suspended Users</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {suspendedUsers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Gear</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {gears.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Rental Revenue</p>
            <p className="mt-2 text-2xl font-bold text-purple-600">
              ৳{totalRevenue}
            </p>
          </div>
        </div>

        {/* Users */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                User Management
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search and manage registered users
              </p>
            </div>

            <div className="w-full md:w-80">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search name, email, role..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <p className="font-semibold text-gray-700">
                No users match your search.
              </p>

              <button
                onClick={() => setUserSearch("")}
                className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col justify-between gap-2 text-sm text-gray-500 sm:flex-row sm:items-center">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {startUserNumber}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold text-gray-900">
                    {endUserNumber}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredUsers.length}
                  </span>{" "}
                  users
                </p>

                {userSearch && (
                  <p>
                    Search:{" "}
                    <span className="font-semibold text-gray-900">
                      {userSearch}
                    </span>
                  </p>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-500">
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Role</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-3 py-4 font-semibold text-gray-900">
                          {user.name}
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-3 py-4">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {user.role}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          {user.status === "ACTIVE" ? (
                            <button
                              onClick={() =>
                                updateStatus(
                                  user.id,
                                  "SUSPENDED"
                                )
                              }
                              disabled={updatingId === user.id}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:bg-gray-400"
                            >
                              {updatingId === user.id
                                ? "Updating..."
                                : "Suspend"}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                updateStatus(
                                  user.id,
                                  "ACTIVE"
                                )
                              }
                              disabled={updatingId === user.id}
                              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:bg-gray-400"
                            >
                              {updatingId === user.id
                                ? "Updating..."
                                : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(page - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${
                        currentPage === page
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(page + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Gear */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Gear Management
          </h2>

          {gears.length === 0 ? (
            <p className="text-gray-500">No gear found.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gears.map((gear) => (
                <div
                  key={gear.id}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    {gear.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Category: {gear.category?.name || "N/A"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Provider: {gear.provider?.name || "N/A"}
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    ৳{gear.pricePerDay} / day
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Stock: {gear.stock ?? 0}
                  </p>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      gear.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {gear.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateGearAvailability(
                        gear.id,
                        Boolean(gear.isAvailable)
                      )
                    }
                    disabled={updatingId === gear.id}
                    className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                      gear.isAvailable
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {updatingId === gear.id
                      ? "Updating..."
                      : gear.isAvailable
                      ? "Disable Gear"
                      : "Enable Gear"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rentals */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Rental Orders
          </h2>

          {rentals.length === 0 ? (
            <p className="text-gray-500">
              No rental orders found.
            </p>
          ) : (
            <div className="space-y-4">
              {rentals.map((rental) => (
                <div
                  key={rental.id}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order ID: {rental.id}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Customer:{" "}
                        {rental.customer?.name || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Email:{" "}
                        {rental.customer?.email || "N/A"}
                      </p>

                      <p className="mt-2 font-semibold text-gray-900">
                        Total: ৳{rental.totalAmount}
                      </p>

                      {rental.items &&
                        rental.items.length > 0 && (
                          <div className="mt-2">
                            {rental.items.map(
                              (item, index) => (
                                <p
                                  key={`${rental.id}-${index}`}
                                  className="text-sm text-gray-600"
                                >
                                  {item.gearItem?.name ||
                                    "Gear"}{" "}
                                  × {item.quantity}
                                </p>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          rental.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : rental.status === "RETURNED"
                            ? "bg-green-100 text-green-700"
                            : rental.status === "PAID"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {rental.status}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Payment:{" "}
                        {rental.payment?.status || "N/A"}
                      </span>

                      {rental.status === "PLACED" && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() =>
                              updateRentalStatus(
                                rental.id,
                                "CONFIRMED"
                              )
                            }
                            disabled={updatingId === rental.id}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-gray-400"
                          >
                            {updatingId === rental.id
                              ? "Updating..."
                              : "Confirm"}
                          </button>

                          <button
                            onClick={() =>
                              updateRentalStatus(
                                rental.id,
                                "CANCELLED"
                              )
                            }
                            disabled={updatingId === rental.id}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {rental.status === "PAID" && (
                        <button
                          onClick={() =>
                            updateRentalStatus(
                              rental.id,
                              "PICKED_UP"
                            )
                          }
                          disabled={updatingId === rental.id}
                          className="mt-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:bg-gray-400"
                        >
                          {updatingId === rental.id
                            ? "Updating..."
                            : "Mark Picked Up"}
                        </button>
                      )}

                      {rental.status === "PICKED_UP" && (
                        <button
                          onClick={() =>
                            updateRentalStatus(
                              rental.id,
                              "RETURNED"
                            )
                          }
                          disabled={updatingId === rental.id}
                          className="mt-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:bg-gray-400"
                        >
                          {updatingId === rental.id
                            ? "Updating..."
                            : "Mark Returned"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Reviews */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Customer Reviews
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View reviews submitted by customers
            </p>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-500">
              No reviews found.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <p className="font-bold text-gray-900">
                        {review.gearItem?.name || "Gear"}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Customer:{" "}
                        {review.customer?.name || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Email:{" "}
                        {review.customer?.email || "N/A"}
                      </p>

                      <p className="mt-3 text-lg text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </p>

                      {review.comment && (
                        <p className="mt-3 text-gray-700">
                          {review.comment}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
