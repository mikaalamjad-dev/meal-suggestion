from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.meal import Ingredient, Meal, MealIngredient
from app.services.openfoodfacts_client import search_product_nutrition
from app.services.themealdb_client import (
    fetch_categories,
    fetch_meal_detail,
    fetch_meal_ids_by_category,
    parse_ingredients,
)
from app.workers.celery_app import celery_app


def upsert_meal(db: Session, meal_json: dict) -> Meal:
    meal = db.query(Meal).filter(Meal.external_id == meal_json["idMeal"]).first()
    if meal is None:
        meal = Meal(external_id=meal_json["idMeal"])
        db.add(meal)

    meal.name = meal_json.get("strMeal", "")
    meal.category = meal_json.get("strCategory", "")
    meal.area = meal_json.get("strArea")
    meal.instructions = meal_json.get("strInstructions")
    meal.thumbnail_url = meal_json.get("strMealThumb")
    db.flush()

    existing_ingredient_ids = {
        row.ingredient_id
        for row in db.query(MealIngredient.ingredient_id).filter(MealIngredient.meal_id == meal.id)
    }
    seen_ingredient_ids = set(existing_ingredient_ids)

    for name, measure in parse_ingredients(meal_json):
        ingredient = db.query(Ingredient).filter(Ingredient.name == name).first()
        if ingredient is None:
            ingredient = Ingredient(name=name)
            db.add(ingredient)
            db.flush()

        # TheMealDB sometimes lists the same ingredient twice for one meal
        # (e.g. once as a main ingredient, again as a garnish) — skip repeats.
        if ingredient.id in seen_ingredient_ids:
            continue
        seen_ingredient_ids.add(ingredient.id)

        db.add(MealIngredient(meal_id=meal.id, ingredient_id=ingredient.id, measure=measure))

    return meal


def enrich_ingredient_nutrition(db: Session, ingredient: Ingredient) -> None:
    if ingredient.calories_per_100g is not None:
        return  # already enriched

    nutrition = search_product_nutrition(ingredient.name)
    if not nutrition:
        return

    ingredient.calories_per_100g = nutrition["calories_per_100g"]
    ingredient.protein_g = nutrition["protein_g"]
    ingredient.carbs_g = nutrition["carbs_g"]
    ingredient.fat_g = nutrition["fat_g"]


@celery_app.task
def ingest_meals_task() -> None:
    db = SessionLocal()
    try:
        for category in fetch_categories():
            for meal_id in fetch_meal_ids_by_category(category):
                meal_json = fetch_meal_detail(meal_id)
                if meal_json:
                    upsert_meal(db, meal_json)
            db.commit()

        for ingredient in db.query(Ingredient).all():
            enrich_ingredient_nutrition(db, ingredient)
        db.commit()
    finally:
        db.close()
