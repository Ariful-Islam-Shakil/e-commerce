from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int
    class Config:
        orm_mode = True
