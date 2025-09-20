from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.cart import Cart, CartItem
from models.user import User
from models.product import Product
from schemas.cart import CartItemIn
from fastapi import HTTPException, status

def get_or_create_cart(db: Session, user: User) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

def get_cart(db: Session, user: User) -> Cart:
    return get_or_create_cart(db, user)

def add_item(db: Session, user: User, payload: CartItemIn) -> Cart:
    cart = get_or_create_cart(db, user)

    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # upsert behavior
    item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == payload.product_id).first()
    if item:
        item.quantity += max(1, payload.quantity)
    else:
        item = CartItem(cart_id=cart.id, product_id=payload.product_id, quantity=max(1, payload.quantity))
        db.add(item)

    db.commit()
    db.refresh(cart)
    return cart

def update_quantity(db: Session, user: User, product_id: int, quantity: int) -> Cart:
    cart = get_or_create_cart(db, user)
    item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not in cart")
    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity
    db.commit()
    db.refresh(cart)
    return cart

def remove_item(db: Session, user: User, product_id: int) -> Cart:
    cart = get_or_create_cart(db, user)
    item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id).first()
    if item:
        db.delete(item)
        db.commit()
    db.refresh(cart)
    return cart

def clear_cart(db: Session, user: User) -> Cart:
    cart = get_or_create_cart(db, user)
    for it in list(cart.items):
        db.delete(it)
    db.commit()
    db.refresh(cart)
    return cart
