"use client";

import { useParams } from "next/navigation";

import { MealDetailPanel } from "@/components/meals/MealDetailPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { useMeal } from "@/hooks/useMeals";

export default function MealDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: meal, isLoading } = useMeal(Number(params.id));

  if (isLoading || !meal) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-card" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return <MealDetailPanel meal={meal} />;
}
