from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserFavourite(Base):
    __tablename__ = "user_favourites"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"), primary_key=True)
    saved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    meal: Mapped["Meal"] = relationship()


class UserIngredient(Base):
    __tablename__ = "user_ingredients"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredients.id"), primary_key=True)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    ingredient: Mapped["Ingredient"] = relationship()
