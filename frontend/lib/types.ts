export interface MealSummary {
  id: number;
  name: string;
  category: string;
  area: string | null;
  thumbnail_url: string | null;
  calories: number | null;
}

export interface MealDetail extends MealSummary {
  instructions: string | null;
  ingredients: { name: string; measure: string | null }[];
  dietary_tags: string[];
}

export interface MealSuggestion {
  meal: MealSummary;
  score: number;
}
