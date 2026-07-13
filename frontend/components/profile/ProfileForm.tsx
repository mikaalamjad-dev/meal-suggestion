"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Flame, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
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

const STATS = [
  { key: "bmi", label: "BMI", icon: Activity, suffix: "" },
  { key: "bmr", label: "BMR", icon: Flame, suffix: "kcal" },
  { key: "tdee", label: "TDEE", icon: TrendingUp, suffix: "kcal" },
  { key: "daily_calorie_target", label: "Daily target", icon: Target, suffix: "kcal" },
] as const;

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
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      await api.put("/users/profile", {
        weight_kg: Number(form.weight_kg),
        height_cm: Number(form.height_cm),
        age: Number(form.age),
        gender: form.gender,
        activity_level: form.activity_level,
        goal: form.goal,
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="md:col-span-3">
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={form.weight_kg}
                  onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={form.height_cm}
                  onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="activity">Activity level</Label>
              <Select
                id="activity"
                value={form.activity_level}
                onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Select id="goal" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                {GOALS.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" disabled={saving} className="mt-2">
              {saving ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:col-span-2 md:grid-cols-1">
        {STATS.map(({ key, label, icon: Icon, suffix }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-3 pt-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="font-semibold text-slate-900">
                  {profile?.[key] ?? "—"} <span className="text-xs font-normal text-slate-400">{suffix}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
