"use client";

import { useQuery } from "@tanstack/react-query";

import { MealGrid } from "@/components/meals/MealGrid";
import { api } from "@/lib/api";
import { MealSummary } from "@/lib/types";

export default function FavouritesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["favourites"],
    queryFn: async () => (await api.get<MealSummary[]>("/favourites")).data,
  });

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-[--color-primary]">Saved Meals</h1>
      {isLoading ? <p className="text-sm text-gray-500">Loading...</p> : <MealGrid meals={data ?? []} />}
    </section>
  );
}
