"use client";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-gray-600">Something went wrong loading this page.</p>
      <button onClick={reset} className="rounded-[--radius] bg-[--color-primary] px-4 py-2 text-sm text-white">
        Try again
      </button>
    </div>
  );
}
