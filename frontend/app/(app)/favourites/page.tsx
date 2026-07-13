"use client";

import { useQuery } from "@tanstack/react-query";

import { MealGrid } from "@/components/meals/MealGrid";
import { PageHeader } from "@/components/ui/page-header";
import { api } from "@/lib/api";
import { MealSummary } from "@/lib/types";

export default function FavouritesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["favourites"],
    queryFn: async () => (await api.get<MealSummary[]>("/favourites")).data,
  });

  return (
    <section>
      <PageHeader title="Saved Meals" description="Meals you've bookmarked for later." />
      <MealGrid meals={data ?? []} loading={isLoading} />
    </section>
  );
}
