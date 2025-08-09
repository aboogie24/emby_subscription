# Subscription Plans Feature

This document describes the subscription plan selection feature that allows users to choose between different subscription plans before checkout.

## Overview

The application now supports multiple subscription plans fetched directly from your Stripe product catalog. Users can select their preferred plan during the signup process.

## How It Works

### Backend Changes

1. **Database Schema Updates**
   - Added `plan_id` and `plan_name` fields to the `Subscription` table
   - Removed the local `SubscriptionPlan` table (plans are now fetched from Stripe)

2. **New API Endpoints**
   - `GET /subscription-plans` - Fetches all active subscription plans from Stripe
   - Updated `POST /signup` - Now requires a `plan_id` parameter
   - Updated `GET /account` - Now returns the user's current plan information

3. **Stripe Integration**
   - Plans are fetched directly from Stripe's product catalog using the Stripe API
   - Plan validation is done against Stripe's active prices
   - Checkout sessions are created with the selected plan

### Frontend Changes

1. **Signup Page Updates**
   - Added plan selection UI with radio buttons
   - Displays plan name, description, price, and billing interval
   - Validates plan selection before allowing signup
   - Shows loading states and error handling

2. **Account Page Updates**
   - Displays the user's current subscription plan name
   - Shows plan information alongside other account details

## Setup Instructions

### 1. Create Products and Prices in Stripe

1. Log into your Stripe Dashboard
2. Go to Products → Create Product
3. Create your subscription products (e.g., "Basic Plan", "Premium Plan")
4. For each product, create recurring prices with different intervals (monthly, yearly)
5. Make sure the products and prices are set to "Active"

### 2. Configure Your Application

The application will automatically fetch all active recurring prices from your Stripe account. No additional configuration is needed beyond your existing Stripe API key.

### 3. Test the Feature

1. Start your backend server
2. Visit the signup page
3. You should see all your active Stripe subscription plans listed
4. Select a plan and complete the signup process
5. Check the account page to see the selected plan information

## API Reference

### GET /subscription-plans

Returns all active subscription plans from Stripe.

**Response:**
```json
[
  {
    "plan_id": "price_1234567890",
    "name": "Basic Monthly",
    "description": "Basic plan with monthly billing",
    "price": 999,
    "currency": "usd",
    "interval": "monthly"
  }
]
```

### POST /signup

Creates a new user account with the selected subscription plan.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "plan_id": "price_1234567890"
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/...",
  "temporary_password": "generated_password"
}
```

### GET /account

Returns account information including the current subscription plan.

**Response:**
```json
{
  "username": "john_doe",
  "status": "active",
  "expiry_date": "2024-12-31",
  "plan_name": "Basic Monthly",
  "plan_id": "price_1234567890",
  "billing_portal_url": "https://billing.stripe.com/..."
}
```

## Error Handling

- If no plans are available in Stripe, the signup page will show "No subscription plans available"
- If a user tries to signup without selecting a plan, they'll get an error message
- If an invalid plan ID is provided, the signup will fail with an appropriate error
- Network errors when fetching plans are handled gracefully with user feedback

## Notes

- Plans are fetched in real-time from Stripe, so any changes to your Stripe products will be immediately reflected
- Only active recurring prices are shown to users
- The system stores both the Stripe price ID and the human-readable plan name for reference
- Existing users who signed up before this feature will have `null` values for plan information
