"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Coffee, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuggestions } from "@/hooks/useSuggestions";
import { api } from "@/lib/api";
import { MealSummary } from "@/lib/types";

const MEAL_SLOTS = [
  { type: "breakfast", label: "Breakfast", icon: Coffee },
  { type: "lunch", label: "Lunch", icon: Sun },
  { type: "dinner", label: "Dinner", icon: Moon },
] as const;

interface MealPlanItem {
  meal_id: number;
  meal_type: string;
  meal: MealSummary;
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
  const { data: suggestions, isLoading: suggestionsLoading } = useSuggestions();

  const plan = plans?.[0];

  async function saveTarget(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/meal-plans", {
      date: today,
      target_calories: targetCalories === "" ? null : targetCalories,
      items: (plan?.items ?? []).map(({ meal_id, meal_type }) => ({ meal_id, meal_type })),
    });
    queryClient.invalidateQueries({ queryKey: ["meal-plans", today] });
  }

  async function assignMeal(mealType: string, mealId: number | null) {
    const items = (plan?.items ?? [])
      .filter((i) => i.meal_type !== mealType)
      .map(({ meal_id, meal_type }) => ({ meal_id, meal_type }));
    if (mealId !== null) {
      items.push({ meal_id: mealId, meal_type: mealType });
    }
    await api.post("/meal-plans", {
      date: today,
      target_calories: plan?.target_calories ?? null,
      items,
    });
    queryClient.invalidateQueries({ queryKey: ["meal-plans", today] });
  }

  return (
    <section>
      <PageHeader title="Daily Planner" description={new Date(today).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="target">Target calories for today</Label>
            <Input
              id="target"
              type="number"
              placeholder="e.g. 2000"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value ? Number(e.target.value) : "")}
            />
          </div>
          <Button onClick={saveTarget} variant="accent">
            Save target
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-card" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MEAL_SLOTS.map(({ type, label, icon: Icon }) => {
            const item = plan?.items.find((i) => i.meal_type === type);
            return (
              <Card key={type}>
                <CardContent className="pt-4">
                  <div className="mb-2 flex items-center gap-2 text-accent-600">
                    <Icon className="h-4 w-4" />
                    <h2 className="font-medium">{label}</h2>
                  </div>

                  {item ? (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.meal.name}</p>
                        {item.meal.calories != null && (
                          <p className="text-xs text-slate-500">{Math.round(item.meal.calories)} kcal</p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-accent-600 hover:underline"
                        onClick={() => assignMeal(type, null)}
                      >
                        Change
                      </button>
                    </div>
                  ) : suggestionsLoading ? (
                    <Skeleton className="h-10 rounded-lg" />
                  ) : (
                    <Select
                      defaultValue=""
                      onChange={(e) => e.target.value && assignMeal(type, Number(e.target.value))}
                    >
                      <option value="" disabled>
                        Pick a suggestion
                      </option>
                      {suggestions?.map(({ meal, score }) => (
                        <option key={meal.id} value={meal.id}>
                          {meal.name} ({score})
                        </option>
                      ))}
                    </Select>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
