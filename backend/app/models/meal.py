from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(64), index=True)
    area: Mapped[str | None] = mapped_column(String(64), nullable=True)
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    calories: Mapped[float | None] = mapped_column(Float, nullable=True)

    ingredients: Mapped[list["MealIngredient"]] = relationship(back_populates="meal", cascade="all, delete-orphan")
    dietary_tags: Mapped[list["MealDietaryTag"]] = relationship(back_populates="meal", cascade="all, delete-orphan")


class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    calories_per_100g: Mapped[float | None] = mapped_column(Float, nullable=True)
    protein_g: Mapped[float | None] = mapped_column(Float, nullable=True)
    carbs_g: Mapped[float | None] = mapped_column(Float, nullable=True)
    fat_g: Mapped[float | None] = mapped_column(Float, nullable=True)


class MealIngredient(Base):
    __tablename__ = "meal_ingredients"

    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"), primary_key=True)
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredients.id"), primary_key=True)
    measure: Mapped[str | None] = mapped_column(String(128), nullable=True)

    meal: Mapped["Meal"] = relationship(back_populates="ingredients")
    ingredient: Mapped["Ingredient"] = relationship()


class DietaryTag(Base):
    __tablename__ = "dietary_tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(64))
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True)


class MealDietaryTag(Base):
    __tablename__ = "meal_dietary_tags"

    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("dietary_tags.id"), primary_key=True)

    meal: Mapped["Meal"] = relationship(back_populates="dietary_tags")
    tag: Mapped["DietaryTag"] = relationship()
