"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


# ========================
# User Schemas
# ========================

class UserBase(BaseModel):
    """Base user schema."""
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=5)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: str = Field(..., min_length=5)
    password: str


class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ========================
# Token Schemas
# ========================

class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Schema for JWT token data."""
    email: Optional[str] = None


# ========================
# Portfolio Schemas
# ========================

class PortfolioBase(BaseModel):
    """Base portfolio schema."""
    asset_name: str = Field(..., min_length=1, max_length=100)
    asset_type: str = Field(..., min_length=1, max_length=50)
    quantity: float = Field(..., gt=0)
    buy_price: float = Field(..., gt=0)
    current_price: float = Field(..., gt=0)


class PortfolioCreate(PortfolioBase):
    """Schema for creating a new portfolio entry."""
    pass


class PortfolioUpdate(BaseModel):
    """Schema for updating a portfolio entry."""
    current_price: Optional[float] = Field(None, gt=0)
    quantity: Optional[float] = Field(None, gt=0)


class PortfolioResponse(PortfolioBase):
    """Schema for portfolio response."""
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PortfolioSummary(BaseModel):
    """Schema for portfolio summary."""
    total_investment: float
    total_current_value: float
    total_profit_loss: float
    portfolio_items: List[PortfolioResponse]


# ========================
# Investment Guide Schemas
# ========================

class InvestmentGuideRequest(BaseModel):
    """Schema for investment guide request."""
    risk_level: str = Field(..., pattern="^(low|medium|high)$")


class InvestmentGuideResponse(BaseModel):
    """Schema for investment guide response."""
    risk_level: str
    recommendations: List[str]
    description: str


# ========================
# Education Schemas
# ========================

class EducationTopic(BaseModel):
    """Schema for education topic."""
    topic_id: str
    title: str
    description: str
    content: str


class EducationResponse(BaseModel):
    """Schema for education topics list."""
    topics: List[dict]
