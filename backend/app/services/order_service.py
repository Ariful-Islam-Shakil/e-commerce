from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Product
from models.order import Order, OrderItem, OrderStatus
from models.cart import Cart, CartItem
from schemas.order import CheckoutRequest
from .payment_service import StripeProvider, SSLCommerzProvider, PaymentInitResult

def _calc_subtotal(db: Session, cart: Cart) -> Decimal:
    subtotal = Decimal("0.00")
    for it in cart.items:
        # Ensure product still exists & price/stock valid
        p = db.query(Product).filter(Product.id == it.product_id).with_for_update().first()
        if not p:
            raise HTTPException(status_code=404, detail=f"Product {it.product_id} not found")
        if p.stock < it.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {p.name}")
        subtotal += Decimal(str(p.price)) * it.quantity
    return subtotal

def create_order_from_cart(db: Session, user_id: int, req: CheckoutRequest) -> Order:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = _calc_subtotal(db, cart)
    shipping_fee = Decimal("0.00")  # Add your own logic (e.g., threshold for free shipping)
    total = subtotal + shipping_fee

    order = Order(
        user_id=user_id,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        currency="BDT" if req.provider == "sslcommerz" else "USD",
        status=OrderStatus.PENDING,
        shipping_name=req.shipping.name,
        shipping_phone=req.shipping.phone,
        shipping_address=req.shipping.address,
        shipping_city=req.shipping.city,
        shipping_postcode=req.shipping.postcode,
        shipping_country=req.shipping.country,
        payment_provider=req.provider,
    )
    db.add(order)
    db.flush()  # get order.id

    # copy items & decrement stock
    for it in cart.items:
        p = db.query(Product).filter(Product.id == it.product_id).with_for_update().first()
        p.stock -= it.quantity

        oi = OrderItem(
            order_id=order.id,
            product_id=p.id,
            name=p.name,
            unit_price=p.price,
            quantity=it.quantity,
        )
        db.add(oi)

    # Clear cart
    for it in list(cart.items):
        db.delete(it)

    db.commit()
    db.refresh(order)
    return order

def init_payment(db: Session, order: Order, base_url: str, user_email: str | None) -> PaymentInitResult:
    # Choose provider
    if order.payment_provider == "stripe":
        provider = StripeProvider()
        result = provider.init_payment(
            amount=float(order.total),
            currency=order.currency,
            order_id=order.id,
            user_email=user_email or "",
            metadata={"env": "dev"}
        )
        order.status = OrderStatus.PAYMENT_PENDING
        order.payment_ref = result.payment_ref
        db.commit()
        return result

    elif order.payment_provider == "sslcommerz":
        provider = SSLCommerzProvider()
        result = provider.init_payment(
            amount=float(order.total),
            currency=order.currency,
            order_id=order.id,
            user_email=user_email or "",
            metadata={
                "success_url": f"{base_url}/api/v1/payments/sslcommerz/success?order_id={order.id}",
                "fail_url":    f"{base_url}/api/v1/payments/sslcommerz/fail?order_id={order.id}",
                "cancel_url":  f"{base_url}/api/v1/payments/sslcommerz/cancel?order_id={order.id}",
                "name": order.shipping_name or "Customer",
                "phone": order.shipping_phone or "",
                "address": order.shipping_address or "",
                "city": order.shipping_city or "",
                "postcode": order.shipping_postcode or "",
                "country": order.shipping_country or "Bangladesh",
            }
        )
        order.status = OrderStatus.PAYMENT_PENDING
        order.payment_ref = result.payment_ref
        db.commit()
        return result

    else:
        raise HTTPException(status_code=400, detail="Unsupported payment provider")

def mark_order_paid(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = OrderStatus.PAID
    db.commit()
    db.refresh(order)
    return order

def mark_order_failed(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = OrderStatus.FAILED
    db.commit()
    db.refresh(order)
    return order
