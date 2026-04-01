from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth_schema import RegisterSchema, LoginSchema
from app.core.security import hash_password, verify_password
from fastapi import HTTPException, status
from app.core.logger import logger

def register_user(db: Session, data: RegisterSchema):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == data.email).first()
    if db_user:
        logger.warning(f"Registration failed: User with email {data.email} already exists.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password
    hashed_pwd = hash_password(data.password)
    
    # Create user
    new_user = User(
        name=data.name,
        email=data.email,
        password=hashed_pwd
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"User registered successfully: {data.email}")
    return new_user

def login_user(db: Session, data: LoginSchema):
    email = data.email.strip()
    password = data.password.strip()
    
    # Fetch user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        logger.warning(f"Login failed: User {email} not found.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(password, user.password):
        logger.warning(f"Login failed: Incorrect password for {email}.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    logger.info(f"User logged in successfully: {email}")
    return user
