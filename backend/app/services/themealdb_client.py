import httpx

from app.config import settings


def fetch_categories() -> list[str]:
    resp = httpx.get(f"{settings.themealdb_base_url}/categories.php", timeout=10)
    resp.raise_for_status()
    categories = resp.json().get("categories") or []
    return [c["strCategory"] for c in categories]


def fetch_meal_ids_by_category(category: str) -> list[str]:
    resp = httpx.get(f"{settings.themealdb_base_url}/filter.php", params={"c": category}, timeout=10)
    resp.raise_for_status()
    meals = resp.json().get("meals") or []
    return [m["idMeal"] for m in meals]


def fetch_meal_detail(meal_id: str) -> dict | None:
    resp = httpx.get(f"{settings.themealdb_base_url}/lookup.php", params={"i": meal_id}, timeout=10)
    resp.raise_for_status()
    meals = resp.json().get("meals") or []
    return meals[0] if meals else None


def parse_ingredients(meal_json: dict) -> list[tuple[str, str | None]]:
    """Return list of (ingredient_name, measure) parsed from TheMealDB's flat strIngredientN fields."""
    ingredients = []
    for i in range(1, 21):
        name = (meal_json.get(f"strIngredient{i}") or "").strip()
        measure = (meal_json.get(f"strMeasure{i}") or "").strip()
        if name:
            ingredients.append((name, measure or None))
    return ingredients
