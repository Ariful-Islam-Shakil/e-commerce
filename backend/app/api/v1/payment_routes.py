from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from database import get_db
from services import order_service

router = APIRouter()

# ---- Stripe webhook (optional) ----
@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    raw = await request.body()
    event = None
    try:
        # Here you'd verify signature with STRIPE_WEBHOOK_SECRET
        import json
        event = json.loads(raw.decode("utf-8"))
    except Exception:
        return {"ok": False}

    typ = event.get("type")
    data = event.get("data", {}).get("object", {})
    meta = data.get("metadata", {})
    order_id = int(meta.get("order_id", "0"))

    if typ in ("payment_intent.succeeded",):
        order_service.mark_order_paid(db, order_id)
    elif typ in ("payment_intent.payment_failed",):
        order_service.mark_order_failed(db, order_id)

    return {"received": True}

# ---- SSLCommerz redirects (success/fail/cancel) ----
@router.get("/sslcommerz/success")
def sslc_success(order_id: int, db: Session = Depends(get_db)):
    order_service.mark_order_paid(db, order_id)
    return {"status": "success", "order_id": order_id}

@router.get("/sslcommerz/fail")
def sslc_fail(order_id: int, db: Session = Depends(get_db)):
    order_service.mark_order_failed(db, order_id)
    return {"status": "failed", "order_id": order_id}

@router.get("/sslcommerz/cancel")
def sslc_cancel(order_id: int, db: Session = Depends(get_db)):
    order_service.mark_order_failed(db, order_id)
    return {"status": "canceled", "order_id": order_id}
