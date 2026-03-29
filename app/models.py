"""
SQLAlchemy ORM models for the application.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
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

    # Relationship to Portfolio
    portfolios = relationship("Portfolio", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"


class Portfolio(Base):
    """Portfolio model for storing investment assets."""
    
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    asset_name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)  # stock, bond, gold, crypto, etc.
    quantity = Column(Float, nullable=False)
    buy_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to User
    owner = relationship("User", back_populates="portfolios")

    def __repr__(self):
        return f"<Portfolio(id={self.id}, user_id={self.user_id}, asset_name={self.asset_name})>"

    def get_profit_loss(self) -> float:
        """Calculate profit/loss for this asset."""
        return (self.current_price - self.buy_price) * self.quantity
