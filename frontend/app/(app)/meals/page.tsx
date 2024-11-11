"use client";

import { useState } from "react";

import { MealGrid } from "@/components/meals/MealGrid";
import { useCategories, useMeals } from "@/hooks/useMeals";

export default function MealsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const { data: categories } = useCategories();
  const { data, isLoading } = useMeals({ q: q || undefined, category: category || undefined });

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-[--color-primary]">Browse Meals</h1>
      <div className="mb-4 flex gap-3">
        <input
          placeholder="Search meals..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-[--radius] border px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-[--radius] border px-3 py-2"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? <p className="text-sm text-gray-500">Loading...</p> : <MealGrid meals={data?.items ?? []} />}
    </section>
  );
}
