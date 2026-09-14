"use client";

import { useEffect, useState } from "react";
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
  category?: {
    name: string;
  };
  provider?: {
    name: string;
    email: string;
  };
};

type Rental = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
  items?: {
    quantity: number;
    gearItem?: {
      name: string;
    };
  }[];
  payment?: {
    status: string;
  };
};

export default function AdminDashboard() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [gears, setGears] = useState<Gear[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, gearResponse, rentalsResponse] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/gear"),
          api.get("/admin/rentals"),
        ]);

      setUsers(usersResponse.data?.data || []);
      setGears(gearResponse.data?.data || []);
      setRentals(rentalsResponse.data?.data || []);
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

      await api.patch(`/admin/users/${id}`, {
        status,
      });

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

  const activeUsers = users.filter(
    (user) => user.status === "ACTIVE"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "SUSPENDED"
  ).length;

  const totalRevenue = rentals.reduce(
    (sum, rental) => sum + Number(rental.totalAmount || 0),
    0
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
            <p className="text-sm text-gray-500">
              Total Users
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Active Users
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeUsers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Suspended Users
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {suspendedUsers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Gear
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {gears.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Rental Revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-purple-600">
              ৳{totalRevenue}
            </p>
          </div>
        </div>

        {/* Users */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            User Management
          </h2>

          {users.length === 0 ? (
            <p className="text-gray-500">
              No users found.
            </p>
          ) : (
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
                  {users.map((user) => (
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
          )}
        </div>

        {/* Gear */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Gear Management
          </h2>

          {gears.length === 0 ? (
            <p className="text-gray-500">
              No gear found.
            </p>
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
                    Category:{" "}
                    {gear.category?.name || "N/A"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Provider:{" "}
                    {gear.provider?.name || "N/A"}
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
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                        {rental.status}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Payment:{" "}
                        {rental.payment?.status ||
                          "N/A"}
                      </span>
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
