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
    plan_id = Column(String, nullable=True)  # Store the selected plan ID
    plan_name = Column(String, nullable=True)  # Store the plan name for easy reference
    created_via_management = Column(Boolean, default=True)  # Track if user was created via this tool
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
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

Base.metadata.create_all(bind=engine)
