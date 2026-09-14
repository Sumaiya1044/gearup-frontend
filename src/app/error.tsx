"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <div className="text-5xl">⚠️</div>

        <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          We could not load this page. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
