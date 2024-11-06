import Image from "next/image";
import Link from "next/link";

import { MealSummary } from "@/lib/types";

export function MealCard({ meal }: { meal: MealSummary }) {
  return (
    <Link
      href={`/meals/${meal.id}`}
      className="block overflow-hidden rounded-[--radius] border transition hover:shadow-md"
    >
      {meal.thumbnail_url && (
        <Image
          src={meal.thumbnail_url}
          alt={meal.name}
          width={320}
          height={200}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="p-3">
        <h3 className="font-medium">{meal.name}</h3>
        <p className="text-sm text-gray-500">
          {meal.category}
          {meal.area ? ` · ${meal.area}` : ""}
        </p>
        {meal.calories != null && (
          <p className="text-sm text-[--color-accent]">{Math.round(meal.calories)} kcal</p>
        )}
      </div>
    </Link>
  );
}
