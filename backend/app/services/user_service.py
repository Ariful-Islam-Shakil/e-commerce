from sqlalchemy.orm import Session
from models import user as user_model
from schemas import user as user_schema 
from core.security import hash_password, verify_password

def create_user(db: Session, user: user_schema.UserCreate):
    hashed_pw = hash_password(user.password)
    db_user = user_model.User(email=user.email, hashed_password=hashed_pw, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(user_model.User).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(user_model.User).filter(user_model.User.id == user_id).first()

def authenticate(db: Session, email: str, password: str) -> user_model.User | None:
    u = db.query(user_model.User).filter(user_model.User.email == email).first()
    if not u:
        return None
    if not verify_password(password, u.hashed_password):
        return None
    return u