from fastapi import FastAPI
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import user_routes, product_routes, cart_routes, auth_routes, order_routes, payment_routes


Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_routes.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(auth_routes.router,  prefix="/api/v1/auth",  tags=["Auth"])
app.include_router(product_routes.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(cart_routes.router, prefix="/api/v1/cart", tags=["Cart"])
app.include_router(order_routes.router,  prefix="/api/v1/orders",   tags=["Orders"])
app.include_router(payment_routes.router,prefix="/api/v1/payments", tags=["Payments"])