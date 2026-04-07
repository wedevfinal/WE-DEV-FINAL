"""
Investment education routes providing learning materials.
"""

from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from typing import Annotated
from sqlalchemy.orm import Session

from app.dependencies import get_current_user
from app.database import get_db
from app.models import User
from app.services.achievements_service import check_achievements

router = APIRouter(
    prefix="/education",
    tags=["Education"]
)

# Education content - Dictionary of topics
EDUCATION_TOPICS = {
    "investing_basics": {
        "title": "Investing Basics",
        "description": "Learn the fundamentals of investing",
        "content": """
        Investing Basics covers:
        1. What is investing?
           - Putting your money into assets with the expectation of returns
        2. Why invest?
           - Build wealth over time
           - Beat inflation
           - Achieve financial goals
        3. Investment timeline
           - Short-term (< 3 years)
           - Medium-term (3-10 years)
           - Long-term (> 10 years)
        4. Risk and return
           - Higher risk = Potential higher returns
           - Lower risk = More stable, smaller returns
        5. Start investing
           - Begin with small amounts
           - Diversify your portfolio
           - Stay informed
        """
    },
    "types_of_investments": {
        "title": "Types of Investments",
        "description": "Understand different investment types",
        "content": """
        Common Investment Types:
        
        1. Stocks
           - Ownership in companies
           - Higher risk, higher return potential
           - Can be volatile
        
        2. Bonds
           - Loans to governments or corporations
           - Lower risk, predictable returns
           - Fixed income
        
        3. Mutual Funds
           - Collection of stocks/bonds
           - Managed by professionals
           - Diversified by default
        
        4. ETFs (Exchange Traded Funds)
           - Similar to mutual funds but traded like stocks
           - Low fees
           - Diversified exposure
        
        5. Real Estate/Gold
           - Tangible assets
           - Inflation hedge
           - Less liquid than stocks/bonds
        
        6. Cryptocurrencies
           - Digital currencies
           - Very volatile
           - High risk, high reward
        
        7. Fixed Deposits
           - Bank deposits with fixed interest
           - Guaranteed returns
           - Lowest risk, lowest returns
        """
    },
    "risk_vs_return": {
        "title": "Risk vs Return",
        "description": "Understanding the relationship between risk and returns",
        "content": """
        Risk and Return Relationship:
        
        The Risk-Return Tradeoff:
        - Higher risk investments offer potential for higher returns
        - Lower risk investments offer lower but more stable returns
        
        Types of Risk:
        1. Market Risk
           - Overall market fluctuations affect your investments
        
        2. Company-Specific Risk
           - Risk specific to a particular company
           - Can be reduced through diversification
        
        3. Inflation Risk
           - Inflation erodes purchasing power
           - Some investments hedge against inflation
        
        4. Interest Rate Risk
           - Changes in interest rates affect bond values
        
        5. Liquidity Risk
           - How easily you can convert investment to cash
        
        Risk Assessment:
        - Consider your age, income, and goals
        - Young investors can take more risk
        - Older investors need more stability
        - Emergency fund is essential before investing
        
        Managing Risk:
        - Diversification is key
        - Don't put all eggs in one basket
        - Regular monitoring and rebalancing
        - Dollar-cost averaging (invest regularly)
        """
    },
    "diversification": {
        "title": "Portfolio Diversification",
        "description": "Reduce risk through portfolio diversification",
        "content": """
        Diversification Strategy:
        
        What is Diversification?
        - Spreading investments across different types of assets
        - Reduces overall portfolio risk
        - Key principle: "Don't put all eggs in one basket"
        
        Benefits:
        1. Risk Reduction
           - When one asset type underperforms, another may outperform
           - Reduces portfolio volatility
        
        2. Consistent Returns
           - More stable portfolio performance
           - Lower emotional stress
        
        3. Opportunity Across Markets
           - Access to different growth opportunities
           - Some assets perform better in different economic cycles
        
        How to Diversify:
        1. Asset Class Diversification
           - Stocks, Bonds, Real Estate, Commodities
           - Different assets perform differently
        
        2. Sector Diversification
           - Technology, Healthcare, Finance, Consumer, Energy
           - Sectors respond differently to economic changes
        
        3. Geographic Diversification
           - Domestic and International investments
           - Reduces country-specific risks
        
        4. Company Size Diversification
           - Large-cap, Mid-cap, Small-cap stocks
           - Different growth and stability profiles
        
        Sample Portfolio Allocations:
        
        Conservative (Low Risk):
        - 30% Stocks (mostly large-cap)
        - 60% Bonds
        - 10% Gold/Commodities
        
        Moderate (Medium Risk):
        - 60% Stocks (mixed sizes and sectors)
        - 30% Bonds
        - 10% Gold/Commodities
        
        Aggressive (High Risk):
        - 80% Stocks (growth-oriented)
        - 15% Bonds
        - 5% Gold/Commodities
        
        Rebalancing:
        - Review quarterly or annually
        - Return to target allocation
        - Sell overweight positions, buy underweight positions
        """
    }
   ,
   "mutual_funds": {
      "title": "Introduction to Mutual Funds",
      "description": "What mutual funds are and why investors use them",
      "content": """
      Mutual funds pool money from multiple investors to invest in a diversified portfolio of securities such as stocks, bonds, or other assets. They are managed by professional fund managers, making them an attractive option for beginners who may lack the time or expertise to manage investments individually.

      Types of mutual funds include equity funds, debt funds, and hybrid funds. Equity funds invest primarily in stocks and offer higher potential returns with higher risk. Debt funds invest in fixed-income securities like bonds and are generally less risky. Hybrid funds combine both equity and debt to balance risk and return.

      Advantages:
      - Diversification across many securities
      - Professional management
      - Liquidity: units can usually be bought or sold easily

      Considerations:
      - Fees and expense ratios impact returns
      - Past performance is not a guarantee of future results
      - Choose funds that match your risk profile and goals
      """
   },
   "stock_market": {
      "title": "Stock Market Fundamentals",
      "description": "Core concepts about buying and owning stocks",
      "content": """
      The stock market is a platform where shares of publicly listed companies are bought and sold. When you buy a stock, you are purchasing a small ownership stake in a company. Investors can earn returns through capital appreciation, when the stock price increases, and through dividends, periodic payments some companies make to shareholders.

      Stock prices are influenced by company performance, economic conditions, interest rates, and market sentiment. Two common analysis approaches are fundamental analysis (evaluating financial health and earnings) and technical analysis (studying price patterns).

      Beginners are advised to adopt a long-term investment approach, diversify across companies and sectors, and avoid emotional decision-making during market swings.
      """
   }
}


