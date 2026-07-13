"use client";

import { Flame, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { MealDetail } from "@/lib/types";

export function MealDetailPanel({ meal }: { meal: MealDetail }) {
  const [saved, setSaved] = useState(false);

  async function saveFavourite() {
    await api.post(`/favourites/${meal.id}`);
    setSaved(true);
  }

  return (
    <article className="grid gap-6 md:grid-cols-2">
      <div className="relative h-64 w-full overflow-hidden rounded-card bg-slate-100 md:h-full">
        {meal.thumbnail_url && (
          <Image src={meal.thumbnail_url} alt={meal.name} fill sizes="50vw" className="object-cover" />
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-primary-500">{meal.name}</h1>
        <p className="text-sm text-slate-500">
          {meal.category}
          {meal.area ? ` · ${meal.area}` : ""}
        </p>
        {meal.calories != null && (
          <p className="mt-2 inline-flex items-center gap-1 font-medium text-accent-600">
            <Flame className="h-4 w-4" />
            {Math.round(meal.calories)} kcal
          </p>
        )}

        {meal.dietary_tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {meal.dietary_tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Card className="mt-5">
          <CardContent className="pt-4">
            <h2 className="mb-2 font-medium text-slate-900">Ingredients</h2>
            <ul className="grid grid-cols-1 gap-1.5 text-sm text-slate-600 sm:grid-cols-2">
              {meal.ingredients.map((ing) => (
                <li key={ing.name} className="flex justify-between gap-2 border-b border-slate-100 py-1 last:border-0">
                  <span>{ing.name}</span>
                  {ing.measure && <span className="text-slate-400">{ing.measure}</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Button onClick={saveFavourite} disabled={saved} variant={saved ? "outline" : "primary"} className="mt-5">
          <Heart className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
          {saved ? "Saved to favourites" : "Save to favourites"}
        </Button>
      </div>

      {meal.instructions && (
        <Card className="md:col-span-2">
          <CardContent className="pt-4">
            <h2 className="mb-2 font-medium text-slate-900">Instructions</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{meal.instructions}</p>
          </CardContent>
        </Card>
      )}
    </article>
  );
}
