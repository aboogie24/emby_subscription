from fastapi import FastAPI, Request, Query, HTTPException, Depends, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer
from fastapi.responses import JSONResponse
from stripe_webhooks import handle_webhook
from database import SessionLocal, Subscription
import stripe
from stripe.error import InvalidRequestError
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

    if not username:
        raise HTTPException(status_code=400, detail="Username is missing")
    
    if not password:
        raise HTTPException(status_code=400, detail="Password is missing")
    
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
    print(r.status_code, r.text)
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
        secure=True,  # change to True in production (HTTPS)
        samesite="Lax",
        max_age=60*60
    )
    return response


@app.get("/debug-token")
def debug_token(access_token: str = Cookie(None)):
    print("🔍 Raw token from cookie:", access_token, flush=True)
    username = verify_access_token(access_token)
    print("🔍 Decoded username:", username, flush=True)
    
    if not username:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
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
        try:
            session_obj = stripe.billing_portal.Session.create(
                customer=sub.stripe_customer_id,
                return_url=F"{FRONTEND_URL}/account"
            )
            billing_portal_url = session_obj.url
        except stripe.error.InvalidRequestError as e:
            print(f"⚠️ Stripe billing portal error: {str(e)}")
            print("💡 Please configure your customer portal at: https://dashboard.stripe.com/settings/billing/portal")
            # billing_portal_url remains None, which is handled gracefully by the frontend

    print(f"username: {sub.emby_username}" +
            f"status: {sub.status}" +
            f"billing_portal_url: {billing_portal_url}"
    )

    return {
        "username": sub.emby_username,
        "status": sub.status,
        "expiry_date": sub.expiry_date.strftime("%Y-%m-%d") if sub.expiry_date else None,
        "plan_name": sub.plan_name,
        "plan_id": sub.plan_id,
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

@app.get("/subscription-plans")
def get_subscription_plans():
    """
    Returns all active subscription plans from Stripe
    """
    try:
        stripe.api_key = STRIPE_API_KEY
        
        # Fetch all active prices from Stripe
        prices = stripe.Price.list(
            active=True,
            type='recurring',
            expand=['data.product']
        )
        
        plans = []
        for price in prices.data:
            # Only include prices that have an associated product
            if price.product and hasattr(price.product, 'name'):
                plans.append({
                    "plan_id": price.id,
                    "name": price.product.name,
                    "description": price.product.description or "",
                    "price": price.unit_amount,
                    "currency": price.currency,
                    "interval": price.recurring.interval if price.recurring else "one_time"
                })
        
        return plans
        
    except Exception as e:
        print(f"Error fetching plans from Stripe: {str(e)}")
        return {"error": "Failed to fetch subscription plans"}


@app.post("/signup")
def signup(data: dict):
    """
    Expects:
    {
        "username": "john_doe",
        "email": "john@example.com",
        "plan_id": "price_1234567890"
    }
    """
    username = data.get("username")
    email = data.get("email")
    plan_id = data.get("plan_id")
    
    if not username or not email:
        return {"error": "Username and email required"}
    
    if not plan_id:
        return {"error": "Plan selection is required"}

    session = SessionLocal()

    try:
        # Verify the selected plan exists in Stripe
        stripe.api_key = STRIPE_API_KEY
        selected_price = stripe.Price.retrieve(plan_id, expand=['product'])
        
        if not selected_price.active:
            session.close()
            return {"error": "Selected plan is not active"}
        
        plan_name = selected_price.product.name if selected_price.product else "Unknown Plan"

        # 1️⃣ Create Emby user immediately
        emby_id, password = create_emby_user(username)
        if not emby_id:
            session.close()
            return {"error": "Failed to create Emby user"}

        # Send welcome email
        send_welcome_email(email, username, password)

        # Create Stripe Checkout Session with selected plan
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            customer_email=email,
            client_reference_id=username,
            line_items=[
                {"price": plan_id, "quantity": 1}
            ],
            mode="subscription",
            success_url="https://signup.justpurple.org",
            cancel_url=F"https://api.justpurple.org/cancel",
        )

        # Save user as pending with plan information
        new_sub = Subscription(
            emby_username=username,
            emby_user_id=emby_id,
            stripe_customer_id=None,  # Will update after webhook
            status="pending",
            plan_id=plan_id,
            plan_name=plan_name
        )
        session.add(new_sub)
        session.commit()
        session.close()

        return {
            "checkout_url": checkout_session.url,
            "temporary_password": password}
            
    except stripe.error.InvalidRequestError:
        session.close()
        return {"error": "Invalid plan selected"}
    except Exception as e:
        session.close()
        print(f"Error in signup: {str(e)}")
        return {"error": "Signup failed"}

@app.post("/webhook")
async def stripe_webhook(request: Request):
    print(f"🔔 Webhook endpoint hit - Method: {request.method}")
    print(f"🔔 Headers: {dict(request.headers)}")
    print(f"🔔 URL: {request.url}")
    return await handle_webhook(request)

@app.get("/")
def home():
    return {"message": "Emby Subscription Backend Running"}
