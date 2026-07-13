"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { MealGrid } from "@/components/meals/MealGrid";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { useCategories, useMeals } from "@/hooks/useMeals";

export default function MealsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const { data: categories } = useCategories();
  const { data, isLoading } = useMeals({ q: q || undefined, category: category || undefined });

  return (
    <section>
      <PageHeader title="Browse Meals" description="Search the full meal catalogue by name or category." />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search meals..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
          />
        </div>
        <div className="sm:w-56">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <MealGrid meals={data?.items ?? []} loading={isLoading} />
    </section>
  );
}
