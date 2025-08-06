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

## **☸️ Kubernetes Deployment with Helm**

The project includes a Helm chart for Kubernetes deployment with persistent storage support.

### **Chart Structure**
```
chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── backend-deployment.yaml
    ├── backend-pvc.yaml
    ├── frontend-deployment.yaml
    └── ingress.yaml
```

### **Persistence Configuration**

The backend deployment supports persistent storage for the SQLite database:

```yaml
# In values.yaml
backend:
  persistence:
    enabled: true          # Enable/disable persistence
    size: 1Gi             # Storage size
    mountPath: /app        # Mount path in container
    accessModes:
      - ReadWriteOnce      # Access mode
    storageClass: ""       # Storage class (empty = default)
    annotations: {}        # Additional annotations
```

### **Deployment Commands**

```bash
# Install the chart
helm install emby-subscription ./chart

# Upgrade the chart
helm upgrade emby-subscription ./chart

# Uninstall the chart
helm uninstall emby-subscription
```

### **Customizing Values**

Create a custom values file:

```bash
# custom-values.yaml
backend:
  persistence:
    enabled: true
    size: 5Gi
    storageClass: "fast-ssd"
  env:
    STRIPE_API_KEY: "your_actual_stripe_key"
    EMBY_API_KEY: "your_actual_emby_key"

# Deploy with custom values
helm install emby-subscription ./chart -f custom-values.yaml
```

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
