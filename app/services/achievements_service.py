from datetime import datetime
from sqlalchemy.orm import Session
from app.models import (
    AchievementMaster,
    UserAchievement,
    User,
    Portfolio,
    UserFinancial,
)

# Default achievement definitions (titles must match frontend expectations)
DEFAULT_ACHIEVEMENTS = [
    {
        "name": "First Steps",
        "description": "Create your first investment",
        "icon_url": "🚀",
    },
    {
        "name": "Saver",
        "description": "Accumulate $5,000 in savings",
        "icon_url": "💰",
    },
    {
        "name": "Portfolio Pro",
        "description": "Create a portfolio with 5+ assets",
        "icon_url": "📈",
    },
    {
        "name": "Knowledge Seeker",
        "description": "Complete 5 educational courses",
        "icon_url": "🎓",
    },
    {
        "name": "Consistent Saver",
        "description": "Save money for 30 consecutive days",
        "icon_url": "⭐",
    },
]


def ensure_master_achievements(db: Session):
    """Ensure the master achievement definitions exist."""
    for d in DEFAULT_ACHIEVEMENTS:
        existing = db.query(AchievementMaster).filter(AchievementMaster.name == d["name"]).first()
        if not existing:
            new = AchievementMaster(name=d["name"], description=d["description"], icon_url=d.get("icon_url"))
            db.add(new)
    db.commit()


def unlock_user_achievement(db: Session, user_id: int, achievement_master_id: int):
    ua = db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id,
        UserAchievement.achievement_id == achievement_master_id,
    ).first()

    if not ua:
        ua = UserAchievement(
            user_id=user_id,
            achievement_id=achievement_master_id,
            is_locked=False,
            date_unlocked=datetime.utcnow(),
        )
        db.add(ua)
        db.commit()
        db.refresh(ua)
        return ua

    if ua.is_locked:
        ua.is_locked = False
        ua.date_unlocked = datetime.utcnow()
        db.commit()
        db.refresh(ua)
    return ua


def check_achievements(db: Session, user_id: int, action_type: str):
    """Run checks for achievements based on action_type and unlock when conditions met.

    action_type: 'investment' | 'balance_update' | 'portfolio_update' | 'course_finish'
    """
    ensure_master_achievements(db)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return []

    unlocked = []

    # Map names to master records
    masters = {m.name: m for m in db.query(AchievementMaster).all()}

    # 1) investment -> First Steps: check if user has at least one portfolio item
    if action_type == "investment":
        count = db.query(Portfolio).filter(Portfolio.user_id == user_id).count()
        if count >= 1 and "First Steps" in masters:
            ua = unlock_user_achievement(db, user_id, masters["First Steps"].id)
            unlocked.append(ua)

    # 2) balance_update -> Saver: check total savings >= 5000
    if action_type == "balance_update":
        saved = 0
        try:
            saved = float(user.monthly_savings or 0)
        except Exception:
            saved = 0
        # fallback to financial table
        if saved == 0 and user.financial:
            saved = float(user.financial.monthly_savings or 0)
        if saved >= 5000 and "Saver" in masters:
            ua = unlock_user_achievement(db, user_id, masters["Saver"].id)
            unlocked.append(ua)

    # 3) portfolio_update -> Portfolio Pro: 5+ unique assets
    if action_type == "portfolio_update":
        unique_assets = db.query(Portfolio.symbol).filter(Portfolio.user_id == user_id).distinct().count()
        if unique_assets >= 5 and "Portfolio Pro" in masters:
            ua = unlock_user_achievement(db, user_id, masters["Portfolio Pro"].id)
            unlocked.append(ua)

    # 4) course_finish -> Knowledge Seeker: completed_courses >=5
    if action_type == "course_finish":
        total_finished = int(user.completed_courses or 0)
        if total_finished >= 5 and "Knowledge Seeker" in masters:
            ua = unlock_user_achievement(db, user_id, masters["Knowledge Seeker"].id)
            unlocked.append(ua)

    return unlocked
