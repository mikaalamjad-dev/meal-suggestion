import { Soup } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { MealSummary } from "@/lib/types";

import { MealCard } from "./MealCard";
import { MealCardSkeleton } from "./MealCardSkeleton";

export function MealGrid({ meals, loading }: { meals: MealSummary[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MealCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (meals.length === 0) {
    return <EmptyState icon={Soup} title="No meals found" description="Try a different search term or category." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
