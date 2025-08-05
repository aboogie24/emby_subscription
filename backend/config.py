import os
from dotenv import load_dotenv

load_dotenv()

STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
EMBY_API_KEY = os.getenv("EMBY_API_KEY")
EMBY_SERVER_URL = os.getenv("EMBY_SERVER_URL")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", 60))

DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

SMTP_SERVER = "sandbox.smtp.mailtrap.io"
SMTP_PORT = 587  # usually 587 for TLS, 465 for SSL
SMTP_USERNAME = "20db3ec6a6b663"
SMTP_PASSWORD = "83b2f0f6d44ed7"
FROM_EMAIL = "noreply@yourdomain.com"

