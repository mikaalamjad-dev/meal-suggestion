from pydantic import BaseModel

from app.schemas.meal import MealSummary


class MealSuggestion(BaseModel):
    meal: MealSummary
    score: int


class SuggestionListResponse(BaseModel):
    items: list[MealSuggestion]
    limit: int
    offset: int


class IngredientSuggestionRequest(BaseModel):
    ingredient_names: list[str]
