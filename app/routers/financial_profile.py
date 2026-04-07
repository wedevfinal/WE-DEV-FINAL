"""
Financial profile router - CRUD for user's financial details
"""
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, UserFinancial
from app.schemas import (
    FinancialProfileCreate,
    FinancialProfileResponse,
    FinancialProfileUpdate,
)
from app.services.achievements_service import check_achievements

router = APIRouter(prefix="/financial-profile", tags=["Financial Profile"])


@router.post("/", response_model=FinancialProfileResponse)
def create_financial_profile(
    payload: FinancialProfileCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    # if exists, return conflict
    existing = db.query(UserFinancial).filter(UserFinancial.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Financial profile already exists")

    obj = UserFinancial(
        user_id=current_user.id,
        monthly_income=payload.monthly_income,
        monthly_savings=payload.monthly_savings,
        investable_amount=payload.investable_amount,
        risk_goal=payload.risk_goal,
        age=payload.age,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)

    # Check for Saver achievement when profile created
    try:
        check_achievements(db, current_user.id, "balance_update")
    except Exception:
        pass

    return obj


@router.get("/", response_model=FinancialProfileResponse)
def get_financial_profile(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    obj = db.query(UserFinancial).filter(UserFinancial.user_id == current_user.id).first()
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial profile not found")
    return obj


@router.put("/", response_model=FinancialProfileResponse)
def update_financial_profile(
    payload: FinancialProfileUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    obj = db.query(UserFinancial).filter(UserFinancial.user_id == current_user.id).first()
    if not obj:
        # create new
        obj = UserFinancial(user_id=current_user.id)
        db.add(obj)

    if payload.monthly_income is not None:
        obj.monthly_income = payload.monthly_income
    if payload.monthly_savings is not None:
        obj.monthly_savings = payload.monthly_savings
    if payload.investable_amount is not None:
        obj.investable_amount = payload.investable_amount
    if payload.risk_goal is not None:
        obj.risk_goal = payload.risk_goal
    if payload.age is not None:
        obj.age = payload.age

    db.commit()
    db.refresh(obj)
    # Check for Saver achievement on updates
    try:
        check_achievements(db, current_user.id, "balance_update")
    except Exception:
        pass
    return obj
