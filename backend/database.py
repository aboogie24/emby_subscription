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

Base.metadata.create_all(bind=engine)
