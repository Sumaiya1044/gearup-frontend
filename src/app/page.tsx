
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Gear {
  id: string;
  name: string;
  description?: string;
  pricePerDay: number;
  image?: string;
  isAvailable?: boolean;
  available?: boolean;
}

const categories = [
  {
    title: "Strength Training",
    description: "Dumbbells, barbells & weights",
    icon: "🏋️",
  },
  {
    title: "Cardio",
    description: "Treadmills, bikes & more",
    icon: "🏃",
  },
  {
    title: "Yoga & Fitness",
    description: "Mats, blocks & accessories",
    icon: "🧘",
  },
  {
    title: "Sports Equipment",
    description: "Professional sports gear",
    icon: "⚽",
  },
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
];

const gearImageMap: Record<string, string> = {
  Treadmill: fallbackImages[0],
  "Dumbbell Set": fallbackImages[1],
  "Barbell Set": fallbackImages[2],
  "Exercise Bike": fallbackImages[3],
  "Yoga Mat": fallbackImages[4],
  "Mountain Bike": fallbackImages[5],
  Kettlebell: fallbackImages[0],
};

const steps = [
  {
    number: "01",
    title: "Find Your Gear",
    description:
      "Browse our wide range of fitness and sports equipment from trusted providers.",
  },
  {
    number: "02",
    title: "Choose Your Dates",
    description:
      "Select the equipment you need and choose the rental period that works for you.",
  },
  {
    number: "03",
    title: "Book & Pay",
    description:
      "Complete your booking securely and get ready to train with the right equipment.",
  },
];

