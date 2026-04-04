"""
Achievement and gamification routes.
"""

from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import Achievement, User
from app.schemas import AchievementCreate, AchievementResponse, AchievementUpdate, AchievementsList
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/achievements",
    tags=["Achievements"]
)

# Default achievements for new users
DEFAULT_ACHIEVEMENTS = [
    {
        "title": "First Steps",
        "description": "Create your first investment",
        "icon": "🚀",
    },
    {
        "title": "Saver",
        "description": "Accumulate $5,000 in savings",
        "icon": "💰",
    },
    {
        "title": "Portfolio Pro",
        "description": "Create a portfolio with 5+ assets",
        "icon": "📈",
    },
    {
        "title": "Knowledge Seeker",
        "description": "Complete 5 educational courses",
        "icon": "🎓",
    },
    {
        "title": "Consistent Saver",
        "description": "Save money for 30 consecutive days",
        "icon": "⭐",
    },
]


@router.get("/", response_model=AchievementsList)
def get_achievements(
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Get all achievements for the current user.
    
    Args:
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        List of achievements with summary
    """
    achievements = db.query(Achievement).filter(Achievement.user_id == current_user.id).all()
    
    # Initialize default achievements if none exist
    if not achievements:
        for default in DEFAULT_ACHIEVEMENTS:
            new_achievement = Achievement(
                user_id=current_user.id,
                title=default["title"],
                description=default["description"],
                icon=default["icon"],
                unlocked=False
            )
            db.add(new_achievement)
        db.commit()
        achievements = db.query(Achievement).filter(Achievement.user_id == current_user.id).all()
    
    unlocked_count = sum(1 for a in achievements if a.unlocked)
    
    return AchievementsList(
        total_achievements=len(achievements),
        unlocked_count=unlocked_count,
        achievements=achievements
    )


@router.post("/", response_model=AchievementResponse)
def create_achievement(
    achievement_data: AchievementCreate,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Create a new achievement (admin only).
    
    Args:
        achievement_data: Achievement creation data
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Created achievement object
    """
    try:
        new_achievement = Achievement(
            user_id=current_user.id,
            title=achievement_data.title,
            description=achievement_data.description,
            icon=achievement_data.icon,
            unlocked=achievement_data.unlocked
        )
        
        db.add(new_achievement)
        db.commit()
        db.refresh(new_achievement)
        
        return new_achievement
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create achievement: {str(e)}"
        )


@router.get("/{achievement_id}", response_model=AchievementResponse)
def get_achievement(
    achievement_id: int,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Get a specific achievement by ID.
    
    Args:
        achievement_id: ID of the achievement
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Achievement object
    """
    achievement = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.user_id == current_user.id
    ).first()
    
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found"
        )
    
    return achievement


@router.put("/{achievement_id}", response_model=AchievementResponse)
def unlock_achievement(
    achievement_id: int,
    achievement_data: AchievementUpdate,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Update an achievement (typically to unlock it).
    
    Args:
        achievement_id: ID of the achievement to update
        achievement_data: Updated achievement data
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Updated achievement object
    """
    achievement = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.user_id == current_user.id
    ).first()
    
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found"
        )
    
    # Update unlocked status
    if achievement_data.unlocked is not None:
        achievement.unlocked = achievement_data.unlocked
        if achievement_data.unlocked and not achievement.unlock_date:
            achievement.unlock_date = datetime.utcnow()
    
    if achievement_data.unlock_date is not None:
        achievement.unlock_date = achievement_data.unlock_date
    
    db.commit()
    db.refresh(achievement)
    
    return achievement


@router.delete("/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(
    achievement_id: int,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Delete an achievement.
    
    Args:
        achievement_id: ID of the achievement to delete
        current_user: Current authenticated user
        db: Database session
    """
    achievement = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.user_id == current_user.id
    ).first()
    
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found"
        )
    
    db.delete(achievement)
    db.commit()


@router.post("/{achievement_id}/unlock", response_model=AchievementResponse)
def unlock_achievement_by_id(
    achievement_id: int,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Unlock an achievement by ID.
    
    Args:
        achievement_id: ID of the achievement to unlock
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Updated achievement object
    """
    achievement = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.user_id == current_user.id
    ).first()
    
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found"
        )
    
    achievement.unlocked = True
    achievement.unlock_date = datetime.utcnow()
    
    db.commit()
    db.refresh(achievement)
    
    return achievement
