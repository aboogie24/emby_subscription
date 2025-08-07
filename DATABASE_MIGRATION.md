# Database Migration Guide

This guide explains how to update your existing database to support the new subscription plans feature.

## What Changed

We added the following to support multiple subscription plans:

### New Columns in `subscriptions` table:
- `plan_id` (TEXT) - Stores the Stripe price ID of the selected plan
- `plan_name` (TEXT) - Stores the human-readable name of the plan

### New Table: `subscription_plans`
- `id` (INTEGER PRIMARY KEY) - Auto-incrementing ID
- `plan_id` (TEXT UNIQUE) - Stripe price ID
- `name` (TEXT) - Plan name
- `description` (TEXT) - Plan description
- `price` (INTEGER) - Price in cents
- `currency` (TEXT) - Currency code (default: 'usd')
- `interval` (TEXT) - Billing interval (monthly, yearly, etc.)
- `is_active` (BOOLEAN) - Whether the plan is active

## Migration Options

### Option 1: Automated Migration Script (Recommended)

Run the migration script we created:

```bash
cd backend
python migrate_database.py
```

This script will:
- ✅ Create a backup of your current database
- ✅ Add the new columns to existing tables
- ✅ Create the new subscription_plans table
- ✅ Show you the updated table structure
- ✅ Handle errors gracefully

### Option 2: Manual SQL Commands

If you prefer to run the SQL commands manually:

```sql
-- Add new columns to subscriptions table
ALTER TABLE subscriptions ADD COLUMN plan_id TEXT;
ALTER TABLE subscriptions ADD COLUMN plan_name TEXT;

-- Create new subscription_plans table
CREATE TABLE subscription_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    interval TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1
);
```

### Option 3: Fresh Database (Development Only)

⚠️ **Warning: This will delete all existing data!**

If you're in development and don't mind losing existing data:

```bash
cd backend
rm subscriptions.db
# Restart your FastAPI server - it will create a new database with the updated schema
```

## After Migration

### 1. Restart Your Server
```bash
cd backend
# Stop your current server (Ctrl+C)
# Then restart it
python -m uvicorn main:app --reload --port 8000
```

### 2. Verify the Migration
You can verify the migration worked by:

1. **Check the API endpoint:**
   ```bash
   curl http://localhost:8000/subscription-plans
   ```

2. **Check your database structure:**
   ```bash
   cd backend
   sqlite3 subscriptions.db
   .schema subscriptions
   .schema subscription_plans
   .quit
   ```

### 3. Set Up Your Stripe Plans
Since we now fetch plans from Stripe, make sure you have:

1. **Created products in Stripe Dashboard:**
   - Go to Products → Create Product
   - Create recurring prices for each product
   - Make sure they're set to "Active"

2. **Your Stripe API key is configured:**
   - Check your `.env` file has `STRIPE_API_KEY` set
   - The application will automatically fetch plans from Stripe

## Troubleshooting

### Migration Script Fails
- Check that your `DATABASE_URL` in `.env` is correct
- Make sure the database file exists and is writable
- Check the error message for specific issues

### No Plans Showing Up
- Verify your Stripe API key is correct
- Check that you have active recurring prices in Stripe
- Look at the server logs for any Stripe API errors

### Existing Users
- Existing users will have `NULL` values for `plan_id` and `plan_name`
- This is normal and won't break anything
- New signups will have these fields populated

## Rollback (If Needed)

If something goes wrong, you can restore from the backup:

```bash
cd backend
# Stop your server first
cp subscriptions.db.backup subscriptions.db
# Restart your server
```

## Production Considerations

For production databases:

1. **Always backup first:**
   ```bash
   cp subscriptions.db subscriptions.db.backup.$(date +%Y%m%d_%H%M%S)
   ```

2. **Test the migration on a copy first**

3. **Plan for downtime** (usually just a few seconds for SQLite)

4. **Monitor logs** after migration to ensure everything works

5. **Have a rollback plan ready**

## Need Help?

If you encounter issues:

1. Check the server logs for error messages
2. Verify your Stripe configuration
3. Make sure all environment variables are set correctly
4. Test the API endpoints manually to isolate issues