export default function HomePage() {
  const { user, logout, loadAuth } = useAuthStore();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  const [gears, setGears] = useState<Gear[]>([]);
  const [loadingGears, setLoadingGears] = useState(true);
  const [gearError, setGearError] = useState("");

  useEffect(() => {
    const fetchFeaturedGears = async () => {
      try {
        const response = await api.get("/gear");

        console.log("HOME GEARS FROM API:", response.data?.data);

        setGears((response.data?.data || []).slice(0, 3));
      } catch (err: any) {
        setGearError(
          err?.response?.data?.message ||
            "Failed to load featured gears."
        );
      } finally {
        setLoadingGears(false);
      }
    };

    fetchFeaturedGears();
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Gear<span className="text-orange-500">Up</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-orange-500"
            >
              Home
            </Link>

            <Link
              href="/gear"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Explore Gears
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How It Works
            </Link>

            <Link
              href="#why-us"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Why GearUp
            </Link>
          </div>

          {/* Auth Navbar */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={
                    user.role === "ADMIN"
                      ? "/dashboard/admin"
                      : user.role === "PROVIDER"
                      ? "/dashboard/provider"
                      : "/dashboard/customer"
                  }
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();

                    document.cookie =
                      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

                    window.location.href = "/";
                  }}
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85"
            alt="Fitness training"
            className="h-full w-full object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30" />
        </div>

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Your fitness gear marketplace
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Gear Up.
              <br />
              <span className="text-orange-500">Train Better.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Rent premium fitness and sports equipment without the commitment
              of buying. Find the right gear, choose your dates, and start
              training.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gear"
                className="rounded-full bg-orange-500 px-7 py-4 text-center font-bold text-white transition hover:bg-orange-600"
              >
                Explore Gears →
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-white/25 bg-white/10 px-7 py-4 text-center font-bold text-white backdrop-blur transition hover:bg-white hover:text-slate-950"
              >
                Become a Provider
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-white">
              <div>
                <p className="text-2xl font-black">500+</p>
                <p className="text-sm text-slate-400">Gears Available</p>
              </div>

              <div>
                <p className="text-2xl font-black">100+</p>
                <p className="text-sm text-slate-400">Trusted Providers</p>
              </div>

              <div>
                <p className="text-2xl font-black">4.9/5</p>
                <p className="text-sm text-slate-400">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                Explore
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                Find your perfect gear
              </h2>
            </div>

            <Link
              href="/gear"
              className="font-bold text-slate-700 transition hover:text-orange-500"
            >
              View all gears →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                href="/gear"
                key={category.title}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                  {category.icon}
                </div>

                <h3 className="text-xl font-bold">{category.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {category.description}
                </p>

                <span className="mt-6 inline-block text-sm font-bold text-orange-500 opacity-0 transition group-hover:opacity-100">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gears */}
      <section className="bg-slate-50 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Popular picks
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Featured gears
            </h2>

            <p className="mt-4 max-w-2xl text-slate-500">
              Discover equipment selected for quality, performance and
              reliability.
            </p>
          </div>

          {loadingGears && (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
              <p className="font-semibold text-slate-500">
                Loading featured gears...
              </p>
            </div>
          )}

          {!loadingGears && gearError && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-600">{gearError}</p>

              <Link
                href="/gear"
                className="mt-4 inline-block rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white"
              >
                Browse All Gears
              </Link>
            </div>
          )}

          {!loadingGears && !gearError && gears.length === 0 && (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
              <p className="font-semibold text-slate-500">
                No gears available right now.
              </p>
            </div>
          )}

          {!loadingGears && !gearError && gears.length > 0 && (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {gears.map((gear) => {
                const gearImage =
                  gear.image ||
                  gearImageMap[gear.name] ||
                  fallbackImages[0];

                const isAvailable =
                  gear.available !== false &&
                  gear.isAvailable !== false;

                return (
                  <article
                    key={gear.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={gearImage}
                        alt={gear.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />

                      <div
                        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${
                          isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isAvailable ? "Available" : "Unavailable"}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-2">
                        <h3 className="text-xl font-bold text-slate-950">
                          {gear.name}
                        </h3>
                      </div>

                      {gear.description && (
                        <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                          {gear.description}
                        </p>
                      )}

                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <span className="text-2xl font-black text-orange-500">
                            ৳{gear.pricePerDay}
                          </span>

                          <span className="text-sm text-slate-400">
                            /day
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            const token = localStorage.getItem("token");

                            if (!token) {
                              window.location.href = "/login";
                              return;
                            }

                            window.location.href = `/gear/${gear.id}`;
                          }}
                          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
                        >
                          View Gear
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loadingGears && !gearError && gears.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/gear"
                className="inline-flex rounded-full border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                View All Gears →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Simple process
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              How GearUp works
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Getting the equipment you need is simple. Find it, book it, and
              get moving.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold">{step.title}</h3>

                <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GearUp */}
      <section id="why-us" className="bg-slate-950 px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Why GearUp
            </p>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Train smarter.
              <br />
              Spend better.
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-slate-400">
              Whether you are starting your fitness journey or preparing for
              your next competition, GearUp helps you access quality equipment
              without the high upfront cost.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              [
                "01",
                "Quality Equipment",
                "Access reliable gear from verified providers.",
              ],
              [
                "02",
                "Flexible Rentals",
                "Choose rental dates that fit your schedule.",
              ],
              [
                "03",
                "Secure Payments",
                "Complete payments through a secure gateway.",
              ],
              [
                "04",
                "Trusted Community",
                "Read ratings and reviews before booking.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <span className="text-sm font-bold text-orange-500">
                  {number}
                </span>

                <h3 className="mt-5 text-lg font-bold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-orange-500 px-7 py-14 sm:px-12 lg:px-16">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-950">
                For providers
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Have fitness gear?
                <br />
                Turn it into income.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-orange-50">
                List your equipment on GearUp, connect with customers, and
                manage your rental business from one place.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-950 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950"
            >
              Become a Provider →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Link href="/" className="text-2xl font-black">
              Gear<span className="text-orange-500">Up</span>
            </Link>

            <p className="mt-2 text-sm text-slate-500">
              Your trusted fitness gear rental marketplace.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
            <Link href="/gear" className="hover:text-slate-950">
              Explore Gears
            </Link>

            {!user && (
              <>
                <Link href="/login" className="hover:text-slate-950">
                  Login
                </Link>

                <Link href="/register" className="hover:text-slate-950">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-100 pt-6 text-sm text-slate-400">
          © {new Date().getFullYear()} GearUp. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

