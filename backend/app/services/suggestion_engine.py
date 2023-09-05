from sqlalchemy.orm import Session

from app.models.favourite import UserFavourite, UserIngredient
from app.models.meal import Meal
from app.models.user import UserProfile

BASE_SCORE = 100
PANTRY_MATCH_BONUS = 30
CALORIE_MATCH_BONUS = 20
DIETARY_TAG_BONUS = 15
CATEGORY_HISTORY_BONUS = 10
ALLERGEN_PENALTY = -20

CALORIE_TOLERANCE = 0.15


def _pantry_ingredient_names(db: Session, user_id: int) -> set[str]:
    links = db.query(UserIngredient).filter(UserIngredient.user_id == user_id).all()
    return {link.ingredient.name.lower() for link in links}


def _favourite_categories(db: Session, user_id: int) -> set[str]:
    favourites = db.query(UserFavourite).filter(UserFavourite.user_id == user_id).all()
    return {f.meal.category for f in favourites}


def score_meal(
    meal: Meal,
    pantry_names: set[str],
    favourite_categories: set[str],
    per_meal_calorie_target: float | None,
    preferred_tag_slugs: set[str],
    allergen_names: set[str],
) -> int:
    score = BASE_SCORE

    meal_ingredient_names = {mi.ingredient.name.lower() for mi in meal.ingredients}

    if meal_ingredient_names and meal_ingredient_names.issubset(pantry_names):
        score += PANTRY_MATCH_BONUS

    if per_meal_calorie_target and meal.calories:
        lower = per_meal_calorie_target * (1 - CALORIE_TOLERANCE)
        upper = per_meal_calorie_target * (1 + CALORIE_TOLERANCE)
        if lower <= meal.calories <= upper:
            score += CALORIE_MATCH_BONUS

    meal_tag_slugs = {mdt.tag.slug for mdt in meal.dietary_tags}
    score += DIETARY_TAG_BONUS * len(meal_tag_slugs & preferred_tag_slugs)

    if meal.category in favourite_categories:
        score += CATEGORY_HISTORY_BONUS

    if meal_ingredient_names & allergen_names:
        score += ALLERGEN_PENALTY

    return score


def get_ranked_suggestions(
    db: Session,
    user_id: int,
    preferred_tag_slugs: set[str] | None = None,
    allergen_names: set[str] | None = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[tuple[Meal, int]], int]:
    preferred_tag_slugs = preferred_tag_slugs or set()
    allergen_names = {a.lower() for a in (allergen_names or set())}

    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    per_meal_calorie_target = (profile.daily_calorie_target / 3) if profile and profile.daily_calorie_target else None

    pantry_names = _pantry_ingredient_names(db, user_id)
    favourite_categories = _favourite_categories(db, user_id)

    meals = db.query(Meal).all()
    scored = [
        (meal, score_meal(meal, pantry_names, favourite_categories, per_meal_calorie_target, preferred_tag_slugs, allergen_names))
        for meal in meals
    ]
    scored.sort(key=lambda pair: pair[1], reverse=True)

    total = len(scored)
    return scored[offset : offset + limit], total


def suggest_by_ingredients(db: Session, ingredient_names: list[str], limit: int = 20) -> list[Meal]:
    wanted = {name.lower() for name in ingredient_names}
    meals = db.query(Meal).all()

    def match_count(meal: Meal) -> int:
        meal_names = {mi.ingredient.name.lower() for mi in meal.ingredients}
        return len(meal_names & wanted)

    ranked = sorted((m for m in meals if match_count(m) > 0), key=match_count, reverse=True)
    return ranked[:limit]
