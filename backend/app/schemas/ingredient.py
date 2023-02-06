from pydantic import BaseModel


class AddPantryIngredientRequest(BaseModel):
    name: str


class PantryIngredientResponse(BaseModel):
    id: int
    name: str
    calories_per_100g: float | None

    class Config:
        from_attributes = True
