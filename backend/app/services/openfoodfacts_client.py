import time

import httpx

from app.config import settings

USER_AGENT = "NutriSuggest/1.0 (https://github.com/nutrisuggest; contact@nutrisuggest.example)"

_client = httpx.Client(headers={"User-Agent": USER_AGENT}, timeout=10)


def search_product_nutrition(ingredient_name: str, max_retries: int = 3) -> dict | None:
    """Look up a single product by name and return calories/macros per 100g, if found."""
    url = f"{settings.openfoodfacts_base_url}/search"
    params = {"fields": "product_name,nutriments", "q": ingredient_name, "page_size": 1}

    for attempt in range(max_retries):
        try:
            resp = _client.get(url, params=params)
        except httpx.RequestError:
            time.sleep(1 + attempt)
            continue

        if resp.status_code == 503:
            time.sleep(2 * (attempt + 1))
            continue
        if resp.status_code != 200:
            return None

        hits = resp.json().get("hits") or []
        if not hits:
            return None

        nutriments = hits[0].get("nutriments") or {}
        return {
            "calories_per_100g": nutriments.get("energy-kcal_100g"),
            "protein_g": nutriments.get("proteins_100g"),
            "carbs_g": nutriments.get("carbohydrates_100g"),
            "fat_g": nutriments.get("fat_100g"),
        }

    return None
