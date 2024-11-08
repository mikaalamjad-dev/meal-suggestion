"use client";

import { MealCard } from "@/components/meals/MealCard";
import { useSuggestions } from "@/hooks/useSuggestions";

export function SuggestionFeed() {
  const { data: suggestions, isLoading } = useSuggestions();

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading suggestions...</p>;
  }

  if (!suggestions || suggestions.length === 0) {
    return <p className="text-sm text-gray-500">No suggestions yet — add pantry ingredients or set your profile.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {suggestions.map(({ meal, score }) => (
        <div key={meal.id} className="relative">
          <span className="absolute right-2 top-2 z-10 rounded-full bg-[--color-primary] px-2 py-0.5 text-xs text-white">
            {score}
          </span>
          <MealCard meal={meal} />
        </div>
      ))}
    </div>
  );
}
