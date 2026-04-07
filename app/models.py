"""
SQLAlchemy ORM models for the application.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """User model for storing user information."""
    
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Profile fields
    monthly_income = Column(Float, nullable=True)
    monthly_savings = Column(Float, nullable=True)
    investable_amount = Column(Float, nullable=True)
    risk_goal = Column(String, nullable=True)
    # Additional personal fields
    phone = Column(String, nullable=True)
    dob = Column(DateTime, nullable=True)
    age = Column(Integer, nullable=True)
    is_student = Column(Boolean, default=False)
    # Track completed education items for achievement checks
    completed_courses = Column(Integer, default=0)

    # Relationships
    portfolios = relationship("Portfolio", back_populates="owner", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="owner", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="owner", cascade="all, delete-orphan")
    # Relationship to user_achievements join table
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    # One-to-one financial profile
    financial = relationship("UserFinancial", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"


class Portfolio(Base):
    """Portfolio model for storing investment assets."""
    
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    symbol = Column(String, nullable=True, index=True)
    asset_name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)  # stock, bond, gold, crypto, etc.
    quantity = Column(Float, nullable=False)
    buy_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    # Cached value for quick reads (quantity * current_price)
    value = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to User
    owner = relationship("User", back_populates="portfolios")

    def __repr__(self):
        return f"<Portfolio(id={self.id}, user_id={self.user_id}, asset_name={self.asset_name})>"

    def get_profit_loss(self) -> float:
        """Calculate profit/loss for this asset."""
        return (self.current_price - self.buy_price) * self.quantity

    def compute_value(self) -> float:
        try:
            return round((self.current_price or 0.0) * (self.quantity or 0.0), 2)
        except Exception:
            return 0.0


class Expense(Base):
    """Expense model for tracking user expenses."""
    
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String, nullable=False)  # Food, Transport, Entertainment, Books, Clothing, Other
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to User
    owner = relationship("User", back_populates="expenses")

    def __repr__(self):
        return f"<Expense(id={self.id}, user_id={self.user_id}, category={self.category}, amount={self.amount})>"


class Achievement(Base):
    """Achievement model for gamification."""
    
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)  # First Steps, Saver, Portfolio Pro, etc.
    description = Column(String, nullable=False)
    icon = Column(String, nullable=False)  # Emoji
    unlocked = Column(Boolean, default=False)
    unlock_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to User
    owner = relationship("User", back_populates="achievements")

    def __repr__(self):
        return f"<Achievement(id={self.id}, user_id={self.user_id}, title={self.title}, unlocked={self.unlocked})>"


class AchievementMaster(Base):
    """Master list of available achievements (global definitions)."""

    __tablename__ = "achievements_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=False)
    icon_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<AchievementMaster(id={self.id}, name={self.name})>"


class UserAchievement(Base):
    """Join table linking users to master achievements and storing unlock state."""

    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey("achievements_master.id", ondelete="CASCADE"), nullable=False, index=True)
    date_unlocked = Column(DateTime, nullable=True)
    is_locked = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("AchievementMaster")

    def __repr__(self):
        return f"<UserAchievement(id={self.id}, user_id={self.user_id}, achievement_id={self.achievement_id}, is_locked={self.is_locked})>"


class UserFinancial(Base):
    """Separate table to store user's financial profile."""

    __tablename__ = "user_financials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    monthly_income = Column(Float, nullable=True)
    monthly_savings = Column(Float, nullable=True)
    investable_amount = Column(Float, nullable=True)
    risk_goal = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="financial")

    def __repr__(self):
        return f"<UserFinancial(id={self.id}, user_id={self.user_id})>"
