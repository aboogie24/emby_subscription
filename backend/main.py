from fastapi import FastAPI, Request, Query, HTTPException, Depends, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer
from fastapi.responses import JSONResponse
from stripe_webhooks import handle_webhook
from database import SessionLocal, Subscription
import stripe
from email_utils import send_welcome_email
from emby import create_emby_user
from auth_utils import create_access_token, verify_access_token
import requests
from dotenv import load_dotenv
import os

app = FastAPI()


load_dotenv()  # Loads from .env file in backend directory

STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")
EMBY_API_KEY = os.getenv("EMBY_API_KEY")
EMBY_SERVER_URL = os.getenv("EMBY_SERVER_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", 60))
DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Allow your frontend origin
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    FRONTEND_URL
]

print(f"DEBUG: CORS origins configured: {origins}")  # Add this line

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def debug_cors(request: Request, call_next):
    origin = request.headers.get("origin")
    print(f"DEBUG: Incoming request from origin: {origin}")
    print(f"DEBUG: Method: {request.method}, Path: {request.url.path}")
    response = await call_next(request)
    print(f"DEBUG: Response status: {response.status_code}")
    return response


@app.on_event("startup")
async def startup_event():
    print("=== REGISTERED ROUTES ===")
    for route in app.routes:
        if hasattr(route, 'methods'):
            print(f"{route.methods} {route.path}")
    print("========================")


@app.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie(key="access_token")
    return response


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    username = form_data.username
    password = form_data.password

    # Authenticate with Emby API
    url = f"{EMBY_SERVER_URL}/emby/Users/AuthenticateByName"
    headers = {
        "X-Emby-Authorization": "MediaBrowser Client=MyApp, Device=API, DeviceId=12345, Version=1.0.0",
        "Content-Type": "application/json"
    }
    payload = {
        "Username": username,
        "Pw": password
    }

    r = requests.post(url, headers=headers, json=payload)
    print(r.data)
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Issue JWT token
    access_token = create_access_token({"sub": username})
    # Set JWT as httpOnly cookie
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # change to True in production (HTTPS)
        samesite="Lax",
        max_age=60*60
    )
    return response


@app.get("/debug-token")
def debug_token(access_token: str = Cookie(None)):
    print("🔍 Raw token from cookie:", access_token, flush=True)
    username = verify_access_token(access_token)
    print("🔍 Decoded username:", username, flush=True)
    return {"raw_token": access_token, "decoded_username": username}


@app.get("/account")
def account(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    username = verify_access_token(access_token)
    print(username)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    session = SessionLocal()
    sub = session.query(Subscription).filter_by(emby_username=username).first()
    if not sub:
        return {"error": "User not found"}

    # Generate Stripe Customer Portal URL (optional, if stripe_customer_id exists)
    billing_portal_url = None
    if sub.stripe_customer_id:
        session_obj = stripe.billing_portal.Session.create(
            customer=sub.stripe_customer_id,
            return_url=F"{FRONTEND_URL}/account"
        )
        billing_portal_url = session_obj.url

    return {
        "username": sub.emby_username,
        "status": sub.status,
        "expiry_date": sub.expiry_date.strftime("%Y-%m-%d") if sub.expiry_date else None,
        "billing_portal_url": billing_portal_url
    }
# def account(token: str = Depends(HTTPBearer())):
#     """
#     Returns account details for the authenticated user.
#     """
#     username = verify_access_token(token.credentials)
#     if not username:
#         raise HTTPException(status_code=401, detail="Invalid or expired token")
    
#     session = SessionLocal()
#     sub = session.query(Subscription).filter_by(emby_username=username).first()

#     if not sub:
#         return {"error": "User not found"}

#     # Generate Stripe Customer Portal URL (optional, if stripe_customer_id exists)
#     billing_portal_url = None
#     if sub.stripe_customer_id:
#         session_obj = stripe.billing_portal.Session.create(
#             customer=sub.stripe_customer_id,
#             return_url="http://localhost:5173/account"
#         )
#         billing_portal_url = session_obj.url

#     return {
#         "username": sub.emby_username,
#         "status": sub.status,
#         "expiry_date": sub.expiry_date.strftime("%Y-%m-%d") if sub.expiry_date else None,
#         "billing_portal_url": billing_portal_url
#     }

@app.post("/signup")
def signup(data: dict):
    """
    Expects:
    {
        "username": "john_doe",
        "email": "john@example.com"
    }
    """
    username = data.get("username")
    email = data.get("email")
    if not username or not email:
        return {"error": "Username and email required"}

    session = SessionLocal()

    # 1️⃣ Create Emby user immediately
    emby_id, password = create_emby_user(username)
    if not emby_id:
        return {"error": "Failed to create Emby user"}

    # Send welcome email
    send_welcome_email(email, username, password)

    # Create Stripe Checkout Session
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        customer_email=email,
        client_reference_id=username,
        line_items=[
            {"price": STRIPE_PRICE_ID, "quantity": 1}
        ],
        mode="subscription",
        success_url="https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="https://yourdomain.com/cancel",
    )

    # Save user as pending
    new_sub = Subscription(
        emby_username=username,
        emby_user_id=emby_id,
        stripe_customer_id=None,  # Will update after webhook
        status="pending"
    )
    session.add(new_sub)
    session.commit()

    return {
        "checkout_url": checkout_session.url,
        "temporary_password": password}

@app.post("/webhook")
async def stripe_webhook(request: Request):
    return await handle_webhook(request)

@app.get("/")
def home():
    return {"message": "Emby Subscription Backend Running"}
