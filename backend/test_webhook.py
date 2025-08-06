#!/usr/bin/env python3
"""
Test script to debug Stripe webhook issues
"""
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def test_webhook_endpoint():
    """Test if the webhook endpoint is accessible"""
    backend_url = "http://localhost:8000"  # Adjust if different
    webhook_url = f"{backend_url}/webhook"
    
    print("🧪 Testing webhook endpoint accessibility...")
    
    try:
        # Test with a simple POST request (will fail signature verification but should reach endpoint)
        response = requests.post(
            webhook_url,
            data=json.dumps({"test": "data"}),
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"✅ Webhook endpoint is accessible")
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Response: {response.text}")
        return True
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to {webhook_url}")
        print("💡 Make sure your backend server is running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Error testing webhook: {str(e)}")
        return False

def check_environment():
    """Check if required environment variables are set"""
    print("🔍 Checking environment variables...")
    
    required_vars = [
        "STRIPE_API_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "STRIPE_PRICE_ID"
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
            print(f"❌ {var}: Not set")
        else:
            # Show partial value for security
            if "SECRET" in var or "KEY" in var:
                display_value = value[:10] + "..." if len(value) > 10 else value
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
    
    if missing_vars:
        print(f"\n⚠️ Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    return True

def check_database():
    """Check database connectivity and subscription data"""
    print("🗄️ Checking database...")
    
    try:
        from database import SessionLocal, Subscription
        session = SessionLocal()
        
        # Count total subscriptions
        total_subs = session.query(Subscription).count()
        print(f"📊 Total subscriptions: {total_subs}")
        
        # Show recent subscriptions
        recent_subs = session.query(Subscription).limit(5).all()
        print("📋 Recent subscriptions:")
        for sub in recent_subs:
            print(f"  - {sub.emby_username} | Status: {sub.status} | Stripe ID: {sub.stripe_customer_id}")
        
        session.close()
        return True
    except Exception as e:
        print(f"❌ Database error: {str(e)}")
        return False

def main():
    print("🔧 Stripe Webhook Debugging Tool")
    print("=" * 40)
    
    # Check environment
    env_ok = check_environment()
    print()
    
    # Check database
    db_ok = check_database()
    print()
    
    # Test webhook endpoint
    webhook_ok = test_webhook_endpoint()
    print()
    
    print("📋 Summary:")
    print(f"  Environment: {'✅' if env_ok else '❌'}")
    print(f"  Database: {'✅' if db_ok else '❌'}")
    print(f"  Webhook Endpoint: {'✅' if webhook_ok else '❌'}")
    
    if not all([env_ok, db_ok, webhook_ok]):
        print("\n💡 Next Steps:")
        if not env_ok:
            print("  1. Check your .env file and ensure all required variables are set")
        if not db_ok:
            print("  2. Check database connectivity and schema")
        if not webhook_ok:
            print("  3. Start your backend server: uvicorn main:app --reload --port 8000")
    else:
        print("\n✅ All checks passed! Your webhook setup looks good.")
        print("💡 If webhooks still aren't working, check:")
        print("  1. Stripe webhook endpoint URL configuration")
        print("  2. Stripe webhook secret matches your .env file")
        print("  3. Server logs when webhook events are sent")

if __name__ == "__main__":
    main()
