"use client";

import { useParams } from "next/navigation";

import { MealDetailPanel } from "@/components/meals/MealDetailPanel";
import { useMeal } from "@/hooks/useMeals";

export default function MealDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: meal, isLoading } = useMeal(Number(params.id));

  if (isLoading || !meal) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return <MealDetailPanel meal={meal} />;
}
