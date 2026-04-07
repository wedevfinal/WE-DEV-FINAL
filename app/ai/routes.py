"""
AI Routes - API endpoints for investment advice, market data, and financial news
"""

from fastapi import APIRouter, HTTPException, Query, Request, Depends
from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import decode_token, JWTError
from app.models import User

from . import service

# Create router with prefix
router = APIRouter()


# ========================
# Market Data Endpoints
# ========================

@router.get("/market-data", tags=["Market Data"])
async def get_market_data() -> Dict[str, Any]:
    """
    Get current market data for major indices and assets.
    
    Returns:
        - Nifty Index
        - Sensex Index
        - Gold Price
        - Bitcoin Price
    
    Example:
        GET /ai/market-data
    """
    try:
        data = service.get_market_data()
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch market data: {str(e)}"
        )


# ========================
# News Endpoints
# ========================

@router.get("/news", tags=["Financial News"])
async def get_financial_news() -> Dict[str, Any]:
    """
    Get latest financial news headlines.
    
    Returns:
        List of top 5 financial news articles with:
        - Title
        - URL
        - Source
        - Published timestamp
    
    Example:
        GET /ai/news
    """
    try:
        data = service.get_finance_news()
        return {
            "status": "success",
            "count": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch news: {str(e)}"
        )


# ========================
# Investment Advice Endpoints
# ========================

@router.get("/investment-advice", tags=["Investment Advice"])
async def get_investment_advice(
    request: Request,
    monthly_savings: Optional[float] = Query(
        None,
        gt=0,
        description="Monthly savings amount (optional if user is authenticated)"
    ),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get personalized investment advice based on monthly savings.
    
    Parameters:
        - monthly_savings (float, required): Monthly savings amount
    
    Returns:
        - Risk level categorization
        - Investment recommendations
        - Disclaimer
    
    Risk Categories:
        - Low Risk: < 1000 currency units/month
        - Medium Risk: 1000 - 3000 currency units/month
        - High Risk: > 3000 currency units/month
    
    Example:
        GET /ai/investment-advice?monthly_savings=2500
    """
    try:
        # If Authorization header present, prefer user's stored profile values
        auth = request.headers.get('authorization')
        if auth and auth.lower().startswith('bearer'):
            token = auth.split(' ', 1)[1]
            try:
                email = decode_token(token)
            except JWTError:
                email = None

            if email:
                user = db.query(User).filter(User.email == email).first()
                if user and user.monthly_savings is not None:
                    advice = service.get_investment_advice(user.monthly_savings)
                    # enhance response with stored profile
                    advice.update({
                        'monthly_income': user.monthly_income,
                        'age': getattr(user, 'age', None),
                        'goals': user.risk_goal,
                    })
                    return {"status": "success", "data": advice}

        # fallback to query parameter
        if monthly_savings is None:
            raise HTTPException(status_code=400, detail="monthly_savings is required when not authenticated")

        advice = service.get_investment_advice(monthly_savings)
        return {"status": "success", "data": advice}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate investment advice: {str(e)}"
        )


# ========================
# Combined Endpoints
# ========================

@router.get("/dashboard", tags=["Dashboard"])
async def get_ai_dashboard(
    request: Request,
    monthly_savings: Optional[float] = Query(
        None,
        gt=0,
        description="Monthly savings amount (optional if user is authenticated)"
    ),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get complete AI dashboard with market data, news, and investment advice.
    
    Parameters:
        - monthly_savings (float, required): Monthly savings amount
    
    Returns:
        Combined data with:
        - Market data
        - Financial news
        - Investment advice
    
    Example:
        GET /ai/dashboard?monthly_savings=2000
    """
    try:
        market_data = service.get_market_data()
        news = service.get_finance_news()

        # If user is authenticated, prefer stored profile values for advice
        auth = request.headers.get('authorization')
        if auth and auth.lower().startswith('bearer'):
            token = auth.split(' ', 1)[1]
            try:
                email = decode_token(token)
            except JWTError:
                email = None

            if email:
                user = db.query(User).filter(User.email == email).first()
                if user and user.monthly_savings is not None:
                    advice = service.get_investment_advice(user.monthly_savings)
                    advice.update({
                        'monthly_income': user.monthly_income,
                        'age': getattr(user, 'age', None),
                        'goals': user.risk_goal,
                    })
                    return {
                        "status": "success",
                        "market_data": market_data,
                        "news": news,
                        "investment_advice": advice
                    }

        if monthly_savings is None:
            raise HTTPException(status_code=400, detail="monthly_savings is required when not authenticated")

        advice = service.get_investment_advice(monthly_savings)

        return {
            "status": "success",
            "market_data": market_data,
            "news": news,
            "investment_advice": advice
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate dashboard: {str(e)}"
        )
