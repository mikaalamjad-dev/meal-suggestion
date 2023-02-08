from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.user import User, UserProfile
from app.schemas.user import ProfileResponse, ProfileUpsertRequest
from app.services.nutrition import calculate_bmi, calculate_bmr, calculate_calorie_target, calculate_tdee

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        return ProfileResponse(
            weight_kg=0, height_cm=0, age=0, gender="", activity_level="", goal="",
            bmi=None, bmr=None, tdee=None, daily_calorie_target=None,
        )
    return profile


@router.put("/profile", response_model=ProfileResponse)
def upsert_profile(
    payload: ProfileUpsertRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile is None:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    profile.weight_kg = payload.weight_kg
    profile.height_cm = payload.height_cm
    profile.age = payload.age
    profile.gender = payload.gender
    profile.activity_level = payload.activity_level
    profile.goal = payload.goal

    profile.bmi = calculate_bmi(payload.weight_kg, payload.height_cm)
    profile.bmr = calculate_bmr(payload.weight_kg, payload.height_cm, payload.age, payload.gender)
    profile.tdee = calculate_tdee(profile.bmr, payload.activity_level)
    profile.daily_calorie_target = calculate_calorie_target(profile.tdee, payload.goal)

    db.commit()
    db.refresh(profile)
    return profile
