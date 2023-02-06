from pydantic import BaseModel


class IngredientLine(BaseModel):
    name: str
    measure: str | None

    class Config:
        from_attributes = True


class MealSummary(BaseModel):
    id: int
    name: str
    category: str
    area: str | None
    thumbnail_url: str | None
    calories: float | None

    class Config:
        from_attributes = True


class MealDetail(MealSummary):
    instructions: str | None
    ingredients: list[IngredientLine]
    dietary_tags: list[str]


class MealListResponse(BaseModel):
    items: list[MealSummary]
    total: int
    limit: int
    offset: int