@router.get("/")
def get_all_topics():
    """
    Get all available education topics.
    
    Returns:
        List of all education topics with summaries
    """
    topics_list = []
    for topic_id, topic_data in EDUCATION_TOPICS.items():
        topics_list.append({
            "topic_id": topic_id,
            "title": topic_data["title"],
            "description": topic_data["description"]
        })
    
    return {
        "topics": topics_list,
        "total": len(topics_list)
    }


@router.get("/{topic}")
def get_topic(topic: str):
    """
    Get detailed content for a specific education topic.
    
    Args:
        topic: Topic identifier (e.g., 'investing_basics')
        
    Returns:
        Detailed content of the topic
        
    Raises:
        HTTPException: If topic not found
    """
    if topic not in EDUCATION_TOPICS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic '{topic}' not found. Available topics: {', '.join(EDUCATION_TOPICS.keys())}"
        )
    
    topic_data = EDUCATION_TOPICS[topic]
    
    return {
        "topic_id": topic,
        "title": topic_data["title"],
        "description": topic_data["description"],
        "content": topic_data["content"]
    }



@router.post("/{topic}/complete")
def complete_topic(
   topic: str,
   db: Annotated[Session, Depends(get_db)],
   current_user: Annotated[User, Depends(get_current_user)]
):
   """Mark a topic as completed for the current user and run achievement checks.

   This increments the user's `completed_courses` counter and evaluates
   the `Knowledge Seeker` achievement.
   """
   if topic not in EDUCATION_TOPICS:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Topic '{topic}' not found")

   # Increment user's completed_courses counter
   user = db.query(User).filter(User.id == current_user.id).first()
   if not user:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

   user.completed_courses = (user.completed_courses or 0) + 1
   db.commit()
   db.refresh(user)

   # Run achievement check for course completion
   try:
      unlocked = check_achievements(db, current_user.id, "course_finish")
   except Exception:
      unlocked = []

   return {"completed_courses": user.completed_courses, "unlocked": [u.id for u in unlocked]}
