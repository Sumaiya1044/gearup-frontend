"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type Order = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  createdAt: string;
  items?: {
    id: string;
    quantity: number;
    gearItem?: {
      name: string;
    };
  }[];
};

export default function ProviderDashboard() {
  const router = useRouter();
  const { loadAuth, logout } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");

      const response = await api.get("/rentals/provider/orders");
      setOrders(response.data?.data || []);
    } catch (err: any) {
      console.error("PROVIDER ORDERS ERROR:", err);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        router.push("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Failed to load provider orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuth();

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadOrders();
  }, [router, loadAuth]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingId(orderId);
      setError("");

      await api.patch(`/rentals/${orderId}/status`, {
        status,
      });

      await loadOrders();
    } catch (err: any) {
      console.error("UPDATE ORDER STATUS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading provider dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Provider Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Manage your rental orders
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/dashboard/provider/gear")}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              My Gears
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Pending Orders</p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {orders.filter((order) => order.status === "PENDING").length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Paid Orders</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {orders.filter((order) => order.status === "PAID").length}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Incoming Rental Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">
              No rental orders found.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order ID: {order.id}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Start:{" "}
                        {new Date(
                          order.startDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-sm text-gray-500">
                        End:{" "}
                        {new Date(
                          order.endDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-2 font-semibold text-gray-900">
                        Total: ৳{order.totalAmount}
                      </p>
                    </div>

                    <span className="h-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      {order.status}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      {order.items.map((item) => (
                        <p
                          key={item.id}
                          className="text-sm text-gray-600"
                        >
                          {item.gearItem?.name || "Gear"} ×{" "}
                          {item.quantity}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                    {order.status === "PLACED" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(
                              order.id,
                              "CONFIRMED"
                            )
                          }
                          disabled={updatingId === order.id}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-gray-400"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              order.id,
                              "CANCELLED"
                            )
                          }
                          disabled={updatingId === order.id}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "PICKED_UP"
                          )
                        }
                        disabled={updatingId === order.id}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:bg-gray-400"
                      >
                        Mark Picked Up
                      </button>
                    )}

                    {order.status === "PICKED_UP" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "RETURNED"
                          )
                        }
                        disabled={updatingId === order.id}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:bg-gray-400"
                      >
                        Mark Returned
                      </button>
                    )}

                    {updatingId === order.id && (
                      <span className="flex items-center px-2 text-sm text-gray-500">
                        Updating...
                      </span>
                    )}
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
