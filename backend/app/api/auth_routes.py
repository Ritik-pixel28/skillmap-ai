from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.auth_schema import RegisterSchema, LoginSchema, UserResponse
from app.schemas.profile_schema import APIResponse # Common response schema
from app.services import auth_service
from app.core.logger import logger

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=APIResponse)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    """Register a new user."""
    try:
        logger.info(f"Processing registration for: {data.email}")
        user = auth_service.register_user(db, data)
        return APIResponse(
            success=True,
            data=UserResponse.from_orm(user),
            message="User registered successfully"
        )
    except HTTPException as e:
        return APIResponse(success=False, error=e.detail, message="Registration failed")
    except Exception as e:
        logger.error(f"Unexpected error in registration: {str(e)}")
        return APIResponse(success=False, error="Internal server error", message="An unexpected error occurred")

@router.post("/login", response_model=APIResponse)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    """Authenticate user and return user ID and access token."""
    try:
        logger.info(f"Processing login for: {data.email}")
        result = auth_service.login_user(db, data)
        return APIResponse(
            success=True,
            data={
                "user_id": result["user"].id,
                "access_token": result["access_token"]
            },
            message="Login successful"
        )
    except HTTPException as e:
        return APIResponse(success=False, error=e.detail, message="Login failed")
    except Exception as e:
        logger.error(f"Unexpected error in login: {str(e)}")
        return APIResponse(success=False, error="Invalid credentials or server error", message="Login failed")

@router.get("/me", response_model=APIResponse)
def get_me():
    """Fetch current user info (placeholder)."""
    try:
        logger.info("Fetching 'me' placeholder data")
        return APIResponse(
            success=True,
            data={"id": 1, "name": "Demo User", "email": "demo@example.com"},
            message="User info fetched"
        )
    except Exception as e:
        logger.error(f"Error in /me: {str(e)}")
        return APIResponse(success=False, error=str(e))
