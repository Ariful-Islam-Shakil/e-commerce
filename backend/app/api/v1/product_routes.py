from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import product as product_schemas
from services import product_service

from database import get_db

router = APIRouter()

@router.post("/", response_model=product_schemas.ProductOut)
def create_product(product: product_schemas.ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db, product)

@router.get("/", response_model=list[product_schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return product_service.get_products(db)
