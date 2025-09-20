from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import user as user_schemas
from services import user_service 
from database import get_db

router = APIRouter()

@router.post("/", response_model=user_schemas.UserOut)
def register_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user)

@router.get("/", response_model=list[user_schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return user_service.get_users(db)

@router.get("/user/{user_id}", response_model=user_schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user