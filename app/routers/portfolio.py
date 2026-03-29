"""
Portfolio management routes for tracking investments.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Annotated

from app.database import get_db
from app.models import Portfolio, User
from app.schemas import PortfolioCreate, PortfolioResponse, PortfolioUpdate, PortfolioSummary
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"]
)


@router.post("/", response_model=PortfolioResponse)
def create_portfolio(
    portfolio_data: PortfolioCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
) -> PortfolioResponse:
    """
    Create a new portfolio entry for the current user.
    
    Args:
        portfolio_data: Portfolio data
        current_user: Currently authenticated user
        db: Database session
        
    Returns:
        Created portfolio entry
    """
    new_portfolio = Portfolio(
        user_id=current_user.id,
        asset_name=portfolio_data.asset_name,
        asset_type=portfolio_data.asset_type,
        quantity=portfolio_data.quantity,
        buy_price=portfolio_data.buy_price,
        current_price=portfolio_data.current_price
    )
    
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)
    
    return new_portfolio


@router.get("/", response_model=List[PortfolioResponse])
def get_portfolio(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
) -> List[PortfolioResponse]:
    """
    Get all portfolio entries for the current user.
    
    Args:
        current_user: Currently authenticated user
        db: Database session
        
    Returns:
        List of user's portfolio entries
    """
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    return portfolios


@router.get("/summary", response_model=PortfolioSummary)
def get_portfolio_summary(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
) -> PortfolioSummary:
    """
    Get portfolio summary with total investment, current value, and profit/loss.
    
    Args:
        current_user: Currently authenticated user
        db: Database session
        
    Returns:
        Portfolio summary with totals and individual items
    """
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    
    if not portfolios:
        return PortfolioSummary(
            total_investment=0.0,
            total_current_value=0.0,
            total_profit_loss=0.0,
            portfolio_items=[]
        )
    
    total_investment = 0.0
    total_current_value = 0.0
    total_profit_loss = 0.0
    
    for portfolio in portfolios:
        # Calculate investment amount (what user paid)
        investment = portfolio.buy_price * portfolio.quantity
        total_investment += investment
        
        # Calculate current value
        current_value = portfolio.current_price * portfolio.quantity
        total_current_value += current_value
        
        # Calculate profit/loss
        profit_loss = portfolio.get_profit_loss()
        total_profit_loss += profit_loss
    
    return PortfolioSummary(
        total_investment=round(total_investment, 2),
        total_current_value=round(total_current_value, 2),
        total_profit_loss=round(total_profit_loss, 2),
        portfolio_items=portfolios
    )


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(
    portfolio_id: int,
    portfolio_data: PortfolioUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
) -> PortfolioResponse:
    """
    Update a portfolio entry (only for owner).
    
    Args:
        portfolio_id: ID of portfolio to update
        portfolio_data: Updated portfolio data
        current_user: Currently authenticated user
        db: Database session
        
    Returns:
        Updated portfolio entry
        
    Raises:
        HTTPException: If portfolio not found or user is not owner
    """
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio entry not found"
        )
    
    # Check if user owns this portfolio
    if portfolio.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this portfolio"
        )
    
    # Update fields if provided
    if portfolio_data.current_price is not None:
        portfolio.current_price = portfolio_data.current_price
    
    if portfolio_data.quantity is not None:
        portfolio.quantity = portfolio_data.quantity
    
    db.commit()
    db.refresh(portfolio)
    
    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    portfolio_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """
    Delete a portfolio entry (only for owner).
    
    Args:
        portfolio_id: ID of portfolio to delete
        current_user: Currently authenticated user
        db: Database session
        
    Raises:
        HTTPException: If portfolio not found or user is not owner
    """
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio entry not found"
        )
    
    # Check if user owns this portfolio
    if portfolio.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this portfolio"
        )
    
    db.delete(portfolio)
    db.commit()
    
    return None
