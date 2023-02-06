from pydantic import BaseModel, Field


class ProfileUpsertRequest(BaseModel):
    weight_kg: float = Field(gt=0)
    height_cm: float = Field(gt=0)
    age: int = Field(gt=0)
    gender: str
    activity_level: str
    goal: str


class ProfileResponse(BaseModel):
    weight_kg: float
    height_cm: float
    age: int
    gender: str
    activity_level: str
    goal: str
    bmi: float | None
    bmr: float | None
    tdee: float | None
    daily_calorie_target: float | None

    class Config:
        from_attributes = True
