from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"          # created, awaiting payment init
    PAYMENT_PENDING = "PAYMENT_PENDING"  # redirect/session created
    PAID = "PAID"
    FAILED = "FAILED"
    CANCELED = "CANCELED"

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)

    subtotal = Column(Numeric(12, 2), nullable=False, default=0)
    shipping_fee = Column(Numeric(12, 2), nullable=False, default=0)
    total = Column(Numeric(12, 2), nullable=False, default=0)

    currency = Column(String(10), default="BDT")
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)

    payment_provider = Column(String(32), nullable=True)   # "stripe" | "sslcommerz"
    payment_ref = Column(String(255), nullable=True)       # session_id/tran_id
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    shipping_name = Column(String(120), nullable=True)
    shipping_phone = Column(String(50), nullable=True)
    shipping_address = Column(String(255), nullable=True)
    shipping_city = Column(String(80), nullable=True)
    shipping_postcode = Column(String(20), nullable=True)
    shipping_country = Column(String(80), nullable=True, default="Bangladesh")

    user = relationship("User")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)

    name = Column(String(255), nullable=False)
    unit_price = Column(Numeric(12, 2), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
