"""
Investment guide routes providing recommendations based on risk level.
"""

from fastapi import APIRouter
from app.schemas import InvestmentGuideRequest, InvestmentGuideResponse

router = APIRouter(
    prefix="/investment-guide",
    tags=["Investment Guide"]
)

# Investment guide data based on risk level
INVESTMENT_GUIDES = {
    "low": {
        "recommendations": [
            "Fixed Deposits",
            "Bonds",
            "Gold",
            "Treasury Securities",
            "Money Market Funds"
        ],
        "description": "Conservative strategy focused on capital preservation and stable income. Best for: Risk-averse investors, near retirees, emergency funds."
    },
    "medium": {
        "recommendations": [
            "Balanced Mutual Funds",
            "Index ETFs",
            "Blue-Chip Stocks",
            "Government Bonds",
            "Real Estate Investment Trusts (REITs)",
            "Dividend Stocks"
        ],
        "description": "Balanced strategy mixing growth and stability. Best for: Regular investors, moderate time horizon, balanced goals."
    },
    "high": {
        "recommendations": [
            "Growth Stocks",
            "Small-Cap Stocks",
            "Sector-Specific ETFs",
            "Cryptocurrencies",
            "Emerging Market Funds",
            "Stock Options (advanced)",
            "Penny Stocks (speculative)"
        ],
        "description": "Aggressive strategy focusing on capital growth. Best for: Young investors, long time horizon, high income, high risk tolerance."
    }
}


@router.post("/", response_model=InvestmentGuideResponse)
def get_investment_guide(request: InvestmentGuideRequest) -> InvestmentGuideResponse:
    """
    Get investment recommendations based on risk level.
    
    Args:
        request: Investment guide request with risk level
        
    Returns:
        Investment recommendations and strategy description
    """
    risk_level = request.risk_level.lower()
    
    if risk_level not in INVESTMENT_GUIDES:
        return InvestmentGuideResponse(
            risk_level=risk_level,
            recommendations=[],
            description="Invalid risk level. Please use 'low', 'medium', or 'high'."
        )
    
    guide = INVESTMENT_GUIDES[risk_level]
    
    return InvestmentGuideResponse(
        risk_level=risk_level,
        recommendations=guide["recommendations"],
        description=guide["description"]
    )
