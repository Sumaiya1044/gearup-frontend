"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Gear = {
  id: string;
  name: string;
  description: string;
  brand?: string;
  pricePerDay: number;
  stock?: number;
  isAvailable?: boolean;
  categoryId?: string;
  images?: string[];
};

type Category = {
  id: string;
  name: string;
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
];

export default function ProviderGearPage() {
  const router = useRouter();

  const [gears, setGears] = useState<Gear[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingGear, setEditingGear] = useState<Gear | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    pricePerDay: "",
    stock: "",
    categoryId: "",
    images: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [gearResponse, categoryResponse] = await Promise.all([
        api.get("/gear/provider/my-gear"),
        api.get("/categories"),
      ]);

      setGears(gearResponse.data?.data || []);
      setCategories(categoryResponse.data?.data || []);
    } catch (err: any) {
      console.error("PROVIDER GEAR ERROR:", err);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        router.push("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Failed to load provider gear."
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

    loadData();
  }, [router]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      brand: "",
      pricePerDay: "",
      stock: "",
      categoryId: "",
      images: "",
    });

    setEditingGear(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (gear: Gear) => {
    setEditingGear(gear);

    setForm({
      name: gear.name || "",
      description: gear.description || "",
      brand: gear.brand || "",
      pricePerDay: String(gear.pricePerDay || ""),
      stock: gear.stock !== undefined ? String(gear.stock) : "",
      categoryId: gear.categoryId || "",
      images: gear.images?.join(", ") || "",
    });

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        name: form.name,
        description: form.description,
        brand: form.brand || undefined,
        pricePerDay: Number(form.pricePerDay),
        stock: form.stock ? Number(form.stock) : undefined,
        categoryId: form.categoryId,
        images: form.images
          ? form.images
              .split(",")
              .map((image) => image.trim())
              .filter(Boolean)
          : [],
      };

      if (editingGear) {
        await api.put(`/gear/${editingGear.id}`, payload);
      } else {
        await api.post("/gear", payload);
      }

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err: any) {
      console.error("SAVE GEAR ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to save gear."
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gear?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/gear/${id}`);

      await loadData();
    } catch (err: any) {
      console.error("DELETE GEAR ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete gear."
      );
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading your gears...
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
              My Gears
            </h1>

            <p className="text-sm text-gray-500">
              Manage your rental gear
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/provider")}
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Orders
            </button>

            <button
              onClick={openAddForm}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              + Add Gear
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

        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              {editingGear ? "Edit Gear" : "Add New Gear"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              <input
                type="text"
                placeholder="Gear name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Brand"
                value={form.brand}
                onChange={(e) =>
                  setForm({ ...form, brand: e.target.value })
                }
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Price per day"
                value={form.pricePerDay}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricePerDay: e.target.value,
                  })
                }
                min="1"
                required
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                min="0"
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoryId: e.target.value,
                  })
                }
                required
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Image URLs (comma separated)"
                value={form.images}
                onChange={(e) =>
                  setForm({
                    ...form,
                    images: e.target.value,
                  })
                }
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
                rows={4}
                className="md:col-span-2 rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500"
                >
                  {editingGear ? "Update Gear" : "Create Gear"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {gears.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              You have no gears yet.
            </p>

            <button
              onClick={openAddForm}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Add Your First Gear
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gears.map((gear, index) => (
              <div
                key={gear.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <img
                  src={
                    gear.images?.[0] ||
                    fallbackImages[index % fallbackImages.length]
                  }
                  alt={gear.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {gear.name}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
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

                  <p className="mt-2 text-sm text-gray-500">
                    {gear.description}
                  </p>

                  <p className="mt-3 font-semibold text-gray-900">
                    ৳{gear.pricePerDay} / day
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Stock: {gear.stock ?? 0}
                  </p>

                  {gear.brand && (
                    <p className="mt-1 text-sm text-gray-500">
                      Brand: {gear.brand}
                    </p>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => openEditForm(gear)}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(gear.id)}
                      disabled={deletingId === gear.id}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:bg-gray-400"
                    >
                      {deletingId === gear.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
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
