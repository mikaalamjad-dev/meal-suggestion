"use client";

import { Sparkles } from "lucide-react";

import { MealCard } from "@/components/meals/MealCard";
import { MealCardSkeleton } from "@/components/meals/MealCardSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useSuggestions } from "@/hooks/useSuggestions";

export function SuggestionFeed() {
  const { data: suggestions, isLoading } = useSuggestions();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MealCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No suggestions yet"
        description="Add pantry ingredients or set up your profile to get personalised meal suggestions."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {suggestions.map(({ meal, score }) => (
        <div key={meal.id} className="relative">
          <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary-500/90 px-2 py-0.5 text-xs font-semibold text-white shadow">
            <Sparkles className="h-3 w-3" />
            {score}
          </span>
          <MealCard meal={meal} />
        </div>
      ))}
    </div>
  );
}
