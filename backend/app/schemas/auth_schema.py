from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any

class RegisterSchema(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: str
