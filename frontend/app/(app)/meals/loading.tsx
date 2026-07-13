import { MealCardSkeleton } from "@/components/meals/MealCardSkeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <MealCardSkeleton key={i} />
      ))}
    </div>
  );
}
