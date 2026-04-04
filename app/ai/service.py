"""
AI Service Module - Core business logic for investment advice and market data
Handles market data retrieval, news fetching, and investment recommendations
"""

import requests
from typing import Dict, List, Any
import yfinance as yf


# ========================
# Configuration
# ========================

NEWS_API_KEY = "ae0c2d8caa1d4e83818fa4b0291f4115"
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"


# ========================
# Market Data Service
# ========================

def get_market_data() -> Dict[str, float]:
    """
    Fetch current market data for major indices and assets.
    
    Returns:
        Dictionary with market indices and their current values
    
    Raises:
        Exception: If unable to fetch market data
    """
    try:
        nifty = yf.Ticker("^NSEI").history(period="1d")["Close"].iloc[-1]
        sensex = yf.Ticker("^BSESN").history(period="1d")["Close"].iloc[-1]
        gold = yf.Ticker("GC=F").history(period="1d")["Close"].iloc[-1]
        bitcoin = yf.Ticker("BTC-USD").history(period="1d")["Close"].iloc[-1]

        return {
            "nifty": round(nifty, 2),
            "sensex": round(sensex, 2),
            "gold": round(gold, 2),
            "bitcoin": round(bitcoin, 2),
            "timestamp": "current"
        }
    except Exception as e:
        raise Exception(f"Failed to fetch market data: {str(e)}")


# ========================
# News Service
# ========================

def get_finance_news() -> List[Dict[str, str]]:
    """
    Fetch latest financial news headlines.
    
    Returns:
        List of dictionaries containing news articles with title and URL
    
    Raises:
        Exception: If unable to fetch news
    """
    try:
        params = {
            "category": "business",
            "country": "in",
            "apiKey": NEWS_API_KEY,
        }

        response = requests.get(NEWS_API_URL, params=params, timeout=10)
        response.raise_for_status()
        
        articles = response.json().get("articles", [])
        news_list = []

        for article in articles[:5]:
            news_list.append({
                "title": article.get("title", "N/A"),
                "url": article.get("url", "N/A"),
                "source": article.get("source", {}).get("name", "N/A"),
                "published_at": article.get("publishedAt", "N/A")
            })

        return news_list
    except Exception as e:
        raise Exception(f"Failed to fetch news: {str(e)}")


# ========================
# Investment Advice Service
# ========================

def calculate_risk_level(monthly_savings: float) -> str:
    """
    Calculate risk level based on monthly savings capacity.
    
    Args:
        monthly_savings: Monthly savings amount in currency units
    
    Returns:
        Risk level: "Low Risk", "Medium Risk", or "High Risk"
    """
    if monthly_savings < 1000:
        return "Low Risk"
    elif monthly_savings < 3000:
        return "Medium Risk"
    else:
        return "High Risk"


def get_investment_recommendation(risk_level: str) -> str:
    """
    Get investment recommendation based on risk level.
    
    Args:
        risk_level: Risk level category (Low, Medium, or High)
    
    Returns:
        Investment recommendation string
    """
    recommendations = {
        "Low Risk": "Fixed Deposit (FD), Recurring Deposit, Safe SIP",
        "Medium Risk": "Mutual Funds, Index Funds, Balanced Portfolio",
        "High Risk": "Stocks (Learning Mode Only), Growth-focused SIP"
    }
    
    return recommendations.get(risk_level, "Consult a financial advisor")


def get_investment_advice(monthly_savings: float) -> Dict[str, Any]:
    """
    Generate complete investment advice based on savings amount.
    
    Args:
        monthly_savings: Monthly savings amount in currency units
    
    Returns:
        Dictionary containing risk level and investment recommendations
    """
    risk_level = calculate_risk_level(monthly_savings)
    recommendation = get_investment_recommendation(risk_level)
    
    return {
        "monthly_savings": monthly_savings,
        "risk_level": risk_level,
        "recommendation": f"Recommended: {recommendation}",
        "disclaimer": "This is educational advice only. Consult a financial advisor before investing."
    }
