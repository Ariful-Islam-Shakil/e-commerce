from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from api.deps import get_current_user
from schemas.cart import CartOut, CartItemIn
from services import cart_service

router = APIRouter()

@router.get("/", response_model=CartOut)
def get_my_cart(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.get_cart(db, user)

@router.post("/items", response_model=CartOut)
def add_to_cart(payload: CartItemIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.add_item(db, user, payload)

@router.put("/items/{product_id}", response_model=CartOut)
def update_item_quantity(product_id: int, quantity: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.update_quantity(db, user, product_id, quantity)

@router.delete("/items/{product_id}", response_model=CartOut)
def remove_from_cart(product_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.remove_item(db, user, product_id)

@router.delete("/", response_model=CartOut)
def clear_my_cart(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.clear_cart(db, user)
