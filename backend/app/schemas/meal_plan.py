from datetime import date

from pydantic import BaseModel


class MealPlanItemRequest(BaseModel):
    meal_id: int
    meal_type: str  # breakfast / lunch / dinner


class MealPlanCreateRequest(BaseModel):
    date: date
    target_calories: float | None = None
    items: list[MealPlanItemRequest] = []


class MealPlanItemResponse(BaseModel):
    meal_id: int
    meal_type: str

    class Config:
        from_attributes = True


class MealPlanResponse(BaseModel):
    id: int
    date: date
    target_calories: float | None
    items: list[MealPlanItemResponse]

    class Config:
        from_attributes = True
