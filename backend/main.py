from fastapi import FastAPI, Request, Query, HTTPException, Depends, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer
from fastapi.responses import JSONResponse
from stripe_webhooks import handle_webhook
from database import SessionLocal, Subscription, get_subscription_query
import stripe
from stripe.error import InvalidRequestError
from email_utils import send_welcome_email
from emby import create_emby_user, get_emby_user_id, set_emby_user_status
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
    "https://signup.justpurple.org",
    "https://api.justpurple.org",
    "https://justpurple.org",
    "https://www.justpurple.org",
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
    sub = get_subscription_query(session, username)
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

@app.get("/check-username/{username}")
def check_username_availability(username: str):
    """
    Check if a username is available (not already taken in Emby or database)
    """
    try:
        # Check if username already exists in Emby
        existing_user_id = get_emby_user_id(username)
        if existing_user_id:
            return {"available": False, "message": "Username already exists. Please choose a different username."}
        
        # Check if username already exists in our database
        session = SessionLocal()
        existing_sub = session.query(Subscription).filter_by(emby_username=username).first()
        session.close()
        
        if existing_sub:
            return {"available": False, "message": "Username already exists. Please choose a different username."}
        
        return {"available": True, "message": "Username is available"}
        
    except Exception as e:
        print(f"Error checking username availability: {str(e)}")
        return {"available": False, "message": "Error checking username availability"}


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
        # Check if username already exists in Emby
        existing_user_id = get_emby_user_id(username)
        if existing_user_id:
            session.close()
            return {"error": "Username already exists. Please choose a different username."}
        
        # Check if username already exists in our database
        existing_sub = session.query(Subscription).filter_by(emby_username=username).first()
        if existing_sub:
            session.close()
            return {"error": "Username already exists. Please choose a different username."}
        
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
            success_url=f"{FRONTEND_URL}/account",
            cancel_url=f"{FRONTEND_URL}/signup",
        )

        # Save user as pending with plan information
        new_sub = Subscription(
            emby_username=username,
            emby_user_id=emby_id,
            stripe_customer_id=None,  # Will update after webhook
            status="pending",
            plan_id=plan_id,
            plan_name=plan_name,
            email=email,
            created_via_management=True
        )
        session.add(new_sub)
        session.commit()
        session.close()

        # Create access token for immediate login
        access_token = create_access_token({"sub": username})
        
        # Return response with access token set as cookie
        response = JSONResponse(content={
            "checkout_url": checkout_session.url,
            "temporary_password": password,
            "message": "Account created successfully"
        })
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,  # change to True in production (HTTPS)
            samesite="Lax",
            max_age=60*60
        )
        return response
            
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

def is_admin_user(username: str) -> bool:
    """
    Check if a user is an admin by checking if they're an admin in Emby
    """
    try:
        url = f"{EMBY_SERVER_URL}/emby/Users"
        headers = {"X-Emby-Token": EMBY_API_KEY}
        r = requests.get(url, headers=headers)
        
        print(f"Checking admin status for user: {username}")
        print(f"Emby API response status: {r.status_code}")
        
        if r.status_code == 200:
            users = r.json()
            for user in users:
                if user["Name"].lower() == username.lower():
                    is_admin = user.get("Policy", {}).get("IsAdministrator", False)
                    print(f"User {username} admin status: {is_admin}")
                    return is_admin
            print(f"User {username} not found in Emby users")
        return False
    except Exception as e:
        print(f"Error checking admin status: {e}")
        return False

