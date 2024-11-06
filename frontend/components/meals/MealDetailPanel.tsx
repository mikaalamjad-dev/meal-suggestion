"use client";

import Image from "next/image";

import { api } from "@/lib/api";
import { MealDetail } from "@/lib/types";

export function MealDetailPanel({ meal }: { meal: MealDetail }) {
  async function saveFavourite() {
    await api.post(`/favourites/${meal.id}`);
  }

  return (
    <article className="grid gap-6 md:grid-cols-2">
      {meal.thumbnail_url && (
        <Image
          src={meal.thumbnail_url}
          alt={meal.name}
          width={480}
          height={320}
          className="w-full rounded-[--radius] object-cover"
        />
      )}
      <div>
        <h1 className="text-2xl font-semibold text-[--color-primary]">{meal.name}</h1>
        <p className="text-sm text-gray-500">
          {meal.category}
          {meal.area ? ` · ${meal.area}` : ""}
        </p>
        {meal.calories != null && (
          <p className="mt-1 text-[--color-accent]">{Math.round(meal.calories)} kcal</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {meal.dietary_tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[--color-accent]/10 px-2 py-1 text-xs text-[--color-accent]">
              {tag}
            </span>
          ))}
        </div>

        <h2 className="mt-4 font-medium">Ingredients</h2>
        <ul className="list-inside list-disc text-sm">
          {meal.ingredients.map((ing) => (
            <li key={ing.name}>
              {ing.name}
              {ing.measure ? ` — ${ing.measure}` : ""}
            </li>
          ))}
        </ul>

        <button
          onClick={saveFavourite}
          className="mt-4 rounded-[--radius] bg-[--color-primary] px-4 py-2 text-sm text-white"
        >
          Save to favourites
        </button>
      </div>

      {meal.instructions && (
        <p className="whitespace-pre-line md:col-span-2">{meal.instructions}</p>
      )}
    </article>
  );
}
