from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.favourite import UserIngredient
from app.models.meal import Ingredient
from app.models.user import User
from app.schemas.ingredient import AddPantryIngredientRequest, PantryIngredientResponse

router = APIRouter(prefix="/api/v1/ingredients", tags=["ingredients"])


@router.get("/mine", response_model=list[PantryIngredientResponse])
def list_my_ingredients(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    links = db.query(UserIngredient).filter(UserIngredient.user_id == current_user.id).all()
    return [link.ingredient for link in links]


@router.post("/mine", response_model=PantryIngredientResponse)
def add_my_ingredient(
    payload: AddPantryIngredientRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ingredient = db.query(Ingredient).filter(Ingredient.name.ilike(payload.name)).first()
    if ingredient is None:
        ingredient = Ingredient(name=payload.name)
        db.add(ingredient)
        db.flush()

    existing = (
        db.query(UserIngredient)
        .filter(UserIngredient.user_id == current_user.id, UserIngredient.ingredient_id == ingredient.id)
        .first()
    )
    if not existing:
        db.add(UserIngredient(user_id=current_user.id, ingredient_id=ingredient.id))
        db.commit()

    return ingredient


@router.delete("/mine/{ingredient_id}", status_code=204)
def remove_my_ingredient(
    ingredient_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    db.query(UserIngredient).filter(
        UserIngredient.user_id == current_user.id, UserIngredient.ingredient_id == ingredient_id
    ).delete()
    db.commit()
