"""
User profile endpoints: get and update authenticated user's profile.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import AchievementResponse
from app.schemas import AchievementResponse

from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    monthly_income: float | None = None
    monthly_savings: float | None = None
    investable_amount: float | None = None
    risk_goal: str | None = None
    age: int | None = None


class ProfileResponse(BaseModel):
    monthly_income: float | None = None
    monthly_savings: float | None = None
    investable_amount: float | None = None
    risk_goal: str | None = None
    age: int | None = None


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/", response_model=ProfileResponse)
def get_profile(current_user: Annotated[User, Depends(get_current_user)]):
    return ProfileResponse(
        monthly_income=current_user.monthly_income,
        monthly_savings=current_user.monthly_savings,
        investable_amount=current_user.investable_amount,
        risk_goal=current_user.risk_goal,
        age=getattr(current_user, 'age', None),
    )


@router.put("/", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    try:
        user = db.query(User).filter(User.id == current_user.id).first()
        if payload.monthly_income is not None:
            user.monthly_income = payload.monthly_income
        if payload.monthly_savings is not None:
            user.monthly_savings = payload.monthly_savings
        if payload.investable_amount is not None:
            user.investable_amount = payload.investable_amount
        if payload.risk_goal is not None:
            user.risk_goal = payload.risk_goal

        db.add(user)
        db.commit()
        db.refresh(user)

        return ProfileResponse(
            monthly_income=user.monthly_income,
            monthly_savings=user.monthly_savings,
            investable_amount=user.investable_amount,
            risk_goal=user.risk_goal,
            age=getattr(user, 'age', None),
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
