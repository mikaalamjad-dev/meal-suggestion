"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Carrot, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
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
      <PageHeader title="My Pantry" description="Ingredients you have at home — used to boost matching suggestions." />
      <form onSubmit={addIngredient} className="mb-6 flex gap-2">
        <Input placeholder="Add an ingredient..." value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Carrot} title="Your pantry is empty" description="Add ingredients you have on hand to get better suggestions." />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {data.map((ingredient) => (
            <li key={ingredient.id}>
              <Badge variant="accent" className="gap-1.5 py-1.5 pl-3 pr-1.5 text-sm">
                {ingredient.name}
                <button
                  onClick={() => removeIngredient(ingredient.id)}
                  className="rounded-full p-0.5 text-accent-600/60 hover:bg-accent-500/20 hover:text-accent-600"
                  aria-label={`Remove ${ingredient.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
