from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.meal import MealSummary
from app.schemas.suggestion import IngredientSuggestionRequest, MealSuggestion, SuggestionListResponse
from app.services.suggestion_engine import get_ranked_suggestions, suggest_by_ingredients

router = APIRouter(prefix="/api/v1/suggestions", tags=["suggestions"])


@router.get("", response_model=SuggestionListResponse)
def get_suggestions(
    dietary_tags: str | None = Query(None, description="Comma-separated dietary tag slugs"),
    allergens: str | None = Query(None, description="Comma-separated allergen ingredient names"),
    limit: int = Query(20, le=100),
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    preferred_tags = set(dietary_tags.split(",")) if dietary_tags else set()
    allergen_names = set(allergens.split(",")) if allergens else set()

    ranked, total = get_ranked_suggestions(
        db, current_user.id, preferred_tags, allergen_names, limit=limit, offset=offset
    )
    items = [MealSuggestion(meal=meal, score=score) for meal, score in ranked]
    return SuggestionListResponse(items=items, limit=limit, offset=offset)


@router.post("/by-ingredients", response_model=list[MealSummary])
def suggestions_by_ingredients(
    payload: IngredientSuggestionRequest,
    _current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return suggest_by_ingredients(db, payload.ingredient_names)
