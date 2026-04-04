"""
AI Routes - API endpoints for investment advice, market data, and financial news
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any

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
    monthly_savings: float = Query(
        ..., 
        gt=0, 
        description="Monthly savings amount (must be greater than 0)"
    )
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
        advice = service.get_investment_advice(monthly_savings)
        return {
            "status": "success",
            "data": advice
        }
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
    monthly_savings: float = Query(
        ...,
        gt=0,
        description="Monthly savings amount"
    )
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
