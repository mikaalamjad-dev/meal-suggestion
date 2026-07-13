import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { MealSummary } from "@/lib/types";

export function MealCard({ meal }: { meal: MealSummary }) {
  return (
    <Link href={`/meals/${meal.id}`} className="group block">
      <Card className="overflow-hidden hover:shadow-card-hover">
        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
          {meal.thumbnail_url && (
            <Image
              src={meal.thumbnail_url}
              alt={meal.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate font-medium text-slate-900">{meal.name}</h3>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {meal.category}
            {meal.area ? ` · ${meal.area}` : ""}
          </p>
          {meal.calories != null && (
            <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-600">
              <Flame className="h-3.5 w-3.5" />
              {Math.round(meal.calories)} kcal
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
