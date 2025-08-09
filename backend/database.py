from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./subscriptions.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    emby_username = Column(String, unique=True, index=True)
    emby_user_id = Column(String, unique=True)
    stripe_customer_id = Column(String, unique=True, nullable=True)
    status = Column(String, default="inactive")
    expiry_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    # These columns might not exist in older databases - handle gracefully
    plan_id = Column(String, nullable=True)  # Store the selected plan ID
    plan_name = Column(String, nullable=True)  # Store the plan name for easy reference
    created_via_management = Column(Boolean, default=False, nullable=True)  # Track if user was created via this tool
    created_at = Column(DateTime, nullable=True)  # Creation timestamp
    email = Column(String, nullable=True)  # Store user email for admin reference

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(String, unique=True, index=True)  # Stripe price ID
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Integer, nullable=False)  # Price in cents
    currency = Column(String, default="usd")
    interval = Column(String, nullable=False)  # monthly, yearly, etc.
    is_active = Column(Boolean, default=True)

# Don't automatically create tables - let migrations handle this
# Base.metadata.create_all(bind=engine)

# Function to check if a column exists in the database
def column_exists(table_name, column_name):
    """Check if a column exists in a table"""
    try:
        with engine.connect() as conn:
            result = conn.execute(f"PRAGMA table_info({table_name})")
            columns = [row[1] for row in result.fetchall()]
            return column_name in columns
    except Exception:
        return False

# Function to get safe subscription query
def get_subscription_query(session, username):
    """Get subscription with safe column handling"""
    try:
        # Try the full query first
        return session.query(Subscription).filter_by(emby_username=username).first()
    except Exception as e:
        if "no such column" in str(e):
            # Fall back to basic query with only core columns
            from sqlalchemy import text
            result = session.execute(
                text("SELECT id, emby_username, emby_user_id, stripe_customer_id, status, expiry_date FROM subscriptions WHERE emby_username = :username"),
                {"username": username}
            ).fetchone()
            
            if result:
                # Create a basic subscription object
                sub = Subscription()
                sub.id = result[0]
                sub.emby_username = result[1]
                sub.emby_user_id = result[2]
                sub.stripe_customer_id = result[3]
                sub.status = result[4]
                sub.expiry_date = result[5]
                # Set defaults for missing columns
                sub.plan_id = None
                sub.plan_name = None
                sub.created_via_management = False
                sub.created_at = None
                sub.email = None
                return sub
            return None
        else:
            raise e
