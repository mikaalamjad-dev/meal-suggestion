from datetime import date

from sqlalchemy import Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    date: Mapped[date] = mapped_column(Date)
    target_calories: Mapped[float | None] = mapped_column(Float, nullable=True)

    items: Mapped[list["MealPlanItem"]] = relationship(back_populates="plan", cascade="all, delete-orphan")


class MealPlanItem(Base):
    __tablename__ = "meal_plan_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("meal_plans.id"))
    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"))
    meal_type: Mapped[str] = mapped_column(String(16))  # breakfast / lunch / dinner

    plan: Mapped["MealPlan"] = relationship(back_populates="items")
    meal: Mapped["Meal"] = relationship()