def require_admin(access_token: str = Cookie(None)):
    """
    Dependency to require admin authentication
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    username = verify_access_token(access_token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    if not is_admin_user(username):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return username

@app.get("/admin/users")
def get_all_users(admin_username: str = Depends(require_admin)):
    """
    Get all users with their subscription information for admin view
    """
    try:
        session = SessionLocal()
        
        # Get all users from Emby
        url = f"{EMBY_SERVER_URL}/emby/Users"
        headers = {"X-Emby-Token": EMBY_API_KEY}
        r = requests.get(url, headers=headers)
        
        if r.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch users from Emby")
        
        emby_users = r.json()
        users_data = []
        
        for emby_user in emby_users:
            username = emby_user["Name"]
            user_id = emby_user["Id"]
            is_disabled = emby_user.get("Policy", {}).get("IsDisabled", False)
            is_admin = emby_user.get("Policy", {}).get("IsAdministrator", False)
            last_activity = emby_user.get("LastActivityDate", "Never")
            
            # Get subscription info from our database
            sub = session.query(Subscription).filter_by(emby_username=username).first()
            
            # Safely get attributes that might not exist yet
            created_via_management = False
            email = None
            created_at = None
            
            if sub:
                try:
                    created_via_management = getattr(sub, 'created_via_management', False)
                except:
                    created_via_management = False
                
                try:
                    email = getattr(sub, 'email', None)
                except:
                    email = None
                
                try:
                    created_at_obj = getattr(sub, 'created_at', None)
                    created_at = created_at_obj.strftime("%Y-%m-%d %H:%M") if created_at_obj else None
                except:
                    created_at = None
            
            user_data = {
                "username": username,
                "emby_user_id": user_id,
                "is_disabled": is_disabled,
                "is_admin": is_admin,
                "last_activity": last_activity,
                "has_subscription": bool(sub),
                "created_via_management": created_via_management,
                "subscription_status": sub.status if sub else "none",
                "plan_name": sub.plan_name if sub else None,
                "expiry_date": sub.expiry_date.strftime("%Y-%m-%d") if sub and sub.expiry_date else None,
                "email": email,
                "created_at": created_at
            }
            users_data.append(user_data)
        
        session.close()
        return {"users": users_data}
        
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@app.post("/admin/users/{username}/toggle-status")
def toggle_user_status(username: str, admin_username: str = Depends(require_admin)):
    """
    Enable/disable a user in Emby
    """
    try:
        # Get current user status
        user_id = get_emby_user_id(username)
        if not user_id:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get current status
        url = f"{EMBY_SERVER_URL}/emby/Users/{user_id}"
        headers = {"X-Emby-Token": EMBY_API_KEY}
        r = requests.get(url, headers=headers)
        
        if r.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to get user info")
        
        user_info = r.json()
        current_disabled = user_info.get("Policy", {}).get("IsDisabled", False)
        new_disabled = not current_disabled
        
        # Toggle status
        status_code, response_text = set_emby_user_status(user_id, new_disabled)
        
        if status_code not in [200, 204]:
            raise HTTPException(status_code=500, detail="Failed to update user status")
        
        return {
            "message": f"User {username} {'disabled' if new_disabled else 'enabled'} successfully",
            "is_disabled": new_disabled
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error toggling user status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to toggle user status")

@app.delete("/admin/users/{username}")
def delete_user(username: str, admin_username: str = Depends(require_admin)):
    """
    Delete a user from both Emby and the database
    """
    try:
        session = SessionLocal()
        
        # Get user ID
        user_id = get_emby_user_id(username)
        if not user_id:
            session.close()
            raise HTTPException(status_code=404, detail="User not found in Emby")
        
        # Delete from Emby
        url = f"{EMBY_SERVER_URL}/emby/Users/{user_id}"
        headers = {"X-Emby-Token": EMBY_API_KEY}
        r = requests.delete(url, headers=headers)
        
        if r.status_code not in [200, 204]:
            session.close()
            raise HTTPException(status_code=500, detail="Failed to delete user from Emby")
        
        # Delete from database
        sub = session.query(Subscription).filter_by(emby_username=username).first()
        if sub:
            session.delete(sub)
            session.commit()
        
        session.close()
        return {"message": f"User {username} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete user")

@app.get("/admin/stats")
def get_admin_stats(admin_username: str = Depends(require_admin)):
    """
    Get statistics for the admin dashboard
    """
    try:
        session = SessionLocal()
        
        # Get counts from database
        total_subscriptions = session.query(Subscription).count()
        active_subscriptions = session.query(Subscription).filter_by(status="active").count()
        pending_subscriptions = session.query(Subscription).filter_by(status="pending").count()
        
        # Check if created_via_management column exists before querying
        created_via_management = 0
        try:
            created_via_management = session.query(Subscription).filter_by(created_via_management=True).count()
        except Exception as col_error:
            print(f"Warning: created_via_management column not found: {str(col_error)}")
            # Column doesn't exist yet, return 0
            created_via_management = 0
        
        # Get total Emby users
        url = f"{EMBY_SERVER_URL}/emby/Users"
        headers = {"X-Emby-Token": EMBY_API_KEY}
        r = requests.get(url, headers=headers)
        
        total_emby_users = 0
        if r.status_code == 200:
            total_emby_users = len(r.json())
        
        session.close()
        
        return {
            "total_emby_users": total_emby_users,
            "total_subscriptions": total_subscriptions,
            "active_subscriptions": active_subscriptions,
            "pending_subscriptions": pending_subscriptions,
            "created_via_management": created_via_management,
            "users_without_subscription": total_emby_users - total_subscriptions
        }
        
    except Exception as e:
        print(f"Error fetching admin stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")

@app.get("/admin/plans")
def get_stripe_plans(admin_username: str = Depends(require_admin)):
    """
    Get all Stripe plans for admin management
    """
    try:
        stripe.api_key = STRIPE_API_KEY
        
        # Fetch all prices from Stripe (both active and inactive)
        prices = stripe.Price.list(
            limit=100,
            expand=['data.product']
        )
        
        plans = []
        for price in prices.data:
            if price.product and hasattr(price.product, 'name'):
                plans.append({
                    "plan_id": price.id,
                    "product_id": price.product.id,
                    "name": price.product.name,
                    "description": price.product.description or "",
                    "price": price.unit_amount,
                    "currency": price.currency,
                    "interval": price.recurring.interval if price.recurring else "one_time",
                    "is_active": price.active,
                    "created": price.created
                })
        
        # Sort by creation date (newest first)
        plans.sort(key=lambda x: x['created'], reverse=True)
        
        return {"plans": plans}
        
    except Exception as e:
        print(f"Error fetching Stripe plans: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch Stripe plans")

@app.post("/admin/plans")
def create_stripe_plan(plan_data: dict, admin_username: str = Depends(require_admin)):
    """
    Create a new Stripe plan
    """
    try:
        stripe.api_key = STRIPE_API_KEY
        
        # Extract plan data
        name = plan_data.get("name")
        description = plan_data.get("description", "")
        price = int(plan_data.get("price"))  # Price in cents
        currency = plan_data.get("currency", "usd")
        interval = plan_data.get("interval", "month")
        
        if not name or not price:
            raise HTTPException(status_code=400, detail="Name and price are required")
        
        # Create product first
        product = stripe.Product.create(
            name=name,
            description=description
        )
        
        # Create price
        price_obj = stripe.Price.create(
            unit_amount=price,
            currency=currency,
            recurring={"interval": interval},
            product=product.id
        )
        
        return {
            "message": "Plan created successfully",
            "plan_id": price_obj.id,
            "product_id": product.id
        }
        
    except Exception as e:
        print(f"Error creating Stripe plan: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create plan")

@app.put("/admin/plans/{plan_id}")
def update_stripe_plan(plan_id: str, plan_data: dict, admin_username: str = Depends(require_admin)):
    """
    Update a Stripe plan (activate/deactivate)
    """
    try:
        stripe.api_key = STRIPE_API_KEY
        
        is_active = plan_data.get("is_active")
        
        if is_active is None:
            raise HTTPException(status_code=400, detail="is_active field is required")
        
        # Update price active status
        stripe.Price.modify(
            plan_id,
            active=is_active
        )
        
        return {
            "message": f"Plan {'activated' if is_active else 'deactivated'} successfully",
            "plan_id": plan_id
        }
        
    except Exception as e:
        print(f"Error updating Stripe plan: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update plan")

@app.delete("/admin/plans/{plan_id}")
def archive_stripe_plan(plan_id: str, admin_username: str = Depends(require_admin)):
    """
    Archive a Stripe plan (deactivate it)
    """
    try:
        stripe.api_key = STRIPE_API_KEY
        
        # Deactivate the price (Stripe doesn't allow deletion, only deactivation)
        stripe.Price.modify(
            plan_id,
            active=False
        )
        
        return {
            "message": "Plan archived successfully",
            "plan_id": plan_id
        }
        
    except Exception as e:
        print(f"Error archiving Stripe plan: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to archive plan")

@app.post("/admin/migrate")
def run_migrations(admin_username: str = Depends(require_admin)):
    """
    Manually run database migrations
    """
    try:
        import subprocess
        import sys
        
        results = []
        
        # Run subscription plans migration
        try:
            result = subprocess.run([sys.executable, "migrate_database.py"], 
                                  capture_output=True, text=True, cwd="/app")
            results.append({
                "migration": "subscription_plans",
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None
            })
        except Exception as e:
            results.append({
                "migration": "subscription_plans",
                "success": False,
                "output": "",
                "error": str(e)
            })
        
        # Run admin features migration
        try:
            result = subprocess.run([sys.executable, "admin_migration.py"], 
                                  capture_output=True, text=True, cwd="/app")
            results.append({
                "migration": "admin_features",
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None
            })
        except Exception as e:
            results.append({
                "migration": "admin_features",
                "success": False,
                "output": "",
                "error": str(e)
            })
        
        # Check if all migrations succeeded
        all_success = all(r["success"] for r in results)
        
        return {
            "message": "Migrations completed" if all_success else "Some migrations failed",
            "success": all_success,
            "results": results
        }
        
    except Exception as e:
        print(f"Error running migrations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to run migrations")

@app.get("/")
def home():
    return {"message": "Emby Subscription Backend Running"}
