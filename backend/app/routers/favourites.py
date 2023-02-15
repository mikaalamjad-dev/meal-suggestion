from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.favourite import UserFavourite
from app.models.meal import Meal
from app.models.user import User
from app.schemas.meal import MealSummary

router = APIRouter(prefix="/api/v1/favourites", tags=["favourites"])


@router.get("", response_model=list[MealSummary])
def list_favourites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    favourites = db.query(UserFavourite).filter(UserFavourite.user_id == current_user.id).all()
    return [f.meal for f in favourites]


@router.post("/{meal_id}", status_code=204)
def add_favourite(meal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not db.get(Meal, meal_id):
        raise HTTPException(status_code=404, detail="Meal not found")

    existing = (
        db.query(UserFavourite)
        .filter(UserFavourite.user_id == current_user.id, UserFavourite.meal_id == meal_id)
        .first()
    )
    if not existing:
        db.add(UserFavourite(user_id=current_user.id, meal_id=meal_id))
        db.commit()


@router.delete("/{meal_id}", status_code=204)
def remove_favourite(meal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(UserFavourite).filter(
        UserFavourite.user_id == current_user.id, UserFavourite.meal_id == meal_id
    ).delete()
    db.commit()
