import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { MealSuggestion } from "@/lib/types";

export function useSuggestions() {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const res = await api.get<{ items: MealSuggestion[] }>("/suggestions");
      return res.data.items;
    },
  });
}
