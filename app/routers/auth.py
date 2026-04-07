"""
Authentication routes for user registration and login.
"""

from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, Token, UserResponse
from app.auth import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    Args:
        user_data: User registration data
        db: Database session
        
    Returns:
        Newly created user
        
    Raises:
        HTTPException: If email already exists
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_password,
            phone=getattr(user_data, 'phone', None),
            dob=getattr(user_data, 'dob', None),
            age=getattr(user_data, 'age', None),
            is_student=getattr(user_data, 'is_student', False),
            monthly_income=getattr(user_data, 'monthly_income', None),
            monthly_savings=getattr(user_data, 'monthly_savings', None),
            investable_amount=getattr(user_data, 'investable_amount', None),
            risk_goal=getattr(user_data, 'risk_goal', None)
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return JWT token.
    
    Args:
        user_data: User login credentials
        db: Database session
        
    Returns:
        JWT token and user information
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }



@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Return the current authenticated user's information.
    """
    return current_user
