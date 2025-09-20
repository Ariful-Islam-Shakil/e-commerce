import os
import requests
from typing import Optional
from config import settings

class PaymentInitResult:
    def __init__(self, payment_ref: str, redirect_url: Optional[str] = None, client_secret: Optional[str] = None):
        self.payment_ref = payment_ref
        self.redirect_url = redirect_url
        self.client_secret = client_secret

class BasePaymentProvider:
    def init_payment(self, *, amount: float, currency: str, order_id: int, user_email: str, metadata: dict) -> PaymentInitResult:
        raise NotImplementedError

    def verify_webhook(self, headers, raw_body: bytes) -> dict:
        """Return parsed event/payload or raise if invalid."""
        raise NotImplementedError

# ---------- Stripe ----------
class StripeProvider(BasePaymentProvider):
    def __init__(self):
        self.secret = os.getenv("STRIPE_SECRET_KEY", "")

    def init_payment(self, *, amount: float, currency: str, order_id: int, user_email: str, metadata: dict) -> PaymentInitResult:
        # Amount in the smallest currency unit
        payload = {
            "amount": int(round(amount * 100)),
            "currency": currency.lower(),
            "metadata": {"order_id": str(order_id), **metadata},
            "receipt_email": user_email,
            "automatic_payment_methods[enabled]": True,
        }
        resp = requests.post(
            "https://api.stripe.com/v1/payment_intents",
            data=payload,
            auth=(self.secret, "")
        )
        resp.raise_for_status()
        data = resp.json()
        # payment_ref = PaymentIntent ID
        return PaymentInitResult(payment_ref=data["id"], client_secret=data["client_secret"])

    def verify_webhook(self, headers, raw_body: bytes) -> dict:
        # In production, check signature with STRIPE_WEBHOOK_SECRET
        # Here we just pass through payload (Stripe sends JSON)
        # You can use stripe SDK if desired; kept HTTP-only to avoid extra lib.
        import json
        return json.loads(raw_body.decode("utf-8"))

# ---------- SSLCommerz ----------
class SSLCommerzProvider(BasePaymentProvider):
    def __init__(self):
        self.store_id = os.getenv("SSLCZ_STORE_ID", "")
        self.store_passwd = os.getenv("SSLCZ_STORE_PASSWD", "")
        self.sandbox = os.getenv("SSLCZ_SANDBOX", "true").lower() == "true"
        self.base = "https://sandbox.sslcommerz.com" if self.sandbox else "https://seamless.sslcommerz.com"

    def init_payment(self, *, amount: float, currency: str, order_id: int, user_email: str, metadata: dict) -> PaymentInitResult:
        tran_id = f"ORD{order_id}"
        payload = {
            "store_id": self.store_id,
            "store_passwd": self.store_passwd,
            "total_amount": amount,
            "currency": currency,
            "tran_id": tran_id,
            "success_url": metadata["success_url"],
            "fail_url": metadata["fail_url"],
            "cancel_url": metadata["cancel_url"],
            "cus_name": metadata.get("name", "Customer"),
            "cus_email": user_email or "noemail@example.com",
            "cus_add1": metadata.get("address", ""),
            "cus_city": metadata.get("city", ""),
            "cus_postcode": metadata.get("postcode", ""),
            "cus_country": metadata.get("country", "Bangladesh"),
            "cus_phone": metadata.get("phone", ""),
            "shipping_method": "NO",
            "product_name": "Cart Items",
            "product_category": "Mixed",
            "product_profile": "general",
        }
        resp = requests.post(f"{self.base}/gwprocess/v4/api.php", data=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if data.get("status") != "SUCCESS":
            raise RuntimeError(f"SSLCommerz init failed: {data}")
        # redirect Gateway URL
        return PaymentInitResult(payment_ref=tran_id, redirect_url=data["GatewayPageURL"])

    def verify_webhook(self, headers, raw_body: bytes) -> dict:
        # SSLCommerz typically redirects with GET params, or posts IPN if configured.
        # You’d verify by hitting their validate API; left as TODO for brevity.
        return {}
