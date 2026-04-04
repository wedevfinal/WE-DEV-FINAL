"""
Utility functions for AI module
Helper functions for data processing and validation
"""

from typing import Any, Dict


def format_currency(value: float, symbol: str = "$") -> str:
    """
    Format numeric value as currency.
    
    Args:
        value: Numeric value to format
        symbol: Currency symbol (default: $)
    
    Returns:
        Formatted currency string
    """
    return f"{symbol}{value:,.2f}"


def validate_monthly_savings(amount: float) -> bool:
    """
    Validate that monthly savings amount is positive.
    
    Args:
        amount: Monthly savings amount
    
    Returns:
        True if valid, False otherwise
    """
    return isinstance(amount, (int, float)) and amount > 0


def categorize_risk_level(monthly_savings: float) -> str:
    """
    Categorize risk level based on monthly savings amount.
    
    Args:
        monthly_savings: Monthly savings in currency units
    
    Returns:
        Risk level category: Low, Medium, or High
    """
    if monthly_savings < 1000:
        return "Low Risk"
    elif monthly_savings < 3000:
        return "Medium Risk"
    else:
        return "High Risk"
