#!/usr/bin/env python3
"""
Database migration script to add new columns and tables for subscription plans feature.
Run this script to update your existing database schema.
"""

import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

def migrate_database():
    """Migrate the database to add new columns and tables"""
    
    # Get database path from environment or use default
    database_url = os.getenv("DATABASE_URL", "sqlite:///./subscriptions.db")
    
    # Extract the database file path from the URL
    if database_url.startswith("sqlite:///"):
        db_path = database_url.replace("sqlite:///", "")
        if db_path.startswith("./"):
            db_path = db_path[2:]  # Remove "./" prefix
    else:
        print("This migration script only supports SQLite databases")
        return False
    
    print(f"Migrating database: {db_path}")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("Starting database migration...")
        
        # Check if the new columns already exist
        cursor.execute("PRAGMA table_info(subscriptions)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add plan_id column if it doesn't exist
        if 'plan_id' not in columns:
            print("Adding plan_id column to subscriptions table...")
            cursor.execute("ALTER TABLE subscriptions ADD COLUMN plan_id TEXT")
            print("✅ Added plan_id column")
        else:
            print("✅ plan_id column already exists")
        
        # Add plan_name column if it doesn't exist
        if 'plan_name' not in columns:
            print("Adding plan_name column to subscriptions table...")
            cursor.execute("ALTER TABLE subscriptions ADD COLUMN plan_name TEXT")
            print("✅ Added plan_name column")
        else:
            print("✅ plan_name column already exists")
        
        # Check if subscription_plans table exists
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='subscription_plans'
        """)
        
        if not cursor.fetchone():
            print("Creating subscription_plans table...")
            cursor.execute("""
                CREATE TABLE subscription_plans (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    plan_id TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT,
                    price INTEGER NOT NULL,
                    currency TEXT DEFAULT 'usd',
                    interval TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT 1
                )
            """)
            print("✅ Created subscription_plans table")
        else:
            print("✅ subscription_plans table already exists")
        
        # Commit the changes
        conn.commit()
        print("✅ Database migration completed successfully!")
        
        # Show current table structure
        print("\n📋 Current subscriptions table structure:")
        cursor.execute("PRAGMA table_info(subscriptions)")
        for column in cursor.fetchall():
            print(f"  - {column[1]} ({column[2]})")
        
        print("\n📋 Current subscription_plans table structure:")
        cursor.execute("PRAGMA table_info(subscription_plans)")
        for column in cursor.fetchall():
            print(f"  - {column[1]} ({column[2]})")
        
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    finally:
        if conn:
            conn.close()

def backup_database():
    """Create a backup of the current database before migration"""
    database_url = os.getenv("DATABASE_URL", "sqlite:///./subscriptions.db")
    
    if database_url.startswith("sqlite:///"):
        db_path = database_url.replace("sqlite:///", "")
        if db_path.startswith("./"):
            db_path = db_path[2:]
        
        if os.path.exists(db_path):
            backup_path = f"{db_path}.backup"
            try:
                import shutil
                shutil.copy2(db_path, backup_path)
                print(f"✅ Database backed up to: {backup_path}")
                return True
            except Exception as e:
                print(f"❌ Failed to create backup: {e}")
                return False
    return False

if __name__ == "__main__":
    print("🚀 Starting database migration for subscription plans feature...")
    print("=" * 60)
    
    # Create backup first
    print("1. Creating database backup...")
    backup_success = backup_database()
    
    if not backup_success:
        print("⚠️  Warning: Could not create backup, but continuing with migration...")
    
    print("\n2. Running migration...")
    success = migrate_database()
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("\nNext steps:")
        print("1. Restart your FastAPI server")
        print("2. The new subscription plan features are now ready to use")
        print("3. You can now create subscription plans via the API or add them manually")
    else:
        print("\n❌ Migration failed. Please check the errors above.")
        if backup_success:
            print("Your original database backup is available for restoration if needed.")
