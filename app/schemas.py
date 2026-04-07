"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime, date
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
    phone: Optional[str] = None
    dob: Optional[date] = None
    is_student: Optional[bool] = False
    # Profile fields allowed at registration
    monthly_income: Optional[float] = None
    monthly_savings: Optional[float] = None
    investable_amount: Optional[float] = None
    risk_goal: Optional[str] = None
    age: Optional[int] = None


class UserLogin(BaseModel):
    """Schema for user login."""
    email: str = Field(..., min_length=5)
    password: str


class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    created_at: datetime
    monthly_income: Optional[float] = None
    monthly_savings: Optional[float] = None
    investable_amount: Optional[float] = None
    risk_goal: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    age: Optional[int] = None
    is_student: Optional[bool] = False

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
    # Backwards-compatible fields
    asset_name: Optional[str] = Field(None, min_length=1, max_length=100)
    asset_type: Optional[str] = Field('stock', min_length=1, max_length=50)
    quantity: float = Field(..., gt=0)
    # Accept price as a single field (price per unit). Keep buy/current names for legacy.
    price: Optional[float] = Field(None, gt=0)
    buy_price: Optional[float] = Field(None, gt=0)
    current_price: Optional[float] = Field(None, gt=0)
    # New fields
    symbol: Optional[str] = None
    value: Optional[float] = None


class PortfolioCreate(PortfolioBase):
    """Schema for creating a new portfolio entry."""
    # Allow either `price` or `current_price`/`buy_price` to be provided
    @field_validator('price', mode='before')
    def fill_price(cls, v, info):
        # If price is provided use it; otherwise try current_price or buy_price
        if v is not None:
            return v
        data = info.data or {}
        return data.get('current_price') or data.get('buy_price')


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
# Risk Calculator Schemas
# ========================

class RiskCalculatorRequest(BaseModel):
    """Schema for risk calculator request."""
    income: float = Field(..., gt=0, description="Monthly income")
    savings: float = Field(..., ge=0, description="Monthly savings")
    age: int = Field(..., ge=18, le=100, description="User age")
    goals: str = Field(default="balanced", description="Investment goal: conservative, balanced, aggressive")


class RiskCalculatorResponse(BaseModel):
    """Schema for risk calculator response."""
    risk_level: str  # Low, Medium, High
    savings_rate: float  # Percentage
    recommendation: str
    allocation: dict  # { "Stocks": 50, "Bonds": 30, "Cash": 20 }


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


# ========================
# Expense Schemas
# ========================

class ExpenseBase(BaseModel):
    """Base expense schema."""
    category: str = Field(..., min_length=1, max_length=50)  # Food, Transport, Books, Entertainment, Clothing, Other
    amount: float = Field(..., gt=0)
    description: Optional[str] = Field(None, max_length=255)
    date: datetime = Field(default_factory=datetime.utcnow)


class ExpenseCreate(ExpenseBase):
    """Schema for creating a new expense."""
    pass


class ExpenseUpdate(BaseModel):
    """Schema for updating an expense."""
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, max_length=255)
    date: Optional[datetime] = None


class ExpenseResponse(ExpenseBase):
    """Schema for expense response."""
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseSummary(BaseModel):
    """Schema for expense summary."""
    total_expenses: float
    by_category: dict  # { "Food": 450, "Transport": 250, ... }
    expenses: List[ExpenseResponse]


# ========================
# Achievement Schemas
# ========================

class AchievementBase(BaseModel):
    """Base achievement schema."""
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=255)
    icon: str = Field(..., min_length=1)  # Emoji


class AchievementCreate(AchievementBase):
    """Schema for creating a new achievement."""
    unlocked: bool = False


class AchievementUpdate(BaseModel):
    """Schema for updating an achievement."""
    unlocked: Optional[bool] = None
    unlock_date: Optional[datetime] = None


class AchievementResponse(AchievementBase):
    """Schema for achievement response."""
    id: int
    user_id: int
    unlocked: bool
    unlock_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AchievementsList(BaseModel):
    """Schema for achievements list."""
    total_achievements: int
    unlocked_count: int
    achievements: List[AchievementResponse]


# ========================
# Financial Profile Schemas
# ========================

class FinancialProfileBase(BaseModel):
    monthly_income: Optional[float] = None
    monthly_savings: Optional[float] = None
    investable_amount: Optional[float] = None
    risk_goal: Optional[str] = None
    age: Optional[int] = None


class FinancialProfileCreate(FinancialProfileBase):
    monthly_income: float
    monthly_savings: float
    investable_amount: float
    risk_goal: str
    age: int


class FinancialProfileUpdate(FinancialProfileBase):
    pass


class FinancialProfileResponse(FinancialProfileBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
