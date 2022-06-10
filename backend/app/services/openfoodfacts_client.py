import httpx

from app.config import settings


def search_product_nutrition(ingredient_name: str) -> dict | None:
    """Look up a single product by name and return calories/macros per 100g, if found."""
    resp = httpx.get(
        f"{settings.openfoodfacts_base_url}/search",
        params={"fields": "product_name,nutriments", "q": ingredient_name, "page_size": 1},
        timeout=10,
    )
    if resp.status_code != 200:
        return None

    products = resp.json().get("products") or []
    if not products:
        return None

    nutriments = products[0].get("nutriments") or {}
    return {
        "calories_per_100g": nutriments.get("energy-kcal_100g"),
        "protein_g": nutriments.get("proteins_100g"),
        "carbs_g": nutriments.get("carbohydrates_100g"),
        "fat_g": nutriments.get("fat_100g"),
    }
