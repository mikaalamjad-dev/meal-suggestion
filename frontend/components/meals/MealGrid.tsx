import { MealSummary } from "@/lib/types";

import { MealCard } from "./MealCard";

export function MealGrid({ meals }: { meals: MealSummary[] }) {
  if (meals.length === 0) {
    return <p className="text-sm text-gray-500">No meals found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
