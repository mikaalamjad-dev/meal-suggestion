import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { MealDetail, MealSummary } from "@/lib/types";

export function useMeals(params: { q?: string; category?: string } = {}) {
  return useQuery({
    queryKey: ["meals", params],
    queryFn: async () => {
      const res = await api.get<{ items: MealSummary[]; total: number }>("/meals", { params });
      return res.data;
    },
  });
}

export function useMeal(id: number) {
  return useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await api.get<MealDetail>(`/meals/${id}`);
      return res.data;
    },
    enabled: Number.isFinite(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["meal-categories"],
    queryFn: async () => {
      const res = await api.get<string[]>("/meals/categories");
      return res.data;
    },
  });
}
