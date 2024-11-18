"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "@/lib/api";

const MEAL_SLOTS = ["breakfast", "lunch", "dinner"] as const;

interface MealPlanItem {
  meal_id: number;
  meal_type: string;
}

interface MealPlan {
  id: number;
  date: string;
  target_calories: number | null;
  items: MealPlanItem[];
}

export default function PlannerPage() {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [targetCalories, setTargetCalories] = useState<number | "">("");

  const { data: plans, isLoading } = useQuery({
    queryKey: ["meal-plans", today],
    queryFn: async () => (await api.get<MealPlan[]>("/meal-plans", { params: { date: today } })).data,
  });

  const plan = plans?.[0];

  async function saveTarget(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/meal-plans", {
      date: today,
      target_calories: targetCalories === "" ? null : targetCalories,
      items: plan?.items ?? [],
    });
    queryClient.invalidateQueries({ queryKey: ["meal-plans", today] });
  }

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-[--color-primary]">Daily Planner</h1>
      <form onSubmit={saveTarget} className="mb-6 flex items-center gap-2">
        <input
          type="number"
          placeholder="Target calories"
          value={targetCalories}
          onChange={(e) => setTargetCalories(e.target.value ? Number(e.target.value) : "")}
          className="rounded-[--radius] border px-3 py-2"
        />
        <button type="submit" className="rounded-[--radius] bg-[--color-primary] px-3 py-2 text-sm text-white">
          Save target
        </button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MEAL_SLOTS.map((slot) => {
            const item = plan?.items.find((i) => i.meal_type === slot);
            return (
              <div key={slot} className="rounded-[--radius] border p-4">
                <h2 className="mb-2 capitalize text-[--color-accent]">{slot}</h2>
                <p className="text-sm text-gray-500">
                  {item ? `Meal #${item.meal_id}` : "No meal planned"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
