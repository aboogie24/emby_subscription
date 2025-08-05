# Emby Subscripter Application
# **Emby Subscription Platform**  

A self‑hosted subscription management system for [Emby](https://emby.media/), built with **FastAPI** (backend) and **React + Chakra UI** (frontend).  
It integrates **Stripe** for payments, automatically enables/disables Emby accounts based on subscription status, and provides a web portal for user signup, login, and account management.  

---

## **🚀 Features**
- **User Signup & Login**  
- **Stripe Integration** for recurring subscriptions  
- **Automatic Emby Account Management** (disable on failed payment)  
- **JWT Authentication** with HttpOnly cookies  
- **User Portal** to manage subscriptions, view status, and access billing portal  
- **Dockerized Deployment** (Frontend + Backend)

---

## **🛠 Tech Stack**
- **Backend**: FastAPI, SQLAlchemy, Stripe API, python‑jose (JWT)  
- **Frontend**: React, Vite, Chakra UI, Axios  
- **Database**: SQLite (default, replaceable with Postgres/MySQL)  
- **Payments**: Stripe  
- **Containerization**: Docker & Docker Compose  

---

## **📂 Project Structure**
``` 
emby-subscription/
│── backend/
│ ├── main.py # FastAPI app entrypoint
│ ├── config.py # Loads environment variables
│ ├── auth_utils.py # JWT helpers
│ ├── emby.py # Emby API helpers
│ ├── database.py # SQLAlchemy setup
│ ├── requirements.txt
│ ├── .env # Backend secrets (ignored by Git)
│
│── frontend/
│ ├── src/
│ │ ├── pages/ # React pages (Login, Signup, Account)
│ │ ├── components/ # Navbar, UI components
│ ├── .env.development # Frontend dev API URL
│ ├── .env.production # Frontend prod API URL
│ ├── Dockerfile
│
│── docker-compose.yml 
```

# Dev deployment

---

## **⚙️ Environment Variables**

### **Backend (`backend/.env`)**
```env
STRIPE_API_KEY=sk_test_123...
STRIPE_WEBHOOK_SECRET=whsec_123...
EMBY_API_KEY=your_emby_api_key
EMBY_SERVER_URL=http://emby:8096
JWT_SECRET_KEY=super_secret_jwt_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60
DATABASE_URL=sqlite:///./subscriptions.db
FRONTEND_URL=http://localhost:5173
