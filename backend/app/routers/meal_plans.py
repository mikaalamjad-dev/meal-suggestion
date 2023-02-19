from datetime import date as date_type

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.meal_plan import MealPlan, MealPlanItem
from app.models.user import User
from app.schemas.meal_plan import MealPlanCreateRequest, MealPlanResponse

router = APIRouter(prefix="/api/v1/meal-plans", tags=["meal-plans"])


@router.get("", response_model=list[MealPlanResponse])
def list_meal_plans(
    date: date_type | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(MealPlan).filter(MealPlan.user_id == current_user.id)
    if date:
        query = query.filter(MealPlan.date == date)
    return query.order_by(MealPlan.date.desc()).all()


@router.post("", response_model=MealPlanResponse)
def create_meal_plan(
    payload: MealPlanCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = (
        db.query(MealPlan)
        .filter(MealPlan.user_id == current_user.id, MealPlan.date == payload.date)
        .first()
    )
    if plan is None:
        plan = MealPlan(user_id=current_user.id, date=payload.date)
        db.add(plan)
    plan.target_calories = payload.target_calories

    db.query(MealPlanItem).filter(MealPlanItem.plan_id == plan.id).delete()
    db.flush()

    for item in payload.items:
        db.add(MealPlanItem(plan_id=plan.id, meal_id=item.meal_id, meal_type=item.meal_type))

    db.commit()
    db.refresh(plan)
    return plan
