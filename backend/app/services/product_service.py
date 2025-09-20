from sqlalchemy.orm import Session
from models import product as product_models
from schemas import product as product_schemas


def create_product(db: Session, product: product_schemas.ProductCreate):
    db_product = product_models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session):
    return db.query(product_models.Product).all()
