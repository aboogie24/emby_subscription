import stripe
from fastapi import Request, HTTPException
from database import SessionLocal, Subscription
from emby import get_emby_user_id, set_emby_user_status
import datetime
from dotenv import load_dotenv
import os

load_dotenv()

STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


stripe.api_key = STRIPE_API_KEY

async def handle_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    session = SessionLocal()

    if event["type"] == "invoice.payment_succeeded":
        customer_id = event["data"]["object"]["customer"]
        sub = session.query(Subscription).filter_by(stripe_customer_id=customer_id).first()
        if sub:
            sub.status = "active"
            sub.expiry_date = datetime.datetime.utcnow() + datetime.timedelta(days=30)
            if sub.emby_user_id:
                set_emby_user_status(sub.emby_user_id, False)  # Enable
            session.commit()

    elif event["type"] in ["invoice.payment_failed", "customer.subscription.deleted"]:
        customer_id = event["data"]["object"]["customer"]
        sub = session.query(Subscription).filter_by(stripe_customer_id=customer_id).first()
        if sub:
            sub.status = "inactive"
            if sub.emby_user_id:
                set_emby_user_status(sub.emby_user_id, True)  # Disable
            session.commit()

    elif event["type"] == "checkout.session.completed":
        session_data = event["data"]["object"]
        email = session_data.get("customer_email")
        customer_id = session_data.get("customer")
        username = session_data.get("client_reference_id")
        
        # sub = session.query(Subscription).filter_by(emby_username=session_data.get("client_reference_id")).first()

       # Find subscription by email (or username if you pass client_reference_id)
        sub = session.query(Subscription).filter_by(emby_username=username).first()
        
        if sub:
            sub.stripe_customer_id = customer_id
            session.commit()
            print(f"✅ Linked Stripe customer {customer_id} to Emby user {sub.emby_username}")


    session.close()
    return {"status": "success"}
