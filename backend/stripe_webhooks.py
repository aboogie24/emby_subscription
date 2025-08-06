import stripe
from fastapi import Request, HTTPException
from database import SessionLocal, Subscription
from emby import get_emby_user_id, set_emby_user_status
import datetime
from dotenv import load_dotenv
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

stripe.api_key = STRIPE_API_KEY

async def handle_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    logger.info(f"🔔 Webhook received - Signature present: {bool(sig_header)}")
    logger.info(f"🔔 Webhook secret configured: {bool(STRIPE_WEBHOOK_SECRET)}")
    
    if not STRIPE_WEBHOOK_SECRET:
        logger.error("❌ STRIPE_WEBHOOK_SECRET not configured!")
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
        logger.info(f"✅ Webhook signature verified successfully")
        logger.info(f"📋 Event type: {event['type']}")
        logger.info(f"📋 Event ID: {event['id']}")
    except ValueError as e:
        logger.error(f"❌ Invalid payload: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid payload: {str(e)}")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"❌ Invalid signature: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid signature: {str(e)}")
    except Exception as e:
        logger.error(f"❌ Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    session = SessionLocal()
    
    try:
        if event["type"] == "invoice.payment_succeeded":
            logger.info("💰 Processing invoice.payment_succeeded")
            customer_id = event["data"]["object"]["customer"]
            logger.info(f"🔍 Looking for customer: {customer_id}")
            
            sub = session.query(Subscription).filter_by(stripe_customer_id=customer_id).first()
            if sub:
                logger.info(f"✅ Found subscription for user: {sub.emby_username}")
                sub.status = "active"
                sub.expiry_date = datetime.datetime.utcnow() + datetime.timedelta(days=30)
                if sub.emby_user_id:
                    logger.info(f"🎬 Enabling Emby user: {sub.emby_user_id}")
                    set_emby_user_status(sub.emby_user_id, False)  # Enable
                session.commit()
                logger.info(f"✅ Successfully activated subscription for {sub.emby_username}")
            else:
                logger.warning(f"⚠️ No subscription found for customer: {customer_id}")

        elif event["type"] in ["invoice.payment_failed", "customer.subscription.deleted"]:
            logger.info(f"❌ Processing {event['type']}")
            customer_id = event["data"]["object"]["customer"]
            logger.info(f"🔍 Looking for customer: {customer_id}")
            
            sub = session.query(Subscription).filter_by(stripe_customer_id=customer_id).first()
            if sub:
                logger.info(f"✅ Found subscription for user: {sub.emby_username}")
                sub.status = "inactive"
                if sub.emby_user_id:
                    logger.info(f"🎬 Disabling Emby user: {sub.emby_user_id}")
                    set_emby_user_status(sub.emby_user_id, True)  # Disable
                session.commit()
                logger.info(f"✅ Successfully deactivated subscription for {sub.emby_username}")
            else:
                logger.warning(f"⚠️ No subscription found for customer: {customer_id}")

        elif event["type"] == "checkout.session.completed":
            logger.info("🛒 Processing checkout.session.completed")
            session_data = event["data"]["object"]
            email = session_data.get("customer_email")
            customer_id = session_data.get("customer")
            username = session_data.get("client_reference_id")
            
            logger.info(f"📧 Email: {email}")
            logger.info(f"👤 Username: {username}")
            logger.info(f"🏪 Customer ID: {customer_id}")
            
            if not username:
                logger.error("❌ No client_reference_id (username) found in checkout session")
                return {"status": "error", "message": "No username found"}
            
            # Find subscription by username
            sub = session.query(Subscription).filter_by(emby_username=username).first()
            
            if sub:
                logger.info(f"✅ Found subscription for user: {sub.emby_username}")
                sub.stripe_customer_id = customer_id
                session.commit()
                logger.info(f"✅ Linked Stripe customer {customer_id} to Emby user {sub.emby_username}")
            else:
                logger.error(f"❌ No subscription found for username: {username}")
                # List all subscriptions for debugging
                all_subs = session.query(Subscription).all()
                logger.info(f"📋 Available subscriptions: {[s.emby_username for s in all_subs]}")

        else:
            logger.info(f"ℹ️ Unhandled event type: {event['type']}")

    except Exception as e:
        logger.error(f"❌ Error processing webhook: {str(e)}")
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing webhook: {str(e)}")
    finally:
        session.close()

    logger.info("✅ Webhook processed successfully")
    return {"status": "success"}
