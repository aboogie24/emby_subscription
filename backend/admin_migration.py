"""
Migration script to add admin-related columns to existing subscriptions
"""
import sqlite3
import datetime

def migrate_admin_columns():
    """Add new columns for admin functionality"""
    conn = sqlite3.connect('subscriptions.db')
    cursor = conn.cursor()
    
    try:
        # Add created_via_management column (default True for existing users)
        cursor.execute('''
            ALTER TABLE subscriptions 
            ADD COLUMN created_via_management BOOLEAN DEFAULT 1
        ''')
        print("Added created_via_management column")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("created_via_management column already exists")
        else:
            raise e
    
    try:
        # Add created_at column (SQLite doesn't support CURRENT_TIMESTAMP as default in ALTER TABLE)
        cursor.execute('''
            ALTER TABLE subscriptions 
            ADD COLUMN created_at DATETIME
        ''')
        # Update existing records with current timestamp
        cursor.execute('''
            UPDATE subscriptions 
            SET created_at = CURRENT_TIMESTAMP 
            WHERE created_at IS NULL
        ''')
        print("Added created_at column and updated existing records")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("created_at column already exists")
        else:
            raise e
    
    try:
        # Add email column
        cursor.execute('''
            ALTER TABLE subscriptions 
            ADD COLUMN email TEXT
        ''')
        print("Added email column")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("email column already exists")
        else:
            raise e
    
    conn.commit()
    conn.close()
    print("Migration completed successfully")

if __name__ == "__main__":
    migrate_admin_columns()
