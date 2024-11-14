"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "@/lib/api";

interface PantryIngredient {
  id: number;
  name: string;
  calories_per_100g: number | null;
}

export default function PantryPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["pantry"],
    queryFn: async () => (await api.get<PantryIngredient[]>("/ingredients/mine")).data,
  });

  async function addIngredient(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/ingredients/mine", { name });
    setName("");
    queryClient.invalidateQueries({ queryKey: ["pantry"] });
  }

  async function removeIngredient(id: number) {
    await api.delete(`/ingredients/mine/${id}`);
    queryClient.invalidateQueries({ queryKey: ["pantry"] });
  }

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-[--color-primary]">My Pantry</h1>
      <form onSubmit={addIngredient} className="mb-4 flex gap-2">
        <input
          placeholder="Add an ingredient..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-[--radius] border px-3 py-2"
        />
        <button type="submit" className="rounded-[--radius] bg-[--color-primary] px-3 py-2 text-sm text-white">
          Add
        </button>
      </form>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {data?.map((ingredient) => (
            <li
              key={ingredient.id}
              className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
            >
              {ingredient.name}
              <button onClick={() => removeIngredient(ingredient.id)} className="text-gray-400 hover:text-red-500">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
