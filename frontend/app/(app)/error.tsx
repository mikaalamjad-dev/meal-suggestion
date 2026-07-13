"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="font-medium text-slate-900">Something went wrong loading this page.</p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
