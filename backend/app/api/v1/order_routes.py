from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from database import get_db
from api.deps import get_current_user
from schemas.order import CheckoutRequest, OrderOut, PaymentInitResponse
from services import order_service
from models.order import Order

router = APIRouter()

@router.post("/checkout", response_model=PaymentInitResponse)
def checkout(req: CheckoutRequest, request: Request, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # 1) Create order from cart (and decrement stock)
    order = order_service.create_order_from_cart(db, user.id, req)

    # 2) Init payment & return redirect/client secret
    #    Build a base URL for callbacks (dev-safe)
    base_url = str(request.base_url).rstrip("/")
    result = order_service.init_payment(db, order, base_url, user_email=user.email)

    return PaymentInitResponse(
        order_id=order.id,
        provider=req.provider,
        redirect_url=result.redirect_url,
        client_secret=result.client_secret
    )

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    if not order:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order
