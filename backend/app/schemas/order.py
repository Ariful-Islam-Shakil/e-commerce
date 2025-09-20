from pydantic import BaseModel, Field
from decimal import Decimal
from typing import List, Optional, Literal
from models.order import OrderStatus

class ShippingInfo(BaseModel):
    name: str
    phone: str
    address: str
    city: str
    postcode: str
    country: str = "Bangladesh"

class CheckoutRequest(BaseModel):
    # which payment provider to use for this checkout
    provider: Literal["sslcommerz", "stripe"] = "sslcommerz"
    shipping: ShippingInfo

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    name: str
    unit_price: Decimal
    quantity: int
    class Config:
        orm_mode = True

class OrderOut(BaseModel):
    id: int
    status: OrderStatus
    subtotal: Decimal
    shipping_fee: Decimal
    total: Decimal
    currency: str
    payment_provider: Optional[str] = None
    payment_ref: Optional[str] = None
    items: List[OrderItemOut]
    class Config:
        orm_mode = True

class PaymentInitResponse(BaseModel):
    order_id: int
    provider: str
    redirect_url: Optional[str] = None      # SSLCommerz Gateway URL
    client_secret: Optional[str] = None     # Stripe PaymentIntent secret
