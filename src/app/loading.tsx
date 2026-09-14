export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="mt-4 text-lg font-semibold text-gray-700">
          Loading GearUp...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Please wait a moment.
        </p>
      </div>
    </main>
  );
}
