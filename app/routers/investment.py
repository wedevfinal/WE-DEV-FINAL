"""
Investment guide and risk calculator routes.
"""

from fastapi import APIRouter
from app.schemas import (
    InvestmentGuideRequest, 
    InvestmentGuideResponse,
    RiskCalculatorRequest,
    RiskCalculatorResponse
)

router = APIRouter(
    prefix="/investment",
    tags=["Investment"]
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


@router.post("/guide", response_model=InvestmentGuideResponse)
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


@router.post("/calculate-risk", response_model=RiskCalculatorResponse)
def calculate_risk(request: RiskCalculatorRequest) -> RiskCalculatorResponse:
    """
    Calculate risk profile based on income, savings, age, and goals.
    
    Args:
        request: Risk calculator request with income, savings, age, and goals
        
    Returns:
        Risk level, savings rate, recommendation, and allocation
    """
    # Calculate savings rate
    savings_rate = (request.savings / request.income * 100) if request.income > 0 else 0
    
    # Determine risk level based on savings rate
    risk_level = "Low Risk"
    if savings_rate > 20:
        risk_level = "Medium Risk"
    if savings_rate > 40:
        risk_level = "High Risk"
    
    # Adjust based on age
    if request.age < 30:
        risk_level = "High Risk"
    elif request.age > 60:
        risk_level = "Low Risk"
    
    # Adjust based on goals
    if request.goals == "conservative":
        risk_level = "Low Risk"
    elif request.goals == "aggressive":
        risk_level = "High Risk"
    
    # Determine allocation based on risk level
    if risk_level == "Low Risk":
        allocation = {"Stocks": 20, "Bonds": 50, "Cash": 30}
        recommendation = "Conservative portfolio - focus on bonds and stable investments"
    elif risk_level == "Medium Risk":
        allocation = {"Stocks": 50, "Bonds": 30, "Cash": 20}
        recommendation = "Balanced portfolio - mix of stocks and bonds"
    else:  # High Risk
        allocation = {"Stocks": 70, "Bonds": 15, "Cash": 15}
        recommendation = "Growth portfolio - focus on stocks and growth assets"
    
    return RiskCalculatorResponse(
        risk_level=risk_level,
        savings_rate=round(savings_rate, 2),
        recommendation=recommendation,
        allocation=allocation
    )
