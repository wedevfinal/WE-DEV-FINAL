"""
Achievement and gamification routes.
"""

from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import Achievement, User, AchievementMaster, UserAchievement
from app.schemas import AchievementCreate, AchievementResponse, AchievementUpdate, AchievementsList
from app.dependencies import get_current_user
from app.services.achievements_service import ensure_master_achievements, unlock_user_achievement

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
    # Ensure master list exists
    ensure_master_achievements(db)

    masters = db.query(AchievementMaster).all()

    # For each master achievement, get or build the user's status
    result_items = []
    unlocked_count = 0
    for m in masters:
        ua = db.query(UserAchievement).filter(
            UserAchievement.user_id == current_user.id,
            UserAchievement.achievement_id == m.id
        ).first()

        unlocked = False
        unlock_date = None
        if ua and not ua.is_locked:
            unlocked = True
            unlock_date = ua.date_unlocked
            unlocked_count += 1

        # Build object compatible with AchievementResponse
        item = {
            "id": m.id,
            "user_id": current_user.id,
            "title": m.name,
            "description": m.description,
            "icon": m.icon_url or "",
            "unlocked": unlocked,
            "unlock_date": unlock_date,
            "created_at": m.created_at,
        }
        result_items.append(item)

    return AchievementsList(
        total_achievements=len(result_items),
        unlocked_count=unlocked_count,
        achievements=result_items
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
        # Create a master achievement definition
        master = AchievementMaster(
            name=achievement_data.title,
            description=achievement_data.description,
            icon_url=achievement_data.icon
        )
        db.add(master)
        db.commit()
        db.refresh(master)

        # Return a shape compatible with existing AchievementResponse
        return {
            "id": master.id,
            "user_id": current_user.id,
            "title": master.name,
            "description": master.description,
            "icon": master.icon_url,
            "unlocked": False,
            "unlock_date": None,
            "created_at": master.created_at,
        }
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
    master = db.query(AchievementMaster).filter(AchievementMaster.id == achievement_id).first()
    if not master:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")

    ua = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == master.id
    ).first()

    unlocked = False
    unlock_date = None
    if ua and not ua.is_locked:
        unlocked = True
        unlock_date = ua.date_unlocked

    return {
        "id": master.id,
        "user_id": current_user.id,
        "title": master.name,
        "description": master.description,
        "icon": master.icon_url or "",
        "unlocked": unlocked,
        "unlock_date": unlock_date,
        "created_at": master.created_at,
    }


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
    master = db.query(AchievementMaster).filter(AchievementMaster.id == achievement_id).first()
    if not master:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")

    # Update the user's achievement record
    ua = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == master.id
    ).first()

    if not ua:
        ua = UserAchievement(user_id=current_user.id, achievement_id=master.id, is_locked=False, date_unlocked=datetime.utcnow())
        db.add(ua)
    else:
        if achievement_data.unlocked is not None:
            ua.is_locked = not achievement_data.unlocked
            if achievement_data.unlocked and not ua.date_unlocked:
                ua.date_unlocked = datetime.utcnow()
        if achievement_data.unlock_date is not None:
            ua.date_unlocked = achievement_data.unlock_date

    db.commit()
    db.refresh(ua)

    return {
        "id": master.id,
        "user_id": current_user.id,
        "title": master.name,
        "description": master.description,
        "icon": master.icon_url or "",
        "unlocked": not ua.is_locked,
        "unlock_date": ua.date_unlocked,
        "created_at": master.created_at,
    }


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
    # Delete master achievement and associated user_achievements
    master = db.query(AchievementMaster).filter(AchievementMaster.id == achievement_id).first()
    if not master:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")

    # Remove user_achievements for this master
    db.query(UserAchievement).filter(UserAchievement.achievement_id == master.id).delete()
    db.delete(master)
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
    master = db.query(AchievementMaster).filter(AchievementMaster.id == achievement_id).first()
    if not master:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")

    ua = unlock_user_achievement(db, current_user.id, master.id)

    return {
        "id": master.id,
        "user_id": current_user.id,
        "title": master.name,
        "description": master.description,
        "icon": master.icon_url or "",
        "unlocked": not ua.is_locked,
        "unlock_date": ua.date_unlocked,
        "created_at": master.created_at,
    }
