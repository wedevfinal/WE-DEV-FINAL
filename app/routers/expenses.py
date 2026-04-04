"""
Expense tracking routes for managing user expenses.
"""

from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import Expense, User
from app.schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate, ExpenseSummary
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Get all expenses for the current user.
    
    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        category: Optional filter by category
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        List of expense objects
    """
    query = db.query(Expense).filter(Expense.user_id == current_user.id)
    
    if category:
        query = query.filter(Expense.category == category)
    
    expenses = query.offset(skip).limit(limit).all()
    return expenses


@router.get("/summary", response_model=ExpenseSummary)
def get_expense_summary(
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Get expense summary for the current user.
    
    Args:
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Expense summary with totals by category
    """
    expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()
    
    total_expenses = sum(e.amount for e in expenses)
    by_category = {}
    
    for expense in expenses:
        if expense.category not in by_category:
            by_category[expense.category] = 0
        by_category[expense.category] += expense.amount
    
    return ExpenseSummary(
        total_expenses=total_expenses,
        by_category=by_category,
        expenses=expenses
    )


@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense_data: ExpenseCreate,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Create a new expense for the current user.
    
    Args:
        expense_data: Expense creation data
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Created expense object
    """
    try:
        new_expense = Expense(
            user_id=current_user.id,
            category=expense_data.category,
            amount=expense_data.amount,
            description=expense_data.description,
            date=expense_data.date
        )
        
        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)
        
        return new_expense
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create expense: {str(e)}"
        )


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Get a specific expense by ID.
    
    Args:
        expense_id: ID of the expense
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Expense object
    """
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Update an expense.
    
    Args:
        expense_id: ID of the expense to update
        expense_data: Updated expense data
        current_user: Current authenticated user
        db: Database session
    
    Returns:
        Updated expense object
    """
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    # Update fields if provided
    if expense_data.category is not None:
        expense.category = expense_data.category
    if expense_data.amount is not None:
        expense.amount = expense_data.amount
    if expense_data.description is not None:
        expense.description = expense_data.description
    if expense_data.date is not None:
        expense.date = expense_data.date
    
    db.commit()
    db.refresh(expense)
    
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Session = Depends(get_db)
):
    """
    Delete an expense.
    
    Args:
        expense_id: ID of the expense to delete
        current_user: Current authenticated user
        db: Database session
    """
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    db.delete(expense)
    db.commit()
