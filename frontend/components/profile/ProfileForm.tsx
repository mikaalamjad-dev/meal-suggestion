"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";

interface Profile {
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
  bmi: number | null;
  bmr: number | null;
  tdee: number | null;
  daily_calorie_target: number | null;
}

const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "active", "very_active"];
const GOALS = ["lose", "maintain", "gain"];

export function ProfileForm() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await api.get<Profile>("/users/profile")).data,
  });

  const [form, setForm] = useState({
    weight_kg: "",
    height_cm: "",
    age: "",
    gender: "female",
    activity_level: "moderate",
    goal: "maintain",
  });

  useEffect(() => {
    if (profile && profile.weight_kg) {
      setForm({
        weight_kg: String(profile.weight_kg),
        height_cm: String(profile.height_cm),
        age: String(profile.age),
        gender: profile.gender,
        activity_level: profile.activity_level,
        goal: profile.goal,
      });
    }
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.put("/users/profile", {
      weight_kg: Number(form.weight_kg),
      height_cm: Number(form.height_cm),
      age: Number(form.age),
      gender: form.gender,
      activity_level: form.activity_level,
      goal: form.goal,
    });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm">
          Weight (kg)
          <input
            type="number"
            value={form.weight_kg}
            onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
            className="mt-1 w-full rounded-[--radius] border px-3 py-2"
            required
          />
        </label>
        <label className="text-sm">
          Height (cm)
          <input
            type="number"
            value={form.height_cm}
            onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
            className="mt-1 w-full rounded-[--radius] border px-3 py-2"
            required
          />
        </label>
        <label className="text-sm">
          Age
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="mt-1 w-full rounded-[--radius] border px-3 py-2"
            required
          />
        </label>
        <label className="text-sm">
          Gender
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="mt-1 w-full rounded-[--radius] border px-3 py-2"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>
        <label className="text-sm">
          Activity level
          <select
            value={form.activity_level}
            onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
            className="mt-1 w-full rounded-[--radius] border px-3 py-2"
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Goal
          <select
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            className="mt-1 w-full rounded-[--radius] border px-3 py-2"
          >
            {GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-[--radius] bg-[--color-primary] px-3 py-2 text-sm text-white">
          Save profile
        </button>
      </form>

      <div className="rounded-[--radius] border p-4">
        <h2 className="mb-3 font-medium text-[--color-primary]">Your numbers</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>BMI</dt>
            <dd>{profile?.bmi ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt>BMR</dt>
            <dd>{profile?.bmr ?? "—"} kcal</dd>
          </div>
          <div className="flex justify-between">
            <dt>TDEE</dt>
            <dd>{profile?.tdee ?? "—"} kcal</dd>
          </div>
          <div className="flex justify-between font-medium text-[--color-accent]">
            <dt>Daily calorie target</dt>
            <dd>{profile?.daily_calorie_target ?? "—"} kcal</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
