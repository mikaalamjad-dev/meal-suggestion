from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.meal import Meal
from app.schemas.meal import MealDetail, MealListResponse

router = APIRouter(prefix="/api/v1/meals", tags=["meals"])


@router.get("", response_model=MealListResponse)
def list_meals(
    q: str | None = None,
    category: str | None = None,
    min_calories: float | None = None,
    max_calories: float | None = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    query = db.query(Meal)
    if q:
        query = query.filter(Meal.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(Meal.category == category)
    if min_calories is not None:
        query = query.filter(Meal.calories >= min_calories)
    if max_calories is not None:
        query = query.filter(Meal.calories <= max_calories)

    total = query.count()
    items = query.order_by(Meal.name).offset(offset).limit(limit).all()
    return MealListResponse(items=items, total=total, limit=limit, offset=offset)


@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db), _current_user=Depends(get_current_user)):
    rows = db.query(Meal.category).distinct().order_by(Meal.category).all()
    return [r[0] for r in rows]


@router.get("/{meal_id}", response_model=MealDetail)
def get_meal(meal_id: int, db: Session = Depends(get_db), _current_user=Depends(get_current_user)):
    meal = db.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    return MealDetail(
        id=meal.id,
        name=meal.name,
        category=meal.category,
        area=meal.area,
        thumbnail_url=meal.thumbnail_url,
        calories=meal.calories,
        instructions=meal.instructions,
        ingredients=[{"name": mi.ingredient.name, "measure": mi.measure} for mi in meal.ingredients],
        dietary_tags=[mdt.tag.slug for mdt in meal.dietary_tags],
    )
