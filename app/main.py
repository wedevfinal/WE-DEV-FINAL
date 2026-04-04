"""
Personal Investment Management System - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import auth, portfolio, education, investment, expenses, achievements, profile
from .ai import ai_router

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Personal Investment Management System",
    description="A production-ready FastAPI backend for managing personal investments",
    version="1.0.0"
)

# Add CORS middleware (allow all origins for development - restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================
# Root Endpoint
# ========================

@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "Personal Investment Management System API",
        "version": "1.0.0",
        "status": "active"
    }


# ========================
# Health Check
# ========================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Personal Investment Management System"
    }


# ========================
# Include Routers
# ========================

app.include_router(auth.router)
app.include_router(portfolio.router)
app.include_router(education.router)
app.include_router(investment.router)
app.include_router(expenses.router)
app.include_router(achievements.router)
app.include_router(profile.router)
app.include_router(ai_router, prefix="/ai", tags=["AI"])


# ========================
# API Documentation
# ========================

# Swagger UI available at: /docs
# ReDoc available at: /redoc


if __name__ == "__main__":
    import uvicorn
    
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
