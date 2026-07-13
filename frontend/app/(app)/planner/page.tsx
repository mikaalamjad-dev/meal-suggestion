"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Coffee, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

const MEAL_SLOTS = [
  { type: "breakfast", label: "Breakfast", icon: Coffee },
  { type: "lunch", label: "Lunch", icon: Sun },
  { type: "dinner", label: "Dinner", icon: Moon },
] as const;

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
                  <p className="text-sm text-slate-500">{item ? `Meal #${item.meal_id}` : "No meal planned"}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
